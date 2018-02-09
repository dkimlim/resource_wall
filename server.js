"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const DataHelpers = require('./lib/data-helpers.js')(knex);
const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));


app.use(cookieSession ({
  name: "session",
  keys: ["key1", "key2", "key3"]
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  const isLoggedIn = {isLoggedIn: DataHelpers.loggedIn(req.session)}
  res.status(200);
  res.render("index", isLoggedIn);
});

app.post("/login", (req, res) => {
  DataHelpers.checkUser({email: req.body.email, password: req.body.password}, (err, userInfo) => {
    if (err) {
      console.error("problems");
      res.status(403).send();
    } else {
      console.log('result',userInfo);
      req.session.userID = userInfo.userID;
      res.redirect("/");
    }
  })
});

app.post("/logout", (req, res) => {
  console.log("clearing cookie")
  req.session = null;

  res.redirect("/");
})

//This  adds a new card to the card database and then returns all the cards present
app.post("/cards", (req, res) => {
  let cardInfo = {
    url: req.body["card-url"],
    tags: req.body.tags,
    boardID: req.body["board-id"]
  };
  DataHelpers.addNewCard(cardInfo);
  //We will have to change this to get userSpecific cards
  const allCards = DataHelpers.getAllCards(req.session);
  res.send(200, allCards);
});

app.post("/boards", (req, res) => {
  let boardInfo = {
    name: req.body["boardname"],
    userID: req.session.userID
  }
  const boardAdded = DataHelpers.addNewBoard(boardInfo)
  res.send(200);
});

app.post("/register", (req, res, err) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  DataHelpers.isUserAlreadyExist(userData, (isExist) => {
      if (isExist) {
        //If this exists, then user information is not unique in db.
        console.error("problems");
        res.status(401).send();
      } else {
        DataHelpers.insertNewUser(userData);
        res.send();
      }
    },
    error => {
      res.status(500).send(error.error);
    }
  )
});

//If #tag entered in search bar exists, server returns an array of cards that have that tagid. 
//If it does not exist, an empty array is returned.
app.post("/search", (req, res) => {
  DataHelpers.findCardsforTag(req.body.tagname);
  res.send(200, foundCards);
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
