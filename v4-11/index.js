//This is our Node Index
//Authors Natali, Nya, Hayden, Tyler Section 04



const express = require("express");

let app = express();
app.use(express.json());

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
      host:
         process.env.DB_ENDPOINT || 
         "awseb-e-fbbnwcpagp-stack-awsebrdsdatabase-bea3yfm1iimr.cevqwie9c4vj.us-east-2.rds.amazonaws.com",
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

//This is for the admin who can see all the users and edit them
//Need this for each table in the database later
// UserInfo THIS WILL ONLY SHOW UP DYNAMICALLY AFTER THEY ARE AUTHENTICATED AND SIGNED IN:)


app.post("/login", (req, res) => {
   const { username, password } = req.body;
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

app.get("/database", (req, res) => {
   knex.select().from("records").then(records => {
      res.render("database", {myRecords: records})
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

app.post("/survey", async (req, res) => {
   const hardcodedorigin = "Provo";
   const selectedPlatforms = req.body.PlatformID;
   try {
      const surveyId = await knex("persons")
         .insert({
            Age: req.body.Age,
            Gender:req.body.Gender,
            RelationshipStatus:req.body.RelationshipStatus,
            OccupationStatus: req.body.OccupationStatus,
            UniversityAffiliation: req.body.UniversityAffiliation,
            SchoolAffiliation: req.body.SchoolAffiliation,
            CompanyAffiliation: req.body.CompanyAffiliation,
            GovernmentAffiliation: req.body.GovernmentAffiliation,
            PrivateAfiliation: req.body.PrivateAfiliation,
            SocialMediaUser: req.body.SocialMediaUser,
            UsageID: req.body.UsageID,
            Q1: req.body.Q1,
            Q2: req.body.Q2,
            Q3: req.body.Q3,
            Q4: req.body.Q4,
            Q5: req.body.Q5,
            Q6: req.body.Q6,
            Q7: req.body.Q7,
            Q8: req.body.Q8,
            Q9: req.body.Q9,
            Q10: req.body.Q10,
            Q11: req.body.Q11,
            Q12: req.body.Q12,
            Origin: hardcodedorigin
         })
         .returning('PersonID');
      
      const platformInsertPromises = selectedPlatforms.map(platform => {
         return knex("records").insert({
            Date: knex.raw('CURRENT_TIMESTAMP'),
            Time: knex.raw('CURRENT_TIMESTAMP'),
            OccupationStatus: req.body.OccupationStatus,
            PlatformID: platform,
            PersonID: surveyId[0].PersonID,
         });
      });

      await Promise.all(platformInsertPromises);

      res.redirect("/");
   } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error submitting survey.');
   }
});

 //listen at the end
app.listen(port,() => console.log("I am listening"));