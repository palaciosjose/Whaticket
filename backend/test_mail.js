const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'streamdigi94@gmail.com',
    pass: 'xzflfoodnroycxam'
  }
});

transporter.sendMail({
  from: 'StreamDigi Sistema <streamdigi6@gmail.com>',
  to: 'streamdigi6@gmail.com',
  subject: 'Test Recuperación',
  text: 'Prueba de correo de recuperación'
}).then(info => {
  console.log('✅ Email enviado:', info.messageId);
}).catch(error => {
  console.log('❌ Error:', error);
});
