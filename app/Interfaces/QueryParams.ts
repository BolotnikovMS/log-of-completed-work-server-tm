import { OrderByEnum } from 'App/Enums/Sorted'

export interface IQueryParams {
  page: number
  size: number
  sort: string
  order: OrderByEnum
  search: string
  active: string
  offset: number
  limit: number
	substation: number
}
