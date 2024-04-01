import request from "@/utils/request";

// 查询年度报废-首页
export function getPurchaseList(data) {
  return request({
    url: "/property/scrapped/list",
    method: "post",
    data: data,
  });
}

// 查询报废明细
export function getProjectList(data) {
  return request({
    url: "/property/scrapped/detail",
    method: "post",
    data: data,
  });
}

// 新增报废
export function setProject(data) {
  return request({
    url: "/property/scrapped/add",
    method: "post",
    data: data,
  });
}
// 编辑报废
export function updateProject(data) {
  return request({
    url: "/property/scrapped/update",
    method: "post",
    data: data,
  });
}
// 报废删除
export function delProject(id) {
  return request({
    url: "/property/scrapped/del/" + id,
    method: "post",
  });
}

// 报废页面-下载
export function download(data) {
  return request({
    url: "/property/scrapped/export",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 资产管理-设备报废单明细-下载
export function downDetailLoad(data) {
  return request({
    url: "/property/scrapped/export/detail",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// ! 设备报废-详情
export function getPurchaseDetail(data) {
  return request({
    url: "/property/scrapped/getScrapped",
    method: "get",
    params: data,
  });
}
