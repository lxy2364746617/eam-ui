import * as echarts from "echarts";

export function chartOption() {
  const myBarChart = echarts.init(this.$refs.chart);
  myBarChart.setOption({
    backgroundColor: "#fff",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["再用", "维修", "备用", "待报废", "闲置"],
      x: "center",
      y: "bottom",

      textStyle: {
        color: "#000",
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 35,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: [
          "液压支架",
          "刮板输送机",
          "转载机",
          "破碎机",
          "采煤机",
          "掘进机",
        ],
        axisLine: {
          show: true,
          lineStyle: {
            color: "#000",
            width: 1,
            type: "solid",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#000",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",

        name: this.datas.title,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#000",
            width: 1,
            type: "solid",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#999",
          },
        },
      },
    ],
    series: this.datas.data.map((item, index) => {
      let title = "";
      let color = "";
      switch (index) {
        case 0:
          title = "再用";
          color = "#135FF0";
          break;
        case 1:
          title = "维修";
          color = "#66C092";
          break;
        case 2:
          title = "备用";
          color = "#E7B45F";

          break;
        case 3:
          title = "待报废";
          color = "#E75F60";
          break;
        case 4:
          title = "闲置";
          color = "#7960E8";
          break;
        default:
          break;
      }
      return {
        name: title,
        type: "bar",
        data: item.data,
        label: {
          show: true,
          position: "top",
          fontSize: 12,
        },
        itemStyle: {
          normal: {
            color: color,
          },
        },
      };
    }),
  });
  window.addEventListener("resize", function () {});
  return myBarChart;
}
