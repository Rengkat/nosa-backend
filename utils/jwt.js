const jwt = require("jsonwebtoken");
const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};
const isTokenVerified = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);
const attachTokenToResponse = ({ res, userPayload }) => {
  const token = createJwt({ payload: userPayload });
  const expiringDate = 1000 * 60 * 60 * 24; // 1 day
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + expiringDate),
    signed: true, // app is using cookie-parser with a secret
    secure: false, // False for development (local)
  });
  return token;
};
module.exports = { createJwt, isTokenVerified, attachTokenToResponse };
