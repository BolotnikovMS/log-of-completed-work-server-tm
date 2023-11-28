import { ActiveEnum } from 'App/Enums/Active'
import HeadController from 'App/Models/HeadController'
import HeadControllerValidator from 'App/Validators/HeadControllerValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import SubstationService from 'App/Services/SubstationService'

export default class HeadsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { sort, order, page, limit } = request.qs() as IQueryParams
      const headsController = await HeadController
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(page && limit, query => query.paginate(page, limit))
      const total = (await HeadController.query().count('* as total'))[0].$extras.total

      return response.status(200).json({ meta: {total}, data: headsController })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getSubstations({ params, request, response }: HttpContextContract) {
    try {
      const substations = await SubstationService.getSubstationByRelationId({colName: 'head_controller_id', id: params.id, request})

      return response.status(200).json(substations)
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(HeadControllerValidator)
      const headController = await HeadController.create({userId: auth?.user?.id || 1, ...validatedData})

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
