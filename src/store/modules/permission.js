// import { asyncRouterMap, constantRouterMap } from '@/router'
import { constantRouterMap } from '@/router'

/**
 * 通过meta.privileges判断是否与当前用户权限匹配
 * @param privileges
 * @param route
 */
// function hasPermission(privileges, route) {
//   if (route.meta && route.meta.privileges) {
//     return privileges.some(privilege => route.meta.privileges.indexOf(privilege) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param privileges
 */
// function filterAsyncRouter(asyncRouterMap, privileges) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(privileges, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, privileges)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { role } = data
        // const accessedRouters = filterAsyncRouter(asyncRouterMap, privileges)
        const accessedRouters = []
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
