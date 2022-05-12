exports.up = function(knex) {
  return knex.raw(`ALTER TABLE users ADD COLUMN viewing_url varchar`)
}

exports.down = function(knex) {
  return knex.raw(`ALTER TABLE users DROP COLUMN viewing_url`)
}
