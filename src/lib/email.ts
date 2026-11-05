import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;
const from = process.env.EMAIL_FROM ?? user;

const transporter = user && pass
  ? nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  })
  : null;

export const mailEnabled = transporter !== null;

export async function sendMail(to: string, subject: string, text: string) {
  if (!transporter) {
    console.log(`[mail:disabled] to=${to} subject=${subject}`);
    return;
  }
  // Fire-and-forget friendly: caller should void this to avoid timing attacks.
  await transporter.sendMail({ from, to, subject, text });
}
