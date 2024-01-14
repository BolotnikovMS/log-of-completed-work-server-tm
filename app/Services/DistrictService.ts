import District from 'App/Models/District'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import { RequestContract } from '@ioc:Adonis/Core/Request'

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
}
