import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN") || "afreshia.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormSubmissionRequest {
  formType: string;
  data: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formType, data }: FormSubmissionRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    switch (formType) {
      case "retailer":
        subject = "New Retailer Application - Afreshia";
        htmlContent = `
          <h2>New Retailer Application</h2>
          <p><strong>Company Name:</strong> ${data.companyName}</p>
          <p><strong>Contact Person:</strong> ${data.contactPerson}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Expected Weekly Tonnage:</strong> ${data.tonnage}</p>
          <p><strong>Products of Interest:</strong> ${data.products}</p>
          <p><strong>Delivery Location:</strong> ${data.deliveryLocation}</p>
        `;
        break;

      case "farmer":
        subject = "New Farmer Application - Afreshia";
        htmlContent = `
          <h2>New Farmer Application</h2>
          <p><strong>Full Name:</strong> ${data.fullName}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Farm Size:</strong> ${data.farmSize}</p>
          <p><strong>Current Crops:</strong> ${data.currentCrops}</p>
          <p><strong>Experience Level:</strong> ${data.experience}</p>
        `;
        break;

      case "quote":
        subject = "New Quote Request - Afreshia";
        htmlContent = `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Product:</strong> ${data.product}</p>
          <p><strong>Quantity:</strong> ${data.quantity} ${data.unit}</p>
          <p><strong>Destination:</strong> ${data.destination}</p>
          <p><strong>Delivery Date:</strong> ${data.deliveryDate}</p>
          <p><strong>Additional Info:</strong> ${data.additionalInfo}</p>
        `;
        break;

      case "contact":
        subject = "New Contact Form Submission - Afreshia";
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong> ${data.message}</p>
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