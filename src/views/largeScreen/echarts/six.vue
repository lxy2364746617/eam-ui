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
      let xData = ["一月", "二月", "三月", "四月", "五月", "六月"].reverse();
      let data1 = ["24", "23", "43", "13", "42", "53"];
      let data2 = ["54", "73", "32", "53", "41", "15"];
      const myBarChart = echarts.init(this.$refs.chart);
      myBarChart.setOption({
        timeline: {
          show: false,
          top: 0,
          data: [],
        },
        tooltip: {
          trigger: "axis",

          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderColor: "transparent",
          textStyle: {
            color: "#fff",
            fontFamily: "PuHuiTi",
            fontSize: "14",
          },
        },

        legend: {
          show: true,
          top: "0%",
          textStyle: {
            color: "#BAE7FF",
            fontSize: 12,
          },
          data: ["缺货数量", "过剩数量"],
        },
        grid: [
          // 左边柱子
          {
            show: false,
            left: "10%",
            top: "10%",
            bottom: "20",
            containLabel: true,
            width: "33%",
          },
          // 中间
          {
            show: false,
            left: "52%",
            top: "11%",
            bottom: "38",
            width: "0%",
          },
          // 右边柱子
          {
            show: false,
            right: "10%",
            top: "10%",
            bottom: "20",
            containLabel: true,
            width: "33%",
          },
        ],
        xAxis: [
          {
            type: "value",
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: "bottom",
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(230, 247, 255, 0.70)",
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            show: false,
          },
          {
            gridIndex: 2,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: "bottom",
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(230, 247, 255, 0.70)",
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            inverse: true,
            position: "right",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: xData,
          },
          {
            gridIndex: 1,
            type: "category",
            inverse: true,
            position: "center",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              align: "center",
              color: "rgba(230, 247, 255, 0.70)",
              fontSize: 12,
            },
            data: xData,
          },
          {
            gridIndex: 2,
            type: "category",
            inverse: true,
            position: "left",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: xData,
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,

            showBackground: true,
            tooltip: {
              show: false,
            },

            type: "pictorialBar",
            barWidth: "60%",
            silent: true,
            symbol: "rect",
            symbolRepeat: true,
            symbolMargin: 1.5,
            symbolSize: [6, 15],
            itemStyle: {
              color: "rgba(233, 75, 49, .4)",
            },

            data: data1.map(() => 1000),
          },
          {
            name: "缺货数量",
            type: "pictorialBar",
            animation: true,
            animationDuration: 600,
            symbol: "rect",
            symbolRepeat: true,
            symbolSize: [6, 15],
            symbolMargin: 1.5,
            barWidth: "60%",
            itemStyle: {
              normal: {
                color: "rgba(233, 75, 49, 1)",
                label: {
                  show: false,
                },
              },
            },
            data: [900, 520, 700, 834, 790, 830].reverse(),
          },
          {
            //框

            type: "bar",
            barWidth: 18,

            barGap: "-120%",

            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)", //底色
                borderWidth: 2,
                borderColor: "#6B7C94",
              },
            },
            data: data1.map(() => 1000),
            z: 2,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,

            showBackground: true,
            tooltip: {
              show: false,
            },

            type: "pictorialBar",
            barWidth: "60%",
            silent: true,
            symbol: "rect",
            symbolRepeat: true,
            symbolMargin: 1.5,
            symbolSize: [6, 15],
            itemStyle: {
              color: "rgba(3, 112, 252, .4)",
            },

            data: data1.map(() => 1000),
          },
          {
            name: "过剩数量",
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "pictorialBar",
            animation: true,
            animationDuration: 600,
            symbol: "rect",
            symbolRepeat: true,
            symbolSize: [6, 15],
            symbolMargin: 1.5,
            barWidth: "60%",
            itemStyle: {
              normal: {
                color: "rgba(3, 112, 252, 1)",
                label: {
                  show: false,
                },
              },
            },
            data: [900, 520, 700, 834, 790, 830],
          },
          {
            //框
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            barWidth: 18,

            barGap: "-120%",

            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)", //底色
                borderWidth: 2,
                borderColor: "#6B7C94",
              },
            },
            data: data1.map(() => 1000),
            z: 2,
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
