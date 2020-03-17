const { Router } = require('express');
const router = Router();
const { getPosts } = require('../controllers/post');
const axios = require('axios');
// router.get('/', getPosts);
router.get('/', (req, res) => {
  axios.get('https://api.github.com/repos/devgaram/TIL/contents')
  .then(function (response) {
    const data = response.data.filter(contents => contents.type === 'dir');
    const category = [];
    data.forEach(element => {
      category.push(element.path);
    });
    res.send(category);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
});
router.get('/:id', (req, res) => {
  res.send('/post/:id');
});



module.exports = router;