
exports.up = function(knex, Promise) {
    return knex.schema.createTable('cards', function (table) {
        table.increments('cardID');
        table.string('title');
        table.string('URL');
        table.integer('boardID').references('boardID').inTable('boards');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('cards');
};