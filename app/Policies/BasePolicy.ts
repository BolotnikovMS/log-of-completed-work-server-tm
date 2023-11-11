// Расширение базовой модели BasePolicy. Добавление before, after.

import { BasePolicy as BouncerBasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Logger from '@ioc:Adonis/Core/Logger'
import { RolesEnum } from 'App/Enums/Roles'
import User from 'App/Models/User'

export default class BasePolicy extends BouncerBasePolicy {
  public async before(user: User | null) {
    if (user?.roleId === RolesEnum.ADMIN) return true
  }
public async after(user: User | null, actionName, actionResult) {
  const userType = user ? 'User' : 'Guest'

  actionResult.authorized
    ? Logger.info(`${userType} was authorized to ${actionName}`)
    : Logger.info(`${userType} was denied to ${actionName} for ${actionResult.errorResponse}`)
  }
}
