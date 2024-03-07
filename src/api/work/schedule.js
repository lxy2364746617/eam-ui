import request from "@/utils/request";

// 工单管理-工单列表
export const getScheduleList = (data) => {
  return request({
    url: "/workorder/selectPage",
    method: "post",
    data: data,
  });
};
// 工单管理-工单执行人列表
export const getExecutorList = (data) => {
  return request({
    url: "/workorder/allocation/executor",
    method: "post",
    data: data,
  });
};
// 工单管理-工单调度关闭
export const getAllocationClose = (data) => {
  return request({
    url: "/workorder/allocation/close",
    method: "post",
    data: data,
  });
};
// 工单管理-工单调度修改计划执行日期
export const updateAllocation = (data) => {
  return request({
    url: "/workorder/allocation/change/plan_date",
    method: "post",
    data: data,
  });
};
// 工单管理-工单调度执行人修改
export const updateExecutor = (data) => {
  return request({
    url: "/workorder/allocation/update_executor",
    method: "post",
    data: data,
  });
};
// 工单管理-工单执行人列表
export const editWorkDate = (data) => {
  return request({
    url: "/workorder/allocation/change/plan_date",
    method: "post",
    data: data,
  });
};
// ! 工单请求新增
// 工单请求-新增巡点检工单-路线or设备
export const addInspection = (data) => {
  return request({
    url: "/workorder/addWorkOrderPatrol",
    method: "post",
    data: data,
  });
};
// 工单管理-新增维保工单
export const addMaintenance = (data) => {
  return request({
    url: "/wom/maintain/add/maintain",
    method: "post",
    data: data,
  });
};
// 工单请求-新增设备维修工单
export const addEquip = (data) => {
  return request({
    url: "/wom/repair/addWorkOrderRepair",
    method: "post",
    data: data,
  });
};
// 工单请求-新增设备维修工单
export const addPeriodic = (data) => {
  return request({
    url: "/wom/check/add/check",
    method: "post",
    data: data,
  });
};

// ! 工单请求-设备维修查询
// * 工单管理-获取设备维修信息
export const getWomRepairInfo = (query) => {
  return request({
    url: "/wom/repair/getWomRepairInfo",
    method: "get",
    params: query,
  });
};
// * 工单待办-根据工单编码获取路线
export const getWomLine = (query) => {
  return request({
    url: "/workorder/getWomLine",
    method: "get",
    params: query,
  });
};

// * 工单管理-获取设备故障工单信息
export const getWomFaultInfo = (query) => {
  return request({
    url:
      "/wom/repair/getWomFaultInfo" +
      "?orderCode=" +
      query.orderCode +
      "&deviceCode=" +
      query.deviceCode,
    method: "get",
    // params: query,
  });
};
// * 工单管理-获取设备委外维修信息
export const getEquipOut = (data) => {
  return request({
    url: "/wom/repair/getWomRepairInfoOut",
    method: "post",
    data: data,
  });
};

// * 工单管理-根据路线编码获取设备信息
export const getWomDevice = (query) => {
  return request({
    url:
      "/workorder/getWomDevice" +
      "?orderCode=" +
      query.orderCode +
      "&lineCode=" +
      query.lineCode,
    method: "get",
  });
};

// * 工单管理-获取关联文件数据
export const getRelevanceInfo = (query) => {
  return request({
    url: "/system/resource/list",
    method: "get",
    params: query,
  });
};
// * 工单管理-获取工单基本信息
export const getWomInfo = (query) => {
  return request({
    url: "/workorder/getWomInfo",
    method: "get",
    params: query,
  });
};
// * 工单管理-获取工单基本信息
export const getWomFaultInfo2 = (query) => {
  return request({
    url: "/workorder/getWomFaultInfo",
    method: "get",
    params: query,
  });
};
// ! 保养
// 保养人员
export const getOrderExecutor = (data) => {
  return request({
    url: "/wom/maintain/list/executors",
    method: "post",
    data: data,
  });
};
// 工单管理-维保工单添加保养人员
export const addExecutors = (data) => {
  return request({
    url: "/wom/maintain/add/executors",
    method: "post",
    data: data,
  });
};
// 工单管理-维保工单删除保养人员
export const delExecutors = (data) => {
  return request({
    url: "/wom/maintain/del/executors",
    method: "post",
    data: data,
  });
};
// * 维保工时
// 工单管理-维保工单保养人员工时列表
export const getWorkHours = (data) => {
  return request({
    url: "/wom/maintain/list/work_hours",
    method: "post",
    data: data,
  });
};

