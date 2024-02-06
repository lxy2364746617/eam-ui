import request from "@/utils/request";

// 新增
export function addClasses(data) {
  return request({
    url: "/maintain/classes/add",
    method: "post",
    data: data,
  });
}
// 更新
export function updateClasses(data) {
  return request({
    url: "/maintain/classes/add",
    method: "post",
    data: data,
  });
}


