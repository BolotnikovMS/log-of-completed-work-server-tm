import { ActiveEnum } from 'App/Enums/Active'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import VoltageClass from 'App/Models/VoltageClass'
import VoltageClassValidator from 'App/Validators/VoltageClassValidator'

export default class VoltageClassesController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { active, limit, page, order, sort } = request.qs() as IQueryParams
      const voltageClasses = await VoltageClass
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(active, query => query.where('active', ActiveEnum[active]))
        .if(page && limit, query => query.paginate(page, limit))
      const total = (await VoltageClass.query().count('* as total'))[0].$extras.total

      return response.status(200).json({ meta: {total}, data: voltageClasses })
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
