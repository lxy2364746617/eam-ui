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
//获取全部供应商
export function gysfindAll(query) {
  return request({
    url: '/system/supplier/findAll',
    method: 'get',
    params: query
  })
}
//获取全部用户
export function userfindAll(query) {
  return request({
    url: '/system/user/findAll',
    method: 'get',
    params: query
  })
}
// 状态修改
// 用户状态修改
export function changeItemStatus(planId, planStatus) {
  const data = {
    planId,
    planStatus,
  };
  return request({
    url: "/maintain/rplan/changeStatus",
    method: "put",
    data: data,
  });
}