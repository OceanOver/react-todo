import {bindActionCreators} from 'redux'
// connect 会把State和dispatch转换成props传递给子组件
import {connect} from 'react-redux'
import * as LoginActions from '../../actions/login'
import React, {Component, PropTypes} from 'react'
import Header from './header'
import Content from './content'
import Footer from '../common/footer'
import './style/login.less'

class Login extends Component {

  render() {
    const {state, actions} = this.props
    return (
      <div className="login">
        <Header/>
        <div className='content'>
          <Content state={state} actions={actions}/>
        </div>
        <Footer/>
      </div>
    );
  }
}

Login.propTypes = {
  state: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {state: state.login}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LoginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
