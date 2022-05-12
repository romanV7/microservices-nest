exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary()
    table.integer('enabled')
    table.string('status', 255)
    table.string('email', 255)
    table.string('first_name', 255)
    table.string('last_name', 255)
    table.string('password', 255)
    table.string('role', 255)
    table.string('reset_password_token', 255)
    table.timestamp('updated_at')
    table.timestamp('deleted_at')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
