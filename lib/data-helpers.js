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
          title: cardInfo.title,
          boardid: cardInfo.boardid
        })
        .then((result) => {
          cb(null);
        })
        .catch((err) => {
          console.log(err);
          //res.status(500).send(error.error);
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
      console.log("hi there LOOOOOOOK HERER!!!!!")
      let resultfromQ;
         knex
            .select("*")
            .from("boards")
            .where("userid", cookie.userID)
            .then((result) => {
              cb(null, result);
            })
        },

      getCardsViaBoardId: function (boardid, cb) {
console.log(boardid)
      knex
        .select("*")
        .from("cards")
        .where("boardid", boardid)
        .then((result) => {
          console.log("result = ", result)
          cb(null, result);
        })

    },

        addNewUserBoards: function (newBoardInfo) {

          knex("boards")
             .insert({
             name: newBoardInfo["name"],
             userid: newBoardInfo.userid
           })
          .catch((err) => {
           console.log(err);
           //res.status(500).send(error.error);
         });

         },

         getUserCards: function(cookie, cb) {
          console.log('cookie = ', cookie)
          knex
            .select("title")
            .select('username')
            .select('url')
            .select('cards.boardid')
            .from("cards")
            .innerJoin('boards', 'cards.boardid', 'boards.boardid')
            .innerJoin('users', 'boards.userid', 'users.userid')
            .where('boards.userid', cookie.userID)
            .then((result) => {
              console.log('result = ', result);
              cb(null, result);
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
          //res.status(500).send(error.error);
        });
    },

     loggedIn: function(cookie){
      return cookie.userID
    },


    insertNewUser: function (regAttemptInfo, cb) {
      console.log(regAttemptInfo);
      knex("users")
        .insert({
          username: regAttemptInfo.username,
          email: regAttemptInfo.email,
          password: bcrypt.hashSync(regAttemptInfo.password, 10)
        },'userid')
        .then((result) => {
          cb(null, result)
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
          return foundCards;
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send(error.error);
        });
    }, 
    getCardsComments: function(cards, cb) {
      console.log("GETTING COMMENTS", cards);
      for(let card in cards) {
        knex
        .select('*', 'username')
        .from('comments')
        .join('users', 'comments.userid', 'users.userid')
        .where('cardid', cards[card].cardid)
        .then((result) => {
          cards[card].comments = result;
          if(card == (cards.length-1)) {
            cb(null, cards);
          }
        })
      }
    },

    getMostLikedCards: function (cb) {
      knex
        .count('* as total_counts')
        .select('cards.*')
        .select('users.username')
        .from('userlikes')
        .innerJoin('cards', 'cards.cardid', 'userlikes.cardid')
        .innerJoin('boards', 'boards.boardid', 'cards.boardid')
        .innerJoin('users', 'boards.userid', 'users.userid')
        .groupBy('cards.cardid', 'cards.title', 'cards.url', 'userlikes.cardid', 'users.username')
        .orderBy('total_counts', 'desc')
        .then((result) => {
          console.log('THE RESULT OF REQUEST ', result);
          cb(null, result);
        })
    },
    likedCard: function(cookie, attemptLikeID, cb) {
      console.log('cookie userid = ', cookie.userID);
      knex
      .select('cardid')
      .from('userlikes')
      .where('userid', cookie.userID)
      .andWhere('cardid', attemptLikeID)
      .then((result) => {
        console.log(result);
          if(result.length !== 0) {
            cb(null, false)
          } else {
            cb(null, true);
          }
        //cb(null, result);
      })
    },
    updateLikesTable: function(updateFlag, cookie, cardid, cb) {
      //add a row to userlikes
      if(updateFlag) {
        knex("userlikes")
        .insert({
          userid: cookie.userID,
          cardid: cardid
        })
        .then((result) => {
          cb(null);
        })
      } else {
        knex('userlikes')
        .where('userid', cookie.userID)
        .andWhere('cardid', cardid)
        .delete()
        .then((result) => {
          cb(null);
        })
      }
    },

    addComment: function(commentInfo, cookie, cb) {
      console.log('COOKIE IS ', cookie)
      knex('comments')
      .insert({
        comment: commentInfo.text,
        cardid: commentInfo.cardid,
        userid: cookie.userID
      })
      .catch((err) => {
        console.log(err);
        //res.status(500).send(error.error);
      });
    },

    getProfileOfLoggedUser: function (cookie, cb, err) {
      knex
      .select('*')
      .from('users')
      .where('userid', cookie.userID)
      .then((result) => {
        cb(null, result);
      })
      .catch((err) => {
          console.error(err);
      });
    },

    updateProfileInfo: function (newProfileInfo, cb, err) {
    console.log(newProfileInfo)
      knex
      .select('*')
      .from('users')
      .where('userid', newProfileInfo.userid)
      .update(newProfileInfo)
      .then((result) => {
        console.log(result)
          cb(null, result)
        })
      .catch((err) => {
          console.log(err);
        });
    }
          


  }
}

