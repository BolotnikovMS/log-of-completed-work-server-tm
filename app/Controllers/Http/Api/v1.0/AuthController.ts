import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    console.log(request.body());
    try {
      const validatedData = await request.validate(LoginValidator)
      const user = await User.query()
        .where('username', '=', validatedData.username)
        .where('active', '=', true)
        .firstOrFail()

      if (!(await Hash.verify(user.password, validatedData.password))) {
        return response.unauthorized('Invalid credentials')
      }

      const token = await auth.use('api').generate(user, {
        expiresIn: '10 days'
      })

      return token
    } catch (error) {
      console.log(error);

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

  public async destroy({}: HttpContextContract) {}
}
