import nodemailer = require('nodemailer');

interface MailOptions {
  to: string;
  subject: string;
  message: string;
}

export async function sendMail(options: MailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT!),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: 'Strahinja Zlatanovic <office@zlatanovics.com>',
    to: options.to,
    subject: options.subject,
    text: options.message,
  });
}
