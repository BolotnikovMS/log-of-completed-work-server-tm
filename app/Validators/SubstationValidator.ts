import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SubstationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    active: schema.boolean.optional(),
    districtId: schema.number(),
    voltageClassesId: schema.number(),
    typeKpId: schema.number(),
    headControllerId: schema.number(),
    mainChannelId: schema.number(),
    backupChannelId: schema.number.optional(),
    additionalChannelId: schema.number.optional(),
    gsmId: schema.number.optional(),
    name: schema.string([rules.trim(), rules.minLength(3), rules.maxLength(200), rules.escape()]),
    rdu: schema.boolean.optional(),
    mainChannelIp: schema.string.optional([rules.ip()]),
    backupChannelIp: schema.string.optional([rules.ip()]),
  })

  public messages: CustomMessages = {
    required: 'Поле {{ field }} является обязательным.',
    minLength: 'Минимальная длина поля {{ field }} - {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ field }} - {{ options.maxLength }} символа.',
    ip: 'Поле {{ field }} должно быть формата xxx.xxx.xxx.xxx.'
  }
}
