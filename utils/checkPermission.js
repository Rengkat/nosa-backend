const customError = require("../errors");
const checkPermission = (requestUser, resourceUser) => {
  // console.log(requestUser.yearOfGraduation, resourceUser.yearOfGraduation);
  if (requestUser.role === "superAdmin") return;
  if (
    requestUser.role === "setAdmin" &&
    requestUser.yearOfGraduation === resourceUser.yearOfGraduation
  )
    return;
  throw new customError.UnauthorizedError("This is not your set. You are not authorized!");
};
module.exports = checkPermission;
