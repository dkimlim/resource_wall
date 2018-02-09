const bcrypt = require('bcrypt');

module.exports = function makeDataHelpers(knex) {
  return {
    checkUser: function (loginAttemptInfo, cb) {
      let templateVars = {};
      knex
        .select("*")
        .from("users")
        .where("email", loginAttemptInfo.email)
        .then((result) => {
          console.log(loginAttemptInfo);
          if (bcrypt.compareSync(loginAttemptInfo.password, result[0].password)) {
            templateVars.userExists = true;
            templateVars.userID = result[0].userid;
            cb(null, templateVars);
            return;
          } else {
            templateVars.userExists = false;
            templateVars.userID = null;
            cb(null, templateVars);
          }
        });
    },

    addNewCard: function (cardInfo, cb) {
      knex("cards")
        .insert({
          url: cardInfo.url,
          title: cardInfo.url,
          boardID: cardInfo.boardID
        });
    },
    getAllCards: function () {
      knex
        .select("*")
        .from("cards")
        .then((result) => {
          return result;
        })
    },
     getUserBoards: function (cookie, cb) {
      let resultfromQ;
         knex
            .select("*")
            .from("boards")
            .where("userid", cookie.userID)
            .then((result) => {
              cb(null, result);
            })
        },

    addNewUserBoards: function (newBoardInfo) {
      console.log("datahelper function", newBoardInfo)
         knex("boards")
            .insert({
            name: newBoardInfo["name"],
            userid: newBoardInfo.userid
          })
          .then((result) => {
          return result;
          })
        },

    isUserAlreadyExist: function (regAttemptInfo, cb, errorCb) {
      knex
        .select("*")
        .from("users")
        .where("email", regAttemptInfo.email)
        .orWhere("username", regAttemptInfo.username)
        .then((users) => {
          if (users.length === 0) {
            console.log("good request");
            cb(false);
          } else {
            cb(true);
          }
        })
        .catch((err) => {
          errorCb(err);
          res.status(500).send(error.error);
        });
    },

     loggedIn: function(cookie){
      return cookie.userID
    },


    insertNewUser: function (regAttemptInfo) {
      console.log(regAttemptInfo);
      knex("users")
        .insert({
          username: regAttemptInfo.username,
          email: regAttemptInfo.email,
          password: bcrypt.hashSync(regAttemptInfo.password, 10)
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
}

