import { BaseModel, BelongsTo, HasMany, HasOne, belongsTo, column, computed, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'

import ChannelType from 'App/Models/ChannelType'
import CompletedWork from 'App/Models/CompletedWork'
import { DateTime } from 'luxon'
import District from 'App/Models/District'
import GsmOperator from 'App/Models/GsmOperator'
import HeadController from 'App/Models/HeadController'
import TypesKp from 'App/Models/TypesKp'
import VoltageClass from 'App/Models/VoltageClass'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Substation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public active: boolean

  @column()
  public districtId: number

  @column()
  public voltageClassesId: number

  @column()
  public typeKpId: number

  @column()
  public headControllerId: number

  @column()
  public mainChannelId: number

  @column()
  public backupChannelId: number | null

  @column()
  public additionalChannelId: number | null

  @column()
  public gsmId: number | null

  @column()
  public name: string

  @column()
  @slugify({
    fields: ['name'],
    strategy: 'shortId',
    // обновление slug, если не использовать для поиска
    allowUpdates: true,
  })
  public slug: string

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public rdu: boolean

  @column()
  public mainChannelIp: string

  @column()
  public backupChannelIp: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get numberCompletedWorks() {
    return this.works?.length
  }

  @hasMany(() => CompletedWork)
  public works: HasMany<typeof CompletedWork>

  @belongsTo(() => District)
  public district: BelongsTo<typeof District>

  @belongsTo(() => VoltageClass, {
    localKey: 'id',
    foreignKey: 'voltageClassesId'
  })
  public voltage_class: BelongsTo<typeof VoltageClass>

  @hasOne(() => TypesKp, {
    localKey: 'typeKpId',
    foreignKey: 'id'
  })
  public type_kp: HasOne<typeof TypesKp>

  @hasOne(() => HeadController, {
    localKey: 'headControllerId',
    foreignKey: 'id'
  })
  public head_controller: HasOne<typeof HeadController>

  @belongsTo(() => ChannelType, {
    localKey: 'id',
    foreignKey: 'mainChannelId'
  })
  public main_channel: BelongsTo<typeof ChannelType>

  @belongsTo(() => ChannelType, {
    localKey: 'id',
    foreignKey: 'backupChannelId'
  })
  public backup_channel: BelongsTo<typeof ChannelType>

  @belongsTo(() => ChannelType, {
    localKey: 'id',
    foreignKey: 'additionalChannelId'
  })
  public additional_channel: BelongsTo<typeof ChannelType>

  @belongsTo(() => ChannelType, {
    localKey: 'id',
    foreignKey: 'gsmId'
  })
  public gsm: BelongsTo<typeof GsmOperator>
  // @hasOne(() => ChannelType, {
  //   localKey: 'mainChannelId',
  //   foreignKey: 'id'
  // })
  // public main_channel: HasOne<typeof ChannelType>

  // @hasOne(() => ChannelType, {
  //   localKey: 'backupChannelId',
  //   foreignKey: 'id'
  // })
  // public backup_channel: HasOne<typeof ChannelType>

  // @hasOne(() => ChannelType, {
  //   localKey: 'additionalChannelId',
  //   foreignKey: 'id'
  // })
  // public additional_channel: HasOne<typeof ChannelType>

  // @hasOne(() => GsmOperator, {
  //   localKey: 'gsmId',
  //   foreignKey: 'id'
  // })
  // public gsm: HasOne<typeof GsmOperator>
}
