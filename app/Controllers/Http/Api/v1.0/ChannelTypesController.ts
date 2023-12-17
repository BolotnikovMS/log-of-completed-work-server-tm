import ChannelType from 'App/Models/ChannelType'
import ChannelTypeValidator from 'App/Validators/ChannelTypeValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'

export default class ChannelTypesController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { sort, order, page, limit } = request.qs() as IQueryParams
      const channelTypes = await ChannelType
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(page && limit, query => query.paginate(page, limit))
      const total = (await ChannelType.query().count('* as total'))[0].$extras.total

      return response.status(200).header('total-count', total).json({ meta: {total}, data: channelTypes})
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(ChannelTypeValidator)
      const channelType = await ChannelType.create({userId: auth?.user?.id || 1, ...validatedData})

      return response.status(201).json(channelType)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const channelType = await ChannelType.find(params.id)

      if (channelType) {
        const validateData = await request.validate(ChannelTypeValidator)
        const updChannelType = await channelType.merge(validateData).save()

        return response.status(200).json(updChannelType)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const channelType = await ChannelType.find(params.id)

      if (channelType) {
        await channelType.delete()

        return response.status(204)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
