const express = require("express");
const router = express.Router();
const defaultController = require("../controllers/defaultController")  //for including file
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('../models/user');


// router.use((req,res,next)=>{
//   res.locals.user=req.user
//   next();});

//home page
router.route('/')
    .get(defaultController.index);




//passportLocalMongoose
router.use(require("express-session")({
  secret:"this is very cool",
  resave: false,
  saveUninitialized :false
}));


  router.use(passport.initialize());
router.use(passport.session());
  passport.use( new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());




router.route('/contact')
    .get(defaultController.contact);



router.route('/login')
  .get(defaultController.loginGet)

//for login authentication
router.post('/login' ,  passport.authenticate("local",
{successRedirect : '/admin',
failureRedirect : '/login',
failureflash:true,
successflash :true,
session:true

}) , (req,res)=>{});
  // .post(defaultController.loginPost);


router.route('/register')
.get(defaultController.registerGet)
.post(defaultController.registerPost);

router.route('/blogs/:slug')
    .get(defaultController.blogShow);


router.route('/blogs')
        .get(defaultController.blogs);

// router.route('/*')
// .get(defaultController.errorGet);



module.exports = router;
