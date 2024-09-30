const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ firstName, email, origin, token }) => {
  const link = `${origin}/user/reset-password?resetToken=${token}&email=${email}`;
  const html = `<body>
  <p>Hello ${firstName},</p>
  <p>Please verify your email using this link:</p>
  <a href="${link}">Reset your password</a>
</body>`;

  return sendEmail({ to: email, subject: "Reset Password", html });
};
module.exports = sendResetPasswordEmail;
