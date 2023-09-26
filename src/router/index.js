import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'definition/model/',
        component: () => import('@/views/flowable/definition/model'),
        name: 'Model',
        meta: { title: '流程设计', icon: '' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'task/finished/detail/index',
        component: () => import('@/views/flowable/task/finished/detail/index'),
        name: 'FinishedRecord',
        meta: { title: '流程详情', icon: '' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'task/myProcess/detail/index',
        component: () => import('@/views/flowable/task/myProcess/detail/index'),
        name: 'MyProcessRecord',
        meta: { title: '流程详情', icon: '' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'task/myProcess/send/index',
        component: () => import('@/views/flowable/task/myProcess/send/index'),
        name: 'SendRecord',
        meta: { title: '流程发起', icon: '' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'task/todo/detail/index',
        component: () => import('@/views/flowable/task/todo/detail/index'),
        name: 'TodoRecord',
        meta: { title: '流程处理', icon: '' }
      }
    ]
  },
  {
    path: '/tool',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'build/index',
        component: () => import('@/views/tool/build/index'),
        name: 'FormBuild',
        meta: { title: '表单配置', icon: '' }
      }
    ]
  },
  ///////////////////////////////////////////////////////////
  {
    path: '/decive/big',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'lbase/add',
        component: () => import('@/views/equipment/big/lbase/add.vue'),
        name: 'bigAdd',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑供电设备' : '新增供电设备'
          to.query.d=='true' ? to.meta.title = '查看供电设备' : ''
          next()
        },
        meta: { title: '供电设备', icon: '' }
      },
      {
        path: 'compressor/add',
        component: () => import('@/views/equipment/big/compressor/add'),
        name: 'bigCompressor',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑空压机' : '新增空压机'
          to.query.d=='true' ? to.meta.title = '查看空压机' : ''
          next()
        },
        meta: { title: '空压机', icon: '' }
      },
      {
        path: 'elevator/add',
        component: () => import('@/views/equipment/big/elevator/add'),
        name: 'bigElevator',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑提升机' : '新增提升机'
          to.query.d=='true' ? to.meta.title = '查看提升机' : ''
          next()
        },
        meta: { title: '提升机', icon: '' }
      },
      {
        path: 'gas/add',
        component: () => import('@/views/equipment/big/gas/add'),
        name: 'bigGas',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑瓦斯抽放泵' : '新增瓦斯抽放泵'
          to.query.d=='true' ? to.meta.title = '查看瓦斯抽放泵' : ''
          next()
        },
        meta: { title: '瓦斯抽放泵', icon: '' }
      },
      {
        path: 'gather/add',
        component: () => import('@/views/equipment/big/gather/add'),
        name: 'bigGather',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑采区排水/加压泵房' : '新增采区排水/加压泵房'
          to.query.d=='true' ? to.meta.title = '查看采区排水/加压泵房' : ''
          next()
        },
        meta: { title: '采区排水/加压泵房', icon: '' }
      },
      {
        path: 'nitrogen/add',
        component: () => import('@/views/equipment/big/nitrogen/add'),
        name: 'bigNitrogen',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑制氨机' : '新增制氨机'
          to.query.d=='true' ? to.meta.title = '查看制氨机' : ''
          next()
        },
        meta: { title: '制氨机', icon: '' }
      },
      {
        path: 'passengers/add',
        component: () => import('@/views/equipment/big/passengers/add'),
        name: 'bigPassengers',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑架空乘人装置' : '新增架空乘人装置'
          to.query.d=='true' ? to.meta.title = '查看架空乘人装置' : ''
          next()
        },
        meta: { title: '架空乘人装置', icon: '' }
      },
      {
        path: 'strong/add',
        component: () => import('@/views/equipment/big/strong/add'),
        name: 'bigStrong',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑强排泵' : '新增强排泵'
          to.query.d=='true' ? to.meta.title = '查看强排泵' : ''
          next()
        },
        meta: { title: '强排泵', icon: '' }
      },
      {
        path: 'substation/add',
        component: () => import('@/views/equipment/big/substation/add'),
        name: 'bigSubstation',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑井下变电所' : '新增井下变电所'
          to.query.d=='true' ? to.meta.title = '查看井下变电所' : ''
          next()
        },
        meta: { title: '井下变电所', icon: '' }
      },
      {
        path: 'transport/add',
        component: () => import('@/views/equipment/big/transport/add'),
        name: 'bigTransport',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑主要辅助运' : '新增主要辅助运'
          to.query.d=='true' ? to.meta.title = '查看主要辅助运' : ''
          next()
        },
        meta: { title: '主要辅助运', icon: '' }
      },
      {
        path: 'ventilator/add',
        component: () => import('@/views/equipment/big/ventilator/add'),
        name: 'bigVentilator',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑主通风机' : '新增主通风机'
          to.query.d=='true' ? to.meta.title = '查看主通风机' : ''
          next()
        },
        meta: { title: '主通风机', icon: '' }
      },
      {
        path: 'water/add',
        component: () => import('@/views/equipment/big/water/add'),
        name: 'bigWater',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑水泵房' : '新增水泵房'
          to.query.d=='true' ? to.meta.title = '查看水泵房' : ''
          next()
        },
        meta: { title: '水泵房', icon: '' }
      },
      {
        path: 'well/add',
        component: () => import('@/views/equipment/big/well/add'),
        name: 'bigWell',
        beforeEnter: (to, from, next) => {
          to.meta.title = to.query.l ? '编辑主井集中皮带' : '新增主井集中皮带'
          to.query.d=='true' ? to.meta.title = '查看主井集中皮带' : ''
          next()
        },
        meta: { title: '主井集中皮带', icon: '' }
      },
    ]
  },
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
