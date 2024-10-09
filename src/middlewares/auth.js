const { verifyToken } = require('../lib/jwt');

exports.auth = async (req, res, next) => {
  const token = req.cookies['token'];

  try {
    const decoededToken = await verifyToken(token);
    req.user = decoededToken;
    res.locals.user = decoededToken;
    res.locals.isAuthenticated = true;
    return next();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    req.user = null;
    res.locals.isAuthenticated = false;
    return next();
  }
};

exports.protect = async (req, res, next) => {
  if (!req.user) {
    res.clearCookie('token');
    return res.redirect('/users/login');
  }

  return next();
};
