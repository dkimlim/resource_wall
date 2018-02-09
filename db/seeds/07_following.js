exports.seed = function(knex, Promise) {
    return knex('following').del()
      .then(function () {
        return Promise.all([
          knex('following').insert({userid_1: 1, userid_2: 1}),
          knex('following').insert({userid_1: 1, userid_2: 2}),
          knex('following').insert({userid_1: 3, userid_2: 3})
        ]);
      });
  };