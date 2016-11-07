import * as types from '../constants/ActionTypes'

/**
 * @param  {Boolean} isLoading loading state
 */
export function changeLoadState(isLoading) {
  return {type: types.CHANGE_LOADSTATE, isLoading}
}

/**
 * @param  {object} status index,validateStatus,help
 */
export function validLogin(status) {
  return {type: types.VALID_LOGIN, status}
}

/**
 * @param  {object} status index,validateStatus,help
 */
export function validRegister(status) {
  return {type: types.VALID_REGISTER, status}
}
