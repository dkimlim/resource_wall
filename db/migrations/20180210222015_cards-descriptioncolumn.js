exports.up = function(knex, Promise) {
    return knex.schema.table('cards', function (table) {
        table.text('description');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('cards', function (table) {
        table.dropColumns('description');
      });
};