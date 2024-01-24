import request from "@/utils/request";

// 查询参数列表
export function getAttachmentList(data) {
  return request({
    url: "/attachment/receipt/condition/page",
    method: "post",
    data: data,
  });
}
// 领用单备件条件查询
export function getAttachmentReceiptList(data) {
  return request({
    url: "/attachment/receipt/condition/receipt/parts",
    method: "post",
    data: data,
  });
}

// 领用单详情
export function getAttachmentDetail(data) {
  return request({
    url: "/attachment/receipt/detail",
    method: "post",
    data: data,
  });
}

// 新增领用单
export function addAttachment(data) {
  return request({
    url: "/attachment/receipt/add",
    method: "post",
    data: data,
  });
}
// 更新领用单
export function updateAttachment(data) {
  return request({
    url: "/attachment/receipt/update",
    method: "post",
    data: data,
  });
}
// ! 删除领用单
export function delAttachment(data) {
  return request({
    url: "/attachment/receipt/del",
    method: "post",
    data: data,
  });
}
