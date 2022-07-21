import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 50).notNullable()
      table.string('description', 400).notNullable()
      table
        .enu('priority', ['important', 'unimportant', 'urgent', 'future_scope'])
        .notNullable()
        .defaultTo('important')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
