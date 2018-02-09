exports.up = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.renameColumn('userID', 'userid');
        table.renameColumn('cardID', 'cardid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.renameColumn('userID', 'userid');
        table.renameColumn('cardID', 'cardid');
      });
};