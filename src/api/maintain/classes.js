import request from "@/utils/request";

// 新增
export function addClasses(data) {
  return request({
    url: "/maintain/classes/add",
    method: "post",
    data: data,
  });
}
// 更新
export function updateClasses(data) {
  return request({
    url: "/maintain/classes/edit",
    method: "put",
    data: data,
  });
}
// 列表
export function listClasses(data) {
  return request({
    url: "/maintain/classes/list",
    method: "get",
    data: data,
  });
}
// 删除
export function removeClasses(data) {
  return request({
    url: "/maintain/classes/remove",
    method: "post",
    params: data,
  });
}
// 详情
export function detailClasses(data) {
  return request({
    url: "/maintain/classes/detail",
    method: "get",
    params: data,
  });
}
//导出 
export function exportClasses(data) {
  return request({
    url: "/maintain/classes/export",
    method: "post",
    params: data,
  });
}