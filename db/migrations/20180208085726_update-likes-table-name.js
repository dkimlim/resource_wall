
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('likes', 'like')
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('like', 'likes')
};