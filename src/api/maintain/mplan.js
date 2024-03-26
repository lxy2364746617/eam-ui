import request from '@/utils/request'

// 查询保养检修计划列表
export function listMplan(query) {
  return request({
    url: '/maintain/mplan/list',
    method: 'get',
    params: query
  })
}

// 查询保养检修计划详细
export function getMplan(planId) {
  return request({
    url: '/maintain/mplan/' + planId,
    method: 'get'
  })
}

// 新增保养检修计划
export function addMplan(data) {
  return request({
    url: '/maintain/mplan',
    method: 'post',
    data: data
  })
}

// 修改保养检修计划
export function updateMplan(data) {
  return request({
    url: '/maintain/mplan',
    method: 'put',
    data: data
  })
}

// 删除保养检修计划
export function delMplan(planId) {
  return request({
    url: '/maintain/mplan/' + planId,
    method: 'delete'
  })
}

// 用户状态修改
export function changeItemStatus(planId, planStatus) {
  const data = {
    planId,
    planStatus,
  };
  return request({
    url: "/maintain/mplan/changeStatus",
    method: "put",
    data: data,
  });
}
// 保养检修计划保养路线选择列表
export function lineList(data) {
  return request({
    url: '/maintain/mplan/lineList',
    method: 'get',
    params:data
  })
}