import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VoltageClass from 'App/Models/VoltageClass'
import VoltageClassValidator from 'App/Validators/VoltageClassValidator'

export default class VoltageClassesController {
  public async index({ response }: HttpContextContract) {
    try {
      const voltageClasses = await VoltageClass.query()

      return response.status(200).json(voltageClasses)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const  validatedData = await request.validate(VoltageClassValidator)
      const voltageClass = await VoltageClass.create({userId: auth?.user?.id, ...validatedData})

      return response.status(201).json(voltageClass)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const voltageClass = await VoltageClass.find(params.id)

      if (voltageClass) {
        const validatedData = await request.validate(VoltageClassValidator)
        const updVoltageClass = await voltageClass.merge(validatedData).save()

        return response.status(200).json(updVoltageClass)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const voltageClass = await VoltageClass.find(params.id)

      if (voltageClass) {
        await voltageClass.delete()

        return response.status(204)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
