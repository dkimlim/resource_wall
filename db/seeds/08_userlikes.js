exports.seed = function(knex, Promise) {
    return knex('userlikes').del()
      .then(function () {
        return Promise.all([
          knex('userlikes').insert({userid: 1, cardid: 1}),
          knex('userlikes').insert({userid: 2, cardid: 2}),
          knex('userlikes').insert({userid: 3, cardid: 2})
        ]);
      });
  };