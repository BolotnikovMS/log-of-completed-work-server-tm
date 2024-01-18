import { RequestContract } from '@ioc:Adonis/Core/Request'
import { OrderByEnum } from 'App/Enums/Sorted'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import ChannelType from 'App/Models/ChannelType'

export default class ChannelTypeService {
	public static async getChannelTypes(req: RequestContract): Promise<{meta: {total: number}, data: ChannelType[]}> {
		const { sort, order, page, limit } = req.qs() as IQueryParams
		const channelTypes = await ChannelType
			.query()
			.if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
			.if(page && limit, query => query.paginate(page, limit))
		const total: number = (await ChannelType.query().count('* as total'))[0].$extras.total

		return { meta: {total}, data: channelTypes }
	}
}
