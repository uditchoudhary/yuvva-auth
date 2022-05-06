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

const RES_ACCESS_DENIED_NO_TOKEN = {
  statusText: "ACCESS_DENIED",
  redirect: "/login",
};

const RES_CART_ERR = {
  statusText: "FAILED_TO_FETCH_CART",
};

const RES_ADD_TO_CART_FAILD = {
  statusText: "ADD_TO_CART_FAILURE",
};

module.exports = {
  RES_USER_EXIST,
  RES_PASSWORD_MISSING,
  RES_SERVER_ERROR,
  RES_REGISTRATION_SUCCESS,
  RES_USER_NOT_EXIST,
  RES_USER_UNAUTHORISED,
  RES_ADD_TO_CART_FAILD,
  RES_ACCESS_DENIED_NO_TOKEN,
};
