import { ActiveEnum } from 'App/Enums/Active'
import District from 'App/Models/District'
import DistrictValidator from 'App/Validators/DistrictValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import Substation from 'App/Models/Substation'

export default class DistrictsController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('DistrictPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })
      const { sort, order, active } = request.qs() as IQueryParams
      const districts = await District
        .query()
        .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
        .if(active, query => query.where('active', ActiveEnum[active]))

      return response.status(200).json(districts)
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getSubstations({ params, request, response, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('DistrictPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const district = await District.find(params.id)

      if (district) {
        const { sort, order, active } = request.qs() as IQueryParams
        const substations = await Substation
          .query()
          .if(active, query => query.where('active', '=', ActiveEnum[active]))
          .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))

        return response.status(200).json(substations)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('DistrictPolicy').denies('create')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const validatedData = await request.validate(DistrictValidator)
      const district = await District.create({userId: auth?.user?.id, ...validatedData})

      return response.status(201).json(district)
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('DistrictPolicy').denies('update')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const district  = await District.find(params.id)

      if (district) {
        const validateData = await request.validate(DistrictValidator)
        console.log(validateData);
        const updDistrict = await district.merge(validateData).save()

        return response.status(200).json(updDistrict)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(400).json(error.messages.errors)
    }
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    try {
      if (await bouncer.with('DistrictPolicy').denies('delete')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const district = await District.find(params.id)

      if (district) {
        await district.delete()

        return response.status(204)
      }
      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }
}
