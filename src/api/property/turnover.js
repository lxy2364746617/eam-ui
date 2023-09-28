import request from "@/utils/request";

// 查询设备移交列表
export function getTurnOverList(data) {
  return request({
    url: "/property/transfer/selectPage",
    method: "post",
    data: data,
  });
}
