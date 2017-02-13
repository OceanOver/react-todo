import React, {Component} from 'react'
import {Form, Input, Button, Checkbox, message} from 'antd'
import 'whatwg-fetch'
import Config from '../../config'
import './style/form.less'
import {mixin} from 'core-decorators'
import formMixin from './formMixin'
import {browserHistory} from 'react-router'

let config = new Config()
let api = config.api

@mixin(formMixin)
class LoginForm extends Component {

  handleSubmit(e) {
    e.preventDefault();
    let reqBody = this.props.form.getFieldsValue()
    let validUser = this.validString(reqBody.username)
    let validPas = this.validString(reqBody.password)
    if (validUser === 1) {
      this.validForm('login', 0, 'warning', '请输入用户名')
      return
    } else if (validUser === 2) {
      this.validForm('login', 0, 'warning', '用户名不允许有空格')
      return
    }
    if (validPas === 1) {
      this.validForm('login', 1, 'warning', '请输入密码')
      return
    } else if (validPas === 2) {
      this.validForm('login', 1, 'warning', '密码不允许有空格')
      return
    }

    this.changeLoadState(true)
    var that = this
    fetch(api.login, {
      method: 'POST',
      credentials:'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      that.changeLoadState(false)
      if (json.state === 1000) {
        that.showMessage('登陆成功')
        Config.prototype.userInfo = json.user
        browserHistory.push('/main')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      that.changeLoadState(false)
      that.showMessage('服务异常')
    })
  }

  onFocusUsername(e) {
    this.validForm('login', 0, '', '')
  }

  onFocusPassword(e) {
    const {setFieldsValue} = this.props.form
    setFieldsValue({password: ''})
    this.validForm('login', 1, '', '')
  }

  render() {
    const FormItem = Form.Item
    const {getFieldDecorator} = this.props.form
    let inputStyle = {
      height: '40px',
      fontSize: '14px'
    }
    let buttonStyle = {
      width: '200px',
      height: '40px',
      fontSize: '15px',
      margin: '15px 0'
    }
    const {state, actions} = this.props
    return (
      <Form vertical onSubmit={this.handleSubmit.bind(this)} style={{
        maxWidth: 200
      }}>
        <FormItem label="用户名" validateStatus={state.loginUsernameStatus} help={state.loginUsernameHelp}>
          {getFieldDecorator('username')(<Input placeholder="请输入用户名" onFocus={this.onFocusUsername.bind(this)} style={inputStyle}/>)}
        </FormItem>
        <FormItem label="密码" validateStatus={state.loginPasswordStatus} help={state.loginPasswordHelp}>
          {getFieldDecorator('password')(<Input type="password" placeholder="请输入密码" onFocus={this.onFocusPassword.bind(this)} style={inputStyle}/>)}
        </FormItem>
        <Button type="primary" htmlType="submit" style={buttonStyle}>登&nbsp;&nbsp;&nbsp;陆</Button>
      </Form>
    );
  }
}

LoginForm = Form.create()(LoginForm)

export default LoginForm
