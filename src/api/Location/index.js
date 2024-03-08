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
// 获取详情-基础信息
export function locationDetail(query) {
  return request({
    url: '/system/location/detail',
    method: 'get',
    params: query
  })
}
// 获取设备状态
export function getDeviceStatus(query) {
  return request({
    url: '/system/dict/data/type/em_device_state',
    method: 'get',
    params: query
  })
}
// 获取设备属性
export function getDeviceAtt(query) {
  return request({
    url: '/system/dict/data/type/em_device_att',
    method: 'get',
    params: query
  })
}
// 获取详情-设备列表
export function locationDetailDevice(query) {
  return request({
    url: '/equipment/base/list',
    method: 'get',
    params: query
  })
}
// 获取详情-文件列表
export function locationDetailFile(query) {
  return request({
    url: '/system/resource/list',
    method: 'get',
    params: query
  })
}
// 获取详情-文件列表-删除
export function locationDetailFileDelete(deviceId) {
  return request({
    url: '/system/resource/' + deviceId,
    method: 'delete'
  })
}
// 详情-上传自动保存
export function uploadSave(query) {
  return request({
    url: '/system/location/insertPic',
    method: 'post',
    data: query
  })
}
// 图片排序
export function updateSortNum(query) {
  return request({
    url: '/system/location/updateSortNum',
    method: 'post',
    data: query
  })
}