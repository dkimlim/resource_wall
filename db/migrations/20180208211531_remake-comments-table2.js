exports.up = function(knex, Promise) {
    return knex.schema.createTable('comments', function (table) {
        table.increments('commentID');
        table.integer('userid').references('userID').inTable('public.users');
        table.integer('cardID').references('cardID').inTable('public.cards');
        table.text('comment');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('comments')
};