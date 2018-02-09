exports.seed = function(knex, Promise) {
    return knex('rating').del()
      .then(function () {
        return Promise.all([
          knex('rating').insert({userid: 1, cardid: 1, avgrating: 4.3}),
          knex('rating').insert({userid: 2, cardid: 2, avgrating: 2.7}),
          knex('rating').insert({userid: 3, cardid: 3, avgrating: 0.2})
        ]);
      });
  };