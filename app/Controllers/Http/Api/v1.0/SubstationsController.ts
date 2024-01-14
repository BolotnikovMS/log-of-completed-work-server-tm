import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import CompletedWork from 'App/Models/CompletedWork'
import Substation from 'App/Models/Substation'
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
      if (await bouncer.with('SubstationPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const { offset = 0, limit = 10 } = request.qs() as IQueryParams
      const works = await CompletedWork
        .query()
        .where('substation_id', '=', params.id)
        .offset(offset)
        .limit(limit)
        .preload('work_producer')
      const serializeWorks = works.map(work => {
        return work.serialize({
          fields: {
            pick: ['id', 'description', 'note', 'date_completion']
          },
          relations: {
            work_producer: {
              fields: {
                pick: ['id', 'shortUserName']
              }
            }
          }
        })
      })

      return response.status(200).json(serializeWorks)
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
