const customError = require("../errors");
const checkPermission = (requestUser, resourceUser) => {
  if (requestUser.role === "supperAdmin") return;
  if (requestUser.id === resourceUser.id.toString()) return;
  throw new customError.UnauthorizedError("You are not authorized!");
};
module.exports = checkPermission;
