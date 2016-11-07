import {message} from 'antd'
import Cookies from 'js-cookie'

var mainMixin = {
  configHttpHeader: ()=>{
      var token = 'Bearer ' + Cookies.get('token')
      return ({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
      })
  },

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

  changeLoadState: function(isLoading) {},

  showMessage: function(info) {
    message.info(info, 2.0)
  }
}

export default mainMixin
