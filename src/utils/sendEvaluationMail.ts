import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';

export enum EjsFormSubjects {
  startEvaluation = 'Start evaluation',
  getCertificate = 'Get Certificate'
}

export const sendEvaluationEmail = async (
  email: string,
  link: string,
  startEvaluation: EjsFormSubjects
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });
  ejs.renderFile(
    'src/templates/emailForm.ejs',
    { link, startEvaluation },
    async (err, invitationForm) => {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: startEvaluation,
        html: invitationForm
      });
    }
  );
};
