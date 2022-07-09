const Tweet = require("../models/tweetModel.js");
const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel.js");
const User = require("../models/userModel.js");
const { isObjectIdOrHexString } = require("mongoose");

const getTweets = asyncHandler(async (req, res) => {
    try{
        const tweets = await Tweet.find().populate({path: 'comments', model: Comment}).sort({updatedAt: -1});
        if(tweets){
          // console.log("tweets:",tweets);
         res.json(tweets);
        }
        else{
            res.json({message:'there are no tweets'})
        }
      }catch(err){
        res.status(500);
        throw new Error("Something went wrong");
     }
});

const getUserTweets = asyncHandler(async (req, res) => {
    try{
        const tweets = await Tweet.find({ user: req.params.loginId}).populate({path: 'comments', model: Comment}).sort({updatedAt: -1});
        res.json(tweets);
    }catch(err){
        res.status(500);
        throw new Error("Something went wrong");
    }
});

const getTweetById = asyncHandler(async (req, res) => {
 try{
    const tweet = await Tweet.findById({_id:req.params.id}).populate({path: 'comments', model: Comment});
    console.log(tweet);
    if (tweet) {
        res.status(200).json({tweet});
    } else {
        res.status(404).json({ message: "Tweet not found" });
    }
  }catch(err)
    {
        res.status(500);
        throw new Error("Something went wrong");
    }
});

const addTweet = asyncHandler(async (req, res) => {
  const { body} = req.body;

  if (!body) {
    res.status(400);
    throw new Error("Cannot create empty tweet");
  } else {
    try{
        const tweet = new Tweet({ user:req.params.loginId, body });    
        const createdTweet = await tweet.save();
      let user = await User.findOneAndUpdate({loginId:req.params.loginId},{$push:{tweet: createdTweet._id}});
        res.status(201).json(createdTweet);
    }
    catch(err)
    {
        res.status(500);
        throw new Error("Something went wrong");
    }
  }
});

const DeleteTweet = asyncHandler(async (req, res) => {
try{
    console.log("params:", req.params);
    const tweet = await Tweet.find({_id: req.params.id});
    const user = await User.find({loginId: req.user.loginId});
    // console.log("tweet:", tweet[0].user)
   if (tweet[0].user !== req.user.loginId) {
        res.status(401);
        throw new Error("You can't perform this action");
    }

    if (tweet && user) {
      console.log("User Tweet", user[0].tweet);
        const index = user[0].tweet.findIndex(p => p == req.params.id);
        // console.log("index::", tweet);
        //delete all the comments
        await Comment.deleteMany({ tweet: req.params.id });
        // delete that specific tweet
        await tweet[0].deleteOne();
        //delete tweet from users
        user[0].tweet.splice(index, 1);
        await user[0].save();
        res.json({ status: 200, message: "Tweet Deleted" });
    } else {
        res.status(404);
        throw new Error("Tweet not Found");
    }
  }catch(err){
    console.log(err)
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  const {body} = req.body;
  try{
    const tweet = await Tweet.findById(req.params.id);
        
    if (tweet.user !== req.user.loginId) {
        res.status(401);
        throw new Error("You can't perform this action");
    }

    if (tweet) {
        tweet.body = body;
        const updatedTweet = await tweet.save();
        res.json(updatedTweet);
    } else {
        res.status(404);
        throw new Error("Tweet not found");
    }
  }
  catch(err){
    res.status(500);
    throw new Error("Cannot update tweet");
  }
});

const updateLike = asyncHandler(async (req, res) => {
    try{
      const tweet = await Tweet.findById(req.params.id);

      if (tweet) {
          tweet.like = tweet.like + 1;
          const updatedTweet = await tweet.save();
          res.json(updatedTweet);
      } else {
          res.status(404);
          throw new Error("Tweet not found");
      }
    }
    catch(err){
      res.status(500);
      throw new Error("Cannot update tweet");
    }
  });




module.exports = {
  getTweetById,
  getTweets,
  addTweet,
  DeleteTweet,
  updateTweet,
  updateLike,
  getUserTweets,
};
