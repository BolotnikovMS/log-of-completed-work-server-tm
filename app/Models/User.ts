import { BaseModel, BelongsTo, beforeSave, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Role from 'App/Models/Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public active: boolean

  @column()
  public username: string

  @column()
  public surname: string

  @column()
  public name: string

  @column()
  public patronymic: string

  @column()
  public position: string

  @column()
  public roleId: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @computed()
  public get fullName() {
    return `${this.surname} ${this.name} ${this.patronymic}`
  }

  @computed()
  public get shortUserName() {
    return `${this.surname} ${this.name.at(0)}.${this.patronymic.at(0)}.`
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>
}
