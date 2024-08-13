const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./error-handler");

class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
