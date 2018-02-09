exports.seed = function(knex, Promise) {
  return knex('comments').del()
    .then(function () {
      return Promise.all([
        knex('comments').insert({comment: 'WOW! amazing. This will help me learn.', userid: 1, cardid: 1}),
        knex('comments').insert({comment: 'Meh, I could find better then this.', userid: 2, cardid: 3}),
        knex('comments').insert({comment: '....COOL', userid: 3, cardid: 2})
      ]);
    });
};