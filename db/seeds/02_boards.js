exports.seed = function(knex, Promise) {
  return knex('boards').del()
    .then(function () {
      return Promise.all([
        knex('boards').insert({name: 'A', userid: 1}),
        knex('boards').insert({name: 'Stack overflow', userid: 2}),
        knex('boards').insert({name: 'board1', userid: 3})
      ]);
    });
};