import request from '@/utils/request'

// 查询巡点检计划列表
export function listPplan(query) {
  return request({
    url: '/maintain/pplan/list',
    method: 'get',
    params: query
  })
}

// 查询巡点检计划详细
export function getPplan(planId) {
  return request({
    url: '/maintain/pplan/' + planId,
    method: 'get'
  })
}

// 新增巡点检计划
export function addPplan(data) {
  return request({
    url: '/maintain/pplan',
    method: 'post',
    data: data
  })
}

// 修改巡点检计划
export function updatePplan(data) {
  return request({
    url: '/maintain/pplan',
    method: 'put',
    data: data
  })
}

// 删除巡点检计划
export function delPplan(planId) {
  return request({
    url: '/maintain/pplan/' + planId,
    method: 'delete'
  })
}
