exports.up = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.dropColumn('avg_rating');
        table.decimal('avgrating');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.dropColumn('avgrating');
        table.integer('avg_rating');
      });
};