  const Post = require("../models/PostModel");
  const Category = require("../models/CategoryModel");
  const {isEmpty}= require("../config/customFunctions");  //fro config/customFunction
  const Newsletter = require("../models/NewsletterModel");
  const Contact = require("../models/ContactModel");
  var slugify = require('slugify');

  module.exports={

  index: (req,res)=>{
  //   var user =req.user;
  console.log(res.locals.user);
  console.log(req.session.user );
  console.log(req.user + " ths admin");
    res.render("admin/index");
    // console.log(slugify("this is it"));

  },


  getPosts: (req,res)=>{
     // res.send("this is submitting");
     //this will display all post in admin/post/index

                  Post.find().sort({"creationDate":-1})

                  .populate('category')  //this si adding whole category model to  id linked with  postPush
                  .then(posts => {
                  res.render('admin/posts/index' ,{ posts: posts});
                  })
                  .catch(error => {
                    console.log(err);
                    req.flash('error-message', `Oops something went wrong` );
                    res.redirect('/admin');
                  });


   },



submitPosts: (req,res)=>{
         // res.send("post submitted")
         //this is from post model
         // console.log(req.body);  //this was just for debugging

      // /this is for passing on and off comments
         // const commentAllowed = req.body.allowComments ? true: false;

//sanitize the blog from script file
          req.body.description =req.sanitize(req.body.description);
          req.body.summary =req.sanitize(req.body.summary);
          req.body.slug =slugify(req.body.slug, {
                                                      replacement: '-',  // replace spaces with replacement character, defaults to `-`
                                                      remove: undefined, // remove characters that match regex, defaults to `undefined`
                                                      lower: true,      // convert to lower case, defaults to `false`
                                                      strict: false,     // strip special characters except replacement, defaults to `false`
                                                    });


         //check for any input file "||" part 17
         let filename = '';

     if(!isEmpty(req.files)) {
         let file = req.files.uploadedFile;
         filename = file.name;
         let uploadDir = './public/uploads/';

         file.mv(uploadDir+filename, (err) => {  //.mv function comes with our package
             if (err)
                 throw err;
         });
     }

         const newPost = new Post({
           title : req.body.title,
           author : req.body.author,
           summary : req.body.summary,
           imgalt : req.body.imgalt,
           slug : req.body.slug,
           description : req.body.description,
           // status : req.body.status,
           // allowComments: commentAllowed,  //this is for passing on and off comments
           category: req.body.category,//connecting id of categorymodel to PostModel
           file: `/uploads/${filename}`
         });

         newPost.save().then(post =>{
           // console.log(post); //this is just for debugging
           req.flash('success-message' , "Post Created Sucessfully");
           res.redirect("/admin/posts");
         }).catch((error) => {
           console.log(err);
           req.flash('error-message', `Oops something went wrong` );
           res.redirect('/admin/posts');
         });

       },



  createPostsGet: (req,res)=>{

    Category.find().then(cats=>{
      res.render("admin/posts/create", {categories:cats});

    }).catch((error) => {
      console.log(err);
      req.flash('error-message', `Oops something went wrong` );
      res.redirect('/admin/posts');
    });

  },


  editPostGetRoute : (req,res)=>{
    //id from params root
    const id= req.params.id;

    Post.findById(id)

    .then(post => {
        //passing to edit form, and finding category and sending into edit form
        Category.find().then(cats=>{

          res.render('admin/posts/edit' , {post: post, categories:cats });

        })

    }).catch((error) => {
      console.log(err);
      req.flash('error-message', `Oops something went wrong` );
      res.redirect('/admin/posts');
    });


  },


//for updating post
editPostUpdateRoute: (req, res) => {
          // const commentsAllowed = req.body.allowComments ? true : false;


          const id = req.params.id;
        console.log(req.body);
          //sanitize the blog from script file
                    req.body.description =req.sanitize(req.body.description);

                    req.body.summary =req.sanitize(req.body.summary);
                    req.body.slug =slugify(req.body.slug, {
                                                                replacement: '-',  // replace spaces with replacement character, defaults to `-`
                                                                remove: undefined, // remove characters that match regex, defaults to `undefined`
                                                                lower: true,      // convert to lower case, defaults to `false`
                                                                strict: false,     // strip special characters except replacement, defaults to `false`
                                                              });

          Post.findById(id)
              .then(post => {

                  post.title = req.body.title;
                  post.author = req.body.author;
                  post.slug = req.body.slug;
                  // post.status = req.body.status;
                  // post.allowComments = req.body.allowComments;
                  post.summary = req.body.summary;
                  post.imgalt = req.body.imgalt;
                  post.description = req.body.description;
                  post.category = req.body.category;


                  post.save().then(updatePost => {
                      req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                      res.redirect('/admin/posts');

                  });
              })
              .catch((error) => {
                console.log(err);
                res.redirect('/admin/posts');
                req.flash('error-message', `Oops something went wrong` );

              });

      },



deletePost : (req,res)=>{

  Post.findByIdAndDelete(req.params.id)
      .then(deletedPost =>{
        // deletedPost.remove();
        req.flash('success-message', `The post ${deletedPost.title} has been deleted` );
        res.redirect('/admin/posts');
      })
      .catch((error) => {
        console.log(err);
        req.flash('error-message', `Oops something went wrong` );
        res.redirect('/admin/posts');
      });

  },



  /* >>>>>>>>>>admin category methods<<<<<<<<<   */

getCategories : (req,res)=>{
  Category.find().then(cats =>{
    res.render('admin/category/index' ,{ categories :cats});
  }).catch((error) => {
    console.log(err);
    req.flash('error-message', `Oops something went wrong` );
    res.redirect('/admin/posts');
  });

},
createCategories: (req, res) => {
      var categoryName = req.body.name;
        // console.log(categoryName);
        // console.log("par");
        // console.log(req.body.title);

      if (categoryName) {
          const newCategory = new Category({
              title: categoryName
          });

          newCategory.save().then(category => {
              res.status(200).json(category);
          }).catch((error) => {
            console.log(err);
            req.flash('error-message', `Oops something went wrong` );
            res.redirect('/admin/category');
          });
      }

  },


  editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;
//INSTED OF .then we have used asynk and await
        const cats = await Category.find();


        Category.findById(catId).then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });
    },


    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'}); //json response for ajax
                });

            });
        }
    },
    deleteCategory : (req,res)=>{

      Category.findByIdAndDelete(req.params.id)
          .then(deletedPost =>{
            // deletedPost.remove();
            req.flash('success-message', `The post ${deletedPost.title} has been deleted` );
            res.redirect('/admin/category');
          }).catch((err) => {
            console.log(err);
            req.flash('error-message', `Oops something went wrong` );
            res.redirect('/admin/category');
          });

      },

      newsletter : (req,res)=>{
        Newsletter.find().then(mail =>{
          res.render('admin/newsletter/index' ,{ mails :mail});
        }).catch((error) => {
          console.log(err);
          req.flash('error-message', `Oops something went wrong` );
          res.redirect('/admin/index');
        });

      },
      Createnewsletter: (req, res) => {
            var categoryName = req.body.mail;
              // console.log(categoryName);
              // console.log("par");
              // console.log(req.body.title);

            if (categoryName) {
                const newCategory = new Newsletter({
                    mail: categoryName
                });

                newCategory.save().then(category => {
                    res.status(200).json(category);
                }).catch((error) => {
                  console.log(err);
                  req.flash('error-message', `Oops something went wrong` );
                  res.redirect('/admin/newsletter');
                });
            }

        },
        Contactform: (req,res)=>{
           // res.send("this is submitting");
           //this will display all post in admin/post/index

                        Contact.find()
                        .then(contact => {
                        res.render('admin/contact/index' ,{ contact: contact});
                        })
                        .catch(error => {
                          console.log(err);
                          req.flash('error-message', `Oops something went wrong` );
                          res.redirect('/admin');
                        });


         },
         submitContactform: (req,res)=>{



         //sanitize the blog from script file
                   req.body.message =req.sanitize(req.body.message);

                  const contact = new Contact({
                    message : req.body.message,
                    name : req.body.name,
                    id : req.body.mail,
                    subject : req.body.subject,
                  });

                  contact.save().then(contact => {
                      res.status(200).json(contact);
                  }).catch((error) => {
                    console.log(err);
                    req.flash('error-message', `Oops something went wrong` );
                    res.redirect('/admin/contact');
                  });

                },




}
