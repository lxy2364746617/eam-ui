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
      var data = [
        {
          name: "解决问题能力",
          value: 70,
        },
        {
          name: "结果导向",
          value: 90,
        },
        {
          name: "学习能力",
          value: 80,
        },
        {
          name: "产品思维",
          value: 85,
        },
        {
          name: "沟通协调",
          value: 70,
        },
      ];

      let dataArr = [];
      data.forEach((item) => {
        dataArr.push(item.value);
      });
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
        title: {
          top: "48%",
          bottom: "center",
          left: "center",
        },
        radar: {
          center: ["50%", "55%"],
          radius: "60%",
          splitNumber: 5,
          name: {
            textStyle: {
              color: "#fff",
              fontFamily: "PuHuiTi",
              fontSize: 14,
            },
          },
          nameGap: 25,
          indicator: [
            {
              name: "工单数量",
              max: 100,
              value: 70,
            },
            {
              name: "工单故障率",
              max: 100,
              value: 90,
            },
            {
              name: "工单完成率",
              max: 100,
              value: 80,
            },
            {
              name: "工单质量",
              max: 100,
              value: 85,
            },
            {
              name: "工单时效性",
              max: 100,
              value: 70,
            },
          ],
          // 圈圈网颜色
          splitLine: {
            show: true,
            lineStyle: {
              color: [
                "rgba(108, 254, 255, 0)",
                "rgba(0, 0, 0, .2)",
                "rgba(0, 0, 0, .3)",
                "rgba(0, 0, 0, .4)",
                "rgba(0, 0, 0, .5)",
              ],
              width: "1",
            },
          },
          splitArea: {
            areaStyle: {
              color: "rgba(119, 140, 162, 0.14)",
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(59, 156, 243, 0.8)",
            },
            symbolSize: [15, 20],
            symbol: ["none", "arrow"],
            symbolOffset: [0, 20],
          },
        },
        series: [
          {
            name: "",
            type: "radar",
            symbol: "circle",
            symbolSize: "8",
            label: {
              show: false,
              // 让它的点没有显示格式
              formatter: "",
              color: "#fff",
              fontStyle: {
                fontSize: 33,
              },
            },
            data: [
              {
                value: dataArr,
                name: "健康态势",
                lineStyle: {
                  //网调线
                  color: "rgba(59, 156, 243, 1)",
                  color: "rgba(59, 156, 243, .4)",
                  background:
                    "radial-gradient(circle, rgba(59, 156, 243, 0) 0%, rgba(59, 156, 243, 0.4) 100%)",
                },
                symbolSize: 5, //圆圈大小
                itemStyle: {
                  //调点的样式
                  show: true,
                  color: "rgba(108, 254, 255, .4)",
                  // shadowColor: 'rgba(108, 254, 255, 1)',
                  // shadowBlur: 10,
                  fontSize: 28,
                },
                areaStyle: {
                  // 内网颜色
                  normal: {
                    color: {
                      type: "radial",
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(108, 254, 255, 0)",
                        },
                        {
                          offset: 1,
                          color: "rgba(56, 148, 255, 0.4)",
                        },
                      ],
                      globalCoord: false,
                    },
                    opacity: 1,
                  },
                },
              },
            ],
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
