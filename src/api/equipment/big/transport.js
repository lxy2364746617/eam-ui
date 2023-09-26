import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listTransport(query) {
  return request({
    url: '/equipment/transport/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getTransport(largeId) {
  return request({
    url: '/equipment/transport/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addTransport(data) {
  return request({
    url: '/equipment/transport',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateTransport(data) {
  return request({
    url: '/equipment/transport',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delTransport(largeId) {
  return request({
    url: '/equipment/transport/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportTransport(data) {
  return request({
    url: '/equipment/transport/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataTransport(data) {
  return request({
    url: '/equipment/transport/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateTransport(data) {
  return request({
    url: '/equipment/transport/importTemplate',
    method: 'post',
    data: data
  })
}
