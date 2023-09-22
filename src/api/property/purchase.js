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
    url: "/property/purchase/plan/selectDetailPage",
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
