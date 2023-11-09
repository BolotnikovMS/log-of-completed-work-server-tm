import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TypeKpValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.trim(),
      rules.escape(),
      rules.minLength(3),
      rules.maxLength(150),
    ]),
    active: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    required: 'Поле {{ field }} является обязательным.',
    minLength: 'Минимальная длина поля {{ field }} - {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ field }} - {{ options.maxLength }} символа.',
  }
}
