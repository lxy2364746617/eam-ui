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
      var charts = {
        unit: "%",
        names: ["西山", "华晋", "汾西", "山煤", "霍州"],
        lineX: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ],
        value: [
          [51, 52, 55, 60, 66, 60, 55, 50, 48, 47, 50, 31],
          [45, 49, 44, 48, 50, 46, 41, 48, 55, 52, 55, 36],
          [33, 32, 35, 34, 34, 33, 36, 31, 36, 33, 33, 57],
          [44, 52, 37, 54, 62, 59, 47, 60, 45, 42, 53, 52],
          [34, 42, 47, 44, 42, 49, 37, 50, 35, 52, 43, 42],
        ],
      };
      var color = [
        "rgba(237, 32, 10",
        "rgba(3, 112, 252",
        "rgba(254, 189, 55",
        "rgba(0, 245, 237",
        "rgba(178, 222, 255",
      ];
      var lineY = [];

      for (var i = 0; i < charts.names.length; i++) {
        var x = i;
        if (x > color.length - 1) {
          x = color.length - 1;
        }
        var data = {
          name: charts.names[i],
          type: "line",
          //  stack: '总量',
          color: color[x] + ")",
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: color[x] + ", 0.3)",
                  },
                  {
                    offset: 0.8,
                    color: color[x] + ", 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10,
            },
          },
          symbol: "circle",
          symbolSize: 0,
          data: charts.value[x],
          // 添加 lineStyle 属性
          lineStyle: {
            width: 1, // 设置线的粗细
          },
        };
        lineY.push(data);
      }
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
        legend: {
          data: charts.names,
          itemGap: 30,
          textStyle: {
            fontSize: 12,
            fontWeight: "200",
            color: "#E6F7FF",
            padding: [0, 0, 0, 8],
          },
          //right: 'center',

          // 设置为 single
          icon: "rect",
          align: "left",
          itemWidth: 15,
          itemHeight: 3,
        },
        grid: {
          top: "16%",
          left: "4%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: charts.lineX,
          splitLine: {
            lineStyle: {
              color: "rgb(183, 183, 183)",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#BAE7FF",
            },
          },
          axisLabel: {
            textStyle: {
              color: "rgba(230, 247, 255, 0.70)",
            },
            formatter: function (params) {
              return params;
            },
          },
        },
        yAxis: {
          name: charts.unit,
          type: "value",
          min: 0,
          max: 100,
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "rgba(230, 247, 255, 0.70)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(183, 183, 183,0.3)",
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(230, 247, 255, 0.70)",
            },
          },
        },
        series: lineY,
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
