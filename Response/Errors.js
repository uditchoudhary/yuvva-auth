const transformError = (errorText, error = "") => {
  return { ...error, ...errorText };
};


module.exports = { transformError };
