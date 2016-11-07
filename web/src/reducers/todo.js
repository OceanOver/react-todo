import * as types from '../constants/ActionTypes'
import _ from 'lodash'

const initialState = []

export default function todos(state = initialState, action) {
  switch (action.type) {
    case types.GET_All:
      {
        var todos = []
        action.list.forEach(function(item, index, array) {
          var obj = {
            id: item._id,
            content: item.content,
            completed: item.completed,
            createTime: item.createTime,
            expireTime: item.expireTime,
            completeTime:item.completeTime
          }
          todos.push(obj)
        })
        return todos
      }
    case types.ADD_ITEM:
      {
        var item = action.item
        var obj = {
          id: item._id,
          content: item.content,
          completed: item.completed,
          createTime: item.createTime,
          expireTime: item.expireTime,
          completeTime:item.completeTime
        }
        return [
          obj, ...state
        ]
      }
    case types.DELETE_ITEM:
      {
        var todos = _.remove(state, function(item) {
          return item.id != action.id
        })
        return todos
      }
    case types.COMPLETE_ITEM:
      {
        state.forEach(function(item, index) {
          if (item.id == action.id) {
            item.completed = true
            item.completeTime = action.completeTime
            return
          }
        })
        return state.slice()
      }
    case types.EDIT_ITEM:
      {
        state.forEach(function(item, index) {
          if (item.id == action.id) {
            console.log(action.item);
            item.content = action.item.content
            item.expireTime = action.item.expireTime
            return
          }
        })
        return state.slice()
      }

    default:
      return state
  }
}
