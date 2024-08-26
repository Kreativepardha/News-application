import nodemailer from 'nodemailer';

interface TransportOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const transportOptions: TransportOptions = {
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string
  }
};

export const transporter = nodemailer.createTransport(transportOptions);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (toEmail: string, subject: string, body: any) => {
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
  