const router = require('express').Router();
const mongoose = require('mongoose');

const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validation/validation');

const {
  validateCreaturePostRules,
} = require('../middlewares/validation/creature.validation');
const {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  deletePostById,
  updatePostById,
} = require('../services/post.service');

const renderPageWithErrors = require('../utils/render-page-with-errors');

// ____ GET Routes ____
router.get('/create-post', (req, res) => {
  res.render('post/create', { title: 'Create Post' });
});
router.get('/my-posts', protect, async (req, res) => {
  const { id } = req.user;
  const posts = await getMyPosts(id);
  res.render('user/my-posts', { title: 'My Posts', posts });
});

router.get('/edit/:id', protect, async (req, res) => {
  const { id } = req.params;
  const post = await getPostById(id);

  if (!post) {
    return res.redirect('/posts/all-posts');
  }

  res.render('post/edit', { title: 'Edit Post', post });
});

router.get('/delete/:id', protect, async (req, res) => {
  const { id } = req.params;
  const post = await getPostById(id);
  const isOwner = req.user ? req.user.id === post.owner._id.toString() : false;

  if (!post || !isOwner) {
    return res.redirect('/posts/all-posts');
  }

  await deletePostById(id);

  res.redirect('/posts/all-posts');
});

router.get('/vote/:id', protect, async (req, res) => {
  const { id } = req.params;
  const post = await getPostById(id);

  const userId = req.user.id;
  const objectId = new mongoose.Types.ObjectId(userId.toString());
  const hasVoted = post.votes.includes(objectId);

  if (hasVoted) {
    return res.redirect(`/posts/${id}`);
  }

  const modifiedPostWithVote = {
    ...post,
    votes: [...post.votes, userId],
  };

  await updatePostById(id, modifiedPostWithVote);

  res.redirect(`/posts/${id}`);
});

router.get('/all-posts', async (req, res) => {
  const posts = await getAllPosts();
  res.render('post/all-posts', { title: 'All Posts', posts });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null;
  const isLoggedIn = req.user ? true : false;

  const objectId = isLoggedIn
    ? new mongoose.Types.ObjectId(userId.toString())
    : null;

  try {
    const post = await getPostById(id);
    const isOwner = req.user
      ? req.user.id === post.owner._id.toString()
      : false;
    const hasVoted =
      isLoggedIn && post.votes.some((voteId) => voteId.equals(objectId));
    const canVote = isLoggedIn && !hasVoted && !isOwner;

    res.render('post/details', {
      title: 'Post',
      post,
      isOwner,
      isLoggedIn,
      hasVoted,
      canVote,
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.redirect('/posts/all-posts');
  }
});

// ____ POST Routes ____
router.post(
  '/create-post',
  validateCreaturePostRules(),
  validate,
  protect,
  async (req, res) => {
    if (res.locals.errors) {
      return renderPageWithErrors({
        errors: res.locals.errors,
        page: 'post/create',
        res,
        title: 'Create Post',
      });
    }

    const owner = req?.user?.id;
    req.body.owner = owner;
    try {
      const post = await createPost(req.body);
      res.redirect(`/posts/${post._id}`);
    } catch (error) {
      return renderPageWithErrors({
        errors: [error.message],
        page: 'post/create',
        res,
        title: 'Create Post',
      });
    }
  }
);

router.post('/edit/:id', protect, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPostById(id);

    const isOwner = req.user
      ? req.user.id === post.owner._id.toString()
      : false;

    if (!post || !isOwner) {
      return res.redirect('/posts/all-posts');
    }

    await updatePostById(id, req.body);

    res.redirect(`/posts/${id}`);
  } catch (error) {
    return renderPageWithErrors({
      errors: [error.message],
      page: 'post/edit',
      res,
      title: 'Edit Post',
    });
  }
});

module.exports = router;
