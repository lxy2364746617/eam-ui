import request from "@/utils/request";

// 出入库条件分页列表
export function getStockInOutList(data) {
  return request({
    url: "/attachment/stockInOut/condition/page",
    method: "post",
    data: data,
  });
}
// 入库
export function stockIn(data) {
  return request({
    url: "/attachment/stockInOut/add/stockIn",
    method: "post",
    data: data,
  });
}

// 出库
export function stockOut(data) {
  return request({
    url: "/attachment/stockInOut/add/stockOut",
    method: "post",
    data: data,
  });
}
// 备件出入库下载
export function stockInOutDownload(data) {
  return request({
    url: "/attachment/stockInOut/download",
    method: "post",
    data: data,
  });
}
// 根据备件编码获取库存信息
export function getStockInOutCondition(partCode) {
  return request({
    url: "/attachment/inventory/condition/" + partCode,
    method: "get",
  });
}
