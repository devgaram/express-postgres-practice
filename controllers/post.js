const { Post } = require('../db/models');

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll();
    res.send(posts);
  } catch(error) {
    next(error);
  }
};

module.exports = {
  getPosts
};