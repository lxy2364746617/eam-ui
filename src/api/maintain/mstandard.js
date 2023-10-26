import request from '@/utils/request'

// 查询保养检修标准列表
export function listMstandard(query) {
  return request({
    url: '/maintain/mstandard/list',
    method: 'get',
    params: query
  })
}

// 查询保养检修标准详细
export function getMstandard(standardId) {
  return request({
    url: '/maintain/mstandard/' + standardId,
    method: 'get'
  })
}

// 新增保养检修标准
export function addMstandard(data) {
  return request({
    url: '/maintain/mstandard',
    method: 'post',
    data: data
  })
}

// 修改保养检修标准
export function updateMstandard(data) {
  return request({
    url: '/maintain/mstandard',
    method: 'put',
    data: data
  })
}

// 删除保养检修标准
export function delMstandard(standardId) {
  return request({
    url: '/maintain/mstandard/' + standardId,
    method: 'delete'
  })
}


// 用户状态修改
export function changeItemStatus(standardId, standardStatus) {
  const data = {
    standardId,
    standardStatus,
  };
  return request({
    url: "/maintain/mstandard/changeStatus",
    method: "put",
    data: data,
  });
}

// 复制到
export function copyStandard(data) {
  return request({
    url: 'maintain/mstandard/copy',
    method: 'post',
    data: data
  })
}