import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([rules.trim()]),
    password: schema.string()
  })

  public messages: CustomMessages = {
    required: 'Поле {{ field }} является обязательным.',
  }
}
