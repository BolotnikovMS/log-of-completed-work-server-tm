import { DateTime } from 'luxon';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Substation from 'App/Models/Substation'
import SubstationValidator from 'App/Validators/SubstationValidator'

export default class SubstationsController {
  public async index({ response }: HttpContextContract) {
    try {
      const substations = await Substation.query()
      const serializeSubstation = substations.map(substation => substation.serialize({
        fields: {
          pick: ['id', 'active', 'name', 'rdu', 'slug']
        }
      }))

      return response.status(200).json(serializeSubstation)
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(SubstationValidator)
      // console.log('validatedData: ', validatedData);
      const substation = await Substation.create({userId: auth?.user?.id, ...validatedData})

      return response.status(201).json(substation)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async getInfoSubstation({ params, request, response }: HttpContextContract) {
    try {
      const substation = await Substation.find(params.id)

      if (substation) {
        const { offset = 0, limit = 10 } = request.qs() as IQueryParams

        await substation.load('works', queryWork => {
          queryWork
            .if(offset && limit, query => query.offset(offset)).limit(limit)
            // .if(start_date && end_date && +new Date(start_date) < +new Date(end_date), query => {
            //   console.log(true);
            //   query.whereBetween('date_completion', [new DateTime(start_date).toSQL(), new DateTime(end_date).toSQL()])
            // })
        })
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
            works: {
              fields: {
                pick: ['id', 'description', 'note', 'date_completion']
              }
            },
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

  public async update({ params, request, response }: HttpContextContract) {
    try {
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

  public async destroy({ params, response }: HttpContextContract) {
    try {
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
