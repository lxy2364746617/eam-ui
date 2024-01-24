import request from "@/utils/request";

// 查询参数列表
export function getManagementList(data) {
  return request({
    url: "/attachment/selectPage",
    method: "post",
    data: data,
  });
}
// 备件管理-添加备件
export function addManagement(data) {
  return request({
    url: "/attachment/addAttachment",
    method: "post",
    data: data,
  });
}

// 备件管理-修改备件
export function updateManagement(data) {
  return request({
    url: "/attachment/updateAttachment",
    method: "post",
    data: data,
  });
}
// 备件管理-备件详情
export function getManagementDetails(id) {
  return request({
    url: "/attachment/getAttachmentDetail",
    method: "get",
    params: { id: id },
  });
}
// ! 备件管理-删除备件
export function delManagement(id) {
  return request({
    url: "/attachment/delAttachment?id=" + id,
    method: "post",
  });
}
// ! 备件管理-下载
export const exportManagementList = (data) => {
  return request({
    url: "/attachment/download",
    method: "post",
    data: data,
    responseType: "blob",
  });
};

// 根据备件编码获取库存信息
export function getStockInOutCondition(partCode) {
  return request({
    url: "/attachment/inventory/condition/" + partCode,
    method: "get",
  });
}

// 备件管理-获取管理设备
export function getDeviceList(params) {
  return request({
    url: "/attachment/getDeviceList",
    method: "get",
    params: params,
  });
}
// 备件管理-备件更换记录
export function getReplaceRecord(params) {
  return request({
    url: "/attachment/getReplaceRecord",
    method: "get",
    params: params,
  });
}
// 关联设备
export function relateDevices(data) {
  return request({
    url: "/attachment/relateDevices",
    method: "post",
    data: data,
  });
}
// 接触设备
export function secureDevices(data) {
  return request({
    url: "/attachment/secureDevices",
    method: "post",
    data: data,
  });
}
// 修改技术资料
export function uploadImg(data) {
  return request({
    url: "/system/resource",
    method: "post",
    data: data,
  });
}

export function uploadImgPut(data) {
  return request({
    url: "/attachment/editSysFileResourceList",
    method: "post",
    data: data,
  });
}
export function uploadImgPost(data) {
  return request({
    url: "/system/resource",
    method: "post",
    data: data,
  });
}
export function getImg(partCode) {
  return request({
    url: "/attachment/getPartImgList?partCode=" + partCode,
    method: "get",
  });
}
