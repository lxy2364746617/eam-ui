import request from "@/utils/request";

// 回退列表-首页
export function getPurchaseList(data) {
  return request({
    url: "/device/back/selectPage",
    method: "post",
    data: data,
  });
}

// 查询计划明细
export function getProjectList(data) {
  return request({
    url: "/device/back/detail/list",
    method: "post",
    data: data,
  });
}

// 新增回退
export function setProject(data) {
  return request({
    url: "/device/back/addDeviceBack",
    method: "post",
    data: data,
  });
}
// 编辑回退
export function updateProject(data) {
  return request({
    url: "/device/back/updateDeviceBack",
    method: "post",
    data: data,
  });
}
// 计划页面-导入
export function uploadInfo(data) {
  return request({
    url: "/property/purchase/plan/importPlan",
    method: "post",
    data: data,
  });
}

// 计划页面-下载
export function download(data) {
  return request({
    url: "/property/purchase/plan/downloadPlan",
    method: "post",
    data: data,
  });
}

// 回退删除
export function delId(id) {
  return request({
    url: "/device/back/delDeviceBack?id=" + id,
    method: "post",
  });
}
// 关联附件列表
export function getAssociatedPlan() {
  return request({
    url: "/property/purchase/plan/getRelateFileList",
    method: "get",
  });
}
