import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listGather(query) {
  return request({
    url: '/equipment/gather/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getGather(largeId) {
  return request({
    url: '/equipment/gather/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addGather(data) {
  return request({
    url: '/equipment/gather',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateGather(data) {
  return request({
    url: '/equipment/gather',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delGather(largeId) {
  return request({
    url: '/equipment/gather/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportGather(data) {
  return request({
    url: '/equipment/gather/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataGather(data) {
  return request({
    url: '/equipment/gather/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateGather(data) {
  return request({
    url: '/equipment/gather/importTemplate',
    method: 'post',
    data: data
  })
}
