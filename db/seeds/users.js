exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({userid: 1, username: 'Alice', email: 'alice@alice.com', password: 'alice'}),
        knex('users').insert({userid: 2, username: 'Bob', email: 'bob@bob.com', password: 'bob'}),
        knex('users').insert({userid: 3, username: 'Charlie', email: 'charlie@charlie.com', password: 'charlie'})
      ]);
    });
};
