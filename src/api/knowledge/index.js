import request from '@/utils/request'

// 获取故障案例列表
export function getFaultList(query) {
  return request({
    url: '/flowable/form/list',
    method: 'get',
    params: query
  })
}





/**
 * 规章制度库
 */
// 新增规章制度
export function ruleAdd(data) {
  return request({
    url: '/kdb/rule/add',
    method: 'post',
    data: data
  })
}
// 新增规章制度-列表
export function ruleList(query) {
  return request({
    url: '/kdb/rule/list',
    method: 'get',
    params: query
  })
}
// 新增规章制度-列表-删除
export function ruleListDel(data) {
  return request({
    url: `/kdb/rule/remove`,
    method: 'post',
    data: data
  })
}
// 新增规章制度-列表-修改
export function ruleListEdit(data) {
  return request({
    url: `/kdb/rule`,
    method: 'post',
    data: data
  })
}
// 新增规章制度-类型
export function ruleType(query) {
  return request({
    url: '/system/dict/data/type/kdb_rule_type',
    method: 'get',
    params: query
  })
}




/**
 * 运维文档库
 */
// 新增
export function maintainAdd(data) {
  return request({
    url: '/kdb/maintain/add',
    method: 'post',
    data: data
  })
}
// 列表
export function maintainList(query) {
  return request({
    url: '/kdb/maintain/list',
    method: 'get',
    params: query
  })
}
// 列表-删除
export function maintainListDel(data) {
  return request({
    url: `/kdb/maintain/remove`,
    method: 'post',
    data: data
  })
}
// 类型
export function maintainType(query) {
  return request({
    url: '/kdb/maintain/typeDict',
    method: 'get',
    params: query
  })
}


/**
 * 技术资料库
 */
// 列表
export function techList(query) {
  return request({
    url: '/kdb/tech/list',
    method: 'get',
    params: query
  })
}
// 获取设备树
export function equipmentTree(query) {
  return request({
    url: '/equipment/category/equipmentTree',
    method: 'get',
    params: query
  })
}
// 根据树ID获取设备列表
export function equipmentTreeList(query) {
  return request({
    url: '/equipment/base/listBySearch',
    method: 'get',
    params: query
  })
}
// 新增
export function techAdd(data) {
  return request({
    url: '/kdb/tech/add',
    method: 'post',
    data: data
  })
}
// 列表-删除
export function techListDel(data) {
  return request({
    url: `/kdb/tech/remove`,
    method: 'post',
    data: data
  })
}




/**
 * 故障案例库
 */
// 获取页面头部所有信息
export function faultCaseInfo(query) {
  return request({
    url: '/kdb/faultCase/indexInfo',
    method: 'get',
    params: query
  })
}
// 列表
export function faultCaseList(query) {
  return request({
    url: '/kdb/faultCase/list',
    method: 'get',
    params: query
  })
}
// 故障分类
export function faultCaseType(query) {
  return request({
    url: '/system/dict/data/type/kdb_fault_type',
    method: 'get',
    params: query
  })
}
//  故障等级
// export function faultCaseLevel(query) {
//   return request({
//     url: '/kdb/maintain/typeDict',
//     method: 'get',
//     params: query
//   })
// }
// 列表-删除
export function faultCaseListDel(data) {
  return request({
    url: `/kdb/faultCase/remove`,
    method: 'post',
    data: data
  })
}
// 列表-详情
export function faultCaseListDetails(data) {
  return request({
    url: `/kdb/faultCase/remove`,
    method: 'post',
    data: data
  })
}