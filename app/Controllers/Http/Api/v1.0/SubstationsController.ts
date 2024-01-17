import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Substation from 'App/Models/Substation'
import CompletedWorkService from 'App/Services/CompletedWorkService'
import SubstationService from 'App/Services/SubstationService'
import SubstationValidator from 'App/Validators/SubstationValidator'

export default class SubstationsController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('SubstationPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })
			const substations = await SubstationService.getSubstations(request)

      return response.status(200).header('total-count', substations.meta.total).json(substations)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('SubstationPolicy').denies('create')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const validatedData = await request.validate(SubstationValidator)
      // console.log('validatedData: ', validatedData);
      const substation = await Substation.create({userId: auth?.user?.id || 1, ...validatedData})

      return response.status(201).json(substation)
    } catch (error) {
      console.log('error: ', error);
      return response.status(400).json(error.messages.errors)
    }
  }

  public async getSubstation({ params, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('SubstationPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })
			// !! Попробовать сделать запрос в сервисе
      const substation = await Substation.find(params.id)

      if (substation) {
				const serializeSubstation = await SubstationService.getSubstation(substation.id)

        return response.status(200).json(serializeSubstation)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log('error: ', error);
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getSubstationWorks({ params, request, response, bouncer }: HttpContextContract) {
    try {
			const works = await CompletedWorkService.getCompletedWorks(request, params.id)

			return response.status(200).header('total-count', works.meta.total).json(works)
    } catch (error) {
      console.log('error: ', error);
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('SubstationPolicy').denies('update')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const substation = await Substation.find(params.id)

      if (substation) {
        // console.log(substation.serialize());
        const validateData = await request.validate(SubstationValidator)
        // console.log('validateData: ', validateData);
        const updSubstation = await substation.merge(validateData).save()

        return response.status(200).json(updSubstation)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('SubstationPolicy').denies('delete')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const substation = await Substation.find(params.id)

      if (substation) {
        await substation.delete()

        return response.status(204)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
