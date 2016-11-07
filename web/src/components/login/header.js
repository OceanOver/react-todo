import React, {Component, PropTypes} from 'react';
import {Menu, Row, Col, Icon, Dropdown} from 'antd'
import './style/header.less'

class Header extends Component {

  render() {
    return (
      <header className="login-header">
        <img className="header-icon" src={require('./resource/logo.svg')}></img>
        <p className="header-title">
          日常待办
        </p >
      </header>
    )
  }
}

export default Header
