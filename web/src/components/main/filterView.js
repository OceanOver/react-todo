import React, {Component} from 'react'
import {Row, Col} from 'antd'
import {PieChart} from 'react-d3'
import classNames from 'classnames'
import './style/filterView.less'
import _ from 'lodash'
import moment from 'moment'

class FilterView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExpired: false,
      showComplete: false
    }
  }

  clickExpire() {
    this.setState({showComplete: false})
    if (this.state.showExpired) {
      this.setState({showExpired: false})
      this.props.callBackState(0)
    } else {
      this.setState({showExpired: true})
      this.props.callBackState(1)
    }
  }

  clickComplete() {
    this.setState({showExpired: false})
    if (this.state.showComplete) {
      this.setState({showComplete: false})
      this.props.callBackState(0)
    } else {
      this.setState({showComplete: true})
      this.props.callBackState(2)
    }
  }

  render() {
    const {todos, actions} = this.props
    let total = todos.length
    const current = moment().utc().format('YYYYMMDDHHmmss')
    let completed = _.filter(todos, {completed: true}).length
    let expired = _.filter(todos, function(item) {
      return (item.completed === false && item.expireTime < current)
    }).length
    let uncomplete = total - completed - expired
    let pieObj0 = {
      label: '未完成',
      value: uncomplete
    }
    let pieObj1 = {
      label: '已完成',
      value: completed
    }
    let pieObj2 = {
      label: '已过期',
      value: expired
    }
    var pieData = [pieObj0]
    if (completed > 0) {
      pieData.push(pieObj1)
    }
    if (expired > 0) {
      pieData.push(pieObj2)
    }

    var valueTextFormatter = function(val) {
      return val
    }

    var expireClassName = classNames('filter-item')
    if (this.state.showExpired) {
      expireClassName = classNames('filter-item', 'select')
    }
    var completeClassName = classNames('filter-item', 'none-split')
    if (this.state.showComplete) {
      completeClassName = classNames('filter-item', 'none-split', 'select')
    }

    return (
      <div className="filterView">
        <Row className="filter-option">
          <Col span={8}>
            <Col span={14}>
              <div className={classNames('filter-item', 'none-split')}>
                <span className="filter-title">统计</span>
                <span className="filter-subtitle">已完成/全部任务</span>
                <span className="filter-number">{(completed + '/' + total)}</span>
              </div>
            </Col>
            <Col span={10}>
              <div className='filter-chart'>
                <PieChart data={pieData} width={80} height={80} radius={40} innerRadius={0} sectorBorderColor="white" valueTextFormatter={valueTextFormatter} showOuterLabels={false} hoverAnimation={false}/>
              </div>
            </Col>
          </Col>
          <Col span={8}>
            <div className={expireClassName} onClick={this.clickExpire.bind(this)}>
              <span className="filter-title">过期历史</span>
              <span className="filter-subtitle">累计过期的任务</span>
              <span className="filter-number">{expired}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className={completeClassName} onClick={this.clickComplete.bind(this)}>
              <span className="filter-title">完成历史</span>
              <span className="filter-subtitle">累计完成的任务</span>
              <span className="filter-number">{completed}</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default FilterView
