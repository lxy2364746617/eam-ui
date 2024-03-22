import * as echarts from "echarts";

export function chartOption() {
  const myBarChart = echarts.init(this.$refs.chart);
  let x = [];
  let legend = [];
  let series = [];
  for (const key in this.datas) {
    // legend.push(key + "工单");
    legend.push(key);
    x = this.datas[key].map((item) => item.date);
    series.push({
      // name: key + "工单",
      name: key,
      type: "line",
      stack: "Total",
      symbol: "none",
      data: this.datas[key].map((item) => item.count),
    });
  }
  myBarChart.setOption({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: legend,
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: x,
    },
    yAxis: {
      type: "value",
    },
    series: series,
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
