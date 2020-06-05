const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('../models/user');

//passportLocalMongoose




module.exports={



index: async (req,res)=>{
//part 16
  // console.log(user);
  const posts = await Post.find().sort({"creationDate":-1});
  const categories = await Category.find();
var  user= res.locals.user;
console.log(req.user + " this def");

  res.render("default/home" , {posts:posts, categories:categories});
},



contact: (req,res)=>{
    res.render("default/contact");
},


blogShow: async (req,res)=>{
  // const id=await req.params.id;
  console.log( req.params.slug);
  const blog= await Post.findOne({slug:req.params.slug}).populate('category');
  res.render('default/show' , {blog: blog });

},

blogs: async (req,res)=>{
  const posts = await Post.find().sort({"creationDate":-1});
  res.render('default/blogs',{posts:posts,error: false});
},



loginGet: (req,res)=>{
    res.render("default/login");
},

loginPost: (req,res)=>{
  // res.send("its working");
},

registerGet: (req,res)=>{
  res.render('default/register');
},

registerPost:(req,res)=>{
// const newUser= new User({username:req.body.user});
const newUser= new User({username:"CollegeTime"});

console.log(req.body);
  User.register(newUser, req.body.password , (err,user)=>{
    if(err){
      console.log(err);
      req.flash('error-message', `Oops something went wrong` );
      return res.redirect('/blogs');
    }
    passport.authenticate("local")(req,res, ()=>{
      res.redirect("/");
    })

  });
},

errorGet :(req,res)=>{
  // console.log(err);
  res.render("default/404");
}





};