export const addWorkHours = (data) => {
  return request({
    url: "/wom/maintain/add/work_hours",
    method: "post",
    data: data,
  });
};
export const updateWorkHours = (data) => {
  return request({
    url: "/wom/maintain/update/work_hours",
    method: "post",
    data: data,
  });
};
export const delWorkHours = (data) => {
  return request({
    url: "/wom/maintain/del/work_hours",
    method: "post",
    data: data,
  });
};
// 工单管理-获取维保项
export const getMaintenanceItem = (data) => {
  return request({
    url: "wom/maintain/detail/item",
    method: "post",
    data: data,
  });
};
// 暂存
export const upkeepStoreItem = (data) => {
  return request({
    url: "/wom/maintain/execute/cache",
    method: "post",
    data: data,
  });
};
// 提交
export const upkeepSubmitItem = (data) => {
  return request({
    url: "/wom/maintain/execute/submit",
    method: "post",
    data: data,
  });
};
export const upkeepCarryPhoto = (data) => {
  return request({
    url: "/wom/maintain/execute/photo",
    method: "post",
    data: data,
  });
};
export const goExecutorSubmit = (data) => {
  return request({
    url: "/wom/check/executor/submit",
    method: "post",
    data: data,
  });
};
export const goExecutorDetail = (data) => {
  return request({
    url: "/wom/check/executor/detail",
    method: "post",
    data: data,
  });
};

// 工单管理-检验工单添加费用
export const addCheckExpense = (data) => {
  return request({
    url: "/wom/check/add/costs",
    method: "post",
    data: data,
  });
};

// ! 工单代办-执行-巡点捡
export const goWorkOrder = (data) => {
  return request({
    url: "/wom/repair/executeWomRepairOrder",
    method: "post",
    data: data,
  });
};

// 工单待办-巡点检执行-分页
export const getSelectPage = (query) => {
  return request({
    url: "/wom/patrol/item/selectPage",
    method: "get",
    params: query,
  });
};
// 提交
export const commitPatrolItem = (data) => {
  return request({
    url: "/wom/patrol/item/commitPatrolItem",
    method: "post",
    data: data,
  });
};
// 暂存
export const stagingPatrolItem = (data) => {
  return request({
    url: "/wom/patrol/item/stagingPatrolItem",
    method: "post",
    data: data,
  });
};
// 自行处理提交
export const dealPatrolItem = (data) => {
  return request({
    url: "/wom/patrol/item/dealPatrolItem",
    method: "post",
    data: data,
  });
};
// 工单待办-获取巡点检异常自行处理记录
export const getPatrolItemDealRecord = (query) => {
  return request({
    url: "/wom/patrol/item/getPatrolItemDealRecord",
    method: "get",
    params: query,
  });
};

// 工单待办-照片上传
export const photoWomDevice = (data) => {
  return request({
    url: "/wom/patrol/item/photoWomDevice",
    method: "post",
    data: data,
  });
};
// 工单待办-导出巡点检项目
export const exportPatrolItem = (data) => {
  return request({
    url: "/wom/patrol/item/exportPatrolItem",
    method: "post",
    data: data,
    responseType: "blob",
  });
};

// 工单待办-工单导出
export const exportWomInfo = (data) => {
  return request({
    url: "/workorder/exportWomInfo",
    method: "post",
    data: data,
    responseType: "blob",
  });
};
// ! 工单日历
export const getCalendarMonth = (query) => {
  return request({
    url: "/wom/calendar/getWorkOrderInfo",
    method: "get",
    params: query,
  });
};
export const getOrderDetailDay = (query) => {
  return request({
    url: "/wom/calendar/getWorkOrderDetail",
    method: "get",
    params: query,
  });
};
export const getWorkOrderCount = (data) => {
  return request({
    url: "/wom/calendar/getWorkOrderCount",
    method: "post",
    data: data,
  });
};
// 加入故障案例库
export const addFaultCase = (data) => {
  return request({
    url: "/kdb/faultCase/add",
    method: "post",
    data: data,
  });
};
// 工单进度
export const getWorkOrderSchedule = (query) => {
  return request({
    url: "/workorder/getWomExecuteRecord",
    method: "get",
    params: query,
  });
};

// 加入故障案例库
export const checkWomInfo = (id) => {
  return request({
    url: "/wom/repair/checkWomInfo?id=" + id,
    method: "get",
  });
};
