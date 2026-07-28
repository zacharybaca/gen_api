import nodemailer from "nodemailer";

/**
 * Send an email via SMTP using Nodemailer.
 *
 * Required env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   FROM_NAME, FROM_EMAIL
 *
 * Options:
 *   email   — recipient address
 *   subject — email subject line
 *   message — plain-text body (use `html` for HTML body)
 *   html    — optional HTML body (overrides message if set)
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    ...(options.html ? { html: options.html } : { text: options.message }),
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
