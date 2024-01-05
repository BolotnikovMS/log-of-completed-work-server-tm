import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CompletedWorkValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    substationId: schema.number(),
    workProducerId: schema.number(),
    description: schema.string([rules.trim(), rules.minLength(5), rules.maxLength(1000), rules.escape()]),
    note: schema.string.optional([rules.trim(), rules.minLength(3), rules.maxLength(700), rules.escape()]),
    dateCompletion: schema.date()
  })

  public messages: CustomMessages = {
    required: 'Поле {{ field }} является обязательным.',
    minLength: 'Минимальная длина поля {{ field }} - {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ field }} - {{ options.maxLength }} символов.',
    'date.format': 'Дата и время должны иметь формат: {{ options.format }}.',
  }
}
