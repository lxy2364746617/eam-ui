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
      smooth: true,
      data: this.datas[key].map((item) => item.count),
    });
  }
  series[0] = {
    ...series[0],
    // 为整个系列设置区域样式
    areaStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(50,142,255,0.3)" }, // 0% 处的颜色
          { offset: 1, color: "rgba(0,255,255,0)" }, // 100% 处的颜色
        ]),
      },
    },
  };
  myBarChart.setOption({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: legend,
      icon: "circle",
      //图例标记的图形高度
      itemHeight: 12,
      //图例标记的图形宽度
      itemWidth: 12,
      left: "left",
    },
    color: [
      "rgba(50, 142, 255, 1)",
      "rgba(255, 138, 101, 1)",
      "rgba(80, 15, 221, 1)",
      "rgba(25, 149, 77, 1)",
    ],
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
      axisLabel: {
        shadowColor: "rgba(0, 0, 0, 0.02)",
        shadowBlur: 2,
        shadowOffsetX: 0,
        shadowOffsetY: 3,
      },
      splitLine: {
        // 将y轴的网格线设置为虚线，并添加阴影
        lineStyle: {
          type: "dashed",
          shadowColor: "rgba(0, 0, 0, 0.02)",
          shadowBlur: 2,
          shadowOffsetX: 0,
          shadowOffsetY: 3,
        },
      },
    },
    series: series,
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
