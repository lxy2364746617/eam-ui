import request from "@/utils/request";

// 查询年度计划-首页
export function getPurchaseList(data) {
  return request({
    url: "/property/purchase/plan/selectPage",
    method: "post",
    data: data,
  });
}

// 查询计划明细
export function getProjectList(data) {
  return request({
    url: "/property/purchase/plan/listDetail",
    method: "post",
    data: data,
  });
}

// 新增计划明细
export function getProjectAdd(data) {
  return request({
    url: "/property/purchase/plan/addDetail",
    method: "post",
    data: data,
  });
}
// 新增计划明细
export function deleteProjectId(id) {
  console.log("========================", id);
  return request({
    url: "/property/purchase/plan/delDetail",
    method: "post",
    data: { id: id },
  });
}
// 新增计划
export function setProject(data) {
  return request({
    url: "/property/purchase/plan/addPlan",
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
    responseType: "blob",
  });
}
// 计划明细页面-下载
export function downDetailLoad(ids) {
  return request({
    url: "/property/purchase/plan/downloadDetails",
    method: "post",
    data: data,
    responseType: "blob",
  });
}

// 购置列表删除
export function delId(id) {
  return request({
    url: "/property/purchase/plan/delPlan?id=" + id,
    method: "post",
  });
}
// 关联附件列表
export function getAssociatedPlan(data) {
  return request({
    url: "/property/purchase/plan/getRelateFileList",
    method: "post",
    data: data,
  });
}
