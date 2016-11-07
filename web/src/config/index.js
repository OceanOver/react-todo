class Config {
  constructor() {
    //   this.env = 'development'
      this.env = 'production'
  }

  get rootPath() {
    if (this.env === 'development') {
      return 'http://localhost:4000/'
    } else {
      return '/'
    }
  }

  get router() {
    return {
      login: this.rootPath + 'login',
      logout: this.rootPath + 'user/logout',
      register: this.rootPath + 'user/register',
      modifyPassword: this.rootPath + 'user/modifyPassword',
      getUptoken:this.rootPath + 'user/getUptoken',
      saveHeadIcon:this.rootPath + 'user/saveHeadIcon',
      addItem: this.rootPath + 'items/addItem',
      list: this.rootPath + 'items/list',
      deleteItem: this.rootPath + 'items/deleteItem',
      completeItem: this.rootPath + 'items/completeItem',
      editItem: this.rootPath + 'items/modifyItem',
      deleteComplete:this.rootPath + 'items/deleteComplete',
      deleteExpire:this.rootPath + 'items/deleteExpire'
    }
  }

  get qiniuConfig() {
      return {
          host:'http://up.qiniu.com/',
          domain:'http://ofclv2mm5.bkt.clouddn.com/'
      }
  }
}

export default Config
