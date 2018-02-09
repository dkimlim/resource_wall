exports.up = function(knex, Promise) {
    return knex.schema.table('cards_tags', function (table) {
        table.renameColumn('cardID', 'cardid');
        table.renameColumn('tagID', 'tagid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('cards_tags', function (table) {
        table.renameColumn('cardid', 'cardID');
        table.renameColumn('tagid', 'tagID');
      });
};