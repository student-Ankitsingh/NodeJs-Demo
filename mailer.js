const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD 
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://localhost:4000/api/users/verify/${verificationToken}`;
  try {
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Verify Your Email',
          text: ` `,
          html: `<p>Please verify your account by clicking the following link:</p><a href="${verificationUrl}">click Here</a>`
      });
  } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Error sending verification email' };
  }
};



const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetLink = `'http://localhost:4000/api/auth/reset-password/${resetToken}`;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "asingh22603@gmail.com",
      to: userEmail,
      subject: 'Password Reset Request',
      text: `You can reset your password by visiting the following link: ${resetLink}`,
      html: `<p>To reset your password, click the link below:</p><a href="${resetLink}">${resetLink}</a>`
    });
    console.log(`Password reset email sent to ${userEmail}`);
    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Error sending password reset email' };
  }
};
module.exports = { 
  sendPasswordResetEmail,
  sendVerificationEmail,
 };
