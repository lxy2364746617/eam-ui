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
    url: `/kdb/rule/edit`,
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
// 增加点击数
export function addClickNum(data) {
  return request({
    url: `/kdb/tech/addClickNum`,
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
// 获取工单基本信息
export function getWomInfo(query) {
  return request({
    url: '/workorder/getWomFaultInfo',
    method: 'get',
    params: query
  })
}
// 获取【维修】处理信息
export function getWomRepairInfo(query) {
  return request({
    url: '/wom/repair/getWomRepairInfo',
    method: 'get',
    params: query
  })
}
// 获取【委外维修】处理信息
export function getWomRepairInfoOut(query) {
  return request({
    url: '/wom/repair/getWomRepairInfoOut',
    method: 'get',
    params: query
  })
}
// 获取备件记录
export function getWomAttachmentList(query) {
  return request({
    url: '/wom/repair/getWomAttachmentList',
    method: 'get',
    params: query
  })
}
// 获取对策补充
// export function getWomAttachmentList(query) {
//   return request({
//     url: '/wom/repair/getWomAttachmentList',
//     method: 'get',
//     params: query
//   })
// }
// 保存对策补充
export function faultCaseEdit(data) {
  return request({
    url: '/kdb/faultCase/edit',
    method: 'post',
    data: data
  })
}
// 获取对策补充
export function getFaultCaseEdit(query) {
  return request({
    url: '/kdb/faultCase/obtainFaultById',
    method: 'get',
    params: query
  })
}




/**
 * 知识导航
 */
// 获取故障案例
export function navFaultCaseList(query) {
  return request({
    url: '/kdb/index/list',
    method: 'get',
    params: query
  })
}
// 获取技术资料
export function navTechList(query) {
  return request({
    url: '/kdb/index/techList',
    method: 'get',
    params: query
  })
}
// 获取技术资料
export function navMaintainList(query) {
  return request({
    url: '/kdb/index/maintainList',
    method: 'get',
    params: query
  })
}
// 获取规章制度
export function navRuleList(query) {
  return request({
    url: '/kdb/index/ruleList',
    method: 'get',
    params: query
  })
}
// 获取搜索结果
export function navSearchList(query) {
  return request({
    url: '/kdb/index/search',
    method: 'get',
    params: query
  })
}
// 获取历史搜索列表
export function searchHistoryList(query) {
  return request({
    url: '/kdb/searchHistory/list',
    method: 'get',
    params: query
  })
}
// 新增历史搜索列表
export function searchHistoryAdd(data) {
  return request({
    url: '/kdb/searchHistory/add',
    method: 'post',
    data: data
  })
}
