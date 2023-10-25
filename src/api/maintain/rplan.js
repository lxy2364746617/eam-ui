import request from '@/utils/request'

// 查询定期检验_定期检验计划列表
export function listRplan(query) {
  return request({
    url: '/maintain/rplan/list',
    method: 'get',
    params: query
  })
}

// 查询定期检验_定期检验计划详细
export function getRplan(planId) {
  return request({
    url: '/maintain/rplan/' + planId,
    method: 'get'
  })
}

// 新增定期检验_定期检验计划
export function addRplan(data) {
  return request({
    url: '/maintain/rplan',
    method: 'post',
    data: data
  })
}

// 修改定期检验_定期检验计划
export function updateRplan(data) {
  return request({
    url: '/maintain/rplan',
    method: 'put',
    data: data
  })
}

// 删除定期检验_定期检验计划
export function delRplan(planId) {
  return request({
    url: '/maintain/rplan/' + planId,
    method: 'delete'
  })
}
