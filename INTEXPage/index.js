//Natali is the author and co founder 
const express = require("express");

let app = express();

let path = require('path');

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.set('views', path.join(__dirname,'./views'));

app.use(express.static(path.join(__dirname,'./static')));
//this pulls in the website page

app.get('/', (request, response)=> {
    //with ejs
    response.render('index');
    //this is without EJS
    // response.sendFile(path.join(__dirname, '../HW7/startbootstrap-full-width-pics-gh-pages/Homework7.html'));
});







//DO this when you have a database :) 

// this lets you pharse stuff from stuff??? the freak 
// app.use(express.urlencoded({extended:true}));

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

// //FROM NOTES
// app.get("/", (req, res)=> {
//     knex.select().from("country").then(country => {
//       res.render("displayCountry", {mycountry: country});
//    })
//  })

//  app.get("/addCountry", (req, res) => {
//     res.render("addCountry");
//  })
//  app.post("/addCountry", (req, res)=> {
//     knex("country").insert({
//       country_name: req.body.country_name.toUpperCase(),
//       popular_site: req.body.popular_site.toUpperCase(),
//       capital: req.body.capital.toUpperCase(),
//       population: req.body.population,
//       visited: req.body.visited ? "Y" : "N",
//       covid_level: req.body.covid_level.toUpperCase()
//    }).then(mycountry => {
//       res.redirect("/");
//    })
//  });

// app.get("/editCountry/:id", (req, res)=> {
//     knex.select("country_id",
//           "country_name",
//           "popular_site",
//           "capital",
//           "population",
//           "visited",
//           "covid_level").from("country").where("country_id", req.params.id).then(country => {
//     res.render("editCountry", {mycountry: country});
//    }).catch( err => {
//       console.log(err);
//       res.status(500).json({err});
//    });
//  });
//  app.post("/editCountry", (req, res)=> {
//     knex("country").where("country_id", parseInt(req.body.country_id)).update({
//       country_name: req.body.country_name.toUpperCase(),
//       popular_site: req.body.popular_site.toUpperCase(),
//       capital: req.body.capital.toUpperCase(),
//       population: req.body.population,
//       visited: req.body.visited ? "Y" : "N",
//       covid_level: req.body.covid_level.toUpperCase()
//    }).then(mycountry => {
//       res.redirect("/");
//    })
//  });

//  app.post("/deleteCountry/:id", (req, res) => {
//     knex("country").where("country_id",req.params.id).del().then( mycountry => {
//       res.redirect("/");
//    }).catch( err => {
//       console.log(err);
//       res.status(500).json({err});
//    });
//  });


 //listen at the end
 app.listen(port,() => console.log("I am listening"));