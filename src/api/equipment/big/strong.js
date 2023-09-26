import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listStrong(query) {
  return request({
    url: '/equipment/strong/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getStrong(largeId) {
  return request({
    url: '/equipment/strong/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addStrong(data) {
  return request({
    url: '/equipment/strong',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateStrong(data) {
  return request({
    url: '/equipment/strong',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delStrong(largeId) {
  return request({
    url: '/equipment/strong/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportStrong(data) {
  return request({
    url: '/equipment/strong/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataStrong(data) {
  return request({
    url: '/equipment/strong/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateStrong(data) {
  return request({
    url: '/equipment/strong/importTemplate',
    method: 'post',
    data: data
  })
}
