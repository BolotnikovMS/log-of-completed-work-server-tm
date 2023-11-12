import BasePolicy from 'App/Policies/BasePolicy'
import { RolesEnum } from 'App/Enums/Roles'
import User from 'App/Models/User'
import { checkUserRole } from 'App/Utils/utils'

export default class VoltageClassPolicy extends BasePolicy {
  public async view(user: User) {
    return [RolesEnum.USER, RolesEnum.MODERATOR].includes(user.roleId)
  }
  public async create(user: User) {
    return checkUserRole(user, 'MODERATOR')
  }
  public async update(user: User) {
    return checkUserRole(user, 'MODERATOR')
  }
  public async delete(user: User) {
    return checkUserRole(user, 'MODERATOR')
  }
}
