import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") || "afreshia.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets when function cold starts)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // No record or expired - create new
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }
  
  // Increment count
  record.count++;
  return true;
}

interface FormSubmissionRequest {
  formType: string;
  data: Record<string, any>;
}

// HTML sanitization function to prevent injection attacks
const sanitizeHTML = (input: any): string => {
  if (input === null || input === undefined) return '';
  
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later." 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { formType, data }: FormSubmissionRequest = await req.json();
    
    console.log(`Processing ${formType} form from IP: ${clientIP}`);

    let subject = "";
    let htmlContent = "";

    switch (formType) {
      case "retailer":
        subject = "New Retailer Application - Afreshia";
        htmlContent = `
          <h2>New Retailer Application</h2>
          <p><strong>Company Name:</strong> ${sanitizeHTML(data.companyName)}</p>
          <p><strong>Contact Person:</strong> ${sanitizeHTML(data.contactPerson)}</p>
          <p><strong>Email:</strong> ${sanitizeHTML(data.email)}</p>
          <p><strong>Phone:</strong> ${sanitizeHTML(data.phone)}</p>
          <p><strong>Expected Weekly Tonnage:</strong> ${sanitizeHTML(data.tonnage)}</p>
          <p><strong>Products of Interest:</strong> ${sanitizeHTML(data.products)}</p>
          <p><strong>Delivery Location:</strong> ${sanitizeHTML(data.deliveryLocation)}</p>
        `;
        break;

      case "farmer":
        subject = "New Farmer Application - Afreshia";
        htmlContent = `
          <h2>New Farmer Application</h2>
          <p><strong>Full Name:</strong> ${sanitizeHTML(data.fullName)}</p>
          <p><strong>Phone:</strong> ${sanitizeHTML(data.phone)}</p>
          <p><strong>Email:</strong> ${sanitizeHTML(data.email)}</p>
          <p><strong>Location:</strong> ${sanitizeHTML(data.location)}</p>
          <p><strong>Farm Size:</strong> ${sanitizeHTML(data.farmSize)}</p>
          <p><strong>Current Crops:</strong> ${sanitizeHTML(data.currentCrops)}</p>
          <p><strong>Experience Level:</strong> ${sanitizeHTML(data.experience)}</p>
        `;
        break;

      case "quote":
        subject = "New Quote Request - Afreshia";
        htmlContent = `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${sanitizeHTML(data.name)}</p>
          <p><strong>Email:</strong> ${sanitizeHTML(data.email)}</p>
          <p><strong>Company:</strong> ${sanitizeHTML(data.company)}</p>
          <p><strong>Phone:</strong> ${sanitizeHTML(data.phone)}</p>
          <p><strong>Product:</strong> ${sanitizeHTML(data.product)}</p>
          <p><strong>Quantity:</strong> ${sanitizeHTML(data.quantity)} ${sanitizeHTML(data.unit)}</p>
          <p><strong>Destination:</strong> ${sanitizeHTML(data.destination)}</p>
          <p><strong>Delivery Date:</strong> ${sanitizeHTML(data.deliveryDate)}</p>
          <p><strong>Additional Info:</strong> ${sanitizeHTML(data.additionalInfo)}</p>
        `;
        break;

      case "contact":
        subject = "New Contact Form Submission - Afreshia";
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizeHTML(data.name)}</p>
          <p><strong>Email:</strong> ${sanitizeHTML(data.email)}</p>
          <p><strong>Company:</strong> ${sanitizeHTML(data.company)}</p>
          <p><strong>Phone:</strong> ${sanitizeHTML(data.phone)}</p>
          <p><strong>Subject:</strong> ${sanitizeHTML(data.subject)}</p>
          <p><strong>Message:</strong> ${sanitizeHTML(data.message)}</p>
        `;
        break;

      default:
        throw new Error("Invalid form type");
    }

    const formData = new FormData();
    formData.append("from", `Afreshia Forms <noreply@${MAILGUN_DOMAIN}>`);
    formData.append("to", "info@afreshia.com");
    formData.append("subject", subject);
    formData.append("html", htmlContent);
    if (data.email) {
      formData.append("h:Reply-To", data.email);
    }

    const emailResponse = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        },
        body: formData,
      }
    );

    const result = await emailResponse.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-form-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);