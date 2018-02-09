
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('like', 'userlikes')
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('userlikes', 'like')
};