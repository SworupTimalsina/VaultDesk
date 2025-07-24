const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"VaultDesk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "VaultDesk - Email Verification",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
