const BadRequestError = require("./bad-request");
const CustomApiError = require("./custom-error");
const NotFoundError = require("./not-found");
const UnauthenticatedError = require("./unauthenticated");
const UnauthorizedError = require("./unauthorized");
module.exports = {
  CustomApiError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
};
