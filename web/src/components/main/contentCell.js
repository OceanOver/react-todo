import React, {Component, PropTypes} from 'react'
import {Menu, Dropdown, Icon, Spin} from 'antd'
import './style/contentCell.less'
import Config from '../../config'
import {mixin} from 'core-decorators'
import mainMixin from './mainMixin'

let config = new Config()
let api = config.api

@mixin(mainMixin)
class ContentCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      loading: false
    }
  }

  removeItem(id) {
    let reqBody = {
      id: id
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(api.deleteItem, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.state === 1000) {
        that.props.actions.deleteItem(id)
        that.showMessage('删除成功')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  completeItem(id) {
    let reqBody = {
      id: id
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    this.setState({loading: true})
    fetch(api.completeItem, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      that.setState({loading: false})
      if (json.state === 1000) {
        that.showMessage('已完成')
        that.props.actions.completeItem(id, json.completeTime)
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      that.setState({loading: false})
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  clickMenu({key}) {
    let todo = this.props.todo
    if (key == 1) {
      this.removeItem(todo.id)
    } else {
      this.props.showModal(todo)
    }
  }

  clickComplete() {
    let id = this.props.todo.id
    this.completeItem(id)
  }

  render() {
    const menu = (
      <Menu onClick={this.clickMenu.bind(this)}>
        <Menu.Item key="1">
          删除
        </Menu.Item>
        <Menu.Item key="2">
          编辑
        </Menu.Item>
      </Menu>
    )
    const {todo} = this.props
    return (
      <Spin spinning={this.state.loading}>
        <li className="contentCell">
          <div className="cell-content">
            <div className="content-left">
              <img className="cell-complete" src={require('./resource/complete.svg')} onClick={this.clickComplete.bind(this)}></img>
              <p className="cell-info">
                {todo.content}
              </p>
            </div>
            <div className="cell-edit">
              <Dropdown overlay={menu}>
                <Icon type="ellipsis"/>
              </Dropdown>
            </div>
          </div>
          <div className="cell-line"></div>
        </li>
      </Spin>
    );
  }
}

ContentCell.propTypes = {
  todo: PropTypes.object.isRequired
}

export default ContentCell
