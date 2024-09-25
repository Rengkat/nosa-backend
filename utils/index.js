const checkPermission = require("./checkPermission");
const createUserPayload = require("./createUserPayload");
const sendVerificationEmail = require("./Email/sendVerificationEmail");
const { isTokenVerified, attachTokenToResponse } = require("./jwt");

module.exports = {
  isTokenVerified,
  attachTokenToResponse,
  createUserPayload,
  checkPermission,
  sendVerificationEmail,
};
