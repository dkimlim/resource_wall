
exports.up = function(knex, Promise) {
    return knex.schema.createTable('following', function (table) {
        table.integer('userid_1').references('userid').inTable('public.users');
        table.integer('userid_2').references('userid').inTable('public.users');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('following');
};