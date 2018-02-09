const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({username: 'Alice', email: 'alice@alice.com', password: bcrypt.hashSync('alice', 10)}),
        knex('users').insert({username: 'Bob', email: 'bob@bob.com', password: bcrypt.hashSync('bob', 10)}),
        knex('users').insert({username: 'Charlie', email: 'charlie@charlie.com', password: bcrypt.hashSync('charlie', 10)})
      ]);
    });
};
