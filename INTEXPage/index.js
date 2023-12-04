//This is our Node Index
//Authors Natali, Nya, Hayden, Tyler Section 04

const express = require("express");

let app = express();

let path = require('path');

//dynamic port
const port = process.env.PORT || 3000;

//no more html 
app.set("view engine", "ejs");

//get views
app.set('views', path.join(__dirname,'./views'));

app.use(express.static(path.join(__dirname,'./static')));
//this pulls in the website page static content

//index page
app.get('/', (request, response)=> {
    //with ejs
    response.render('index');

});
//login page
app.get("/login", (req, res) => {
    res.render("login");
  });
// Survey/Database
app.get("/database", (req, res) => {
res.render("database");
});

// this lets you pharse stuff from stuff??? the freak 
app.use(express.urlencoded({extended:true}));

//DO this when you have a database :) 
// const knex = require("knex")({
//     client: "pg",
//     connection: {
//         host: process.env.RDS_HOSTNAME || "localhost", 
//         user: process.env.RDS_USERNAME || "postgres",
//         password: process.env.RDS_PASSWORD || "Comolibros44ever",
//         database: process.env.RDS_DB_NAME || "bucket_list",
//         port: process.env.RDS_PORT || 5432,
//         ssl: process.env.DB_SSL ? {rejectUnauthorized: false}: false 
//     }
// })


//This is for the admin who can see all the users and edit them
//Need this for each table in the database
app.get("/", (req, res)=> {
    knex.select().from("User").then(User => {
      res.render("displayUser", {myUser: User});
   })
 })

 app.get("/addUser", (req, res) => {
    res.render("addUser");
 })
 app.post("/addUser", (req, res)=> {
    knex("User").insert({
      username: req.body.username,
      popular_site: req.body.password
   }).then(myUser => {
      res.redirect("/");
   })
 });

app.get("/editUser/:id", (req, res)=> {
    knex.select("user_id",
          "username",
          "password").from("User").where("user_id", req.params.id).then(User => {
    res.render("editUser", {myUser: User});
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });
 });

 app.post("/editUser", (req, res)=> {
    knex("User").where("user_id", parseInt(req.body.user_id)).update({
      username: req.body.username,
      password: req.body.password
   }).then(myUser => {
      res.redirect("/");
   })
 });

 app.post("/deleteUser/:id", (req, res) => {
    knex("User").where("user_id",req.params.id).del().then( myUser => {
      res.redirect("/");
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });
 });

 //listen at the end
 app.listen(port,() => console.log("I am listening"));