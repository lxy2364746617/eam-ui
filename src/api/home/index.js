import request from "@/utils/request";

// 我的待办
export function getWorkOrderToDoList(query) {
  return request({
    url: "/workorder/workOrderToDoList",
    method: "get",
    params: query,
  });
}
// 首页设备状态统计
export function getDeviceStatusCount(query) {
  return request({
    url: "/deviceStatusCount",
    method: "get",
    params: query,
  });
}
// 常用功能导航
export function getMenuList(query) {
  return request({
    url: "/getMenuList",
    method: "get",
    params: query,
  });
}

// 工单总览-饼图
export function getWomStatusCount(query) {
  return request({
    url: "/workorder/getWomStatusCount",
    method: "get",
    params: query,
  });
}
// 工单总览-折线图
export function getWomTypeList(query) {
  return request({
    url: "/workorder/getWomTypeList",
    method: "get",
    params: query,
  });
}
// 知识管理
export function getKdbStatics(query) {
  return request({
    url: "/kdbStatics",
    method: "get",
    params: query,
  });
}
// 知识管理
export function getFlowTodo(query) {
  return request({
    url: "/flowTodo",
    method: "get",
    params: query,
  });
}
// 待办数量
export function getTodoCount(query) {
  return request({
    url: "/todoCount",
    method: "get",
    params: query,
  });
}
// 系统公告
export function getNoticeList(query) {
  return request({
    url: "/getNoticeList",
    method: "get",
    params: query,
  });
}
// 工单总览
export function getWomInfoCount(query) {
  return request({
    url: "/workorder/getWomInfoCount",
    method: "get",
    params: query,
  });
}
