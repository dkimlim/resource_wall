exports.up = function(knex, Promise) {
    return knex.schema.table('boards', function (table) {
        table.renameColumn('boardID', 'boardid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('boards', function (table) {
        table.renameColumn('boardid', 'boardID');
      });
};