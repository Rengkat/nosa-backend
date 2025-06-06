const jwt = require("jsonwebtoken");
const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const isTokenVerified = (token) => jwt.verify(token, process.env.JWT_SECRET);
const attachTokenToResponse = ({ res, userPayload, refreshToken }) => {
  const isProduction = process.env.NODE_ENV === "production";
  const accessTokenJWT = createJwt({ payload: { accessToken: userPayload } });
  const refreshTokenJWT = createJwt({ payload: { accessToken: userPayload, refreshToken } });
  const expiringDate = 1000 * 60 * 60 * 24 * 30; // 30 days

  const commonCookieOptions = {
    httpOnly: true,
    signed: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res.cookie("accessToken", accessTokenJWT, {
    ...commonCookieOptions,
    maxAge: 1000 * 60 * 5,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    ...commonCookieOptions,
    expires: new Date(Date.now() + expiringDate),
  });
};
module.exports = { isTokenVerified, attachTokenToResponse };
