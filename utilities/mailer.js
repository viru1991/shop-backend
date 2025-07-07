const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or your provider
  auth: {
    user: "trnitin253@gmail.com",
    pass: "jabg ynvy hrgq qjev" // app password for Gmail
  }
});

exports.sendResetEmail = async (to, resetToken) => {
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: "trnitin253@gmail.com",
    to,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset</p>
      <p><a href="${resetLink}">Click here to reset</a></p>
      <p>This link will expire in 15 minutes</p>
    `
  };

  return transporter.sendMail(mailOptions);
};
