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
        grid: {
          bottom: "12%",
        },
        xAxis: {
          type: "category",
          data: this.data.xData,
          axisLabel: {
            interval: 0, // 尝试显示所有标签
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
          axisTick: {
            inside: false,
            alignWithLabel: true,
          },
          splitNumber: 7,
          name: this.data.name,
        },
        series: [
          {
            data: this.data.series,
            type: "bar",
            barWidth: 30,
            itemStyle: {
              normal: {
                color: this.data.color,
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
