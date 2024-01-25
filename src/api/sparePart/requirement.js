import request from "@/utils/request";

// 查询参数列表
export function getAttachmentList(data) {
  return request({
    url: "/attachment/demand/selectPage",
    method: "post",
    data: data,
  });
}
// 备件需求管理-备件需求明细列表
export function getAttachmentReceiptList(data) {
  return request({
    url: "/attachment/demand/selectDetailPage",
    method: "post",
    data: data,
  });
}

// 备件需求管理-获取备件详情
export function getAttachmentDetail(data) {
  return request({
    url: "/attachment/demand/getDemandDetail",
    method: "get",
    params: data,
  });
}

// 备件需求管理-添加备件需求
export function addAttachment(data) {
  return request({
    url: "/attachment/demand/addDemand",
    method: "post",
    data: data,
  });
}
// 备件需求管理-编辑备件详情
export function updateAttachment(data) {
  return request({
    url: "/attachment/demand/updateDemand",
    method: "post",
    data: data,
  });
}
// ! 删除领用单
export function delAttachment(id) {
  return request({
    url: "/attachment/demand/delDemand",
    method: "post",
    params: { id: id },
  });
}
// ! 备件需求-下载
export const exportManagementList = (data) => {
  return request({
    url: "/attachment/demand/download",
    method: "post",
    data: data,
    responseType: "blob",
  });
};
