const CustomError = require("../errors");
const { isTokenVerified } = require("../utils");
const User = require("../model/userModel");
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

    if (req.user.role === "setAdmin") {
      const { userId } = req.params;

      // Fetch the user to be updated
      const userToBeUpdated = await User.findById(userId);
      if (!userToBeUpdated) {
        return next(new CustomError.NotFoundError("User not found"));
      }

      // Compare the graduation year
      if (req.user.yearOfGraduation !== userToBeUpdated.yearOfGraduation) {
        return next(
          new CustomError.UnauthorizedError(
            "Set Admins can only update users with the same graduation year"
          )
        );
      }
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
};
