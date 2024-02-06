import request from '@/utils/request'

// 查询列表
export function listGroup(query) {
  return request({
    url: '/system/group/list',
    method: 'get',
    params: query
  })
}

// 查询定期检验_定期检验计划详细
export function getGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'get'
  })
}

// 新增
export function addGroup(data) {
  return request({
    url: '/system/group',
    method: 'post',
    data: data
  })
}

// 修改
export function updateGroup(data) {
  return request({
    url: '/system/group',
    method: 'put',
    data: data
  })
}

// 删除
export function delGroup(userIds) {
  return request({
    url: '/system/group/' + userIds,
    method: 'delete'
  })
}
// 状态修改
export function changeItemStatus(id, groupStatue) {
  const data = {
    id,
    groupStatue
,
  };
  return request({
    url: "/system/group/changeStatus",
    method: "put",
    data: data,
  });
}

// 查询所有列表
export function findAll(query) {
  return request({
    url: '/system/group/findAll',
    method: 'get',
    params: query
  })
}