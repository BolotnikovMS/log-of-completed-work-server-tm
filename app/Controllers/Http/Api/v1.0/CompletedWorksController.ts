import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompletedWork from 'App/Models/CompletedWork'
import CompletedWorkService from 'App/Services/CompletedWorkService'
import CompletedWorkValidator from 'App/Validators/CompletedWorkValidator'

export default class CompletedWorksController {
  public async index({ request, response }: HttpContextContract) {
    try {
			const works = await CompletedWorkService.getCompletedWorks(request)

			return response.status(200).header('total-count', works.meta.total).json(works)
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(CompletedWorkValidator)
      const work = await CompletedWork.create({userId: auth?.user?.id || 1, ...validatedData})

      return response.status(201).json(work)
    } catch (error) {
      console.log('error: ', error);
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const work = await CompletedWork.find(params.id)

      if (work) {
        const validatedData = await request.validate(CompletedWorkValidator)
        const updWork = await work.merge(validatedData).save()

        return response.status(200).json(updWork)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const work = await CompletedWork.find(params.id)

      if (work) {
        await work.delete()

        return response.status(204)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
