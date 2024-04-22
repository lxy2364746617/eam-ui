import request from '@/utils/request'

// 查询设备平台_设备类别 树
export function equipmentTree(query) {
  return request({
    url: '/equipment/category/equipmentTree',
    method: 'get',
    params: query
  })
}
// 查询设备平台_设备类别 不查模板
export function equipmentTreeNoTemplate(query) {
  return request({
    url: '/equipment/category/equipmentTreeNoTemplate',
    method: 'get',
    params: query
  })
}
// 查询设备平台_设备类别详情
export function getAttrByCatgoryId(query) {
  return request({
    url: '/equipment/category/getAttrByCatgoryId',
    method: 'get',
    params: query
  })
}
// 查询设备平台_设备类别 树 无最外层父级
export function equipmentTrees_noParent(query) {
  return request({
    url: '/equipment/category/equipmentTrees',
    method: 'get',
    params: query
  })
}

// 查询设备平台_设备类别列表
export function listCategory(query) {
  return request({
    url: '/equipment/category/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_设备类别详细
export function getCategory(categoryId) {
  return request({
    url: '/equipment/category/' + categoryId,
    method: 'get'
  })
}

// 新增设备平台_设备类别
export function addCategory(data) {
  return request({
    url: '/equipment/category',
    method: 'post',
    data: data
  })
}

// 修改设备平台_设备类别
export function updateCategory(data) {
  return request({
    url: '/equipment/category',
    method: 'put',
    data: data
  })
}

// 删除设备平台_设备类别
export function delCategory(categoryId) {
  return request({
    url: '/equipment/category/' + categoryId,
    method: 'delete'
  })
}

// 查询设备平台_设备类别-获取六大类设备
export function isSmEmCategoryCategory() {
  return request({
    url: '/equipment/category/isSmEmCategory',
    method: 'get'
  })
}

// 查询设备平台_设备类别-获取特种设备
export function isSpecialEmCategoryCategory() {
  return request({
    url: '/equipment/category/isSpecialEmCategory',
    method: 'get'
  })
}
