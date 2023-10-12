import request from "@/utils/request";

// 设备调剂管理-图表统计
export function getDispensingChart(data) {
  return request({
    url: "/property/relieve/count",
    method: "post",
    data: data,
  });
}
