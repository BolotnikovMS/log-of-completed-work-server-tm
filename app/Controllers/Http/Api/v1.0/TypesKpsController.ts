import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import SubstationService from 'App/Services/SubstationService'
import TypeKpValidator from 'App/Validators/TypeKpValidator'
import TypesKp from 'App/Models/TypesKp'

export default class TypesKpsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { sort, order, page, limit } = request.qs() as IQueryParams
      const typesKp = await TypesKp
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(page && limit, query => query.paginate(page, limit))
      const total = (await TypesKp.query().count('* as total'))[0].$extras.total

      return response.status(200).json({ meta: {total}, data: typesKp })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getSubstations({ params, request, response }: HttpContextContract) {
    try {
      const substations = await SubstationService.getSubstationByRelationId({colName: 'type_kp_id', id: params.id, request})

      return response.status(200).json(substations)
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(TypeKpValidator)
      const typeKp = await TypesKp.create({userId: auth?.user?.id || 1, ...validatedData})

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
