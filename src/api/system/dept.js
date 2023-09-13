import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId, query) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getDept(deptId,query) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get',
    params: query
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId, query) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete',
    params: query
  })
}

// 获取部门列表
export function getDeptChild(query) {
  return request({
    url: '/system/dept/child',
    method: 'get',
    params: query
  })
}