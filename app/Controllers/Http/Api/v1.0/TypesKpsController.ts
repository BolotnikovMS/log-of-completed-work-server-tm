import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypeKpValidator from 'App/Validators/TypeKpValidator'
import TypesKp from 'App/Models/TypesKp'

export default class TypesKpsController {
  public async index({ response }: HttpContextContract) {
    try {
      const typesKp = await TypesKp.query()

      return response.status(200).json(typesKp)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(TypeKpValidator)
      const typeKp = await TypesKp.create({userId: auth?.user?.id, ...validatedData})

      return response.status(201).json(typeKp)
    } catch (error) {
      console.log('error: ', error);
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const typeKp = await TypesKp.find(params.id)

      if (typeKp) {
        const validatedData = await request.validate(TypeKpValidator)
        const updTypeKp = await typeKp.merge(validatedData).save()

        return response.status(200).json(updTypeKp)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const typeKp = await TypesKp.find(params.id)

      if (typeKp) {
        await typeKp.delete()

        return response.status(204)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
