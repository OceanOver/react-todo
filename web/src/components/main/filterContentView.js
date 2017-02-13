import React, {Component} from 'react'
import {
  DatePicker,
  Icon,
  Tooltip,
  Row,
  Col,
  Pagination
} from 'antd'
import './style/filterContentView.less'
import FilterContentSection from './FilterContentSection'
import moment from 'moment'
import _ from 'lodash'
import Config from '../../config'
import {mixin} from 'core-decorators'
import mainMixin from './mainMixin'

let config = new Config()
let api = config.api

@mixin(mainMixin)
class FilterContentView extends Component {
  constructor(props) {
    super(props)
    this.numPerPage = 10
    this.needReload = false
    this.state = {
      currentPage: 1,
      rangeDate:[]
    }
  }

  handlePageChange(page) {
    this.setState({currentPage: page})
  }

  /**
   * type: expire , complete
   */
  handleListData(page, list, type) {
    var keys = []
    var dataSource = []
    let numPerPage = this.numPerPage
    var pageList = _.slice(list, (page - 1) * numPerPage, numPerPage * page)
    _.forEach(pageList, function(item) {
      var time = ''
      if (type == 1) {
        time = item.expireTime
      } else if (type == 2) {
        time = item.completeTime
      } else {
        return dataSource
      }

      var localDate = moment.utc(time, 'YYYYMMDDHHmmss').local().format('YYYYMMDDHHmmss')
      localDate = localDate.substring(0, 8);
      if (!(_.includes(keys, localDate))) {
        keys.push(localDate)
      }
    })
    _.forEach(keys, function(key) {
      var subArray = []
      _.forEach(pageList, function(item) {
        var time = ''
        if (type == 1) {
          time = item.expireTime
        } else if (type == 2) {
          time = item.completeTime
        } else {
          return dataSource
        }

        var localDate = moment.utc(time, 'YYYYMMDDHHmmss').local().format('YYYYMMDDHHmmss')
        localDate = localDate.substring(0, 8);
        if (localDate === key) {
          subArray.push(item)
        }
      })
      dataSource.push({list: subArray, key: key})
    })
    return dataSource
  }

  clickDelete() {
    var api = api.deleteComplete
    if (this.props.contentState == 1) {
      api = api.deleteExpire
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(api, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.state === 1000) {
        that.props.actions.allTodoItems(json.list)
        that.showMessage('删除成功')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  handleDateChange(date, dateString) {
    const {todos} = this.props
    let fromDate = date[0].utc().format('YYYYMMDDHHmmss')
    let endDate = date[1].utc().format('YYYYMMDDHHmmss')
    if (this.props.contentState == 1) {
      this.filterData = _.filter(todos, function(item) {
        let time = item.expireTime
        return (time >= fromDate && time <= endDate)
      })
    } else if (this.props.contentState == 2) {
      this.filterData = _.filter(todos, function(item) {
        let time = item.completeTime
        return (time >= fromDate && time <= endDate)
      })
    }
    this.setState({rangeDate:[date[0],date[1]]})
  }

  onOpenChange(status) {
      if (!status) {
            _.delay(this.upload.bind(this), 1000)
      }
  }

  upload() {
      this.needReload = true
      this.forceUpdate(function() {
          this.needReload = false
      })
  }

  resetDate() {
      this.needReload = false
      this.setState({rangeDate:[]})
      this.forceUpdate()
  }

  render() {
    const {todos, actions} = this.props
    const RangePicker = DatePicker.RangePicker

    var dataSource = [];
    var list = todos;
    if (this.needReload) {
      list = this.filterData
    }

    var numPerPage = this.numPerPage
    const current = moment.utc().format('YYYYMMDDHHmmss')

    var total = 0;
    if (this.props.contentState == 1) {
      const expiredItems = list.filter((item) => (item.completed === false && item.expireTime < current))
      dataSource = this.handleListData(this.state.currentPage, expiredItems, 1)
      total = expiredItems.length;
    } else if (this.props.contentState == 2) {
      const completedItems = list.filter((item) => (item.completed === true))
      dataSource = this.handleListData(this.state.currentPage, completedItems, 2)
      var total = completedItems.length;
    }

    if (total % numPerPage == 0) {
      total /= numPerPage
    } else {
      total = _.floor(total / numPerPage) + 1
    }
    total *= 10

    var emptyState = 'block'
    var listState = 'none'
    if (total > 0) {
      emptyState = 'none'
      listState = 'block'
    }

    let contentState = this.props.contentState
    return (
      <div className="filter-content">
        <Row>
          <Col span={6}>
            <Tooltip title="删除全部" onClick={this.clickDelete.bind(this)}>
              <Icon className="delete" type="delete"/>
            </Tooltip>
          </Col>
          <Col span={18}>
            <div className="date-picker">
                <Tooltip title="重置日期">
                  <Icon className="reload" type="reload" onClick={this.resetDate.bind(this)}/>
                </Tooltip>
              <RangePicker value={this.state.rangeDate} size="large" format="MM月DD日" style={{
                width: '200px',
                float: 'right'
            }} onChange={this.handleDateChange.bind(this)} onOpenChange={this.onOpenChange.bind(this)}/>
            </div>
          </Col>
        </Row>
        <div style={{
          display: listState
        }}>
          <ul>
            {_.map(dataSource, function(section) {
              var list = section.list
              if (contentState == 1) {
                list = _.orderBy(list, ['expireTime'], ['desc'])
              } else if (contentState == 2) {
                list = _.orderBy(list, ['completeTime'], ['desc'])
              }
              return <FilterContentSection todos={todos} actions={actions} section={list} contentState={contentState} key={section.key}/>
            })}
          </ul>
          <Pagination defaultCurrent={1} current={this.state.currentPage} total={total} onChange={this.handlePageChange.bind(this)}/>
        </div>
        <div className="content-none" style={{
          display: emptyState
        }}>
          <img className="content-none-icon" src={require('./resource/contentNone.svg')}></img>
          <p>暂无记录</p>
        </div>
      </div>
    )
  }
}

export default FilterContentView
