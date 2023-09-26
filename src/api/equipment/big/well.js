import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listWell(query) {
  return request({
    url: '/equipment/well/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getWell(largeId) {
  return request({
    url: '/equipment/well/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addWell(data) {
  return request({
    url: '/equipment/well',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateWell(data) {
  return request({
    url: '/equipment/well',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delWell(largeId) {
  return request({
    url: '/equipment/well/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportWell(data) {
  return request({
    url: '/equipment/well/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataWell(data) {
  return request({
    url: '/equipment/well/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateWell(data) {
  return request({
    url: '/equipment/well/importTemplate',
    method: 'post',
    data: data
  })
}
