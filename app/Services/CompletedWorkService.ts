import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { OrderByEnum } from 'App/Enums/Sorted'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import CompletedWork from 'App/Models/CompletedWork'

export default class CompletedWorkService {
	public static async getCompletedWorks(req: RequestContract, substationId?: number | undefined ): Promise<{meta: {total: number}, data: ModelObject[]}> {
		console.log(substationId)
		const { sort = 'createdAt', order = 'desc', page, limit } = req.qs() as IQueryParams
		const works = await CompletedWork
			.query()
			.if(substationId, query => query.where('substationId', '=', substationId!))
			.if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
			.if(page && limit, query => query.paginate(page, limit))
			.preload('work_producer')
			.preload('substation', query => query.preload('voltage_class'))
		const total: number = (await CompletedWork
			.query()
			.if(substationId, query => query.where('substationId', '=', substationId!))
			.count('* as total'))[0].$extras.total
		const serializeWorks = works.map(work => {
			return work.serialize({
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

		return { meta: {total}, data: serializeWorks }
	}
}
