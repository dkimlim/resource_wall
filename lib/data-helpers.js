const bcrypt = require('bcrypt');

module.exports = function makeDataHelpers(knex) {
    return {
        checkUser: function(loginAttemptInfo, cb) {
            knex
            .select("*")
            .from("users")
            .then((results) => {
              for(let user of results) {
                  if(user.email === loginAttemptInfo.email) {
                      if(bcrypt.compareSync(loginAttemptInfo.password, user.password)){
                        cb(null, true);
                        return;
                      }
                  }
              }
              cb(null, false);
          });
        }
    }
}