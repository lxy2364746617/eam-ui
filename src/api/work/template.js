import request from "@/utils/request";

// 查询设备平台_表单模板列表
export function orderTemplate() {
  return request({
    url: "/workorder/tree/order_type",
    method: "post",
  });
}
