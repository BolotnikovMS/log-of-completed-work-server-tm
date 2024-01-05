import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Substation from 'App/Models/Substation'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class CompletedWork extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public substationId: number

  @column()
  public workProducerId: number

  @column()
  public description: string

  @column()
  public note: string | null

  @column.dateTime()
  public dateCompletion: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user_created: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'workProducerId',
    localKey: 'id'
  })
  public work_producer: BelongsTo<typeof User>

  @belongsTo(() => Substation)
  public substation: BelongsTo<typeof Substation>
}
