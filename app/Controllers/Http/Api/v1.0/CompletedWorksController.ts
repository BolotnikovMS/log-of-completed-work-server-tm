import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrderByEnum } from 'App/Enums/Sorted'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import CompletedWork from 'App/Models/CompletedWork'
import CompletedWorkValidator from 'App/Validators/CompletedWorkValidator'

export default class CompletedWorksController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const { sort = 'dateCompletion', order = 'desc', page, limit } = request.qs() as IQueryParams
      const works = await CompletedWork
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(page && limit, query => query.paginate(page, limit))
        .preload('work_producer')
        .preload('substation', query => query.preload('voltage_class'))
      const total = (await CompletedWork.query().count('* as total'))[0].$extras.total
      const serializeWorks = works.map(work => {
        return work.serialize({
          fields: {
            pick: ['id', 'description', 'note', 'dateCompletion', 'createdAt']
          },
          relations: {
            work_producer: {
              fields: {
                pick: ['id', 'shortUserName']
              }
            },
            substation: {
              fields: {
                pick: ['id', 'name', 'fullNameSubstation']
              },
              relations: {
                voltage_class: {
                  fields: {
                    pick: ['name']
                  }
                }
              }
            }
          }
        })
      })

      return response.status(200).header('total-count', total).json({ meta: {total}, data: serializeWorks })
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
