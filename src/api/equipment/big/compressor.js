import request from '@/utils/request'

// 查询设备平台_大型设备_基础信息列表
export function listCompressor(query) {
  return request({
    url: '/equipment/compressor/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_大型设备_基础信息详细
export function getCompressor(largeId) {
  return request({
    url: '/equipment/compressor/' + largeId,
    method: 'get'
  })
}

// 新增设备平台_大型设备_基础信息
export function addCompressor(data) {
  return request({
    url: '/equipment/compressor',
    method: 'post',
    data: data
  })
}

// 修改设备平台_大型设备_基础信息
export function updateCompressor(data) {
  return request({
    url: '/equipment/compressor',
    method: 'put',
    data: data
  })
}

// 删除设备平台_大型设备_基础信息
export function delCompressor(largeId) {
  return request({
    url: '/equipment/compressor/' + largeId,
    method: 'delete'
  })
}

// 导出设备平台_大型设备_基础信息
export function exportCompressor(data) {
  return request({
    url: '/equipment/compressor/export',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入列表
export function importDataCompressor(data) {
  return request({
    url: '/equipment/compressor/importData',
    method: 'post',
    data: data
  })
}

// 导入设备平台_大型设备_导入模板
export function importTemplateCompressor(data) {
  return request({
    url: '/equipment/compressor/importTemplate',
    method: 'post',
    data: data
  })
}
