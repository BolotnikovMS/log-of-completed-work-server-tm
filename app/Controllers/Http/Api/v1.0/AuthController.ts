import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    console.log(request.body());
    try {
      const loginSchema = schema.create({
        username: schema.string([rules.trim()]),
        password: schema.string()
      })
      const messages: CustomMessages = {
        required: 'Поле {{ field }} является обязательным.',
      }
      const validatedData = await request.validate({ schema: loginSchema, messages })

      const user = await User.query()
        .where('username', '=', validatedData.username)
        .where('blocked', '=', false)
        .firstOrFail()

      if (!(await Hash.verify(user.password, validatedData.password))) {
        return response.unauthorized('Invalid credentials')
      }

      const token = await auth.use('api').generate(user, {
        expiresIn: '10 days'
      })

      return token
    } catch (error) {
      return response.status(403).json(error.messages)
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      // console.log( (await auth.use('api').authenticate()).serialize());
      await auth.use('api').revoke()

      return { revoke: true }
    } catch (error) {
      return response.status(401).json({message: 'Unauthorized'})
    }
  }

  public async refresh({}: HttpContextContract) {}

  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const registerSchema = schema.create({
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
      const messages: CustomMessages = {
        required: 'Поле {{ field }} является обязательным.',
        minLength: 'Минимальная длина {{ field }} - {{ options.minLength }} символа.',
        maxLength: 'Максимальная длина {{ field }} - {{ options.maxLength }} символа.',
        unique: 'Поле {{ field }} является уникальным!',
      }
      const validatedData = await request.validate({ schema: registerSchema, messages })
      await User.create(validatedData)

      return response.status(201).json({ message: 'Create!' })
    } catch (error) {
      return response.status(401).json(error.messages)
    }
  }

  public async destroy({}: HttpContextContract) {}
}
