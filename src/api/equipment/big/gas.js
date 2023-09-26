import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listGas(query) {
  return request({
    url: '/equipment/gas/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getGas(largeId) {
  return request({
    url: '/equipment/gas/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addGas(data) {
  return request({
    url: '/equipment/gas',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateGas(data) {
  return request({
    url: '/equipment/gas',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delGas(largeId) {
  return request({
    url: '/equipment/gas/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportGas(data) {
  return request({
    url: '/equipment/gas/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataGas(data) {
  return request({
    url: '/equipment/gas/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateGas(data) {
  return request({
    url: '/equipment/gas/importTemplate',
    method: 'post',
    data: data
  })
}
