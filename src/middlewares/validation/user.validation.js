const { body } = require('express-validator');
const User = require('../../models/user.model');

const checkUserExists = async (email) => {
  return await User.findOne({ email });
};

const validateUserRegistrationRules = () => {
  return [
    body('firstName')
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('First name must be at least 3 characters long'),
    body('lastName')
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Last name must be at least 3 characters long'),
    body('email')
      .isEmail()
      .isLength({ min: 10 })
      .withMessage('Valid email is required')
      .custom(async (value, { req }) => {
        const email = value;
        const isUserExist = await checkUserExists(email);
        if (isUserExist) {
          req.statusCode = 409;
          throw new Error('Email already in use');
        }
        return true;
      }),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('repeatPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    }),
  ];
};

const validateUserLoginRules = () => {
  return [
    body('email')
      .isEmail()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage('Valid email is required')
      .custom(async (value, { req }) => {
        const email = value;
        const isUserExist = await checkUserExists(email);
        if (!isUserExist) {
          throw new Error('Wrong email or password');
        }
        req.user = isUserExist;
        return true;
      }),
    body('password')
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('Password is required')
      .custom(async (value, { req }) => {
        const user = req.user;
        if (!user) {
          return false;
        }

        const isPasswordMatch = await user.comparePassword(value);

        if (!isPasswordMatch) {
          throw new Error('Wrong email or password');
        }
      }),
  ];
};

module.exports = {
  validateUserRegistrationRules,
  validateUserLoginRules,
};
