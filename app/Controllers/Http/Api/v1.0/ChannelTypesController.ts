import ChannelType from 'App/Models/ChannelType'
import ChannelTypeValidator from 'App/Validators/ChannelTypeValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChannelTypesController {
  public async index({ response }: HttpContextContract) {
    try {
      const channelTypes = await ChannelType.query()

      return response.status(200).json(channelTypes)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(ChannelTypeValidator)
      const channelType = await ChannelType.create({userId: auth?.user?.id, ...validatedData})

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
