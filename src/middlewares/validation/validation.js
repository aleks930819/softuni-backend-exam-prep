const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  const statusCode = req.statusCode || 400;

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push(err.msg));

  res.locals.errors = extractedErrors;
  res.statusCode = statusCode;

  return next();
};

module.exports = validate;
