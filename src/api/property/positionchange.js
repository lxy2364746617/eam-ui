import request from "@/utils/request";

// 查询位置状态变动列表
export function getPositionChangeList(data) {
  return request({
    url: "/property/positionchange/selectPage",
    method: "post",
    data: data,
  });
}
