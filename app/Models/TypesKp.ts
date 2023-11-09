import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class TypesKp extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({
    consume: (value: string): boolean => Boolean(value),
  })
  public active: boolean

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
