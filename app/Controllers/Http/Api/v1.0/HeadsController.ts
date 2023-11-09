import HeadController from 'App/Models/HeadController'
import HeadControllerValidator from 'App/Validators/HeadControllerValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HeadsController {
  public async index({ response }: HttpContextContract) {
    try {
      const headsController = await HeadController.query()

      return response.status(200).json(headsController)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(HeadControllerValidator)
      const headController = await HeadController.create({userId: auth?.user?.id, ...validatedData})

      return response.status(201).json(headController)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const headController = await HeadController.find(params.id)

      if (headController) {
        const validateData = await request.validate(HeadControllerValidator)
        const updHeadController = await headController.merge(validateData).save()

        return response.status(200).json(updHeadController)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log('error: ', error);
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const headController = await HeadController.find(params.id)

      if (headController) {
        await headController.delete()

        return response.status(204)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
