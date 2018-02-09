exports.up = function(knex, Promise) {
    return knex.schema.table('cards', function (table) {
        table.renameColumn('cardID', 'cardid');
        table.renameColumn('URL', 'url');
        table.renameColumn('boardID', 'boardid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('cards', function (table) {
        table.renameColumn('cardid', 'cardID');
        table.renameColumn('url', 'URL');
        table.renameColumn('boardid', 'boardID');
      });
};