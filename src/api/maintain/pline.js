import request from '@/utils/request'

// 查询巡点检路线列表
export function listPline(query) {
  return request({
    url: '/maintain/pline/list',
    method: 'get',
    params: query
  })
}

// 查询巡点检路线详细
export function getPline(lineId) {
  return request({
    url: '/maintain/pline/' + lineId,
    method: 'get'
  })
}

// 新增巡点检路线
export function addPline(data) {
  return request({
    url: '/maintain/pline',
    method: 'post',
    data: data
  })
}

// 修改巡点检路线
export function updatePline(data) {
  return request({
    url: '/maintain/pline',
    method: 'put',
    data: data
  })
}

// 删除巡点检路线
export function delPline(lineId) {
  return request({
    url: '/maintain/pline/' + lineId,
    method: 'delete'
  })
}


// 获取设备详情
export function findByDeviceId(data) {
  return request({
    url: '/maintain/pline/findByDeviceId/',
    method: 'post',
    data: data
  })
}

// 根据设备ID获取点检项
export function findByDeviceIdAndItemType(query) {
  return request({
    url: '/maintain/larchives/findByDeviceIdAndItemType/',
    method: 'get',
    params: query
  })
}


//查询巡点检路设备档案关联列表
export function larchivesList(query) {
  return request({
    url: '/maintain/larchives/list/',
    params: query
  })
}
