import request from '@/utils/request'

// 查询巡点检路线列表
export function listPline(query) {
  return request({
    url: '/maintain/pline/list',
    method: 'get',
    params: query
  })
}

// 查询巡点检路线详细
export function getPline(lineId) {
  return request({
    url: '/maintain/pline/' + lineId,
    method: 'get'
  })
}

// 新增巡点检路线
export function addPline(data) {
  return request({
    url: '/maintain/pline',
    method: 'post',
    data: data
  })
}

// 修改巡点检路线
export function updatePline(data) {
  return request({
    url: '/maintain/pline',
    method: 'put',
    data: data
  })
}

// 删除巡点检路线
export function delPline(lineId) {
  return request({
    url: '/maintain/pline/' + lineId,
    method: 'delete'
  })
}
