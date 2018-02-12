"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const bcrypt = require('bcrypt');
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
  if(isLoggedIn.isLoggedIn){
    DataHelpers.getUserBoards(req.session, (err, result) => {
       const templateVars = {userBoards: result, isLoggedIn: DataHelpers.loggedIn(req.session)}
      DataHelpers.getMostLikedCards((err, cards) => {
        DataHelpers.getCardsComments(cards, (err, cardsWithComments) => {
          templateVars.cards = cardsWithComments;
          res.render("index", templateVars);
        })
      })
    })
  } else {
    console.log('in else');
    const templateVars = {isLoggedIn: DataHelpers.loggedIn(req.session)};
    DataHelpers.getMostLikedCards((err, mostLikedCards) => {
      templateVars.cards = mostLikedCards;
      res.render("index", templateVars);
    })
  }
});

/////   GET USER BOARDS  ////
  app.get("/user/boards", (req, res) => {
    const userBoards = {isLoggedIn: DataHelpers.getUserBoards(req.session)}
    res.status(200);
    res.send(userBoards);
  });

/////   POST NEW USER BOARDS INFO  ////
  app.post("/user/boards", (req, res) => {
    let newBoardInfo = {
     name: req.body["name"],
     userid: req.session.userID
    }
    let NewUserBoard = DataHelpers.addNewUserBoards(newBoardInfo)
    console.log(NewUserBoard)
    res.status(200);
    res.send(NewUserBoard);
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
    title: req.body['title-of-card'],
    url: req.body["url-of-card"],
    description: req.body['tags-of-card'],
    boardid: req.body["board-of-card"]
  };
  console.log(req.body);
  DataHelpers.addNewCard(cardInfo, (err) => {
    console.log('before redirect');
    res.redirect(200, '/');
  });
  //We will have to change this to get userSpecific cards
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

  if(req.body.username.indexOf(' ') >= 0){
    res.redirect('/')
  } else {
    DataHelpers.isUserAlreadyExist(userData, (isExist) => {
        if (isExist) {
          //If this exists, then user information is not unique in db.
          console.error("problems");
          res.status(401).send();
        } else {
          DataHelpers.insertNewUser(userData, (err, results) => {
            console.log(results[0]);
            req.session.userID=results[0];
            res.redirect('/')
          });

        }
      },
      err => {
        res.status(500).send(error.error);
      }
    )
  }
});

//If #tag entered in search bar exists, server returns an array of cards that have that tagid.
//If it does not exist, an empty array is returned.
/*app.post("/search", (req, res) => {
  DataHelpers.findCardsforTag(req.body.tagname);
  res.send(200, foundCards);
});
*/
app.get('/user-boards', (req, res) => {
  console.log('in user boards')
  const templateVars = { };
  DataHelpers.getMyCards(req.session, (err, cards) => {
    console.log('RESULT OF GETMYCARDS = ', cards)
    templateVars.cards = cards;
    templateVars.isLoggedIn = DataHelpers.loggedIn(req.session);
    DataHelpers.getCardsComments(cards, (err, cardsWithComments) => {
      templateVars.cards = cardsWithComments;
      DataHelpers.getUserBoards(req.session, (err, boards) => {
        templateVars.userBoards = boards;
        res.render('index', templateVars);
      })
    })
  })
}),
app.post('/comments', (req, res) => {
  console.log('in comments POST', req.session);
  DataHelpers.addComment(req.body, req.session, (err) => {
    res.redirect('/');
  })
})

app.post('/like-card', (req, res) => {
  //2 is the cardid we are trying to like

  DataHelpers.likedCard(req.session, req.body.cardid, (err, canLike) => {
    console.log(canLike);
    if(canLike) {
      //add like to database
      DataHelpers.updateLikesTable(canLike,req.session, req.body.cardid, (err) => {
        DataHelpers.getTotalLikes(req.body.cardid, (err, total_likes) => {
          // console.log('total likes in server.js is', total_likes)
          res.json({liked: canLike, total_likes: total_likes});
        })
      })
    } else {
      DataHelpers.updateLikesTable(canLike,req.session, req.body.cardid, (err) => {
        DataHelpers.getTotalLikes(req.body.cardid, (err, total_likes) => {
          res.json({liked: canLike, total_likes: total_likes});
        })
      })
    }
  })
})

//GET profile page if user is logged in. They can update their profile from this page.
app.get("/profile", (req, res) => {
  let isLoggedIn = DataHelpers.loggedIn(req.session)

  if(isLoggedIn){
    DataHelpers.getProfileOfLoggedUser(req.session, (err, users) => {
      let templateVariables = {
        username: users[0].username,
        email: users[0].email,
        password: users[0].password,
        isLoggedIn: DataHelpers.loggedIn(req.session),
        userBoards: DataHelpers.getUserBoards(req.session, (err, result) => {
          const templateVars = {userBoards: result, isLoggedIn: DataHelpers.loggedIn(req.session)}
        })
      }

        res.render("profile", templateVariables);

    })
  } else {
      console.log('user is not logged in');
      res.redirect('login')
  }
});

//POST updated information in the profile page. This will automatically update info in db.
app.post("/profile", (req, res) => {
  const userData = {};

  //username cannot have spaces. Will return an error. 
  if(req.body.username.indexOf(' ') >= 0){
      res.redirect('profile')
  } else {
      if(req.body.email) userData.email = req.body.email;
      if(req.body.password) userData.password = bcrypt.hashSync(req.body.password, 10);
      if(req.session.userID) userData.userid = req.session.userID;
      if(req.body.username) userData.username = req.body.username;
  } 
  DataHelpers.updateProfileInfo(userData, (results) => {
      console.log(results);
  })
  res.redirect('/')
});


app.get('/user-boards/:board', (req, res) => {

  const templateVars = { };

    DataHelpers.getCardsViaBoardId(req.params["board"], (err, cards) => {
      console.log("card collect by boardid ", cards)
      templateVars.cards = cards
      templateVars.isLoggedIn = DataHelpers.loggedIn(req.session);
      console.log(templateVars);
      DataHelpers.getUserBoards(req.session, (err, boards) => {
      templateVars.userBoards = boards;

      console.log ("temp vars", templateVars)

      res.render('index', templateVars);
    })
  })
})

app.post("/ratings", (req, res) => {
  console.log(req.body);
  req.body.userid = req.session.userID;
  DataHelpers.canUserRate(req.session, req.body.cardid, (err, canRate) => {
    console.log('CAN RATE = ', canRate)
    if(canRate) {
      DataHelpers.addNewRating(req.body, (err) => {
        res.send(200);
      });
    } else {
      res.send(200);
    }
  })
})
app.get("/get-rating", (req, res) => {
  console.log(req.query);
    DataHelpers.getCardRating(req.query.cardid, (err, result) => {
      console.log(result);
      res.json({cardRating: result});
    })
})

app.get('/user-boards/search/:searchWord', (req, res) => {
  console.log(" req PARSM searchword", req.params["searchWord"])

  const templateVars = { };

    DataHelpers. getCardsByKeyword(req.params["searchWord"], (err, cards) => {
      console.log("card collect by searchWord", cards)
      templateVars.cards = cards
      templateVars.isLoggedIn = DataHelpers.loggedIn(req.session);
      console.log(templateVars);
      DataHelpers.getUserBoards(req.session, (err, boards) => {
      templateVars.userBoards = boards;

     // console.log ("temp vars", templateVars)

      res.render('index', templateVars);
    })
  })
})




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
