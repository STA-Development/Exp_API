import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';

export const sendEvaluationEmail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });
  ejs.renderFile(
    'src/forms/emailForm.ejs',
    { link },
    async (err, invitationForm) => {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Hello',
        html: invitationForm
      });
    }
  );
};
