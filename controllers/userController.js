const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../utils/generateToken.js");
// const mongoose = require("mongoose");
const path = require("path");
const Tweet = require("../models/tweetModel.js");

const authUser = asyncHandler(async (req, res) => {
  const { loginId, password } = req.body;

  const user = await User.findOne({ loginId });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  } else if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fistName: user.fistName,
      lastName: user.lastName,
      email: user.email,
      loginId: user.loginId,
      pic: user.pic,
      contact: user.contact,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, loginId, password, contact } = req.body;

  const ID = await User.findOne({ loginId });
  if (ID) {
    res.status(404);
    throw new Error("Username is not available");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    loginId,
    password,
    contact,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fistName: user.fistName,
      lastName: user.lastName,
      email: user.email,
      loginId: user.loginId,
      pic: user.pic,
      contact: user.contact,
      token: generateToken(user._id),
    });
  } else {
    res.status(404).json({message:"user Not Found"});
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fistName = req.body.fistName || user.fistName;
      user.lastName = req.body.lastName || user.lastName;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.loginId = req.body.loginId || user.loginId;
      user.email = req.body.email || user.email;
      user.contact = req.body.contact || user.contact;

      

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        password: updatedUser.password,
        loginId: updatedUser.loginId,
        email: updatedUser.email,
        contact: updatedUser.contact,
        pic: updatedUser.pic,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({message:"user Not Found"});
    }
  }
  catch (err) {
    res.status(500).json({message:"something went wrong"});
  }
});

const forgotPass =asyncHandler(async (req, res) => {
  try{
    const {loginId,password}= req.body;
    const user = await User.findOne({ loginId });
      if(user)
      {
      user.password = password;
      const updatedUser = await user.save();
      console.log(updatedUser)
      res.status(200).json({message:"password updated successfully!!"})
      }
      else{
        res.status(404).json({message:"user Not Found"});
      }
    
  }
  catch(err){
    res.status(500).json({message:"something went wrong"});
  }
})

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate({path: 'tweet', model: Tweet});

  if (users) res.json(users);
  else {
    res.status(404).json({message:"Not Found"});
  }
});

const searchUser = asyncHandler(async (req, res) => {
  const users = (await User.find()).filter(user => user.loginId.includes(req.params.loginId));
    
  if (users) res.status(200).json(users);
  else {
    res.status(404).json({message:"Not Found"});
  }
});
const getUser = asyncHandler(async (req, res) => {
  const users = await User.find({loginId:req.params.loginId}).populate({path: 'tweet', model: Tweet})
    
  if (users) res.status(200).json(users);
  else {
    res.status(404).json({message:"Not Found"});
  }
});


const uploadProfilePic = asyncHandler(async (req, res) => {
  try{
  let user = await User.findById(req.user._id);
  // console.log("uploadProfilePic req:.user:",user)
  if (!user) {
    res.status(404);
    throw new Error('User not found!!');
  }
  const file = req.files?.profilePic;
  // console.log("file::", file);
  if ( !req.files.profilePic && !req.files) {
    res.status(404);
    throw new Error('Profile pic not provided or profilePic key is not used while uploading!!');
  }
    user.pic = Date.now()+"_"+file.name;
    file.mv('./public/'+user.pic, (err, result)=>{
      if(err){
        throw new Error("Fiele didnot uploaded");
      }
      else{
        console.log("file uploaded successfully!!");
      }
    })
    await user.save();
    res.status(200).json({ success: true, data: user.pic })
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"something went wrong"});
   
  }

})

const getPic = asyncHandler(async(req,res)=>{  
     
  const user = await User.findOne({ loginId: req.params.loginId });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  } 
  else{
    const downloadPath = path.join(__dirname, '../public/uploads', `${user.pic}`);
    res.status(200).json({downloadPath})
  }
  
})


module.exports = {
  authUser,
  updateUserProfile,
  registerUser,
  getUsers,
  getUser,
  searchUser,
  uploadProfilePic,
  getPic,
  forgotPass
};
