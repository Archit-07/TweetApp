const {
  getTweetById,
  getTweets,
  addTweet,
  DeleteTweet,
  updateTweet,
  updateLike,
  getUserTweets,
} = require('../controllers/tweetController')
  const{ protect} = require("../middleware/authMiddleware.js");
  const express = require('express');
  const router = express.Router();
  
  router.route("/:loginId/add").post(protect, addTweet);
  router.route("/:loginId/update/:id").put(protect, updateTweet);
  router.route("/:loginId/like/:id").put(protect, updateLike);
  router.route('/:loginId/delete/:id').delete(protect,DeleteTweet);
  router.route('/all').get(getTweets ) ;
  router.route('/:loginId').get(getUserTweets) ;
  router.route('/:id/tweet').get(getTweetById);

  module.exports= router;