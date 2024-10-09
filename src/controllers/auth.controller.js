const {
  validateUserRegistrationRules,
  validateUserLoginRules,
} = require('../middlewares/validation/user.validation');

const { protect } = require('../middlewares/auth');

const validate = require('../middlewares/validation/validation');

const { register, login } = require('../services/user.service');
const renderPageWithErrors = require('../utils/render-page-with-errors');

const router = require('express').Router();

// ____ GET Routes ____
router.get('/login', (req, res) => {
  res.render('user/login', { title: 'Login' });
});
router.get('/register', (req, res) => {
  res.render('user/register', { title: 'Register' });
});
router.get('/logout', protect, (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// ____ POST Routes ____
router.post('/login', validateUserLoginRules(), validate, async (req, res) => {
  const { email, password } = req.body;

  if (res.locals.errors) {
    return renderPageWithErrors({
      errors: res.locals.errors,
      page: 'user/login',
      res,
      title: 'Login',
    });
  }

  try {
    const { token } = await login({ email, password });
    res.cookie('token', token, {
      httpOnly: true,
    });
    res.redirect('/');
  } catch (error) {
    return renderPageWithErrors({
      errors: [error.message],
      page: 'user/login',
      res,
      title: 'Login',
    });
  }
});

router.post(
  '/register',
  validateUserRegistrationRules(),
  validate,
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (res.locals.errors) {
      return renderPageWithErrors({
        errors: res.locals.errors,
        page: 'user/register',
        res,
        title: 'Register',
      });
    }
    try {
      const { token } = await register({
        firstName,
        lastName,
        email,
        password,
      });

      res.cookie('token', token, {
        httpOnly: true,
      });

      res.redirect('/');
    } catch (error) {
      return renderPageWithErrors({
        errors: [error.message],
        page: 'user/register',
        res,
        title: 'Register',
      });
    }
  }
);

module.exports = router;
