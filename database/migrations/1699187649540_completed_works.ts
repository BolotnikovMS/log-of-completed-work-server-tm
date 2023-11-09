import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'completed_works'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id', 11).notNullable().index().unsigned().references('id').inTable('users')
      table.integer('substation_id', 11).notNullable().index().unsigned().references('id').inTable('substations')
      table.integer('work_producer_id', 11).notNullable().index().unsigned().references('id').inTable('users')
      table.text('description').notNullable()
      table.string('note').nullable()
      table.dateTime('date_completion').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
