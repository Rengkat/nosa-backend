const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ firstName, email, origin, token }) => {
  const link = `${origin}/user/reset-password?resetToken=${token}&email=${email}`;
  const html = `
  <body
    style="
      display: flex;
      width: 100%;
      justify-content: center;
      padding: 0;
      margin: 0;
      background-color: white;
      font-family: Arial, Helvetica, sans-serif;
    ">
    <div
      style="
        width: 100%;
        max-width: 600px;
        border: 1px solid #dddddd;
        background: white;
        font-family: Arial, Helvetica, sans-serif;
        color: #074456;
        margin: 20px auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px; /* Added padding for inner content */
      ">
      <header
        style="
          height: auto;
          display: flex;
          justify-content: left;
          background: #f4f4f4;
          padding: 1rem;
          align-items: center;
        ">
        <a
          href="${origin}"
          style="
            display: flex;
            justify-content: left;
            gap: 0.3rem;
            padding: 0.5rem;
            align-items: center;
            color: #00adf2;
            text-decoration: none;
            font-size: larger;
          ">
          <img
            style="width: 5%"
            src="https://res.cloudinary.com/de811cbmm/image/upload/v1727691863/logo_dfmzua.png"
            alt="NOSA Logo" />
          <span style="font-weight: bolder; font-size: larger"> NOSA</span>
        </a>
      </header>
      <main style="padding: 1.5rem">
        <p style="font-size: 16px; line-height: 1.5">Hello ${firstName},</p>
        <p style="font-size: 16px; line-height: 1.5">
          We received a request to reset your password. Please reset your password by clicking the link below.
        </p>
        <div style="text-align: center; margin: 20px 0">
          <a
            href="${link}"
            style="
              background: #00adf2;
              border-radius: 7px;
              padding: 0.8rem 1.2rem;
              color: white;
              font-size: 16px;
              text-decoration: none;
              display: inline-block;
            "
            rel="noopener noreferrer">
            Reset Your Password
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.5">
          If you didn't request this email, please ignore it.
        </p>
        <p style="font-size: 14px; line-height: 1.5">
          Regards, <br />
          <span style="color: #00adf2; font-weight: bolder; font-size: larger">NOSA</span>
        </p>
        <p style="font-style: italic; margin-top: -1rem">Keep walking in light...</p>
      </main>
    </div>
  </body>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html,
  });
};

module.exports = sendResetPasswordEmail;
