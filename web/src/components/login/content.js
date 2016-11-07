import React, {Component} from 'react';
import {Tabs, Spin} from 'antd'
import LoginForm from './loginForm'
import RegisterForm from './registerForm'
import './style/content.less'

class Content extends Component {
  render() {
    const TabPane = Tabs.TabPane
    const {state, actions} = this.props
    return (
      <Spin spinning={state.isLoading}>
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="登 陆" key="1">
              <LoginForm state={state} actions={actions}/>
            </TabPane>
            <TabPane tab="注 册" key="2">
              <RegisterForm state={state} actions={actions}/>
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    )
  }
}

export default Content
