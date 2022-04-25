
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "This is a place where anybody can post a story that they live or any other ineteristing story that can entertain someone else. ";
const aboutContent = "I am Julian Fuentes, the developer of this app. I am a software engineer focus on full stack development, specifically on the backend. I made this app with the purposeto make a well done project and also to connect people around the world so anybody can share their stories with other people";
const contactContent = "Here is my social media and the ways to contact me.";


posts = [];
//Database condimentum
mongoose.connect(process.env.MONGO_URL);
//--Schema
const postSchema = new mongoose.Schema({
  title: String,
  body: String
})
//--model
const Post = new mongoose.model("Post", postSchema);

//Server code

const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}))

app.set('view engine', 'ejs');

app.use(express.static("public"));


app.get("/", function(req, res) {


  Post.find(function(err, resul) {
    res.render("home", {
      titulo: homeStartingContent,
      posts: resul
    })

  })

})
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
})
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
})
app.get("/compose", function(req, res) {
  res.render("compose");
})


app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTile,
    body: req.body.postBody
  }
  Post.create(post, function(err) {
    if (!err) {
      console.log("Succesfully added");
      res.redirect("/");
    }
  })



});

app.post("/delete", function(req, res) {

  Post.findByIdAndDelete({_id:req.body.buttonDel},function(err){
    if(!err){
      console.log("Succesfully deleted");
      res.redirect("/")
    }
  })
})



app.get("/posts/:userId", function(req, res) {
  const requestedPostId = req.params.userId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    if (err) {
      console.log(err);
    } else {
        res.render("post", {title2: post.title,content: post.body})
      }
  })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
