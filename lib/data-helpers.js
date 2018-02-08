module.exports = function makeDataHelpers(knex) {
    return {
        checkUser: function(loginAttemptInfo, cb) {
            knex
            .select("*")
            .from("users")
            .then((results) => {
              for(let user of results) {
                  if(user.email === loginAttemptInfo.email) {
                      if(user.password === loginAttemptInfo.password){
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