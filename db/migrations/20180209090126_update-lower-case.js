exports.up = function(knex, Promise) {
    return knex.schema.table('userlikes', function (table) {
        table.renameColumn('cardID', 'cardid');
        table.renameColumn('userID', 'userid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('userlikes', function (table) {
        table.renameColumn('cardid', 'cardID');
        table.renameColumn('userid', 'userID');
      });
};