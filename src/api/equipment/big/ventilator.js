import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listVentilator(query) {
  return request({
    url: '/equipment/ventilator/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getVentilator(largeId) {
  return request({
    url: '/equipment/ventilator/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addVentilator(data) {
  return request({
    url: '/equipment/ventilator',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateVentilator(data) {
  return request({
    url: '/equipment/ventilator',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delVentilator(largeId) {
  return request({
    url: '/equipment/ventilator/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportVentilator(data) {
  return request({
    url: '/equipment/ventilator/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataVentilator(data) {
  return request({
    url: '/equipment/ventilator/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateVentilator(data) {
  return request({
    url: '/equipment/ventilator/importTemplate',
    method: 'post',
    data: data
  })
}
