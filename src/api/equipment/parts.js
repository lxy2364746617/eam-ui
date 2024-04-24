import request from '@/utils/request'
import { json } from 'vkbeautify'

// 查询关联备件_表单模板列表
export function listParts(query) {
  return request({
    url: '/equipment/parts/list',
    method: 'get',
    params: query
  })
}
// 更换记录
export function getPartRecord(query) {
  return request({
    url: '/workorder/getPartRecord',
    method: 'post',
    data: query
  })
}
// 查询关联备件_表单模板详细
export function getParts(deviceId) {
  return request({
    url: '/equipment/parts/' + deviceId,
    method: 'get'
  })
}

// 新增关联备件_表单模板
export function addParts(data) {
  return request({
    url: '/equipment/parts',
    method: 'post',
    data: data
  })
}

// 修改关联备件_表单模板
export function updateParts(data) {
  return request({
    url: '/equipment/parts',
    method: 'put',
    data: data
  })
}

// 删除关联备件_表单模板
export function delParts(deviceId) {
  return request({
    url: '/equipment/parts/' + deviceId,
    method: 'delete'
  })
}

//备品备件
export function selectPage(data) {
  return request({
    url: '/attachment/list',
    method: 'get',
    params: data
  })
}

//查询运维计划列表
export function list(query) {
  return request({
    url: '/maintain/list' ,
    method: 'get',
    params: query
  })
}

//运维计划统计
export function statistics(query) {
  return request({
    url: '/maintain/statistics' ,
    method: 'get',
    params: query
  })
}

//周转履历
export function getDeviceResume(data) {
  return request({
    url: 'equipment/base/getDeviceResume' ,
    method: 'post',
    data: data 
  })
}

//运维履历
export function getMaintenanceList(data) {
  return request({
    url: 'workorder/getMaintenanceList' ,
    method: 'post',
    data: data
  })
}