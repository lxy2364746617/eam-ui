import request from '@/utils/request'

// 查询技术资料列表
export function listResource(query) {
  return request({
    url: '/system/resource/list',
    method: 'get',
    params: query
  })
}

// 查询技术资料详细
export function getResource(busId) {
  return request({
    url: '/system/resource/' + busId,
    method: 'get'
  })
}

// 新增技术资料
export function addResource(data) {
  return request({
    url: '/system/resource',
    method: 'post',
    data: data
  })
}

// 修改技术资料
export function updateResource(data) {
  return request({
    url: '/system/resource',
    method: 'put',
    data: data
  })
}

// 删除技术资料
export function delResource(busId) {
  return request({
    url: '/system/resource/' + busId,
    method: 'delete'
  })
}