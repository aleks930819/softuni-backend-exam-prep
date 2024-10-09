const { signToken } = require('../lib/jwt');

const User = require('../models/user.model');

/**
 *
 * @param {Object} user
 * @param {string} user.firstName
 * @param {string} user.lastName
 * @param {string} user.email
 * @param {string} user.password
 * @returns {Promise<{user: Object, token: string}>}
 */
exports.register = async ({ firstName, lastName, email, password }) => {
  const newUser = await new User({
    firstName,
    lastName,
    email,
    password,
  });

  await newUser.save();
  const token = await signToken({ id: newUser._id, email: newUser.email });

  return { user: newUser, token };
};

/**
 * @param {Object} user
 * @param {string} user.email
 * @returns {Promise<{user: Object, token: string}>}
 */
exports.login = async ({ email }) => {
  const user = await User.findOne({ email });

  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = await signToken(payload);

  return { user, token };
};
