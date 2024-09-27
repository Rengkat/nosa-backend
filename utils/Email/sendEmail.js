const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  await transporter.sendMail({
    from: `"NOSA" <${process.env.GMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });

  console.log("Message sent");
};

module.exports = sendEmail;
