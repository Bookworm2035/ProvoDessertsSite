//This is our Node Index
//Authors Natali, Nya, Hayden, Tyler Section 04

const express = require("express");

let app = express();

let path = require('path');

//dynamic port
const port = process.env.PORT || 3000;

//no more html 
app.set("view engine", "ejs");

// this lets you pharse stuff from stuff??? the freak 
app.use(express.urlencoded({extended:true}));

//DO this when you have a database :) 
const knex = require("knex")({
   client: "pg",
   connection: {
   host: process.env.RDS_HOSTNAME || "localhost", 
   user: process.env.RDS_USERNAME || "postgres",
   password: process.env.RDS_PASSWORD || "Comolibros44ever",
   database: process.env.RDS_DB_NAME || "health_data",
   port: process.env.RDS_PORT || 5432,
   ssl: process.env.DB_SSL ? {rejectUnauthorized: false}: false 
}
})

//get views
app.set('views', path.join(__dirname,'./views'));

app.use(express.static(path.join(__dirname,'./static')));
//this pulls in the website page static content

//index page
app.get('/', (req, res) => {
   //with ejs
   res.render('index');
});

//login page
app.get("/login", (req, res) => {
   res.render("login");
});

// Survey
app.get("/survey", (req, res) => {
   res.render("survey")
});

//Dashboard/Tableau
app.get("/dashboard", (req, res) => {
   res.render("dashboard");
});

app.get("/error", (req, res) => {
   res.render("error");
});

app.get("/indexUser", (req, res) => {
   res.render("indexUser");
})

app.get("/logout", (req, res) => {
   res.render("logout");
})

app.get("/database", (req, res) => {
   res.render("database");
})

//This is for the admin who can see all the users and edit them
//Need this for each table in the database later
// UserInfo THIS WILL ONLY SHOW UP DYNAMICALLY AFTER THEY ARE AUTHENTICATED AND SIGNED IN:)


app.post("/login", (req, res) => {
   //username = document.getElementById("username").value;
   //localStorage.setItem('username', username);
   //password = document.getElementById('password').value;
   //localStorage.setItem('password', password);
   const { username, password } = req.body;
   //let username = req.body.username;
   //let password = req.body.password;
   knex("users")
      .where({ username, password })
      .first()
      .then( user => {
         if (user) 
         {
            res.redirect("/indexUser");
         }
         else 
         {
            res.redirect("/error");
         }
      })
      .catch(err => {
         console.error(err);
         res.status(500).json({error: "Internal Server Error"})
      })
})

// Display all the users
app.get("/displayUser", (req, res)=> {
    knex.select().from("users").then(users => {
      res.render("displayUser", {myUser: users});
   })
})

// Site to add user to users
app.get("/addUser", (req, res) => {
    res.render("addUser");
})

// Adding to the users table
app.post("/addUser", (req, res)=> {
    knex("users").insert({
      username: req.body.username,
      password: req.body.password
   }).then(myUser => {
      res.redirect("/");
   })
});



app.get("/editUser/:id", (req, res)=> {
    knex.select("user_id",
      "username",
      "password").from("users").where("user_id", req.params.id).then(User => {
    res.render("editUser", {myUser: User});
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });
});

app.post("/editUser", (req, res)=> {
   knex("users").where("user_id", parseInt(req.body.user_id)).update({
      username: req.body.username,
      password: req.body.password
   }).then(myUser => {
      res.redirect("/");
   })
});

app.post("/deleteUser/:id", (req, res) => {
   knex("users").where("user_id",req.params.id).del().then( myUser => {
      res.redirect("/");
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });
});

 //listen at the end
app.listen(port,() => console.log("I am listening"));