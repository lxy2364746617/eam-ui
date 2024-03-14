import request from '@/utils/request'

// 新增设备平台_设备档案_关联部件
export function addAssembly(data) {
  return request({
    url: '/equipment/assembly',
    method: 'post',
    data: data
  })
}

// 查询设备平台_设备档案_关联部件详细
export function getAssembly(deviceId) {
  return request({
    url: '/equipment/assembly/' + deviceId,
    method: 'get'
  })
}

// 删除设备平台_设备档案_关联部件
export function delAssembly(deviceId) {
  return request({
    url: '/equipment/assembly/' + deviceId,
    method: 'delete'
  })
}


// 查询设备平台_设备档案_关联部件列表
export function listAssembly(query) {
  return request({
    url: '/equipment/assembly/list',
    method: 'get',
    params: query
  })
}