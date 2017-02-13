import React, {Component, PropTypes} from 'react'
import {Input} from 'antd'
import 'whatwg-fetch'
import ContentCell from './contentCell'
import './style/content.less'
import Config from '../../config'
import {mixin} from 'core-decorators'
import mainMixin from './mainMixin'
import moment from 'moment'

let config = new Config()
let api = config.api

@mixin(mainMixin)
class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  onSave(e) {
    let text = e.target.value.trim()
    if (text.length === 0) {
      return
    }
    let reqBody = {
      content: text
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(api.addItem, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.state === 1000) {
        that.setState({text: ''})
        that.props.actions.addItem(json.item)
        that.showMessage('添加成功')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  handleBlur(e) {
    this.setState({text: ''})
  }

  handleChange(e) {
    this.setState({text: e.target.value})
  }

  render() {
    var emptyState = 'block'
    var listState = 'none'
    const {todos, actions} = this.props
    const current = moment().utc().format('YYYYMMDDHHmmss')
    const uncompletedItems = todos.filter((item) => (item.completed === false && item.expireTime >= current))
    if (uncompletedItems.length > 0) {
      emptyState = 'none'
      listState = 'block'
    }
    return (
      <div className="todo-content">
        <Input size="large" placeholder="添加新任务" value={this.state.text} onPressEnter={this.onSave.bind(this)} onChange={this.handleChange.bind(this)} style={{
          height: "40px",
          fontSize: "14px"
        }}/>
        <div className="content-line"/>
        <div style={{
          display: listState
        }}>
          <ul>
            {uncompletedItems.map(todo => {
              return <ContentCell key={todo.id} todo={todo} todos={todos} actions={actions} showModal={this.props.showModal}></ContentCell>
            })}
          </ul>
        </div>
        <div className="content-none" ref="content-none" style={{
          display: emptyState
        }}>
          <img className="content-none-icon" src={require('./resource/contentNone.svg')}></img>
          <p>暂无未完成记录</p>
        </div>
      </div>
    );
  }
}

Content.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

export default Content
