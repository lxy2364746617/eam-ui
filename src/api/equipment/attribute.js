import request from '@/utils/request'

// 查询设备平台_表单模板列表
export function listTemplate(query) {
  return request({
    url: '/equipment/attribute/list',
    method: 'get',
    params: query
  })
}

// 查询设备平台_表单模板详细
export function getTemplate(templateId) {
  return request({
    url: '/equipment/attribute/' + templateId,
    method: 'get'
  })
}

// 新增设备平台_表单模板
export function addTemplate(data) {
  return request({
    url: '/equipment/attribute',
    method: 'post',
    data: data
  })
}

// 修改设备平台_表单模板
export function updateTemplate(data) {
  return request({
    url: '/equipment/attribute',
    method: 'put',
    data: data
  })
}

// 删除设备平台_表单模板
export function delTemplate(templateId) {
  return request({
    url: '/equipment/attribute/' + templateId,
    method: 'delete'
  })
}

// 根据维度查找表单
export function findByTemplateType(data) {
  return request({
    url: '/equipment/attribute/templateType',
    method: 'post',
    data: data
  })
}