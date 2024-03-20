import * as echarts from "echarts";

export function chartOption() {
  const myBarChart = echarts.init(this.$refs.chart);
  console.log("========================this.datas", this.datas);
  myBarChart.setOption({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["巡点捡工单", "保养检修工单", "定期检验工单", "维修工单"],
    },
    grid: {
      left: "1%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "巡点捡工单",
        type: "line",
        stack: "Total",
        symbol: "none",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "保养检修工单",
        type: "line",
        stack: "Total",
        symbol: "none",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "定期检验工单",
        type: "line",
        stack: "Total",
        symbol: "none",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "维修工单",
        type: "line",
        stack: "Total",
        symbol: "none",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
    ],
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
