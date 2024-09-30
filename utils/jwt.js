const jwt = require("jsonwebtoken");
const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const isTokenVerified = (token) => jwt.verify(token, process.env.JWT_SECRET);
const attachTokenToResponse = ({ res, userPayload, refreshToken }) => {
  const accessTokenJWT = createJwt({ payload: { accessToken: userPayload } });
  const refreshTokenJWT = createJwt({ payload: { accessToken: userPayload, refreshToken } });
  const expiringDate = 1000 * 60 * 60 * 24 * 30; // 30 days
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
    signed: true, // app is using cookie-parser with a secret
    secure: false, // False for development (local)
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + expiringDate),
    signed: true, // app is using cookie-parser with a secret
    secure: false, // False for development (local)
  });
  return { accessTokenJWT };
};
module.exports = { isTokenVerified, attachTokenToResponse };
