exports.up = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.integer('avg_rating');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('rating', function (table) {
        table.dropColumns('avg_rating');
      });
};