<template>
  <div style="width: 100%; height: 100%">
    <div ref="chart" style="width: 100%; height: 100%"></div>
    <!-- <div
      v-else
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      "
    >
      <div
        :style="{
          backgroundImage: `url(${img})`,
          width: '178px',
          height: '143px',
          backgroundSize: 'cover',
        }"
      ></div>
      <p>暂无数据</p>
    </div> -->
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: ["data"],
  data() {
    return {
      img: require("@/assets/images/shouye/notData.png"),
      chart: null, // 用来获取实例
      mySetionChart: null, // 改变指向
      datas: this.data, // 数据
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const myBarChart = echarts.init(this.$refs.chart);
      myBarChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["需求设备数量之和", "入库设备数量之和"],
          icon: "circle",
          //图例标记的图形高度
          itemHeight: 12,
          //图例标记的图形宽度
          itemWidth: 12,
          left: "3%",
        },
        color: [this.data.color1, this.data.color2],
        grid: {
          bottom: "12%",
          left: "6%",
          right: "6%",
        },
        xAxis: {
          type: "category",
          data: this.data.xData,

          axisLabel: {
            interval: 0, // 尝试显示所有标签
            overflow: "truncate", // 控制溢出行为
            width: 80,
            ellipsis: "...", // 截断方式
            textStyle: {
              fontSize: 10, // 减小字体大小
            },
            color: "#55566D",
          },
          triggerEvent: true,
        },
        yAxis: {
          type: "value",
          min: 0,

          axisLabel: {
            color: "#999",
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
          axisTick: {
            inside: false,
            alignWithLabel: true,
          },
          splitNumber: 7,
        },
        series: [
          {
            name: "需求设备数量之和",
            data: this.data.series1,
            barWidth: 10,
            type: "bar",
            itemStyle: {
              normal: {
                color: this.data.color1,
                barBorderRadius: [50, 50, 50, 50],
              },
            },
          },
          {
            name: "入库设备数量之和",
            data: this.data.series2,
            barWidth: 10,
            type: "bar",
            itemStyle: {
              normal: {
                color: this.data.color2,
                barBorderRadius: [50, 50, 50, 50],
              },
            },
          },
        ],
      });
      window.addEventListener("resize", function () {
        myBarChart.resize();
      });
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.mySetionChart.resize();
    });
  },
};
</script>

<style scoped></style>
