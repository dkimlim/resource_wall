exports.seed = function(knex, Promise) {
    return knex('cards').del()
      .then(function () {
        return Promise.all([
          knex('cards').insert({title: 'A', url: 'www.a.com', boardid: 1}),
          knex('cards').insert({title: 'Stack overflow run knex seed', url: 'www.stackoverflow.com', boardid: 2}),
          knex('cards').insert({title: 'board1', url: 'www.example.com', boardid: 3})
        ]);
      });
  };