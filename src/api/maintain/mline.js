import request from '@/utils/request'

// 查询保养检修路线列表
export function listMline(query) {
  return request({
    url: '/maintain/mline/list',
    method: 'get',
    params: query
  })
}

// 查询保养检修路线详细
export function getMline(lineId) {
  return request({
    url: '/maintain/mline/' + lineId,
    method: 'get'
  })
}

// 新增保养检修路线
export function addMline(data) {
  return request({
    url: '/maintain/mline',
    method: 'post',
    data: data
  })
}

// 修改保养检修路线
export function updateMline(data) {
  return request({
    url: '/maintain/mline',
    method: 'put',
    data: data
  })
}

// 删除保养检修路线
export function delMline(lineId) {
  return request({
    url: '/maintain/mline/' + lineId,
    method: 'delete'
  })
}
