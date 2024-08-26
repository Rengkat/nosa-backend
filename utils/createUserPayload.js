const createUserPayload = (user) => {
  return {
    firstName: user.firstName,
    surname: user.surname,
    role: user.role,
    email: user.email,
    id: user._id,
  };
};
module.exports = createUserPayload;
