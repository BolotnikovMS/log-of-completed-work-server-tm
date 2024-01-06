import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ActiveEnum } from 'App/Enums/Active'
import { OrderByEnum } from 'App/Enums/Sorted'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import District from 'App/Models/District'
import Substation from 'App/Models/Substation'

export default class DistrictService {
	public static async getDistricts(req: RequestContract): Promise<{meta: {total: number}, data: District[]}> {
		const { sort, order, page, limit } = req.qs() as IQueryParams
		const districts = await District
			.query()
			.if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
			.if(page && limit, query => query.paginate(page, limit))
		const total: number = (await District.query().count('* as total'))[0].$extras.total

		return { meta: {total}, data: districts }
	}
	public static async getDistrictSubstations(district: District, req: RequestContract): Promise<{meta: {total: number}, data: Substation[]}> {
		const { active, sort, order, page, limit } = req.qs() as IQueryParams
		const substations = await Substation
			.query()
			.where('district_id', '=', district.id)
			.if(active, query => query.where('active', '=', ActiveEnum[active]))
			.if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
			.if(page && limit, query => query.paginate(page, limit))
			.preload('voltage_class')
		const total: number = (await Substation.query().count('* as total'))[0].$extras.total

		return { meta: {total}, data: substations }
	}
}
