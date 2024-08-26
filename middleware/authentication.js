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

    // If verification fails or returns no user, throw an error
    if (!user) {
      throw new CustomError.UnauthenticatedError(
        "Authentication invalid - Token verification failed"
      );
    }

    // Destructure user info and attach it to the request object
    const { firstName, surname, id, role } = user;
    req.user = { firstName, surname, id, role };

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error); // Logging the actual error for debugging purposes
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};

module.exports = { authenticateUser };
