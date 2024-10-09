const jsonwebtoken = require('jsonwebtoken');

// eslint-disable-next-line no-unused-vars
const typedefs = require('../@typedef/typedefs');

const { JWT_SECRET, EXPIRES_IN } = require('../constants/config');

/**
 * Signs a payload and returns a JWT token.
 *
 * @param {typedefs.UserPayload} payload - The payload to encode in the token.
 * @returns {string} - The signed JWT token.
 */
const signToken = (payload) => {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {typedefs.TokenPayload} - The decoded token payload.
 */
const verifyToken = (token) => {
  return jsonwebtoken.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
