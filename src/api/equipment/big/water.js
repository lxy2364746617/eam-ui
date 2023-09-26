import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listWater(query) {
  return request({
    url: '/equipment/water/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getWater(largeId) {
  return request({
    url: '/equipment/water/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addWater(data) {
  return request({
    url: '/equipment/water',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateWater(data) {
  return request({
    url: '/equipment/water',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delWater(largeId) {
  return request({
    url: '/equipment/water/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportWater(data) {
  return request({
    url: '/equipment/water/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataWater(data) {
  return request({
    url: '/equipment/water/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateWater(data) {
  return request({
    url: '/equipment/water/importTemplate',
    method: 'post',
    data: data
  })
}
