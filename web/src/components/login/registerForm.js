import React, {Component} from 'react'
import {Form, Input, Button, Checkbox, message} from 'antd'
import 'whatwg-fetch'
import Config from '../../config'
import './style/form.less'
import {mixin} from 'core-decorators'
import formMixin from './formMixin'

let config = new Config()
let api = config.api

@mixin(formMixin)
class RegisterForm extends Component {

  handleSubmit(e) {
    e.preventDefault();
    let reqBody = this.props.form.getFieldsValue()
    let validUser = this.validString(reqBody.username)
    let validPas = this.validString(reqBody.password)
    if (validUser === 1) {
      this.validForm('register', 0, 'warning', '请输入用户名')
      return
    } else if (validUser === 2) {
      this.validForm('register', 0, 'warning', '用户名不允许有空格')
      return
    }
    if (validPas === 1) {
      this.validForm('register', 1, 'warning', '请输入密码')
      return
    } else if (validPas === 2) {
      this.validForm('register', 1, 'warning', '密码不允许有空格')
      return
    }
    if (reqBody.password != reqBody.rePasswd) {
      this.validForm('register', 2, 'warning', '请确认密码')
      return
    }

    this.changeLoadState(true)
    var that = this
    fetch(api.register, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: reqBody.username, password: reqBody.password})
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      that.changeLoadState(false)
      if (json.state === 1000) {
        that.showMessage('注册成功')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      that.changeLoadState(false)
      that.showMessage('服务异常')
    })
  }

  onFocusUsername(e) {
    this.validForm('register', 0, '', '')
  }

  onFocusPassword(e) {
    const {setFieldsValue} = this.props.form
    setFieldsValue({password: ''})
    this.validForm('register', 1, '', '')
  }

  onFocusRePassword(e) {
    const {setFieldsValue} = this.props.form
    setFieldsValue({rePasswd: ''})
    this.validForm('register', 2, '', '')
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
        <FormItem label="用户名" validateStatus={state.registerUsernameStatus} help={state.registerUsernameHelp}>
          {getFieldDecorator('username')(<Input onFocus={this.onFocusUsername.bind(this)} placeholder="请输入用户名" style={inputStyle}/>)}
        </FormItem>
        <FormItem label="密码" validateStatus={state.registerPasswordStatus} help={state.registerPasswordHelp}>
          {getFieldDecorator('password')(<Input type="password" onFocus={this.onFocusPassword.bind(this)} placeholder="请输入密码" style={inputStyle}/>)}
        </FormItem>
        <FormItem label="确认密码" validateStatus={state.registerConfirmStatus} help={state.registerConfirmHelp}>
          {getFieldDecorator('rePasswd')(<Input type="password" onFocus={this.onFocusRePassword.bind(this)} autoComplete="off" placeholder="请再次输入密码" style={inputStyle}/>)}
        </FormItem>
        <Button type="primary" htmlType="submit" style={buttonStyle}>注&nbsp;&nbsp;&nbsp;册</Button>
      </Form>
    );
  }
}

RegisterForm = Form.create()(RegisterForm)

export default RegisterForm
