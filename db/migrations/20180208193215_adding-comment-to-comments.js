exports.up = function(knex, Promise) {
    return knex.schema.table('comments', function (table) {
        table.text('comment');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('comments', function (table) {
        table.dropColumns('comment');
      });
};