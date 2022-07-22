import Vue from 'vue'
// 第三方css库 让不同浏览器标签渲染效果一致 重置样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 全局公共样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon svg图标
import '@/permission' // permission control 权限控制

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 控制台有一个生产提示，不重要
Vue.config.productionTip = false

// 批量导入自定义指令 作用可以简化指令的写法
import * as obj from '@/directives' // 得到一个对象
// Object.keys(obj)  // ['imgerror','abc']
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})

// 什么时候用插件？封装了一对公共组件供同事用时，让同事用起来更方便
import components from './components'
// 会自动执行install方法
Vue.use(components)

// 时间过滤器 filter 封装
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
