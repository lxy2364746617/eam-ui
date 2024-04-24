import request from "@/utils/request";

// 查询故障代码管理列表
export function listFaultcode(query) {
  return request({
    url: "/maintain/faultCode/list",
    method: "get",
    params: query,
  });
}
export function listFaultcode2(query) {
  return request({
    url: "/maintain/faultCode/listNoAnnotation",
    method: "get",
  });
}
// 查询故障代码管理详细
export function getFaultcode(codeId) {
  return request({
    url: "/maintain/faultCode/" + codeId,
    method: "get",
  });
}

// 新增故障代码管理
export function addFaultcode(data) {
  return request({
    url: "/maintain/faultCode",
    method: "post",
    data: data,
  });
}

// 修改故障代码管理
export function updateFaultcode(data) {
  return request({
    url: "/maintain/faultCode",
    method: "put",
    data: data,
  });
}

// 删除故障代码管理
export function delFaultcode(codeId) {
  return request({
    url: "/maintain/faultCode/" + codeId,
    method: "delete",
  });
}
