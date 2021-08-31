const router = require('express').Router();
const { publicPosts, privatePosts } = require('../db')
const { checkAuth } = require('../middleware/checkAuth')


router.get('/public', (req, res) => {

    console.log(publicPosts);
    res.json(publicPosts);
})


router.get('/private', checkAuth, (req, res) => {

    console.log(privatePosts);
    res.json(privatePosts);
})

module.exports = router;