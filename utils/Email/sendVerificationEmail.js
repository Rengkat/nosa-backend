const sendEmail = require("./sendEmail");
const sendVerificationEmail = async ({ firstName, email, origin, verificationToken }) => {
  const link = `${origin}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`;
  const html = `
    <body
    style="
      padding: 0;
      margin: 0;
      background-color: #f4f4f4;
      width: 100%;
    ">
     <p>Hello ${firstName},</p>
     <>${link}</p>
    </body>
  `;

  return sendEmail({
    subject: "Email Verification",
    to: email,
    html,
  });
};

module.exports = sendVerificationEmail;
