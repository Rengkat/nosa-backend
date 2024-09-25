const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const info = await transporter.sendMail({
    from: `"NOSA" <${process.env.GMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
