exports.seed = function(knex, Promise) {
    return knex('cards_tags').del()
      .then(function () {
        return Promise.all([
          knex('cards_tags').insert({tagid: 1, cardid: 1}),
          knex('cards_tags').insert({tagid: 2, cardid: 2}),
          knex('cards_tags').insert({tagid: 3, cardid: 3})
        ]);
      });
  };