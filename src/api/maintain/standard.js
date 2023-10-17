import request from '@/utils/request'

// 查询维护计划_巡点检标准列表
export function listStandard(query) {
  return request({
    url: '/maintain/standard/list',
    method: 'get',
    params: query
  })
}

// 查询维护计划_巡点检标准详细
export function getStandard(standardId) {
  return request({
    url: '/maintain/standard/' + standardId,
    method: 'get'
  })
}

// 新增维护计划_巡点检标准
export function addStandard(data) {
  return request({
    url: '/maintain/standard',
    method: 'post',
    data: data
  })
}

// 修改维护计划_巡点检标准
export function updateStandard(data) {
  return request({
    url: '/maintain/standard',
    method: 'put',
    data: data
  })
}

// 删除维护计划_巡点检标准
export function delStandard(standardId) {
  return request({
    url: '/maintain/standard/' + standardId,
    method: 'delete'
  })
}
