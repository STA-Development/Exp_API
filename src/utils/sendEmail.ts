import * as nodemailer from 'nodemailer';

export const sendEmail = async (email: string
                                , link: string
) => {


    const transporter = nodemailer.createTransport({

        service:'gmail',
      //  port: 465,
      //  secure: true,
        auth: {
            user: process.env.email,
            pass: process.env.emailPass,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: 'Hello ',
        text:'hiiiii',
       html: `<b>Hello world?</b> <a href="${link}">confirm Email</a>`,
    });

    console.log('Message sent: %s', info.messageId);

};
