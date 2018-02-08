const bcrypt = require('bcrypt');

module.exports = function makeDataHelpers(knex) {
  return {
    checkUser: function (loginAttemptInfo, cb) {
      knex
        .select("password")
        .from("users")
        .where("email", loginAttemptInfo.email)
        .then((result) => {
          if (bcrypt.compareSync(loginAttemptInfo.password, result[0].password)) {
            cb(null, true);
            return;
          } else {
            cb(null, false);
          }
        });
    }
  }
}
