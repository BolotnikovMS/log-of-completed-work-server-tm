import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Hash from '@ioc:Adonis/Core/Hash';
import { RolesEnum } from 'App/Enums/Roles'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.boolean('active').defaultTo(true)
      table.string('username', 50).notNullable().unique()
      table.string('surname', 30).notNullable()
      table.string('name', 30).notNullable()
      table.string('patronymic', 30).notNullable()
      table.string('position', 50).notNullable()
      table
        .integer('role_id', 10)
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('roles')
        .defaultTo(RolesEnum.USER)
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table(this.tableName).insert({
        username: 'Admin',
        surname: 'Admin',
        name: 'Admin',
        patronymic: 'Admin',
        position: 'Admin',
        role_id: RolesEnum.ADMIN,
        email: 'admin@defect.ru',
        password: await Hash.make('12345678'),
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
