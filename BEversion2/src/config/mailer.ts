import nodemailer from 'nodemailer';

interface TransportOptions {
  host: string;
  port: any;
  secure: boolean;
  auth: {
    user: string;
    pass: any;
  };
}

const transportOptions: TransportOptions = {
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as any, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as any
  }
};

export const transporter = nodemailer.createTransport(transportOptions);


export const sendEmail = async (toEmail: any, subject: any, body: any) => {
    try {
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: toEmail,
        subject: subject,
        html: body
      });
      console.log("INFO IS:", info);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; 
    }
  };
  