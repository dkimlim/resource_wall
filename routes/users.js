"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}


  //Check if user is logged in . If the cookie session has a userID, then render follers page, allow the client to comment on, like and add cards.
  router.get('/allowed', function (req, res) {
    console.log("in allowed route");
    if (req.session.userID) {
      res.json({
        status: true
      });
    } else {
      res.json({
        status: false
      });
    }
  })

  //When the user logs out, we clear the session
  router.get("/logout", function (req, res) {
    console.log('in logout route');
    req.session = null;
    res.redirect('/')
  })