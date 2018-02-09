exports.up = function(knex, Promise) {
    return knex.schema.table('comments', function (table) {
        table.renameColumn('cardID', 'cardid');
        table.renameColumn('commentID', 'commentid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('comments', function (table) {
        table.renameColumn('cardid', 'cardID');
        table.renameColumn('commentid', 'commentID');
      });
};