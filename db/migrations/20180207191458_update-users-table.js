
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
        table.renameColumn('id', 'userid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
        table.renameColumn('userid', 'id');
      });
};