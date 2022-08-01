import { asyncRoutes, constantRoutes } from '@/router'
// 因为只有vuex中的数据才能在组件中使用
const state = {
  routes: []
}
// 只能写同步
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}
// 能写同步也能写异步
const actions = {
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    console.log(newRoutes)
    // 静态路由+部分筛选之后动态路由汇总
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
    return newRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
