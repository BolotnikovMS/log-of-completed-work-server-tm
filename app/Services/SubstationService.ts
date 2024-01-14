import { RequestContract } from "@ioc:Adonis/Core/Request"
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { ActiveEnum } from 'App/Enums/Active'
import { OrderByEnum } from 'App/Enums/Sorted'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Substation from 'App/Models/Substation'

interface IParamGetSubstationBy {
  colName: string
  id: number
  request: RequestContract
}

export default class SubstationService {
	public static async getSubstations(req: RequestContract, districtId?: number): Promise<{meta: {total: number}, data: Substation[]}> {
		const { active, sort, order, page, limit } = req.qs() as IQueryParams
		const substations = await Substation
			.query()
			.if(districtId, query => query.where('district_id', '=', districtId!))
			.if(active, query => query.where('active', '=', ActiveEnum[active]))
			.if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
			.if(page && limit, query => query.paginate(page, limit))
			.preload('voltage_class')
		const total: number = (await Substation
			.query()
			.if(districtId, query => query.where('district_id', '=', districtId!))
			.count('* as total'))[0].$extras.total

		return { meta: {total}, data: substations }
	}

	public static async getSubstation(substationId: number): Promise<ModelObject> {
		const substation = await Substation.findOrFail(substationId)

		await substation.load('voltage_class')
		await substation.load('district')
		await substation.load('type_kp')
		await substation.load('head_controller')
		await substation.load('main_channel')
		await substation.load('backup_channel')
		await substation.load('additional_channel')
		await substation.load('gsm')
		await substation.load('works')

		const serializedSubstation = substation.serialize({
			fields: {
				omit: ['districtId', 'voltageClassesId', 'typeKpId', 'headControllerId', 'mainChannelId', 'backupChannelId', 'additionalChannelId', 'gsmId']
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
				}
			}
		})

		return serializedSubstation
	}

  public static async getSubstationByRelationId({colName, id, request}: IParamGetSubstationBy) {
    if (!id) throw new Error('Не передан id!')
    if (!colName) throw new Error('Не передано название столбца для выборки!')

    const { sort, order, active, offset, page, limit } = request.qs() as IQueryParams
    const substations = await Substation
      .query()
      .where(colName, '=', id)
      .if(sort && order, query => query.orderBy(sort, OrderByEnum[order]))
      .if(active, query => query.where('active', '=', ActiveEnum[active]))
      .preload('voltage_class')
    const serializeSubstations = substations.map(substation => {
      return substation.serialize({
        fields: {
          pick: ['id', 'name', 'gsmId', 'rdu', 'active', 'fullNameSubstation']
        },
        relations: {
          voltage_class: {
            fields: {
              pick: ['name']
            }
          }
        }
      })
    })

    return serializeSubstations
  }
}
