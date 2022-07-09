const mongoose = require("mongoose");

const TweetSchema = mongoose.Schema({
    user: {
      type: String,
      required: true,
    },
    body:{
      type : String,
      required: true,
      maxLength: 144
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    like:{
      type: Number,
      default:0
    }
  },
  {
    timestamps: true,
  });

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;