const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({userID: 1, username: 'Alice', email: 'alice@alice.com', password: bcrypt.hashSync('alice', 10)}),
        knex('users').insert({userID: 2, username: 'Bob', email: 'bob@bob.com', password: bcrypt.hashSync('bob', 10)}),
        knex('users').insert({userID: 3, username: 'Charlie', email: 'charlie@charlie.com', password: bcrypt.hashSync('charlie', 10)})
      ]);
    });
};
