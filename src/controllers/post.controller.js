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
  const objectId = new mongoose.Types.ObjectId(userId.toString());

  const post = await getPostById(id);

  const isOwner = req.user ? req.user.id === post.owner._id.toString() : false;
  const isLoggedIn = req.user ? true : false;
  const hasVoted = post.votes.some((voteId) => voteId.equals(objectId));

  const canVote = isLoggedIn && !hasVoted && !isOwner;

  res.render('post/details', {
    title: 'Post',
    post,
    isOwner,
    isLoggedIn,
    hasVoted,
    canVote,
  });
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
    const post = await createPost(req.body);
    res.redirect(`/posts/${post._id}`);
  }
);

router.post('/edit/:id', protect, async (req, res) => {
  const { id } = req.params;
  const post = await getPostById(id);

  const isOwner = req.user ? req.user.id === post.owner._id.toString() : false;

  if (!post || !isOwner) {
    return res.redirect('/posts/all-posts');
  }

  await updatePostById(id, req.body);

  res.redirect(`/posts/${id}`);
});

module.exports = router;
