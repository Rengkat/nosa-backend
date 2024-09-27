const sendEmail = require("./sendEmail");
const sendVerificationEmail = async ({ firstName, email, origin, verificationToken }) => {
  const link = `${origin}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`;
  const html = `<body>
  <p>Hello ${firstName},</p>
  <p>Please verify your email using this link:</p>
  <a href="${link}">Verify your email</a>
</body>`;

  return sendEmail({
    subject: "Email Verification",
    to: email,
    html,
  });
};

module.exports = sendVerificationEmail;
