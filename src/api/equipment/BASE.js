import request from "@/utils/request";

// 查询设备平台_设备档案_基础信息列表
export function listBASE(query) {
  return request({
    url: "/equipment/base/list",
    method: "get",
    params: query,
  });
}
// 查询设备平台_设备档案_关联备件
export function relationList(query) {
  return request({
    url: "/equipment/base/relationList",
    method: "get",
    params: query,
  });
}
// 大型设备选择设备
export function largeRelationList(query) {
  return request({
    url: "/equipment/base/largeRelationList",
    method: "get",
    params: query,
  });
}
// 查询设备平台_设备档案_设备指标列表
export function listIndexBASE(query) {
  return request({
    // url: '/equipment/base/listIndex',
    url: "/equipment/index/list",
    method: "get",
    params: query,
  });
}

// 查询设备平台_设备档案_特种设备列表
export function specialListBASE(query) {
  return request({
    // url: '/equipment/base/specialList',
    url: "/equipment/special/list",
    method: "get",
    params: query,
  });
}

// 查询设备平台_设备档案_基础信息详细
export function getBASE(deviceId) {
  return request({
    url: "/equipment/base/" + deviceId,
    method: "get",
  });
}

// 新增设备平台_设备档案_基础信息
export function addBASE(data) {
  return request({
    url: "/equipment/base",
    method: "post",
    data: data,
  });
}

// 修改设备平台_设备档案_基础信息
export function updateBASE(data) {
  return request({
    url: "/equipment/base",
    method: "put",
    data: data,
  });
}

// 编辑-设备平台_设备档案_基础信息
export function modifyBASE(data) {
  return request({
    url: "/equipment/base/modify",
    method: "put",
    data: data,
  });
}

// 删除设备平台_设备档案_基础信息
export function delBASE(deviceId) {
  return request({
    url: "/equipment/base/" + deviceId,
    method: "delete",
  });
}

// 查询设备平台_设备档案_统计
export function countBASE(query) {
  return request({
    url: "/equipment/base/count",
    method: "get",
    params: query,
  });
}

// 导出设备平台_设备档案_基础信息
export function exportBASE(data) {
  return request({
    url: "/equipment/base/export",
    method: "post",
    data: data,
  });
}

// 设备平台_设备档案_解除父级设备
export function removeParentEmBASE(deviceId) {
  return request({
    url: "/equipment/base/removeParentEm?deviceId=" + deviceId,
    method: "get",
  });
}

// 设备平台_设备档案_添加父级设备
export function addParentEmBASE(data) {
  return request({
    url: "/equipment/base/addParentEm",
    method: "post",
    data: data,
  });
}

// 查询设备平台_设备档案_复制
export function copyBASE(query) {
  return request({
    url: "/equipment/base/copy",
    method: "get",
    params: query,
    noRepeat:true
  });
}

// 设备档案新增/编辑第一步的所属组织和当前使用组织
export function getPrtOrgTreeByDeptId(query) {
  return request({
    url: "/system/dept/getPrtOrgTreeByDeptId",
    method: "get",
    params: query,
  });
}
// 所属组织无权限隔离
export function getPrtOrgTreeListAll() {
  return request({
    url: "/system/dept/listAll",
    method: "get",
  });
}

//所有部门信息
export function getDeptInfo(query) {
  return request({
    url: "/system/dept/getDeptInfo",
    method: "get",
    params: query,
  });
}
//detail-step1-上级设备
export function listSjsb(query) {
  return request({
    url: "/equipment/base/listSjsb",
    method: "get",
    params: query,
  });
}

//分词搜素
export function matchPage(query) {
  return request({
    url: "/equipment/base/match/page",
    method: "post",
    data: query,
  });
}
//分词搜索前分析
/* export function completions(data) {
  return request({
    baseURL:'/baidu',
    url: "/api/proxy/promptflow-tb4idke0/v2/completions",
    method: "post",
    headers:{
      "Content-Type":"application/json",
      "app-code":"64a790dc6d004ce58820c69d3817494e"
    },
    data: {
      messages:[{
          "role":"user",//固定值
          "content":data,//语音转文字内容	
      }]
    },
    timeout:60000
  });
} */

//分词搜索前分析
export function completions(data,that) {
  return request({
    url: "/equipment/base/baiduYy",
    method: "post",
    data: {
      messages:[{
          "role":"user",//固定值
          "content":data,//语音转文字内容	
      }]
    },
    cancelToken: new CancelToken((c) => {
      that.cancelAxios = c
    }),
    timeout:60000
  });
}