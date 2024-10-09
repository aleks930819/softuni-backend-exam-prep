const router = require('express').Router();

const homeController = require('./controllers/home.controller');
const authController = require('./controllers/auth.controller');
const postController = require('./controllers/post.controller');

router.use(homeController);
router.use('/users', authController);
router.use('/posts', postController);

router.use('/404', (req, res) => {
  res.status(404).render('404', { title: '404' });
});

router.get('*', (req, res) => {
  res.redirect('/404');
});

module.exports = router;
