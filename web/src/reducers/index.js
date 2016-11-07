import {combineReducers} from 'redux'
import todos from './todo'
import login from './login'
import {routerReducer} from 'react-router-redux'

/*
 * Redux提供了一个方法 combineReducers 专门来管理这些小Reducer
 */
const rootReducer = combineReducers({login, todos, routing: routerReducer})

export default rootReducer
