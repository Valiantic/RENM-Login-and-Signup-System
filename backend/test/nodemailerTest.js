const nodemailer = require('nodemailer');

// Setup your SMTP transport service
const transporter = nodemailer.createTransport({
    service: 'Gmail',  // You can use other services like 'SendGrid', 'Outlook', etc.
    auth: {
      user: 'stevenmadali17@gmail.com', // Your email
      pass: 'odei efvp hufg rccu'   // Your email password or App-specific password for Gmail
    }
  });

transporter.sendMail({
    from: 'stevenmadali17@gmail.com',
    to: 'gonzagaralphdainiell@gmail.com',
    subject: 'NodeMailer Test',
    text: 'This is a test email from NodeMailer for the creation of an AI Powered Ecommerce Website',
  }, (err, info) => {
    if (err) {
      console.log('Error sending test email: ', err);
    } else {
      console.log('Test email sent: ', info.response);
    }
  });
  