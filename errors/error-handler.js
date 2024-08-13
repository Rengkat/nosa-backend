class CustomApiError extends Error {
  constructor(message) {
    supper(message);
  }
}
module.exports = CustomApiError;
