import React, {Component} from 'react';
import {Row, Col} from 'antd'
import './style/filterContentCell.less'
import Config from '../../config'
import {mixin} from 'core-decorators'
import mainMixin from './mainMixin'

let config = new Config()
let router = config.router

@mixin(mainMixin)
class FilterContentCell extends Component {

  deleteItem() {
    let id = this.props.item.id
    let reqBody = {
      id: id
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(router.deleteItem, {
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

  render() {
    const {item} = this.props
    return (
      <li>
        <div className="cell">
          <Row>
            <Col span={20}>
              <p>{item.content}</p>
            </Col>
            <Col span={4}>
              <a onClick={this.deleteItem.bind(this)}>删除</a>
            </Col>
          </Row>
        </div>
      </li>
    );
  }
}

export default FilterContentCell
