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

  let center = ["50%", "31%"];
  let radius1 = ["42%", "60%"];
  let radius2 = ["0%", "38%"];
  let titleX = "48.8%";
  let titleY = "18%";
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
        text: `{a|${list.title}总数量}\n\n{b|${list.total}}\n{c|今日新增${list.today}条}`,
        textStyle: {
          rich: {
            a: {
              color: "#AAB2BF",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "DINPro-Medium",
            },
            b: {
              color: "#55566D",
              fontSize: 20,
              padding: [6, 0, 0, 0],
              fontWeight: 700,
              lineHeight: 1,
              fontFamily: "DINPro-Medium",
              // textShadowColor: "#6eb5f2",
            },
            c: {
              padding: [24, 0, 0, 0],
              color: "#55566D",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "DINPro-Medium",
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
        width: "100%",
        x: "center",
        bottom: "20%",
        data: lengthList.slice(0, 3),
        formatter: function (params) {
          return `{a|${params.split(",")[0]}}{c|${" "}}\n\n{b|${
            params.split(",")[1]
          }}`;
        },
        itemHeight: 10,
        itemWidth: 10,
        itemGap: 30,

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
              // textShadowColor: "#6eb5f2",
            },
            // c: {
            //   padding: [0, 0, 0, 30],
            // },
          },
        },
      },
      {
        width: "100%",
        x: "center",
        bottom: legendBottom,
        data: lengthList.slice(3),
        formatter: function (params) {
          return `{a|${params.split(",")[0]}}{c|${" "}}\n\n{b|${
            params.split(",")[1]
          }}`;
        },
        itemHeight: 10,
        itemWidth: 10,
        itemGap: 30,

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
              // textShadowColor: "#6eb5f2",
            },
            // c: {
            //   padding: [0, 0, 0, 30],
            // },
          },
        },
      },
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
