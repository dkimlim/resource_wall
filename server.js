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
  res.render("index");
});

app.get("/login", (req, res) => {
  DataHelpers.checkUser({email: 'bob@bob.com',password: 'bob'}, (err, userInfo) => {
    if (err) {
      console.error("problems");
      res.status(403).send();
    } else {
      console.log('result',userInfo);
      req.session.userID = userInfo.userID;
      res.send(userInfo);
    }
  })
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.send("logged out");
})

//This  adds a new card to the card database and then returns all the cards present
app.post("/cards", (req, res) => {
    let cardInfo = {url: req.body["card-url"], tags: req.body.tags, boardID: req.body["board-id"]};
    DataHelpers.addNewCard(cardInfo);
    //We will have to change this to get userSpecific cards
    const allCards = DataHelpers.getAllCards(req.session);
    res.send(allCards);
})

app.post("/boards", (req, res) => {
  let boardInfo = {name: req.body["boardname"], userID: req.session.userID}
  DataHelpers.addNewBoard(boardInfo)
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
