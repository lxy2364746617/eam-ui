import * as echarts from "echarts";

export function chartOption() {
  let list = JSON.parse(JSON.stringify(this.datas));

  // 确保 this.datas 是一个有效的对象
  if (!list || !Array.isArray(list.stateList)) {
    console.error("Invalid data provided for chart.");
    return; // 或者返回一个默认的图表配置
  }
  let dataList = [];
  // let nameList = ["待派工", "待执行", "执行中", "待验收", "已完成", "已关闭"];
  let nameList = [];
  list?.stateList?.forEach(function (item) {
    for (const key in item) {
      dataList.push(item[key]);
      nameList.push(key + "," + item[key]);
    }
  });
  let colorList = [
    "#328EFF",
    "#32A9FF",
    "#F87A02",
    "#F99902",
    "#FFBF78",
    "#FDE502",
  ];
  let lengthList = [];
  nameList.forEach(function (item) {
    lengthList.push({ name: item.toString(), icon: "circle" });
  });
  let totalNum = dataList.reduce((prev, curr) => {
    return prev + curr;
  });
  let seriesList = [];
  let valList = [];
  seriesList.push({
    name: "abc",
    type: "bar",
    data: [list?.total],
    stack: "one",
    coordinateSystem: "polar",
    roundCap: true,
    zlevel: 20,
    itemStyle: {
      normal: {
        color: "#F7F7F7",
        borderWidth: 2,
        // borderColor: colorList[index],
      },
    },
  });
  dataList.forEach(function (item, index) {
    let obj = {
      value: parseInt((item / list?.total) * 10000) / 100,
      value2: item,
    };
    seriesList.push({
      name: nameList[index],
      type: "bar",
      data: [obj],
      stack: "one",
      coordinateSystem: "polar",
      roundCap: true,
      zlevel: 20,
      itemStyle: {
        normal: {
          color: colorList[index],
          borderWidth: 2,
          // borderColor: colorList[index],
        },
      },
    });
  });
  let center = ["25%", "50%"];
  let radius1 = ["50%", "72%"];
  let radius2 = ["0%", "38%"];
  let titleX = "24%";
  let titleY = "35%";
  let titleSize = 28;
  let legendBottom = "0%";
  seriesList.push({
    name: "外层背景",
    type: "pie",
    radius: radius2,
    silent: true,
    center: center,
    itemStyle: {
      normal: {
        opacity: 0,
        color: "#ffffff",
      },
    },
    label: {
      normal: {
        show: false,
      },
    },
    data: [
      {
        value: 0,
        name: "外层背景",
      },
    ],
  });
  const myBarChart = echarts.init(this.$refs.chart);
  myBarChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        if (params.seriesName === "abc") return;
        return (
          params.marker +
          " " +
          params.seriesName.split(",")[0] +
          "  " +
          params.seriesName.split(",")[1] +
          "  " +
          parseInt((params.seriesName.split(",")[1] / list?.total) * 10000) /
            100 +
          "%"
        );
      },
    },
    title: [
      {
        text: `{a|${list.title}总数量}\n\n{b|${list.total}}\n\n{c|今日新增${list.today}台}`,
        textStyle: {
          rich: {
            a: {
              color: "#AAB2BF",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "PingFang",
            },
            b: {
              color: "#55566D",
              fontSize: 18,
              padding: [5, 0, 0, 0],
              fontWeight: 700,
              lineHeight: 1,
              fontFamily: "DINPro-Medium",
              // textShadowColor: "#6eb5f2",
            },
            c: {
              padding: [5, 0, 0, 0],
              color: "#55566D",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "PingFang",
            },
          },
        },
        x: titleX,
        y: titleY,
        textAlign: "center",
      },
    ],
    legend: [
      {
        width: "52%",
        // height: "100%",
        x: "right",
        // orient: "vartical",
        top: "center",
        right: "4%",
        // bottom: "20%",
        data: lengthList,
        formatter: function (params) {
          return `{a|${params.split(",")[0]}}{c|${" "}}\n\n{b|${
            params.split(",")[1]
          }}`;
        },
        itemHeight: 10,
        itemWidth: 10,
        itemGap: 20,

        textStyle: {
          rich: {
            a: {
              color: "#AAB2BF",
              fontSize: 15,
              fontWeight: 500,
              padding: [30, 0, 0, 0],
            },
            b: {
              color: "#55566D",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "DINPro-Medium",
              // textShadowColor: "#6eb5f2",
            },
            // c: {
            //   padding: [0, 0, 0, 30],
            // },
          },
        },
      },
      // {
      //   width: "10%",
      //   x: "center",
      //   orient: "vartical",
      //   bottom: legendBottom,
      //   data: lengthList.slice(4),
      //   formatter: function (params) {
      //     return `{a|${params.split(",")[0]}}{c|${" "}}\n\n{b|${
      //       params.split(",")[1]
      //     }}`;
      //   },
      //   itemHeight: 10,
      //   itemWidth: 10,
      //   itemGap: 30,

      //   textStyle: {
      //     rich: {
      //       a: {
      //         color: "#AAB2BF",
      //         fontSize: 15,
      //         fontWeight: 500,
      //         padding: [30, 0, 0, 0],
      //       },
      //       b: {
      //         color: "#55566D",
      //         fontSize: 16,
      //         fontWeight: 700,
      //         // textShadowColor: "#6eb5f2",
      //       },
      //       // c: {
      //       //   padding: [0, 0, 0, 30],
      //       // },
      //     },
      //   },
      // },
    ],
    angleAxis: {
      max: 100,
      clockwise: true, // 逆时针
      show: false,
    },
    radiusAxis: {
      type: "category",
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    polar: {
      center: center,
      radius: radius1,
    },
    series: seriesList,
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
