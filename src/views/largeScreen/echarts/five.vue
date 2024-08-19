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
import "echarts-gl";
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
      const colorList = [
        "rgba(69, 244, 245,  0.9)",
        "rgba(7, 166, 255,  0.9)",
        "rgba(255, 208, 118,  0.9)",
        "rgba(109, 148, 198, 0.9)",
        "rgba(255, 255, 255,  0.9)",
      ];

      // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
      function getParametricEquation(
        startRatio,
        endRatio,
        isSelected,
        isHovered,
        k,
        h
      ) {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;

        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;

        // 如果只有一个扇形，则不实现选中效果。
        // if (startRatio === 0 && endRatio === 1) {
        //     isSelected = false;
        // }
        isSelected = false;
        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== "undefined" ? k : 1 / 3;

        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.sin(midRadian) * 0.1 : 0;
        let offsetY = isSelected ? Math.cos(midRadian) * 0.1 : 0;

        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;

        // 返回曲面参数方程
        return {
          u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32,
          },

          v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
          },

          x: function (u, v) {
            if (u < startRadian) {
              return (
                offsetX +
                Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            if (u > endRadian) {
              return (
                offsetX +
                Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
          },

          y: function (u, v) {
            if (u < startRadian) {
              return (
                offsetY +
                Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            if (u > endRadian) {
              return (
                offsetY +
                Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
          },

          z: function (u, v) {
            if (u < -Math.PI * 0.5) {
              return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
              return Math.sin(u) * h * 0.1;
            }
            return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
          },
        };
      }

      // 生成模拟 3D 饼图的配置项
      function getPie3D(pieData, internalDiameterRatio) {
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let k =
          typeof internalDiameterRatio !== "undefined"
            ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
            : 1 / 3;

        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
          sumValue += pieData[i].value;

          let seriesItem = {
            name:
              typeof pieData[i].name === "undefined"
                ? `series${i}`
                : pieData[i].name,
            type: "surface",
            parametric: true,
            wireframe: {
              show: false,
            },
            pieData: pieData[i],
            pieStatus: {
              selected: false,
              hovered: false,
              k: 1 / 10,
            },
          };

          if (typeof pieData[i].itemStyle != "undefined") {
            let itemStyle = {};

            typeof pieData[i].itemStyle.color != "undefined"
              ? (itemStyle.color = pieData[i].itemStyle.color)
              : null;
            typeof pieData[i].itemStyle.opacity != "undefined"
              ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
              : null;

            seriesItem.itemStyle = itemStyle;
          }
          series.push(seriesItem);
        }

        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        for (let i = 0; i < series.length; i++) {
          endValue = startValue + series[i].pieData.value;

          series[i].pieData.startRatio = startValue / sumValue;
          series[i].pieData.endRatio = endValue / sumValue;
          series[i].parametricEquation = getParametricEquation(
            series[i].pieData.startRatio,
            series[i].pieData.endRatio,
            false,
            false,
            k,
            series[i].pieData.value
          );

          startValue = endValue;

          legendData.push(series[i].name);
        }

        // // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        series.push({
          name: "mouseoutSeries",
          type: "surface",
          parametric: true,
          wireframe: {
            show: false,
          },
          itemStyle: {
            opacity: 0.1,
            color: "#E1E8EC",
          },
          parametricEquation: {
            u: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20,
            },
            v: {
              min: 0,
              max: Math.PI,
              step: Math.PI / 20,
            },
            x: function (u, v) {
              return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2;
            },
            y: function (u, v) {
              return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2;
            },
            z: function (u, v) {
              return Math.cos(v) > 0 ? -0.5 : -5;
            },
          },
        });

        // // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        series.push({
          name: "mouseoutSeries",
          type: "surface",
          parametric: true,
          wireframe: {
            show: false,
          },
          itemStyle: {
            opacity: 0.1,
            color: "rgba(101, 153, 164, 0.24)",
          },
          parametricEquation: {
            u: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20,
            },
            v: {
              min: 0,
              max: Math.PI,
              step: Math.PI / 20,
            },
            x: function (u, v) {
              return ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2;
            },
            y: function (u, v) {
              return ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2;
            },
            z: function (u, v) {
              return Math.cos(v) > 0 ? -5 : -7;
            },
          },
        });
        series.push({
          name: "mouseoutSeries",
          type: "surface",

          parametric: true,
          wireframe: {
            show: false,
          },
          itemStyle: {
            opacity: 0.1,
            color: "#E1E8EC",
          },
          parametricEquation: {
            u: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20,
            },
            v: {
              min: 0,
              max: Math.PI,
              step: Math.PI / 20,
            },
            x: function (u, v) {
              return (
                ((Math.sin(v) * Math.sin(u) + Math.sin(u)) / Math.PI) * 2.2
              );
            },
            y: function (u, v) {
              return (
                ((Math.sin(v) * Math.cos(u) + Math.cos(u)) / Math.PI) * 2.2
              );
            },
            z: function (u, v) {
              return Math.cos(v) > 0 ? -7 : -7;
            },
          },
        });

        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        let option = {
          // animation: false,
          // animation: false,
          fontFamily: "Source Han Sans CN",
          legend: [
            {
              icon: "none",
              orient: "vertical",
              data: pieData
                .map((dItem, dIndex) => {
                  return {
                    ...dItem,
                    textStyle: {
                      rich: {
                        iconName: {
                          width: 4,
                          height: 4,
                          borderRadius: 5,
                          borderWidth: 5,
                          borderColor: colorList[dIndex],
                          backgroundColor: colorList[dIndex],
                        },
                        name: {
                          color: colorList[dIndex],
                          fontSize: 14,
                        },
                        c: {
                          color: colorList[dIndex],
                        },
                      },
                    },
                  };
                })
                .slice(2),
              right: "6%",
              top: "center",
              itemGap: 30,
              itemWidth: 10,
              itemHeight: 10,
              selectedMode: false, // 关闭图例选择
              textStyle: {
                color: "#fff",
                fontSize: 28,
                fontFamily: "Source Han Sans CN",
                rich: {
                  name: {
                    fontSize: 14,
                    fontFamily: "PuHuiTi",
                    width: 50,
                    padding: [0, 0, 0, 8],
                  },
                  value: {
                    color: "#fff",
                    fontFamily: "Manrope",
                    fontSize: 17,
                    width: 40,
                    padding: [8, 0, 0, 10],
                  },
                  c: {
                    fontSize: 14,
                    padding: [8, 0, 0, 0],
                  },
                },
              },
              formatter: (name) => {
                let obj = pieData.find((item) => item.name === name);
                let datas = pieData;
                let total = 0;
                let target = obj.value;
                for (let i = 0; i < datas.length; i++) {
                  total += Number(datas[i].value);
                }
                const arr = [
                  `{iconName|}{name|${name}\n}{value|${obj.value}}{c|/台}`,
                ];
                return arr.join("");
              },
            },
            {
              icon: "none",
              orient: "vertical",
              data: pieData
                .map((dItem, dIndex) => {
                  return {
                    ...dItem,
                    textStyle: {
                      rich: {
                        iconName: {
                          width: 4,
                          height: 4,
                          borderRadius: 5,
                          borderWidth: 5,
                          borderColor: colorList[dIndex],
                          backgroundColor: colorList[dIndex],
                        },
                        name: {
                          color: colorList[dIndex],
                        },
                        c: {
                          color: colorList[dIndex],
                        },
                      },
                    },
                  };
                })
                .slice(0, 2),
              left: "6%",
              top: "center",
              itemGap: 50,
              itemWidth: 10,
              itemHeight: 10,
              selectedMode: false, // 关闭图例选择
              textStyle: {
                color: "#fff",
                fontSize: 28,
                fontFamily: "Source Han Sans CN",
                rich: {
                  name: {
                    fontSize: 14,
                    fontFamily: "PuHuiTi",
                    width: 50,
                    padding: [0, 0, 0, 8],
                  },
                  value: {
                    color: "#fff",
                    fontFamily: "Manrope",
                    fontSize: 17,
                    width: 40,
                    padding: [8, 0, 0, 10],
                  },
                  c: {
                    fontSize: 14,
                    padding: [8, 0, 0, 0],
                  },
                },
              },
              formatter: (name) => {
                let obj = pieData.find((item) => item.name === name);
                let datas = pieData;
                let total = 0;
                let target = obj.value;
                for (let i = 0; i < datas.length; i++) {
                  total += Number(datas[i].value);
                }
                const arr = [
                  `{iconName|}{name|${name}\n}{value|${obj.value}}{c|/台}`,
                ];
                return arr.join("");
              },
            },
          ],

          xAxis3D: {},
          yAxis3D: {},
          zAxis3D: {},
          grid3D: {
            viewControl: {
              distance: 120,
              autoRotate: true, // 自动旋转
            },
            left: "0%",
            width: "100%",
            show: false,
            boxHeight: 60,
          },
          series: series,
        };
        return option;
      }

      const data = [
        {
          name: "5年以内",
          value: 852,
        },
        {
          name: "5-8年",
          value: 323,
        },
        {
          name: "8-10年",
          value: 289,
        },
        {
          name: "10年以上",
          value: 642,
        },
      ];
      const serData = data.map((dItem, index) => {
        return {
          ...dItem,
          value: Number(dItem.value),
          itemStyle: {
            color: colorList[index],
          },
        };
      });
      // 传入数据生成 option

      const myBarChart = echarts.init(this.$refs.chart);
      myBarChart.setOption({ ...getPie3D(serData, 0.7) });
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
