
exports.up = function(knex, Promise) {
    return knex.schema.table('tags', function (table) {
        table.renameColumn('tagsID', 'tagID');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('tags', function (table) {
        table.renameColumn('tagID', 'tagsID');
      });
};