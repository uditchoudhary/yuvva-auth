const RES_USER_EXIST = {
  statusText: "USER_EXIST",
  redirect: "/login",
};

const RES_PASSWORD_MISSING = {
  statusText: "PASSWORD_MISSING",
};

const RES_SERVER_ERROR = {
  statusText: "SERVER_ERROR",
  redirect: "/",
};

const RES_REGISTRATION_SUCCESS = {
  statusText: "REGISTRATION_SUCCESSFULL",
  redirect: "/login",
};

const RES_USER_NOT_EXIST = {
  statusText: "USER_DOES_NOT_EXIST",
  redirect: "/register",
};

const RES_USER_UNAUTHORISED = {
  statusText: "INVALID_CREDENTIALS",
  redirect: "/register",
};

module.exports = {
  RES_USER_EXIST,
  RES_PASSWORD_MISSING,
  RES_SERVER_ERROR,
  RES_REGISTRATION_SUCCESS,
  RES_USER_NOT_EXIST,
  RES_USER_UNAUTHORISED,
};
