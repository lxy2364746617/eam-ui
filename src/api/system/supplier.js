import request from '@/utils/request'

// 查询供应商_列表
export function listSupplier ( query) {
  return request({
    url: '/system/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商_详细
export function getSupplier(supplierId) {
  return request({
    url: '/system/supplier/' + supplierId,
    method: 'get'
  })
}

// 新增供应商_
export function addSupplier(data) {
  return request({
    url: '/system/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商_
export function updateSupplier(data) {
  return request({
    url: '/system/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商_
export function delSupplier(supplierId) {
  return request({
    url: '/system/supplier/' + supplierId,
    method: 'delete'
  })
}

// 导入供应商_
// export function importSupplier(data) {
//   return request({
//     url: '/system/supplier/importData',
//     method: 'post',
//     data: data
//   })
// }