import {message} from 'antd'

var formMixin = {
  validString: function(str) {
    // 1：字符串为空 2：包含空格
    if (!str) {
      return 1
    }
    let arr = str.split(" ");
    if (arr.length != 1) {
      return 2;
    }
  },

  changeLoadState: function(isLoading) {
    this.props.actions.changeLoadState(isLoading)
  },

/**
 * @param  {string} type           login & register
 * @param  {number} index          form input index  from 0
 */
  validForm: function(type,index, validateStatus, help) {
      if (type === 'login') {
          this.props.actions.validLogin({index: index, validateStatus: validateStatus, help: help})
      } else {
          this.props.actions.validRegister({index: index, validateStatus: validateStatus, help: help})
      }
  },

  showMessage: function(info) {
    message.info(info, 2.0)
  }
}

export default formMixin
