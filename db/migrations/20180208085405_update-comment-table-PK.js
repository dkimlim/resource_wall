
exports.up = function(knex, Promise) {
    return knex.schema.table('comments', function (table) {
        table.increments('commentID');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('comments', function (table) {
        table.dropColumn('commentID');
      });
};