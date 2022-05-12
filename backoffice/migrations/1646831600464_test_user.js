exports.up = function(knex) {
  return knex.raw(
    `INSERT INTO "users" (
      "first_name",
      "last_name",
      "enabled",
      "status",
      "email",
      "password",
      "role",
      "reset_password_token"
    ) VALUES (
      'test', 'test', true, 'CONFIRMED', 'test@user.com', '$2b$10$8GV1qZrAmrQ.A17KlWeCsesL8use9IOo2PyTGV/H4zfuZe.4VUGHy', 'STREAMER', 'resetPasswordToken'
    )`,
  )
}

exports.down = function(knex) {}
