import React, {Component, PropTypes} from 'react'
import {
  Menu,
  Row,
  Col,
  Icon,
  Dropdown,
  Modal,
  Form,
  Input,
  Upload
} from 'antd'
import {browserHistory} from 'react-router'
import './style/header.less'
import Config from '../../config'
import {mixin} from 'core-decorators'
import mainMixin from './mainMixin'

let config = new Config()
let api = config.api
let qiniuConfig = config.qiniuConfig

const createForm = Form.create
const FormItem = Form.Item

@mixin(mainMixin)
class Header extends Component {
  constructor(props, context) {
    super(props, context)
    this.uptoken = ''
    this.state = {
      visible: false,
      //show headIcon edit view
      headIconVisible: false,
      headIcon: config.userInfo.headIcon
    }
    this.getUptoken()
  }

  getUptoken() {
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(api.getUptoken, {
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
        that.uptoken = json.uptoken
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      console.log(ex);
      that.showMessage('服务异常')
    })
  }

  handleMenuClick(e) {
    if (e.key === '0') {
      //修改密码
      this.showModal()
    } else {
      //登出
      var httpHeader = this.configHttpHeader()
      var that = this
      fetch(api.logout, {
        method: 'POST',
        credentials: 'include',
        headers: httpHeader
      }).then(function(response) {
        return response.json()
      }).then(function(json) {
        if (json.state === 1000) {
          that.showMessage('已退出账户登录')
          browserHistory.push('/')
        } else if (json.message) {
          that.showMessage(json.message)
        }
      }).catch(function(ex) {
        console.log(ex);
        that.showMessage('服务异常')
      })
    }
  }

  handleSubmit() {
    let reqBody = this.props.form.getFieldsValue()
    let validPas = this.validString(reqBody.password)
    let validNewPas = this.validString(reqBody.newPassword)
    if (validPas === 1) {
      this.showMessage('请输入密码')
      return
    } else if (validPas === 2) {
      this.showMessage('用户名不允许有空格')
      return
    }
    if (validNewPas === 1) {
      this.showMessage('请输入新密码')
      return
    } else if (validNewPas === 2) {
      this.showMessage('密码不允许有空格')
      return
    }
    if (reqBody.newPassword != reqBody.rePasswd) {
      this.showMessage('请确认密码')
      return
    }

    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(api.modifyPassword, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: JSON.stringify({password: reqBody.password, newPassword: reqBody.newPassword})
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      that.hideModal()
      if (json.state === 1000) {
        that.showMessage('修改成功')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
      that.showMessage('服务异常')
    })
  }

  showModal() {
    this.setState({visible: true})
  }

  hideModal() {
    this.setState({visible: false})
  }

  showHeadIconModal() {
    this.setState({headIconVisible: true})
  }

  hideHeadIconModal() {
    this.setState({headIconVisible: false})
  }

  beforeUpload(file) {
    var upData = new FormData()
    upData.append('token', this.uptoken)
    upData.append('file', file)

    var that = this
    fetch(qiniuConfig.host, {
      method: 'POST',
      body: upData
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.key) {
        let url = qiniuConfig.domain + json.key
        that.setState({imageUrl: url})
      } else {
        that.showMessage('上传失败')
      }
    }).catch(function(ex) {
      that.showMessage('服务异常')
    });
    return false
  }

  /**
   * callback image url
   */
  uploadHeadIcon() {
    const {imageUrl} = this.state
    if (!this.state.imageUrl) {
      this.hideHeadIconModal()
    }
    var httpHeader = this.configHttpHeader()
    var that = this
    fetch(api.saveHeadIcon, {
      method: 'POST',
      credentials: 'include',
      headers: httpHeader,
      body: JSON.stringify({headIcon: this.state.imageUrl})
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      that.hideHeadIconModal()
      if (json.state === 1000) {
        config.userInfo = json.user
        that.setState({imageUrl: null, headIcon: imageUrl})
        that.showMessage('上传成功')
      } else if (json.message) {
        that.showMessage(json.message)
      }
    }).catch(function(ex) {
        console.log(ex);
      that.showMessage('服务异常')
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }

    const menu = (
      <Menu onClick={this.handleMenuClick.bind(this)}>
        <Menu.Item key="0">
          账号
        </Menu.Item>
        <Menu.Item key="1">
          退出
        </Menu.Item>
      </Menu>
    )

    const imageUrl = this.state.imageUrl
    var headIconPath = require('./resource/userIcon.png')
    if (this.state.headIcon != '') {
      headIconPath = this.state.headIcon
    }

    return (
      <header className="todo-header">
        <Row type="flex" justify="space-around" align="middle" style={{
          height: "100%"
        }}>
          <Col span={10}>
            <img className="header-icon" src={require('./resource/logo.svg')}></img>
            <p className="header-title">日常待办</p>
          </Col>
          <Col span={10}>
            <div className="user-menu">
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  {this.props.username}
                  <Icon type="down"/>
                </a>
              </Dropdown>
            </div>
            <img className="user-icon" src={headIconPath} onClick={this.showHeadIconModal.bind(this)}></img>
          </Col>
        </Row>

        <Modal title="上传头像" visible={this.state.headIconVisible} onOk={this.uploadHeadIcon.bind(this)} onCancel={this.hideHeadIconModal.bind(this)}>
          <Upload className="avatar-uploader" showUploadList={false} beforeUpload={this.beforeUpload.bind(this)}>
            {imageUrl
              ? <img src={imageUrl} role="presentation" className="avatar"/>
              : (
                <div className="avatar-uploader-trigger"><Icon type="plus"/></div>
              )}
          </Upload>
        </Modal>

        <Modal title="修改密码" visible={this.state.visible} onOk={this.handleSubmit.bind(this)} onCancel={this.hideModal.bind(this)}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="原密码">
              {getFieldDecorator('password')(<Input type="password" autoComplete="off"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('newPassword')(<Input type="password" autoComplete="off"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('rePasswd')(<Input type="password" autoComplete="off"/>)}
            </FormItem>
          </Form>
        </Modal>
      </header>
    )
  }
}

Header.prototypes = {
  username: PropTypes.string.isRequired
}

Header = Form.create()(Header)
export default Header
