import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import District from 'App/Models/District'
import DistrictService from 'App/Services/DistrictService'
import SubstationService from 'App/Services/SubstationService'
import DistrictValidator from 'App/Validators/DistrictValidator'

export default class DistrictsController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('DistrictPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })
			const districts = await DistrictService.getDistricts(request)

			return response.status(200).header('total-count', districts.meta.total).json(districts)
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async getSubstations({ params, request, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('DistrictPolicy').denies('view')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

			const district = await District.find(params.id)

      if (district) {
				const substations = await SubstationService.getSubstations(request, district.id)

				return response.status(200).header('total-count', substations.meta.total).json(substations)
      }

      return response.status(404).json({ message: 'Не найдено!' })
    } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Произошла ошибка при выполнении запроса!' })
    }
  }

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('DistrictPolicy').denies('create')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const validatedData = await request.validate(DistrictValidator)
      const district = await District.create({userId: auth?.user?.id || 1, ...validatedData})

      return response.status(201).json(district)
    } catch (error) {
      console.log(error);

      return response.status(400).json(error.messages.errors)
    }
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    try {
      // if (await bouncer.with('DistrictPolicy').denies('update')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

      const district  = await District.find(params.id)

      if (district) {
        const validateData = await request.validate(DistrictValidator)
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
      // if (await bouncer.with('DistrictPolicy').denies('delete')) return response.status(403).json({ message: 'Недостаточно прав для выполнения операции!' })

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
