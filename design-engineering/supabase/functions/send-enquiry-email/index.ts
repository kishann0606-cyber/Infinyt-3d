import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EnquiryData {
  enquiryId?: string;
  enquiryType: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  product?: string;
  quantity?: string;
  message: string;
  fileLinks?: string[];
  submittedAt?: string;
}

function buildHtml(data: EnquiryData, senderName: string, prefix: string): string {
  const rows = [
    ['Enquiry ID', data.enquiryId || 'N/A'],
    ['Type', data.enquiryType],
    ['Name', data.name],
    ['Email', `<a href="mailto:${data.email}" style="color:#E8622C;">${data.email}</a>`],
    data.company ? ['Company', data.company] : null,
    data.phone ? ['Phone', `<a href="tel:${data.phone}" style="color:#E8622C;">${data.phone}</a>`] : null,
    data.service ? ['Service', data.service] : null,
    data.product ? ['Product', data.product] : null,
    data.quantity ? ['Quantity', data.quantity] : null,
    ['Date', data.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
  ].filter(Boolean) as [string, string][];

  const rowsHtml = rows.map(([k, v]) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#6B7480;font-weight:600;white-space:nowrap;width:140px;background:#F5F5F0;border-bottom:1px solid #E0E0D8;">${k}</td>
      <td style="padding:10px 16px;font-size:13px;color:#12233D;border-bottom:1px solid #E0E0D8;">${v}</td>
    </tr>`).join('');

  const filesHtml = data.fileLinks?.length ? `
    <div style="margin-top:24px;">
      <p style="font-size:13px;font-weight:600;color:#12233D;margin-bottom:8px;">Attached Files</p>
      <ul style="margin:0;padding-left:20px;">${data.fileLinks.map(f => `<li style="margin-bottom:4px;"><a href="${f}" style="color:#E8622C;font-size:13px;" target="_blank">${f.split('/').pop()}</a></li>`).join('')}</ul>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${prefix} New Enquiry</title></head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#F5F5F0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F0;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E0E0D8;border-radius:6px;overflow:hidden;">
  <!-- Header -->
  <tr><td style="background:#12233D;padding:24px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><p style="margin:0;font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px;">${senderName}</p>
            <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:0.08em;text-transform:uppercase;">New Enquiry Received</p></td>
        <td align="right"><span style="display:inline-block;background:#E8622C;color:#fff;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;">${data.enquiryType}</span></td>
      </tr>
    </table>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:28px;">
    <p style="margin:0 0 20px;font-size:15px;color:#12233D;">You have received a new enquiry. Details are below:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0E0D8;border-radius:4px;overflow:hidden;">
      ${rowsHtml}
    </table>
    <!-- Message -->
    <div style="margin-top:24px;background:#F5F5F0;border:1px solid #E0E0D8;border-radius:4px;padding:16px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#12233D;">Message / Project Details</p>
      <p style="margin:0;font-size:13px;color:#3A4B63;line-height:1.7;white-space:pre-wrap;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>
    ${filesHtml}
    <!-- CTA -->
    <div style="margin-top:28px;text-align:center;">
      <a href="mailto:${data.email}?subject=Re: Your Enquiry — ${senderName}" style="display:inline-block;background:#E8622C;color:#ffffff;font-size:13px;font-weight:600;padding:12px 28px;border-radius:6px;text-decoration:none;letter-spacing:0.04em;">Reply to ${data.name}</a>
    </div>
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:16px 28px;border-top:1px solid #E0E0D8;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;">This email was sent automatically by ${senderName} Admin System. Do not reply to this email directly.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  let enquiryData: EnquiryData | null = null;

  try {
    enquiryData = await req.json();
    if (!enquiryData?.name || !enquiryData?.email) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Load email settings
    const { data: settings } = await supabase.from("email_settings").select("*").limit(1).single();

    const resendApiKey = settings?.resend_api_key || Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      await supabase.from("email_logs").insert({ enquiry_id: enquiryData.enquiryId, enquiry_type: enquiryData.enquiryType, recipients: [], status: "failed", error_message: "RESEND_API_KEY not configured" });
      return new Response(JSON.stringify({ error: "Email service not configured. Add RESEND_API_KEY." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const recipients: string[] = settings?.recipients?.length ? settings.recipients : ["info@infinyt3d.com"];
    const senderName: string = settings?.sender_name || "Infinyt3D";
    const prefix: string = settings?.subject_prefix || "[Enquiry]";
    const subject = `${prefix} New ${enquiryData.enquiryType} from ${enquiryData.name}`;

    const payload: Record<string, unknown> = {
      from: `${senderName} <onboarding@resend.dev>`,
      to: recipients,
      subject,
      html: buildHtml(enquiryData, senderName, prefix),
      reply_to: enquiryData.email,
    };
    if (settings?.cc?.length) payload.cc = settings.cc;
    if (settings?.bcc?.length) payload.bcc = settings.bcc;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resBody = await res.json();

    if (!res.ok) {
      await supabase.from("email_logs").insert({ enquiry_id: enquiryData.enquiryId, enquiry_type: enquiryData.enquiryType, recipients, status: "failed", error_message: resBody.message || JSON.stringify(resBody) });
      return new Response(JSON.stringify({ error: resBody.message || "Email delivery failed." }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("email_logs").insert({ enquiry_id: enquiryData.enquiryId, enquiry_type: enquiryData.enquiryType, recipients, status: "sent", resend_id: resBody.id });

    return new Response(JSON.stringify({ success: true, id: resBody.id }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    if (enquiryData) {
      await supabase.from("email_logs").insert({ enquiry_id: enquiryData.enquiryId, enquiry_type: enquiryData.enquiryType, recipients: [], status: "failed", error_message: (err as Error).message }).catch(() => {});
    }
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
