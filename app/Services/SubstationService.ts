import { ActiveEnum } from 'App/Enums/Active'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { OrderByEnum } from 'App/Enums/Sorted'
import { RequestContract } from "@ioc:Adonis/Core/Request"
import Substation from 'App/Models/Substation'

interface IParamGetSubstationBy {
  colName: string
  id: number
  request: RequestContract
}

export default class SubstationService {
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
