import * as nodemailer from 'nodemailer'

export const sendMail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Hello ',
    text: 'hiiiii',
    html: `<b>Hello world?</b> <a href="${link}">confirm Email</a>`,
  })
}
