import { RolesEnum } from 'App/Enums/Roles'
import User from 'App/Models/User'

/**
 * Возвращает принимаемый текст после замены экранированных символов.
 * @param {string} text Текст, где есть экранированные символы.
 * @returns {string} Текст после замены.
 */
export const replacementEscapeSymbols = (text: string | null): string | null => {
  if (text === null) return null

  const replSymbol: string[] = ["'", '"', '/', '<', '>', '`']
  const escapeSymbols: string[] = ['&#x27;', '&quot;', '&#x2F;', '&lt;', '&gt;', '&#96;']

  escapeSymbols.forEach((symb: string, i: number): string | null => {
    if (text === null) return null

    return (text = text.replace(new RegExp(symb, 'g'), replSymbol[i]))
  })

  return text
}

/**
 * Возвращает true/false, в зависимости от того принадлежит пользователь роли или нет.
 * @param {User} user Объект пользователя.
 * @param {string} roleName Название роли.
 * @returns {boolean} true/false.
 */

export const checkUserRole = (user: User, roleName: string): boolean => user.roleId === +RolesEnum[roleName]
