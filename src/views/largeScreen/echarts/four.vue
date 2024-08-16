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
      var color = [
        ["rgb(254,198,97,1)", "rgb(254,198,97,.5)"],
        ["rgb(72,117,238,1)", "rgb(72,117,238,.5)"],
        ["rgb(115,209,202,1)", "rgb(115,209,202,.5)"],
        ["rgb(110,200,248,1)", "rgb(110,200,248,.5)"],
      ];
      var gradList = [
        new echarts.graphic.LinearGradient(
          1,
          0,
          0,
          1,
          [
            {
              offset: 0,
              color: color[0][0], // 0% 处的颜色，上
            },
            {
              offset: 1,
              color: color[0][1], // 100% 处的颜色，下
            },
          ],
          false
        ),

        new echarts.graphic.LinearGradient(
          0,
          0,
          0,
          1,
          [
            {
              offset: 0,
              color: color[1][0], // 0% 处的颜色，上
            },
            {
              offset: 1,
              color: color[1][1], // 100% 处的颜色，下
            },
          ],
          false
        ),

        new echarts.graphic.LinearGradient(
          0,
          1,
          1,
          1,
          [
            {
              offset: 0,
              color: color[2][0], // 0% 处的颜色，上
            },
            {
              offset: 1,
              color: color[2][1], // 100% 处的颜色，下
            },
          ],
          false
        ),
        new echarts.graphic.LinearGradient(
          0,
          1,
          1,
          1,
          [
            {
              offset: 0,
              color: color[3][0], // 0% 处的颜色，上
            },
            {
              offset: 1,
              color: color[3][1], // 100% 处的颜色，下
            },
          ],
          false
        ),
      ];
      const pieData = [
        { value: 450, name: "特种设备" },
        { value: 350, name: "关键设备" },
        { value: 350, name: "计量设备" },
        { value: 460, name: "常规设备" },
      ];

      const myBarChart = echarts.init(this.$refs.chart);
      myBarChart.setOption({
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderColor: "transparent",
          textStyle: {
            color: "#fff",
            fontFamily: "PuHuiTi",
            fontSize: "14",
          },
        },
        legend: {
          width: "100%",
          x: "65%",
          bottom: "center",
          orient: "vertical",
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 3,
          textStyle: {
            // lineHeight: 20,
            color: "auto",
            rich: {
              name: {
                fontSize: 14,
                fontFamily: "PuHuiTi",
              },
              unit: {
                fontSize: 14,
              },
              number: {
                fontFamily: "Manrope",
                fontSize: 14,
                padding: [0, 5, 0, 2],
                color: "#fff",
              },
            },
          },
          formatter: (params) => {
            var aim = pieData.find((item) => item.name == params);
            return `{name|${params}}{number| ${aim.value}}{unit|/台}`;
          },
        },
        series: [
          {
            name: "",
            startAngle: 30,
            type: "pie",
            clockwise: false, //true 顺势针 false 逆时针
            center: ["35%", "55%"],
            radius: ["69%", "55%"],
            // hoverAnimation: false,
            animation: false,
            avoidLabelOverlap: false,
            data: pieData,

            label: {
              show: true,
              position: "outside",
              formatter: "{a|{d}%}\n{hr|}",
              rich: {
                a: {
                  color: "#fff",
                  fontFamily: "Manrope",
                  fontSize: 12,
                  fontWeight: 600,
                },
              },
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 15,
              maxSurfaceAngle: 80,
              minTurnAngle: 100,
            },
            itemStyle: {
              color: (params) => gradList[params.dataIndex],
              borderColor: "#020726",
              borderWidth: 4,
            },
            emphasis: {
              disable: true, //是否关闭扇区高亮效果
              scale: false, //扇区是否缩放
              scaleSize: 0, //放大的尺寸，这里为了保证不放大扇区设置的，可要可不要
            },
          },
          {
            name: "",
            startAngle: 30,
            type: "pie",
            clockwise: false,
            center: ["35%", "55%"],
            radius: ["44%", "30%"],
            data: pieData,
            itemStyle: {
              color: (params) => gradList[params.dataIndex],
              borderColor: "#020726",
              borderWidth: 4,
            },
            label: {
              show: false,
            },
            emphasis: {
              disable: true, //是否关闭扇区高亮效果
              scale: false, //扇区是否缩放
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
