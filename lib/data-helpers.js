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
        })
        .catch((e) => {
          templateVars.userExists = false;
          templateVars.userID = null;
          cb(null, templateVars);
        });
    },

    addNewCard: function (cardInfo, cb) {
      knex("cards")
        .insert({
          url: cardInfo.url,
          title: cardInfo.title,
          boardid: cardInfo.boardid,
          description: cardInfo.description
        })
        .then((result) => {
          cb(null);
        })
        .catch((err) => {
          console.log(err);
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

    getCardsViaBoardId: function (boardid, cb) {
      knex
        .select("*")
        .from("cards")
        .where("boardid", boardid)
        .then((result) => {
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

        });

    },

    getUserCards: function (cookie, cb) {
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
        });
    },

    loggedIn: function (cookie) {
      return cookie.userID
    },

    insertNewUser: function (regAttemptInfo, cb) {
      knex("users")
        .insert({
          username: regAttemptInfo.username,
          email: regAttemptInfo.email,
          password: bcrypt.hashSync(regAttemptInfo.password, 10)
        }, 'userid')
        .then((result) => {
          cb(null, result)
        })
        .catch((e) => {
          cb(e, null)
        });
    },

    findCardsforTag: function (tag) {
      console.log(tag);
      knex('tags')
        .join('cards_tags', 'tags.tagid', '=', 'cards_tags.tagid')
        .join('cards', 'cards_tags.cardid', '=', 'cards.cardid')
        .whereRaw('name = ?', [tag])
        .select('cards.cardid', 'title', 'url', 'boardid')
        .then((foundCards) => {
          return foundCards;
        })
        .catch((err) => {

        });
    },

    getCardsComments: function (cards, cb) {
      if (cards.length === 0) cb(null, [])
      for (let card in cards) {
        knex
          .select('*', 'username')
          .from('comments')
          .join('users', 'comments.userid', 'users.userid')
          .where('cardid', cards[card].cardid)
          .then((result) => {
            cards[card].comments = result;
            if (card == (cards.length - 1)) {
              cb(null, cards);
            }
          })
      }
    },

    getCardsByKeyword: function (searchWord, cb) {
      let searchVar = '%' + searchWord + '%'
      knex
        .select("*")
        .from("cards")
        .innerJoin('boards', 'cards.boardid', 'boards.boardid')
        .innerJoin('users', 'boards.userid', 'users.userid')
        .where('boards.name', 'ilike', searchVar)
        .orWhere('cards.description', 'ilike', searchVar)
        .then((result) => {
          cb(null, result);
        })
    },

    getHomeCards: function (cookie, cb) {
      knex
        .select("*")
        .from('cards')
        .join('users', 'boards.userid', 'users.userid')
        .join('boards', 'cards.boardid', 'boards.boardid')
        .where('boardid', cookie.userID)
        .then((result) => {
          cb(null, result);
        })
    },

    getMostLikedCards: function (cb) {
      knex
        .count('* as total_counts')
        .select('cards.*')
        .select('users.username')
        .select('users.userid')
        .from('userlikes')
        .innerJoin('cards', 'cards.cardid', 'userlikes.cardid')
        .innerJoin('boards', 'boards.boardid', 'cards.boardid')
        .innerJoin('users', 'boards.userid', 'users.userid')
        .groupBy('cards.cardid', 'cards.title', 'cards.url', 'userlikes.cardid', 'users.username', 'users.userid')
        .orderBy('total_counts', 'desc')
        .then((result) => {
          cb(null, result);
        })
    },

    likedCard: function (cookie, attemptLikeID, cb) {
      knex
        .select('cardid')
        .from('userlikes')
        .where('userid', cookie.userID)
        .andWhere('cardid', attemptLikeID)
        .then((result) => {
          console.log(result);
          if (result.length !== 0) {
            cb(null, false)
          } else {
            cb(null, true);
          }
        })
    },

    updateLikesTable: function (updateFlag, cookie, cardid, cb) {
      if (updateFlag) {
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

    addComment: function (commentInfo, cookie, cb) {
      knex('comments')
        .insert({
          comment: commentInfo.text,
          cardid: commentInfo.cardid,
          userid: cookie.userID
        })
        .then(() => {
          cb(null);
        })
        .catch((err) => {

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
        .catch((err) => {});
    },

    updateProfileInfo: function (newProfileInfo, cb, err) {
      knex
        .select('*')
        .from('users')
        .where('userid', newProfileInfo.userid)
        .update(newProfileInfo)
        .then((result) => {
          cb(null, result)
        })
        .catch((err) => {

        });
    },

    addNewRating: function (rating, cb) {
      knex('rating')
        .insert(rating)
        .then(() => {
          cb(null)
        })
    },

    getCardRating: function (cardid, cb) {
      knex('rating')
        .select(knex.raw('ROUND(AVG(avgrating),1)'))
        .where('cardid', cardid)
        .then((result) => {
          console.log('RESULT OF ROUND', result);
          cb(null, result[0].round);
        })
    },

    getMyCards: function (cookie, cb) {
      knex.raw(`SELECT DISTINCT cards.cardid, cards.title, cards.url, cards.description, cards.boardid, bt.name, tlt.total_counts FROM cards
     LEFT JOIN boards AS bt ON bt.boardid = cards.boardid
     LEFT JOIN userlikes AS ult ON ult.cardid = cards.cardid
     LEFT JOIN (SELECT COUNT(*) as total_counts, userlikes.cardid FROM userlikes
    GROUP BY userlikes.cardid) tlt on tlt.cardid = cards.cardid
     GROUP BY cards.cardid, bt.boardid, ult.userid, ult.cardid, tlt.total_counts
HAVING bt.userid = ${cookie.userID} or ult.userid = ${cookie.userID};`).then((result) => {
        cb(null, result.rows);
      })
    },

    getUserLikedCards: function (cookie, cb) {
      knex
        .select('aCard.*')
        .select('users.userid')
        .select('users.username')
        .from('userlikes')
        .where('userlikes.userid', cookie.userID)
        .innerJoin('boards as b', 'b.userid', cookie.userID)
        .innerJoin('cards as aCard', 'aCard.card  id', 'userlikes.cardid')
        .innerJoin('users', 'userlikes.userid', 'users.userid')
        .then((result) => {
          cb(null, result);
        })
    },

    canUserRate: function (cookie, attemptRatingID, cb) {
      knex
        .select('*')
        .from('rating')
        .where('userid', cookie.userID)
        .andWhere('cardid', attemptRatingID)
        .then((result) => {
          console.log(result);
          if (result.length !== 0) {
            cb(null, false)
          } else {
            cb(null, true);
          }
        })
    },

    getTotalLikes: function (cardid, cb) {
      knex
        .count('* as total_counts')
        .from('userlikes')
        .where('cardid', cardid)
        .then((result) => {
          console.log(result[0].total_counts);
          cb(null, result[0].total_counts)
        })
    }
  }
}
