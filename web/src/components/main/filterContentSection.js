import React, {Component, PropTypes} from 'react'
import {Row, Col} from 'antd'
import FilterContentCell from './filterContentCell'
import './style/filterContentSection.less'
import moment from 'moment'
import _ from 'lodash'

class FilterContentSection extends Component {

  render() {
    const {todos,actions,section,contentState} = this.props
    var time
    let headItem = _.head(section)
    if (contentState == 1) {
        time = headItem.expireTime
    } else {
        time = headItem.completeTime
    }
    let completedDate = moment.utc(time, 'YYYYMMDDHHmmss').local()
    let date = completedDate.format('MM月DD日')
    let day = completedDate.format('dddd')
    return (
      <li>
        <Row className="section">
          <Col span={4}>
            <div className="section-title">
              <span className="title-date">{date}</span><br/>{day}
            </div>
          </Col>
          <Col span={20}>
            <ul className="section-list">
              {_.map(section, function(item) {
                return <FilterContentCell todos={todos} actions={actions} item={item} key={item.id}/>
              })}
            </ul>
          </Col>
        </Row>
      </li>
    )
  }
}

FilterContentSection.propTypes = {
  section: PropTypes.array.isRequired
}

export default FilterContentSection
