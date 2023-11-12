import BasePolicy from 'App/Policies/BasePolicy'
import CompletedWork from 'App/Models/CompletedWork'
import { RolesEnum } from 'App/Enums/Roles'
import User from 'App/Models/User'
import { checkUserRole } from 'App/Utils/utils'

export default class CompletedWorkPolicy extends BasePolicy {
	// public async viewList(user: User) {}
	public async view(user: User) {
    return [RolesEnum.USER, RolesEnum.MODERATOR].includes(user.roleId)
  }
	public async create(user: User) {
    return [RolesEnum.USER, RolesEnum.MODERATOR].includes(user.roleId)
  }
	public async update(user: User, completedWork: CompletedWork) {
    if (user.id === completedWork.userId) return true

    return checkUserRole(user, 'MODERATOR')
  }
	public async delete(user: User, completedWork: CompletedWork) {
    if (user.id === completedWork.userId) return true

    return checkUserRole(user, 'MODERATOR')
  }
}
