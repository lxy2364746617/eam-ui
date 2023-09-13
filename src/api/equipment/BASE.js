import request from '@/utils/request'

// 查询设备平台_设备档案_基础信息列表
export function listBASE(query) {
  return request({
    url: '/equipment/BASE/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_设备档案_基础信息详细
export function getBASE(deviceId) {
  return request({
    url: '/equipment/BASE/' + deviceId,
    method: 'get'
  })
}

// 新增设备平台_设备档案_基础信息
export function addBASE(data) {
  return request({
    url: '/equipment/BASE',
    method: 'post',
    data: data
  })
}

// 修改设备平台_设备档案_基础信息
export function updateBASE(data) {
  return request({
    url: '/equipment/BASE',
    method: 'put',
    data: data
  })
}

// 删除设备平台_设备档案_基础信息
export function delBASE(deviceId) {
  return request({
    url: '/equipment/BASE/' + deviceId,
    method: 'delete'
  })
}
