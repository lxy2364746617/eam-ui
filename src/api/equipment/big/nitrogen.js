import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listNitrogen(query) {
  return request({
    url: '/equipment/nitrogen/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getNitrogen(largeId) {
  return request({
    url: '/equipment/nitrogen/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addNitrogen(data) {
  return request({
    url: '/equipment/nitrogen',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateNitrogen(data) {
  return request({
    url: '/equipment/nitrogen',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delNitrogen(largeId) {
  return request({
    url: '/equipment/nitrogen/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportNitrogen(data) {
  return request({
    url: '/equipment/nitrogen/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataNitrogen(data) {
  return request({
    url: '/equipment/nitrogen/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateNitrogen(data) {
  return request({
    url: '/equipment/nitrogen/importTemplate',
    method: 'post',
    data: data
  })
}
