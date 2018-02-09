exports.up = function(knex, Promise) {
    return knex.schema.dropTable('comments')
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('comments', function (table) {
    table.integer('userid').references('userid').inTable('public.users');
    table.integer('cardID').references('cardID').inTable('public.cards');
    table.text('comment');
    table.increments('commentID');
  });
};
