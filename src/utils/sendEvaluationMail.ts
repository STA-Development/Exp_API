import * as nodemailer from 'nodemailer'
import * as ejs from 'ejs'

export const sendEvaluationEmail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.EMAIL_PASS,
    },
  })
  ejs.renderFile('src/directory/emailForm.ejs', {link: link}, async (err, data) => {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Hello',
      html: data,
    })
  })
}
