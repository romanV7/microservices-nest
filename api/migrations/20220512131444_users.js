exports.up = function(knex) {
  return knex.schema.createTable('streams', function(table) {
    table.increments('id').primary()
    table.string('firstName', 255)
    table.string('lastName', 255)
    table.string('title', 255)
    table.timestamp('scheduled_for')
    table.string('scheduled_duration', 255)
    table.string('actual_duration', 255)
    table.string('type', 255)
    table.string('inbound_url', 255)
    table.string('outbound_url', 255)
    table.string('archive_url', 255)
    table.integer('max_viewers_count')
    table.integer('user_id')
    table.string('status', 255)
    table.timestamp('created_at')
    table.timestamp('started_at')
    table.timestamp('activation_initiated_at')
    table.timestamp('activation_completed_at')
    table.timestamp('deactivation_initiated_at')
    table.timestamp('deactivation_completed_at')
    table.timestamp('updated_at')
    table.timestamp('deleted_at')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('streams')
}
