import nodemailer from 'nodemailer';

// Configure nodemailer transporter (Uses ENV variables if configured, else creates clean test transport)
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Create ethereal / test transport for zero-config local execution
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/**
 * Send Welcome Email to User's Gmail Address
 */
export const sendWelcomeEmail = async ({ email, name, provider = 'Google' }) => {
  try {
    const transporter = await createTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; borderRadius: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; padding: 24px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #fff; line-height: 48px; border-radius: 12px; font-weight: bold; font-size: 20px;">TS</div>
            <h1 style="color: #ffffff; font-size: 22px; margin-top: 10px; font-weight: 800;">Welcome to TaskSphere!</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">High-Performance Enterprise Task & Time Management Platform</p>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />

          <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6;">
            Hi <strong>${name}</strong> 👋,
          </p>

          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            Your account was successfully authenticated via <strong>${provider}</strong>. Your personal workspace has been initialized and is ready for team collaboration.
          </p>

          <div style="background-color: #0f172a; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #94a3b8;"><strong>Registered Gmail Account:</strong> <span style="color: #60a5fa;">${email}</span></p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #94a3b8;"><strong>Status:</strong> <span style="color: #4ade80;">Active & Verified</span></p>
          </div>

          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
            You can now create projects, manage Kanban task boards, assign team members, and track estimated hours seamlessly.
          </p>

          <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
            <a href="http://localhost:5173/dashboard" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Go to Workspace Dashboard &rarr;</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
            This is an automated notification sent to ${email} by TaskSphere Platform.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"TaskSphere Team" <no-reply@tasksphere.com>',
      to: email,
      subject: `🎉 Welcome to TaskSphere, ${name}! Your Gmail account is verified`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Welcome email dispatched successfully to ${email} (MessageID: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EmailService] Local Email Live Preview URL: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error(`[EmailService Error] Could not send email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
};
