import request from "@/utils/request";

// 入库-分页
export function getPurchaseList(data) {
  return request({
    url: "/device/warehousing/selectPage",
    method: "post",
    data: data,
  });
}
// 资产管理-设备入库-选择需求计划
export function getWarehousingList(data) {
  return request({
    url: "/device/warehousing/getPurchasePlanList",
    method: "post",
    data: data,
  });
}

// 资产管理-设备购置入库-新增
export function addBASE(data) {
  return request({
    url: "/device/warehousing/addWareHousing",
    method: "post",
    data: data,
  });
}

// 资产管理-设备购置入库-编辑
export function updateBASE(data) {
  return request({
    url: "/device/warehousing/updateWareHousing",
    method: "post",
    data: data,
  });
}
// 资产管理-设备购置入库-删除
export function deleteBASE(id) {
  return request({
    url: "/device/warehousing/delWareHousing?id=" + id,
    method: "post",
  });
}
// 资产管理-设备购置入库-下载
export function download(ids) {
  return request({
    url: "/device/warehousing/download",
    method: "post",
    data: { ids: ids },
    responseType: "blob",
  });
}

// 资产管理-设备购置入库-导入
export function uploadInfo(data) {
  return request({
    url: "/device/warehousing/download",
    method: "post",
    data: data,
  });
}
