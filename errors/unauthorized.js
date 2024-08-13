const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom-error");

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
module.exports = UnauthorizedError;
