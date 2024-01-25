import request from '@/utils/request'

// 获取故障案例列表
export function getLocationTree(query) {
  return request({
    url: '/system/location/orgTree',
    method: 'get',
    params: query
  })
}
// 获取基本信息
export function locationInfo(query) {
  return request({
    url: '/system/location/obtainInfoById',
    method: 'get',
    params: query
  })
}
// 新增树
export function saveOrUpdate(query) {
  return request({
    url: '/system/location/saveOrUpdate',
    method: 'post',
    data: query
  })
}
// 获取功能位置属性
export function getLocationAttr(query) {
  return request({
    url: '/system/dict/data/type/sys_fun_location_attr',
    method: 'get',
    params: query
  })
}
// 删除树节点
export function locationRemove(query) {
  return request({
    url: '/system/location/remove',
    method: 'post',
    data: query
  })
}