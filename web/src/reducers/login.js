import {
  CHANGE_LOADSTATE,
  VALID_LOGIN,
  VALID_REGISTER
} from '../constants/ActionTypes'

/**
 * status: 'success' 'warning' 'error' 'validating'
 *
 * @type {Object}
 */
var initialState = {
  isLoading: false,
  loginUsernameStatus: '',
  loginUsernameHelp: '',
  loginPasswordStatus: '',
  loginPasswordHelp: '',
  registerUsernameStatus: '',
  registerUsernameHelp: '',
  registerPasswordStatus: '',
  registerPasswordHelp: '',
  registerConfirmStatus: '',
  registerConfirmHelp: ''
}

export default function login(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOADSTATE:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      })
    case VALID_LOGIN:
      {
        var validateStatus = 'loginUsernameStatus'
        var help = 'loginUsernameHelp'
        switch (action.status.index) {
          case 1:
            validateStatus = 'loginPasswordStatus'
            help = 'loginPasswordHelp'
        }
        return Object.assign({}, state, {
          [validateStatus]: action.status.validateStatus,
          [help]: action.status.help
        })
      }
    case VALID_REGISTER:
      {
        var validateStatus = 'registerUsernameStatus'
        var help = 'registerUsernameHelp'
        switch (action.status.index) {
          case 1:
            validateStatus = 'registerPasswordStatus'
            help = 'registerPasswordHelp'
          case 2:
            validateStatus = 'registerConfirmStatus'
            help = 'registerConfirmHelp'
        }
        return Object.assign({}, state, {
          [validateStatus]: action.status.validateStatus,
          [help]: action.status.help
        })
      }

    default:
      return state
  }
}
