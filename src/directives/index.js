/* import Vue from 'vue'
// 自定义指令
Vue.directive('imgerror', {
  // 指令所在的标签插入到dom中的时候就会执行
  // inserted (el, binding) {
  //   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
  // },
  // 数据更新的时候就会执行
  update (el, binding) {
    el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
  }
})
 */

export const imgerror = {
  inserted (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
