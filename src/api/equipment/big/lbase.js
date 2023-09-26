import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listlbase(query) {
  return request({
    url: '/equipment/lbase/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getlbase(largeId) {
  return request({
    url: '/equipment/lbase/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addlbase(data) {
  return request({
    url: '/equipment/lbase',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updatelbase(data) {
  return request({
    url: '/equipment/lbase',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function dellbase(largeId) {
  return request({
    url: '/equipment/lbase/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportlbase(data) {
  return request({
    url: '/equipment/lbase/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDatalbase(data) {
  return request({
    url: '/equipment/lbase/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplatelbase(data) {
  return request({
    url: '/equipment/lbase/importTemplate',
    method: 'post',
    data: data
  })
}
