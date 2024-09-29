const CustomError = require("../errors");
const { isTokenVerified, attachTokenToResponse } = require("../utils");
const Token = require("../model/Token");

const authenticateUser = async (req, res, next) => {
  try {
    let accessToken;
    let refreshToken;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.signedCookies.token) {
      accessToken = req.signedCookies.accessToken;
    }
    // If no access token, check for refresh token in cookies
    if (!accessToken && req.signedCookies.refreshToken) {
      refreshToken = req.signedCookies.refreshToken;
    }
    if (!accessToken && !refreshToken) {
      throw new CustomError.UnauthenticatedError("Authentication invalid - No token provided");
    }

    if (accessToken) {
      const payload = isTokenVerified(accessToken);
      req.user = payload.accessToken;
      return next();
    }
    //handle refresh token
    const payload = isTokenVerified(refreshToken);

    const existingRefreshToken = await Token.findOne({
      user: payload.accessToken.id,
      refreshToken: payload.refreshToken,
    });
    if (!existingRefreshToken || !existingRefreshToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
    attachTokenToResponse({
      res,
      userPayload: payload.accessToken,
      refreshToken: existingRefreshToken.refreshToken,
    });
    req.user = payload.accessToken;

    next();
  } catch (error) {
    next(error);
  }
};
const superAdminAuthorizationPermission = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return next(new CustomError.UnauthorizedError("You are not authorized!"));
  }
  next();
};

const superAdminAndSetAdminAuthorizationPermission = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError.UnauthorizedError("You are not authorized!"));
    }
    next();
  };
};
module.exports = {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
};
