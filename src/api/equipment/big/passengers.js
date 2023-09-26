import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listPassengers(query) {
  return request({
    url: '/equipment/passengers/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getPassengers(largeId) {
  return request({
    url: '/equipment/passengers/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addPassengers(data) {
  return request({
    url: '/equipment/passengers',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updatePassengers(data) {
  return request({
    url: '/equipment/passengers',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delPassengers(largeId) {
  return request({
    url: '/equipment/passengers/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportPassengers(data) {
  return request({
    url: '/equipment/passengers/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataPassengers(data) {
  return request({
    url: '/equipment/passengers/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplatePassengers(data) {
  return request({
    url: '/equipment/passengers/importTemplate',
    method: 'post',
    data: data
  })
}
