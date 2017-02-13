import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import router from './router'
/*
 * Browser history 是由 React Router 创建浏览器应用推荐的 history
 */
import {browserHistory} from 'react-router'
/*
 * 利用syncHistoryWithStore我们可以结合store同步导航事件
 */
import {syncHistoryWithStore} from 'react-router-redux'
import './index.less'

const store = configureStore()
//创建一个增强版的history来结合store同步导航事件
const history = syncHistoryWithStore(browserHistory, store)

/*
 * Provider这个模块是作为整个App的容器
 */
render(
  <Provider store={store}>
  {router(history)}
</Provider>, document.getElementById('root'))
