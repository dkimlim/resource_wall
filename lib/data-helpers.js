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
            templateVars.userID = result[0].userID;
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
    },

    findCardsforTag: function (tag) {
      console.log(tag);
      knex('tags')
        .join ('cards_tags', 'tags.tagid', '=', 'cards_tags.tagid')
        .join ('cards', 'cards_tags.cardid', '=', 'cards.cardid')
        .whereRaw('name = ?', [tag])
        .select('cards.cardid', 'title', 'url', 'boardid')
        .then((foundCards) => {
          console.log(foundCards);
          return foundCards;
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send(error.error);
        });
    }


  }
}

