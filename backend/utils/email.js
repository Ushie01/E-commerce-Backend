const nodemailer = require('nodemailer');
// const ejs = require('ejs');
// const htmlToText = require('html-to-text');

module.exports = (receiver, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: receiver,
    subject: 'Email Verification',
    text: message
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent' + info.response);
    }
  });
}




// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Juliana's Brand <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       // Gmail
//       return nodemailer.createTransport({
//         service: 'gamil',
//         auth: {
//           user: process.env.GMAIL_USERNAME,
//           pass: process.env.GMAIL_PASSWORD
//         }
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });
//   }

//   // Send the actual email
//   async send(template, subject) {
//     // 1) Render HTML based on a pug template
//     const html = ejs.renderFile(`${__dirname}/../views/${template}.ejs`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject
//     });

//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html)
//     };

//     // 3) Create a transport and send email
//     await this.newTransport().gmail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send("welcome", "Welcome to the Juliana's Brand Family!");
//   }

//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minutes)'
//     );
//   }
// };


// const nodemailer = require('nodemailer');

