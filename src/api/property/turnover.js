import request from "@/utils/request";

// 移交列表-首页
export function getPurchaseList(data) {
  return request({
    url: "/property/transfer/selectPage",
    method: "post",
    data: data,
  });
}

// 查询计划明细
export function getProjectList(data) {
  return request({
    url: "/property/transfer/detail/list",
    method: "post",
    data: data,
  });
}

// 新增移交
export function setProject(data) {
  return request({
    url: "/property/transfer/addTransfer",
    method: "post",
    data: data,
  });
}
// 编辑移交
export function updateProject(data) {
  return request({
    url: "/property/transfer/updateTransfer",
    method: "post",
    data: data,
  });
}
// // 计划页面-导入
// export function uploadInfo(data) {
//   return request({
//     url: "/property/purchase/plan/importPlan",
//     method: "post",
//     data: data,
//   });
// }

// // 计划页面-下载
// export function download(data) {
//   return request({
//     url: "/property/purchase/plan/downloadPlan",
//     method: "post",
//     data: data,
//   });
// }

// 回退删除
export function delProject(id) {
  return request({
    url: "/property/transfer/delTransfer?id=" + id,
    method: "post",
  });
}
// 关联附件列表
export function getAssociatedPlan() {
  return request({
    url: "/property/purchase/plan/getRelateFileList",
    method: "get",
  });
}
// ! 设备移交-详情
export function getPurchaseDetail(data) {
  return request({
    url: "/property/transfer/getTransfer",
    method: "get",
    params: data,
  });
}
