const CustomError = require("../errors");
const { isTokenVerified } = require("../utils");

const authenticateUser = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.signedCookies.token) {
      token = req.signedCookies.token;
    }

    if (!token) {
      throw new CustomError.UnauthenticatedError("Authentication invalid - No token provided");
    }

    const user = isTokenVerified({ token });

    if (!user) {
      throw new CustomError.UnauthenticatedError(
        "Authentication invalid - Token verification failed"
      );
    }
    // Attach the user to the request object
    const { firstName, surname, id, role } = user;
    req.user = { firstName, surname, id, role };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizationPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.error(
        `User with role ${req.user.role} is not authorized. Allowed roles: ${roles.join(", ")}`
      );

      throw new CustomError.UnauthorizedError(
        `You are not authorized! Only You are not authorized!`
      );
    }

    next();
  };
};

module.exports = { authenticateUser, authorizationPermission };
