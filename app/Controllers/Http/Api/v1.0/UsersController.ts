import { ActiveEnum } from 'App/Enums/Active'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { active, sort, order, offset = 0, limit = 15 } = request.qs() as IQueryParams
      const users = await User
        .query()
        .offset(offset)
        .limit(limit)
        .if(active, query => query.where('active', '=', ActiveEnum[active]))
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .preload('role')
      const serializeUsers = users.map(user => {
        return user.serialize({
          fields: {
            omit: ['roleId']
          },
          relations: {
            role: {
              fields: {
                pick: ['name']
              }
            }
          }
        })
      })

      return response.status(200).json(serializeUsers)
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (user) {
        await user.load('role')
        const serializeUser = user.serialize({
          fields: {
            omit: ['roleId']
          },
          relations: {
            role: {
              fields: {
                pick: ['name']
              }
            }
          }
        })

        return response.status(200).json(serializeUser)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error)

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
