exports.seed = function(knex, Promise) {
    return knex('tags').del()
      .then(function () {
        return Promise.all([
          knex('tags').insert({name: "#A"}),
          knex('tags').insert({name: "#stackoverflow"}),
          knex('tags').insert({name: "#boring"})
        ]);
      });
  };