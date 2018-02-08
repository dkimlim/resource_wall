exports.up = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.renameColumn('userid', 'userID');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.renameColumn('userID', 'userid');
      });
};