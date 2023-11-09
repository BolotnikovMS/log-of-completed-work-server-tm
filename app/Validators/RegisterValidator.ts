import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([rules.trim(), rules.unique({ table: 'users', column: 'username', caseInsensitive: true}), rules.minLength(2), rules.maxLength(20), rules.escape()]),
    surname: schema.string([rules.trim(), rules.minLength(2), rules.maxLength(20), rules.escape()]),
    name: schema.string([rules.trim(), rules.minLength(2), rules.maxLength(20), rules.escape()]),
    patronymic: schema.string([
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(20),
      rules.escape(),
    ]),
    position: schema.string([
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(40),
      rules.escape(),
    ]),
    email: schema.string([
      rules.trim(),
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      rules.escape(),
    ]),
    password: schema.string({}, [rules.minLength(6)]),
  })

  public messages: CustomMessages = {
    required: 'Поле {{ field }} является обязательным.',
    minLength: 'Минимальная длина {{ field }} - {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина {{ field }} - {{ options.maxLength }} символа.',
    unique: 'Поле {{ field }} является уникальным!',
  }
}
