import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listElevator(query) {
  return request({
    url: '/equipment/elevator/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getElevator(largeId) {
  return request({
    url: '/equipment/elevator/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addElevator(data) {
  return request({
    url: '/equipment/elevator',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateElevator(data) {
  return request({
    url: '/equipment/elevator',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delElevator(largeId) {
  return request({
    url: '/equipment/elevator/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportElevator(data) {
  return request({
    url: '/equipment/elevator/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataElevator(data) {
  return request({
    url: '/equipment/elevator/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateElevator(data) {
  return request({
    url: '/equipment/elevator/importTemplate',
    method: 'post',
    data: data
  })
}
