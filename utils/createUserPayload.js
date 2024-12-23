const createUserPayload = (user) => {
  return {
    firstName: user.firstName,
    surname: user.surname,
    role: user.role,
    email: user.email,
    id: user._id,
    nosaSet: user.nosaSet,
    isSetAdminVerify: user.isSetAdminVerify,
    firstVisit: user.firstVisit,
  };
};
module.exports = createUserPayload;
