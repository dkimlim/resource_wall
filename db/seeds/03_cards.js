exports.seed = function(knex, Promise) {
    return knex('cards').del()
      .then(function () {
        return Promise.all([
          knex('cards').insert({title: 'A', url: 'http://www.a.com', boardid: 1, description: "the letter a!"}),
          knex('cards').insert({title: 'Stack overflow', url: 'http://www.stackoverflow.com', boardid: 2, description: "Cool site to help solve programming problems!"}),
          knex('cards').insert({title: 'Example', url: 'http://www.example.com', boardid: 3, description: "Boring site"}),
          knex('cards').insert({title: 'News', url: 'http://www.cnn.com', boardid: 3, description: "News site"}),
          knex('cards').insert({title: 'B', url: 'http://www.b.com', boardid: 1, description: "the letter b!"})
        ]);
      });
  };