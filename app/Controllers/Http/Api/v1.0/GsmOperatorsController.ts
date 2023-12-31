import GsmOperator from 'App/Models/GsmOperator'
import GsmOperatorValidator from 'App/Validators/GsmOperatorValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import SubstationService from 'App/Services/SubstationService'

export default class GsmOperatorsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { sort, order } = request.qs() as IQueryParams
      const gsmOperators = await GsmOperator
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
      const total = (await GsmOperator.query().count('* as total'))[0].$extras.total

      return response.status(200).header('total-count', total).json(gsmOperators)
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getSubstations({ params, request, response }: HttpContextContract) {
    try {
      const substations = await SubstationService.getSubstationByRelationId({colName: 'gsm_id', id: params.id, request})

      return response.status(200).json(substations)
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(GsmOperatorValidator)
      const gsmOperator = await GsmOperator.create({userId: auth?.user?.id || 1, ...validatedData})

      return response.status(201).json(gsmOperator)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const gsmOperator = await GsmOperator.find(params.id)

      if (gsmOperator) {
        const validatedData = await request.validate(GsmOperatorValidator)
        const updGsmOperator = await gsmOperator.merge(validatedData).save()

        return response.status(200).json(updGsmOperator)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const gsmOperator = await GsmOperator.find(params.id)

      if (gsmOperator) {
        await gsmOperator.delete()

        return response.status(204)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
