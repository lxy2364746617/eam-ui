import request from '@/utils/request'

// 查询设备平台_设备档案_基础信息列表
export function listBASE(query) {
  return request({
    url: '/equipment/base/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_设备档案_设备指标列表
export function listIndexBASE(query) {
  return request({
    url: '/equipment/base/listIndex',
    method: 'get',
    params: query
  })
}

// 查询设备平台_设备档案_设备指标列表
export function specialListBASE(query) {
  return request({
    url: '/equipment/base/specialList',
    method: 'get',
    params: query
  })
}

// 查询设备平台_设备档案_基础信息详细
export function getBASE(deviceId) {
  return request({
    url: '/equipment/base/' + deviceId,
    method: 'get'
  })
}

// 新增设备平台_设备档案_基础信息
export function addBASE(data) {
  return request({
    url: '/equipment/base',
    method: 'post',
    data: data
  })
}

// 修改设备平台_设备档案_基础信息
export function updateBASE(data) {
  return request({
    url: '/equipment/base',
    method: 'put',
    data: data
  })
}

// 编辑-设备平台_设备档案_基础信息
export function modifyBASE(data) {
  return request({
    url: '/equipment/base/modify',
    method: 'put',
    data: data
  })
}

// 删除设备平台_设备档案_基础信息
export function delBASE(deviceId) {
  return request({
    url: '/equipment/base/' + deviceId,
    method: 'delete'
  })
}

// 查询设备平台_设备档案_统计
export function countBASE(query) {
  return request({
    url: '/equipment/base/count',
    method: 'get',
    params: query
  })
}

// 导出设备平台_设备档案_基础信息
export function exportBASE(data) {
  return request({
    url: '/equipment/base/export',
    method: 'post',
    data: data
  })
}

// 设备平台_设备档案_解除父级设备
export function removeParentEmBASE(deviceId) {
  return request({
    url: '/equipment/base/removeParentEm?deviceId='+deviceId,
    method: 'get',
  })
}

// 设备平台_设备档案_添加父级设备
export function addParentEmBASE(data) {
  return request({
    url: '/equipment/base/addParentEm',
    method: 'post',
    data: data
  })
}