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
    loggedIn: function(cookie){
      return cookie.userID
    }

  }
}

