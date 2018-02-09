exports.up = function(knex, Promise) {
    return knex.schema.table('tags', function (table) {
        table.renameColumn('tagID', 'tagid');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('tags', function (table) {
        table.renameColumn('tagid', 'tagID');
      });
};