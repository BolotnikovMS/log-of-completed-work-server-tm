import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      return response.status(200).json({ message: 'Test!' })
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
