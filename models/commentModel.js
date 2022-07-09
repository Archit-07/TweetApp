const mongoose =require("mongoose");

const CommentSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  tweet: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Tweet"
  },
  body: {
    type: String,
    maxLength: 144
  },
  like:{
    type: Number,
    default:0
  }
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports= Comment;