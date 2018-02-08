
exports.up = function(knex, Promise) {
    return knex.schema.createTable('boards', function (table) {
        table.increments('boardID');
        table.string('name');
        table.integer('userid').references('userid').inTable('public.users');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('boards');
};
