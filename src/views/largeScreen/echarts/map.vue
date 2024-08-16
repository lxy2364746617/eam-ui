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
import shanxi from "./shanxi.json";
import "echarts-gl";
import tiezhi1 from "@/assets/images/largeScreen/tiezhi.png";
import tiezhi2 from "@/assets/images/largeScreen/tiezhi2.png";
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
    abc() {},

    initChart() {
      const myChart = echarts.init(this.$refs.chart);
      echarts.registerMap("shanxi", shanxi);
      const viewControl = {
        distance: 200,
        center: [-2, -5, 10],
      };
      let geoCoordMap = {
        长治市: [113.113556, 36.191112],
        运城市: [111.003957, 35.022778],
        临汾市: [111.517973, 36.08415],
        吕梁市: [111.134335, 37.524366],
        阳泉市: [113.583285, 37.861188],
        忻州市: [112.733538, 38.41769],
        晋城市: [112.851274, 35.497553],
        大同市: [113.295259, 40.09031],
      };
      var alirl = [
        { name: "长治市", value: { 数量: 42 } },
        { name: "运城市", value: { 数量: 40 } },
        { name: "临汾市", value: { 数量: 60 } },
        { name: "吕梁市", value: { 数量: 80 } },
        { name: "阳泉市", value: { 数量: 120 } },
        { name: "忻州市", value: { 数量: 20 } },
        { name: "晋城市", value: { 数量: 30 } },
        { name: "大同市", value: { 数量: 50 } },
      ];
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }
        return res;
      };
      const mapSerie = {
        map: "shanxi",
        show: true,
        type: "map3D",
        regionHeight: 4,
        zlevel: 2,
        viewControl: viewControl,
        lambertMaterial: {
          detailTexture: tiezhi1,
        },
        itemStyle: {
          color: "#539efe",
          borderWidth: 3,
          borderColor: "#ADDCFF",
        },
        label: {
          show: true,
          fontSize: 16,
          color: "#f9fcff",
          fontWeight: 600,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            color: "#f9fcff",
            fontWeight: 600,
          },
          itemStyle: {
            color: "#ADDCFF",
            borderWidth: 5,
            borderColor: "#ADDCFF",
          },
        },
      };

      let option = {
        tooltip: {
          trigger: "axis",
        },

        geo3D: [
          mapSerie,
          {
            ...mapSerie,
            zlevel: 1,
            regionHeight: 12,
            itemStyle: {
              opacity: 0.7,
            },
            lambertMaterial: {
              detailTexture: tiezhi2,
              textureTiling: 10,
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                opacity: 0.7,
              },
            },
            viewControl: {
              ...viewControl,
              center: [-2, 7, 10],
            },
          },
        ],

        series: [
          {
            name: "shanxi",
            type: "lines3D",
            coordinateSystem: "geo3D",
            effect: {
              // 尾迹线(动画线)
              show: true,
              trailWidth: 4, // 宽度
              trailOpacity: 1, // 透明度
              trailLength: 0.5, // 尾迹线长度
              constantSpeed: 15, // 速度
              period: 4, // 箭头指向速度，值越小速度越快
            },
            blendMode: "lighter",
            lineStyle: {
              // 参考线
              color: "#00F4C8",
              width: 4,
              opacity: 0.1,
            },
            z: 3,
            data: [
              [
                [112.549248, 37.857014],
                [113.113556, 36.191112],
              ],
              [
                [112.549248, 37.857014],
                [111.003957, 35.022778],
              ],
              [
                [112.549248, 37.857014],
                [111.517973, 36.08415],
              ],
              [
                [112.549248, 37.857014],
                [111.134335, 37.524366],
              ],
              [
                [112.549248, 37.857014],
                [113.583285, 37.861188],
              ],
              [
                [112.549248, 37.857014],
                [112.672399, 39.13224],
              ],
              [
                [112.549248, 37.857014],
                [112.851274, 35.497553],
              ],
              [
                [112.549248, 37.857014],
                [113.295259, 40.09031],
              ],
            ],
          },
          {
            name: "shanxi",
            type: "scatter3D",
            coordinateSystem: "geo3D",
            symbol: "rect",
            symbolSize: [5, 120],
            opacity: 1,
            position: "top",
            zlevel: 20,
            label: {
              position: "center",
              show: true,
              formatter: function (res) {
                return res.value[2]["数量"];
              },
              textStyle: {
                color: "#FFF",
                fontSize: 20,
                backgroundColor: "transparent",
              },
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     position: "center",
            //     backgroundColor: "red",
            //     textStyle: {
            //       color: "#fff",
            //       fontSize: 20,
            //       backgroundColor: "(0,0,0,.8)",
            //     },
            //     formatter: function (res) {
            //       return "\n" + res.name + "   :" + res.value[2]["数量"];
            //     },
            //   },
            // },
            data: convertData(alirl).map((it) => {
              return {
                // 数组新增2，代表z轴距离
                name: it.name,
                value: [it.value[0], it.value[1], it.value[2]],
                itemStyle: {
                  normal: {
                    color: "#FEFF27", // 如果想颜色不一样 就换成这个，并且 在上面color数组中修改，添加想要的颜色，--colorF()
                    areaColor: "#FEFF27",
                  },
                },
              };
            }),
          },
        ],
      };

      myChart.setOption(option, true);

      window.addEventListener("resize", function () {
        myChart.resize();
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
