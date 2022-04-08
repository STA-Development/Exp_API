import * as nodemailer from 'nodemailer';
// const ejs = require ('ejs')
import * as ejs  from 'ejs'

export const sendEmail = async (email: string, link: string) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.emailPass,
        },
    });

  ejs.renderFile(__dirname + "/emailForm.ejs", { link: link }, async (err, data) => {
       await transporter.sendMail({
          from: process.env.email,
          to: email,
          subject: 'Hello ',
          html: data,
      });
  })
};
