import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info.response);
        });
    });
};

export default sendEmail;

