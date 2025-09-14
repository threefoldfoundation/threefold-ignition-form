import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  fullName: string;
  email: string;
  interests: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, email, interests }: EmailRequest = await req.json();

    console.log("Sending emails for:", { fullName, email, interests });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "ThreeFold <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for your interest in ThreeFold!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Thank you, ${fullName}!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We've received your submission and are excited about your interest in ThreeFold.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Information:</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Interests:</strong> ${interests.join(", ")}</p>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We'll be in touch soon with updates about ThreeFold and opportunities that match your interests.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 14px;">
              Best regards,<br>
              The ThreeFold Team
            </p>
          </div>
        </div>
      `,
    });

    // Send notification email to the website owner
    const ownerEmailResponse = await resend.emails.send({
      from: "ThreeFold Forms <onboarding@resend.dev>",
      to: ["admin@threefold.io"], // Replace with actual owner email
      subject: "New ThreeFold Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">New Form Submission</h1>
          <p style="color: #666; font-size: 16px;">
            A new user has submitted the ThreeFold interest form.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Submission Details:</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Interests:</strong> ${interests.join(", ")}</p>
            <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            You can manage these submissions in your Supabase dashboard.
          </p>
        </div>
      `,
    });

    console.log("User email sent:", userEmailResponse);
    console.log("Owner email sent:", ownerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userEmail: userEmailResponse,
        ownerEmail: ownerEmailResponse 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending emails:", error);
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