import request from '@/utils/request'

// 查询保养检修项目列表
export function listMitem(query) {
  return request({
    url: '/maintain/mitem/list',
    method: 'get',
    params: query
  })
}

// 查询保养检修项目详细
export function getMitem(itemId) {
  return request({
    url: '/maintain/mitem/' + itemId,
    method: 'get'
  })
}

// 新增保养检修项目
export function addMitem(data) {
  return request({
    url: '/maintain/mitem',
    method: 'post',
    data: data
  })
}

// 修改保养检修项目
export function updateMitem(data) {
  return request({
    url: '/maintain/mitem',
    method: 'put',
    data: data
  })
}

// 删除保养检修项目
export function delMitem(itemId) {
  return request({
    url: '/maintain/mitem/' + itemId,
    method: 'delete'
  })
}

// 用户状态修改
export function changeItemStatus(itemId, itemStatus) {
  const data = {
    itemId,
    itemStatus,
  };
  return request({
    url: "/maintain/mitem/changeStatus",
    method: "put",
    data: data,
  });
}
