import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const emailResponse = await resend.emails.send({
      from: "Afreshia Forms <no-reply@afreshia.com>",
      to: ["info@afreshia.com"],
      subject: subject,
      html: htmlContent,
      reply_to: data.email || "info@afreshia.com",
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
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