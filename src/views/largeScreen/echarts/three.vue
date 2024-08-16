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

          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderColor: "transparent",
          textStyle: {
            color: "#fff",
            fontFamily: "PuHuiTi",
            fontSize: "14",
          },
        },
        legend: [
          {
            icon: "rect",
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
              color: "#C0E1FF",
              fontFamily: "PuHuiTi",
              fontSize: "14",
            },
            top: 5, //调整位置
            left: "15.5%", //调整位置
            data: [{ name: "应完成数量", icon: "rect" }], //rect为矩形
          },
          {
            icon: "rect",
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
              color: "#C0E1FF",
              fontFamily: "PuHuiTi",
              fontSize: "14",
            },
            top: 5, //调整位置
            left: "38%", //调整位置
            data: [{ name: "已完成数量", icon: "rect" }], //rect为矩形
          },
          {
            icon: "rect",
            itemWidth: 25,
            itemHeight: 2,
            textStyle: {
              color: "#C0E1FF",
              fontFamily: "PuHuiTi",
              fontSize: "14",
            },
            top: 5, //调整位置
            right: "15%", //调整位置
            data: [{ name: "完成率", icon: "rect" }], //rect为矩形
          },
        ],
        grid: {
          left: "3%",
          right: "3%",
          bottom: "1%",
          top: "22%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["西山", "华晋", "汾西", "山煤", "霍州"],
          axisLabel: {
            formatter: "{value}",
            color: "white", // 文本颜色
          },
          axisLine: {
            lineStyle: {
              color: "#BAE7FF",
            },
          },
          triggerEvent: true,
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              color: "rgba(230, 247, 255, 0.70)",
              fontFamily: "Microsoft YaHei",
              fontSize: 12,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(152, 212, 255, .3)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(152, 212, 255, .3)",
              },
            },
            name: "数量",
            nameTextStyle: {
              color: "rgba(230, 247, 255, 0.70)",
              fontWeight: 400,
              fontSize: 14,
            },
          },
          {
            splitLine: { show: false },
            type: "value",
            axisLabel: {
              show: true,
              color: "rgba(230, 247, 255, 0.70)",
              fontFamily: "Microsoft YaHei",
              fontSize: 12,
            },
            min: 0,
            max: 100,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(152, 212, 255, .0)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(152, 212, 255, .0)",
              },
            },
            name: "完成率",
            nameTextStyle: {
              color: "rgba(230, 247, 255, 0.70)",
              fontWeight: 400,
              fontSize: 14,
            },
          },
        ],
        series: [
          {
            name: "应完成数量",
            type: "bar",
            stack: "account",
            barMaxWidth: 18,
            showBackground: true,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(255,28,1,.8)",
                  },
                  {
                    offset: 1,
                    color: "rgb(255,28,1,.5)",
                  },
                ],
              },
            },
            data: [3200, 3020, 1200, 1000, 5400],
          },
          {
            name: "已完成数量",
            type: "bar",
            stack: "account",
            barMaxWidth: 18,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(3,111,248,.8)",
                },
                {
                  offset: 1,
                  color: "rgb(3,111,248,.2)",
                },
              ]),
            },
            data: [1200, 1020, 900, 1500, 1200, 1230],
          },

          {
            name: "完成率",
            type: "line",
            symbol: "circle",
            // smooth: true,
            yAxisIndex: 1,
            data: [50, 80, 80, 50, 20],
            itemStyle: {
              normal: {
                fontSize: 5,
                color: "#fff",
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
