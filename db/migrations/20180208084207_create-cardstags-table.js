
exports.up = function(knex, Promise) {
    return knex.schema.createTable('cards_tags', function (table) {
        table.integer('cardID').references('cardID').inTable('public.cards');
        table.integer('tagID').references('tagsID').inTable('public.tags');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('cards_tags');
};