import { ActiveEnum } from 'App/Enums/Active'
import CompletedWork from 'App/Models/CompletedWork'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import Substation from 'App/Models/Substation'
import SubstationValidator from 'App/Validators/SubstationValidator'

export default class SubstationsController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('SubstationPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })
      const { sort, order, page, limit, active } = request.qs() as IQueryParams
      const substations = await Substation
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(active, query => query.where('active', ActiveEnum[active]))
        .if(page && limit, query => query.paginate(page, limit))
      const total = (await Substation.query().count('* as total'))[0].$extras.total
      const serializeSubstation = substations.map(substation => substation.serialize({
        fields: {
          pick: ['id', 'active', 'name', 'rdu', 'slug']
        }
      }))

      return response.status(200).json({ meta: {total}, data: substations })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('SubstationPolicy').denies('create')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const validatedData = await request.validate(SubstationValidator)
      // console.log('validatedData: ', validatedData);
      const substation = await Substation.create({userId: auth?.user?.id, ...validatedData})

      return response.status(201).json(substation)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async getInfoSubstation({ params, response, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('SubstationPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const substation = await Substation.find(params.id)

      if (substation) {
        await substation.load('district')
        await substation.load('voltage_class')
        await substation.load('type_kp')
        await substation.load('head_controller')
        await substation.load('main_channel')
        await substation.load('backup_channel')
        await substation.load('additional_channel')
        await substation.load('gsm')

        const serializeSubstation = substation.serialize({
          fields: {
            omit: ['user_id', 'district_id', 'voltage_classes_id', 'type_kp_id', 'head_controller_id', 'main_channel_id', 'backup_channel_id', 'additional_channel_id', 'gsm_id']
          },
          relations: {
            district: {
              fields: {
                pick: ['id', 'name', 'short_name']
              }
            },
            voltage_class: {
              fields: {
                pick: ['id', 'name']
              }
            },
            type_kp: {
              fields: {
                pick: ['id', 'name']
              }
            },
            head_controller: {
              fields: {
                pick: ['id', 'name']
              }
            },
            main_channel: {
              fields: {
                pick: ['id', 'name']
              }
            },
            backup_channel: {
              fields: {
                pick: ['id', 'name']
              }
            },
            additional_channel: {
              fields: {
                pick: ['id', 'name']
              }
            },
            gsm: {
              fields: {
                pick: ['id', 'name']
              }
            },
          }
        })

        // console.log(substation.serialize())
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
      if (await bouncer.with('SubstationPolicy').denies('update')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

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
      if (await bouncer.with('SubstationPolicy').denies('delete')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

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
