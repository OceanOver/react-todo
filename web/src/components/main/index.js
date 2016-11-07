import {bindActionCreators} from 'redux'
/*
 * connect 会把State和dispatch转换成props传递给子组件
 */
import {connect} from 'react-redux'
import * as TodoActions from '../../actions'
import React, {Component, PropTypes} from 'react'
import {Modal, Button, Input, DatePicker, TimePicker} from 'antd'
import Header from './header'
import Content from './content'
import FilterView from './filterView'
import FilterContentView from './filterContentView'
import Footer from '../common/footer'
import './style/main.less'
import Config from '../../config'
import {mixin} from 'core-decorators'
import mainMixin from './mainMixin'
import _ from 'lodash'
import moment from 'moment'

let config = new Config()
let router = config.router

@mixin(mainMixin)
class Main extends Component {
  constructor(props, context) {
    super(props, context)
    this.expireDateString = ''
    this.originalModalText = ''
    this.originalDateString = ''
    this.editItemId = ''
    this.username = config.userInfo.username
      ? config.userInfo.username
      : '用户名'
    this.requestUncompleteItems()
    this.state = {
      visible: false,
      modalText: '',
      fiterContentState: 0
    }
  }

  editItem(id, editedText, expireDateString) {
    editedText = _.trimEnd(editedText)
    let reqBody = {
      id: id,
      content: editedText,
      expireTime: expireDateString
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(router.editItem, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.state === 1000) {
        that.showMessage('完成编辑')
        that.props.actions.editItem(id, json.item)
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  showModal(item) {
    let text = item.content
    let expireTime = item.expireTime
    this.originalModalText = text
    this.originalDateString = expireTime
    this.editItemId = item.id
    this.setState({modalText: text})
    let date = moment.utc(item.expireTime, 'YYYYMMDDHHmmss').toDate()
    this.setState({modalExpireDate: date})
    this.setState({visible: true})
  }

  handleOk() {
    let text = this.state.modalText
    let expireTime = this.expireDateString
    let textHasChange = (text === this.originalModalText || !text || text.length == 0)
    let expireHasChange = (expireTime === this.originalDateString)
    if (textHasChange && expireHasChange) {
      this.setState({visible: false})
      return
    } else {
      this.editItem(this.editItemId, text, this.expireDateString)
      this.setState({visible: false})
    }
  }

  handleCancel(e) {
    this.setState({visible: false});
  }

  handleModalInputChange(e) {
    var text = e.target.value
    this.setState({modalText: text})
  }

  handleDateChange(date, dateString) {
    this.expireDateString = date.utc().format('YYYYMMDDHHmmss')
    let expireDate = date.toDate()
    this.setState({modalExpireDate: expireDate})
  }

  // request uncomplete todo items
  requestUncompleteItems() {
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(router.list, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: {
        type: '0'
      }
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.state === 1000) {
        var list = json.list
        that.props.actions.allTodoItems(list)
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  callBackState(state) {
    this.setState({fiterContentState: state})
  }

  render() {
    const {todos, actions} = this.props
    const inputStyle = {
      fontSize: '14px',
      letterSpacing: '1px',
      fontWeight: '200'
    }
    const format = 'YYYY/MM/DD'
    const timeFormat = 'HH:mm'

    var filterContentStyle = {
      display: 'none'
    }
    if (this.state.fiterContentState != 0) {
      filterContentStyle = {
        display: 'block'
      }
    }

    return (
      <div className="todo-main">
        <Header username={this.username} todos={todos} actions={actions}/>
        <div className="content">
          <Content todos={todos} actions={actions} showModal={this.showModal.bind(this)}/>
          <FilterView todos={todos} actions={actions} callBackState={this.callBackState.bind(this)} contentState={this.state.fiterContentState}/>
          <div style={filterContentStyle}>
            <FilterContentView todos={todos} actions={actions} contentState={this.state.fiterContentState}/>
          </div>
        </div>
        <Footer/>
        <Modal title="编辑" visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
          <Input type="textarea" value={this.state.modalText} placeholder="编辑内容" autosize={{
            minRows: 2,
            maxRows: 5
          }} style={inputStyle} onChange={this.handleModalInputChange.bind(this)}/>
          <div className="expire-picker">
            <p>&nbsp;截 止 日 期：</p>
            <DatePicker value={moment(this.state.modalExpireDate, format)} format={format} onChange={this.handleDateChange.bind(this)}/>
            <TimePicker value={moment(this.state.modalExpireDate, timeFormat)} format={timeFormat} style={{
              marginLeft: '10px'
            }} onChange={this.handleDateChange.bind(this)}/>
          </div>
        </Modal>
      </div>
    )
  }
}

Main.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

/*
 * 返回需要传递给子组件的State
 * 然后connect会拿到返回的数据写入到react组件中，
 * 然后组件中就可以通过props读取数据
 * 当它被connect调用的时候会为它传递一个参数State。
 */
function mapStateToProps(state) {
  return {todos: state.todos}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

/*
 * 连接 React 组件与 Redux store
 * connect 会把State和dispatch转换成props传递给组件。
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main)
