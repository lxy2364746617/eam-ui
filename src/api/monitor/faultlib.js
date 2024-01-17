import request from '@/utils/request'

// 查询故障管理_故障库管理列表
export function listFaultLib(query) {
  return request({
    url: '/maintain/faultLib/list',
    method: 'get',
    params: query
  })
}

// 查询故障管理_故障库管理详细
export function getFaultLib(libId) {
  return request({
    url: '/maintain/faultLib/' + libId,
    method: 'get'
  })
}

// 新增故障管理_故障库管理
export function addFaultLib(data) {
  return request({
    url: '/maintain/faultLib',
    method: 'post',
    data: data
  })
}

// 修改故障管理_故障库管理
export function updateFaultLib(data) {
  return request({
    url: '/maintain/faultLib',
    method: 'put',
    data: data
  })
}

// 删除故障管理_故障库管理
export function delFaultLib(libId) {
  return request({
    url: '/maintain/faultLib/' + libId,
    method: 'delete'
  })
}
