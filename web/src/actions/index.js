import * as types from '../constants/ActionTypes'

/*
 * redux约定 Action 内使用一个字符串类型的 type 字段来表示将要执行的动作。
 * 除了 type 之外，Action可以存放一些其他的想要操作的数据
 */

/**
 * add plan
 * @param {[object]} content [content of plan]
 */
export function addItem(item) {
  return {type: types.ADD_ITEM, item}
}

export function allTodoItems(list) {
  return {type: types.GET_All, list}
}

export function deleteItem(id) {
  return {type: types.DELETE_ITEM, id}
}

export function completeItem(id, completeTime) {
  return {type: types.COMPLETE_ITEM, id, completeTime}
}

export function editItem(id, item) {
  return {type: types.EDIT_ITEM, id, item}
}
