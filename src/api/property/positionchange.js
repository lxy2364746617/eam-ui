import request from "@/utils/request";

// 查询位置状态变动列表
export function getPurchaseList(data) {
  return request({
    url: "/property/pos_change/selectPage",
    method: "post",
    data: data,
  });
}
// 新增位置状态变动
export function setProject(data) {
  return request({
    url: "/property/pos_change/add",
    method: "post",
    data: data,
  });
}
// 删除位置状态变动
export function delProject(changeNo) {
  return request({
    url: "/property/pos_change/del/" + changeNo,
    method: "post",
  });
}
// 查询新增位置状态明细
export function getProjectList(data) {
  return request({
    url: "/property/pos_change/detail",
    method: "post",
    data: data,
  });
}

// 位置状态页面-下载
export function download(data) {
  return request({
    url: "/property/pos_change/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 位置状态明细页面-下载
export function downDetailLoad(ids) {
  return request({
    url: "/property/pos_change/export/detail",
    method: "post",
    data: { ids: ids },
    responseType: "blob",
  });
}
// 修改
export function updateProject(data) {
  return request({
    url: "/property/pos_change/update",
    method: "post",
    data: data,
  });
}
// ! 位置状态变动-详情
export function getPurchaseDetail(data) {
  return request({
    url: "/property/pos_change/getPostChg",
    method: "get",
    params: data,
  });
}
