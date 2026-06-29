import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const isSMTPConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendMailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"EduConsult Pro" <noreply@educonsultpro.com>',
    to,
    subject,
    html,
  };

  if (!isSMTPConfigured) {
    console.log('--- DEVELOPMENT EMAIL LOG ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html}`);
    console.log('-----------------------------');
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const getWelcomeTemplate = (name: string): string => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Welcome to EduConsult Pro</h1>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>Dear ${name},</p>
        <p>Thank you for registering with EduConsult Pro! We are thrilled to partner with you in your educational journey.</p>
        <p>With your new student portal, you can now:</p>
        <ul>
          <li>Track your study visa and university application pipeline.</li>
          <li>Upload required documents securely.</li>
          <li>Book appointments directly with study abroad consultants.</li>
          <li>Receive updates on university admissions and active scholarships.</li>
        </ul>
        <p>If you have any questions, please do not hesitate to contact our team.</p>
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Best Regards,</p>
          <p style="margin: 0; font-weight: bold;">EduConsult Pro Admissions Team</p>
        </div>
      </div>
    </div>
  `;
};

export const getAppointmentTemplate = (
  studentName: string,
  consultantName: string,
  dateTime: string,
  meetLink?: string
): string => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Consultation Confirmed</h1>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>Dear ${studentName},</p>
        <p>Your educational consultation has been successfully scheduled.</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #d4af37; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Consultant:</strong> ${consultantName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${new Date(dateTime).toLocaleString()}</p>
          ${meetLink ? `<p style="margin: 0;"><strong>Meeting Link:</strong> <a href="${meetLink}" style="color: #3f51b5; font-weight: bold;">Join Video Call</a></p>` : ''}
        </div>
        <p>Please log in to your student portal to reschedule or cancel if your availability changes.</p>
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Best Regards,</p>
          <p style="margin: 0; font-weight: bold;">EduConsult Pro Team</p>
        </div>
      </div>
    </div>
  `;
};

export const getApplicationStatusTemplate = (
  studentName: string,
  universityName: string,
  program: string,
  status: string
): string => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Application Status Update</h1>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>Dear ${studentName},</p>
        <p>There has been an update regarding your application for **${program}** at **${universityName}**.</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #00e5ff; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 18px;">New Status: <span style="font-weight: bold; color: #1a237e;">${status.replace(/_/g, ' ')}</span></p>
        </div>
        <p>Please log in to your student portal to view detailed notes or submit required documentation.</p>
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Best Regards,</p>
          <p style="margin: 0; font-weight: bold;">EduConsult Pro Team</p>
        </div>
      </div>
    </div>
  `;
};
