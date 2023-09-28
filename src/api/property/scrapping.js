import request from "@/utils/request";

// 查询设备报废列表
export function getScrappedList(data) {
  return request({
    url: "/property/scrapped/list",
    method: "post",
    data: data,
  });
}

// 新增报废单
export function addScrappedList(data) {
  return request({
    url: "/property/scrapped/list",
    method: "post",
    data: data,
  });
}
