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

//app.get("/database", (req, res) => {
 //  res.render("database");
//})

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

app.post("/submitSurvey", async (req, res) => {
   try {
      // const{ }=req.body
      const uploadData = req.body;
      // 
      // const {
      //    Age,
      //    Gender,
      //    RelationshipStatus,
      //    OccupationStatus,
      //    UniversityAffiliation,
      //    SchoolAffiliation,
      //    CompanyAffiliation,
      //    GovernmentAfilliation,
      //    PrivateAfilliation,
      //    SocialMediaUser,
      //    UsageID,
      //    Q1,
      //    Q2,
      //    Q3,
      //    Q4,
      //    Q5,
      //    Q6,
      //    Q7,
      //    Q8,
      //    Q9,
      //    Q10,
      //    Q11,
      //    Q12,
      //    Origin
      // } = req.body;
      // console.log(Age)
      // console.log(Gender)
      // console.log(RelationshipStatus)
      console.log(req.body['age'])
      knex.into('persons').insert(uploadData).column(Age,Gender,RelationshipStatus,OccupationStatus,UniversityAffiliation,SchoolAffiliation,
            CompanyAffiliation,
            GovernmentAfilliation,
            PrivateAfilliation,
            SocialMediaUser,
            UsageID,
            Q1,
            Q2,
            Q3,
            Q4,
            Q5,
            Q6,
            Q7,
            Q8,
            Q9,
            Q10,
            Q11,
            Q12,
            Origin);
         res.status(200).json({ message: 'Survey submitted successfully' });
      } catch (error) {
         console.error('Error submitting survey:', error);
         res.status(500).json({ error: 'Internal Server Error' });
      }
})

      // await knex("persons").insert({
      //    Age: Age,
      //    Gender: Gender,
      //    RelationshipStatus: RelationshipStatus,
      //    OccupationStatus: OccupationStatus,
      //    UniversityAffiliation: UniversityAffiliation,
      //    SchoolAffiliation: SchoolAffiliation,
      //    CompanyAffiliation: CompanyAffiliation,
      //    GovernmentAfilliation: GovernmentAfilliation,
      //    PrivateAfilliation: PrivateAfilliation,
      //    SocialMediaUser: SocialMediaUser,
      //    UsageID: UsageID,
      //    Q1: Q1,
      //    Q2: Q2,
      //    Q3: Q3,
      //    Q4: Q4,
      //    Q5: Q5,
      //    Q6: Q6,
      //    Q7: Q7,
      //    Q8: Q8,
      //    Q9: Q9,
      //    Q10: Q10,
      //    Q11: Q11,
      //    Q12: Q12,
      //    Origin: Origin
      // });

//       const rowCount = await knex('persons').count('PersonID as count').first();
//       const peopleCount = rowCount ? rowCount.count + 1 : 1;
//       const now = new Date();
//       const date = now.toISOString().split('T')[0];
//       const time = now.toISOString().split('T')[1].split('.')[0];
//       const platforms = ['cbFacebook', 'cbTwitter', 'cbInstagram', 'cbYouTube', 'cbDiscord', 'cbReddit', 'cbPinterest', 'cbTikTok', 'cbSnapchat'];
//       for (let iCount = 0; iCount < platforms.length; iCount++) {
//          const optionChecked = req.body[platforms[iCount]] === 'on';
//          if (optionChecked) {
//             await knex('records').insert({
//                Date: date,
//                Time: time,
//                OccupationStatus: OccupationStatus,
//                PlatformID: iCount + 1,
//                PersonID: peopleCount
//             });
//          }
//       }
//       res.status(200).json({ message: 'Survey submitted successfully' });
//    } catch (error) {
//       console.error('Error submitting survey:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//    }
// });

 //listen at the end
app.listen(port,() => console.log("I am listening"));