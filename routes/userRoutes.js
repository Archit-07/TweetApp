const{
  authUser,
  updateUserProfile,
  registerUser,
  getUsers,
  getUser,
  uploadProfilePic,
  getPic,
  searchUser,
  forgotPass,
  
} =require("../controllers/userController.js");
const{ protect} = require("../middleware/authMiddleware.js");
const express = require('express');
const bodyParser =require('body-parser');
const cors = require('cors');
const router = express.Router();
const app = express();
app.use(bodyParser.json());
app.use(cors()); 


router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/profile").post(protect, updateUserProfile);
// all users
router.route('/users/all').get( getUsers) ;
//they do same fn search and get
router.route('/search/:loginId').get(searchUser);
router.route('/user/:loginId').get(getUser);
//avtar
router.route('/avtar').put(protect,uploadProfilePic)
router.route('/:loginId/avtar').get(protect,getPic)
//forgot pass
router.route('/forgot').patch(forgotPass)

module.exports= router;