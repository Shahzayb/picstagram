const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = ({ to, subject, text, html, from }) => {
  const msg = {
    to,
    subject,
    text,
    from,
    html,
  };
  return sgMail.send(msg);
};

exports.generateResetPasswordTemplate = (to, username, link) => {
  return {
    to,
    from: process.env.COMPANY_EMAIL,
    subject: 'Reset your password',
    text: `Your username is: 
      ${username}

     Visit this link to reset your password: 
     <a href=${link}>${link}</a>

    Note: This link is only valid for 1 hour. And you cannot reuse this link.
    `,
    html: `Your user name is: 
    <br><br>
      ${username}
    <br><br>
     Visit this link to reset your password:
    <br><br>
     <a href=${link}>${link}</a>
    <br><br>
    <strong>Note:</strong> This link is only valid for 1 hour. And you cannot reuse this link.
    `,
  };
};

/**
 * SendGrid test code
 */

//
//
//
//   const msg = {
//     to: 'test@example.com',
//     from: 'test@example.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };
//   sgMail
//     .send(msg)
//     .then(console.log)
//     .catch((e) => console.log(JSON.stringify(e, null, 4)));
//
