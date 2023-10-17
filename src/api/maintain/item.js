import request from "@/utils/request";

// 查询维护计划_巡点检项目列表
export function listItem(query) {
  return request({
    url: "/maintain/item/list",
    method: "get",
    params: query,
  });
}

// 查询维护计划_巡点检项目详细
export function getItem(itemId) {
  return request({
    url: "/maintain/item/" + itemId,
    method: "get",
  });
}

// 新增维护计划_巡点检项目
export function addItem(data) {
  return request({
    url: "/maintain/item",
    method: "post",
    data: data,
  });
}

// 修改维护计划_巡点检项目
export function updateItem(data) {
  return request({
    url: "/maintain/item",
    method: "put",
    data: data,
  });
}

// 删除维护计划_巡点检项目
export function delItem(itemId) {
  return request({
    url: "/maintain/item/" + itemId,
    method: "delete",
  });
}

// 用户状态修改
export function changeItemStatus(itemId, itemStatus) {
  const data = {
    itemId,
    itemStatus,
  };
  return request({
    url: "/maintain/item/changeStatus",
    method: "put",
    data: data,
  });
}
