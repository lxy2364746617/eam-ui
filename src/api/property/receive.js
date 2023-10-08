import request from "@/utils/request";

// 分页-首页
export function getPurchaseList(data) {
  return request({
    url: "/property/neck/selectPage",
    method: "post",
    data: data,
  });
}
// 明细分页-首页
export function getProjectList(data) {
  return request({
    url: "/property/neck/detail/list",
    method: "post",
    data: data,
  });
}
// 新增领用
export function setProject(data) {
  return request({
    url: "/property/neck/addNeck",
    method: "post",
    data: data,
  });
}
// 新增领用
export function delProject(id) {
  return request({
    url: "/property/neck/delNeck?id=" + id,
    method: "post",
  });
}

// ! 关联附件列表   购置计划的
export function getAssociatedPlan(data) {
  return request({
    url: "/property/purchase/plan/getRelateFileList",
    method: "post",
    data: data,
  });
}
