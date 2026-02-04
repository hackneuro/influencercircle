const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@influencercircle.net";
const toEmail = process.env.ADMIN_EMAIL;

if (!resendKey) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

if (!toEmail) {
  console.error("Missing ADMIN_EMAIL");
  process.exit(1);
}

const resend = new Resend(resendKey);

async function sendTestEmail() {
  console.log(`Sending test email from ${fromEmail} to ${toEmail}...`);
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Resend Configuration Test',
      html: '<p>If you see this, Resend is working correctly! 🚀</p>'
    });
    console.log("Email sent successfully!", data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

sendTestEmail();
