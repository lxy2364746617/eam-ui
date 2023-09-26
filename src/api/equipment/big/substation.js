import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listSubstation(query) {
  return request({
    url: '/equipment/substation/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getSubstation(largeId) {
  return request({
    url: '/equipment/substation/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addSubstation(data) {
  return request({
    url: '/equipment/substation',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateSubstation(data) {
  return request({
    url: '/equipment/substation',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delSubstation(largeId) {
  return request({
    url: '/equipment/substation/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportSubstation(data) {
  return request({
    url: '/equipment/substation/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataSubstation(data) {
  return request({
    url: '/equipment/substation/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateSubstation(data) {
  return request({
    url: '/equipment/substation/importTemplate',
    method: 'post',
    data: data
  })
}
