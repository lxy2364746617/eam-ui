import * as echarts from "echarts";

export function chartOption() {
  let list = JSON.parse(JSON.stringify(this.datas));
  let nameArray = [];
  let data = [];
  // if (list.stateList) {
  data = list?.stateList?.map((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    nameArray.push(key + "\t\t\t\t\t\t\t\t\t" + "{a|" + value + "条}");
    return {
      name: key + "\t\t\t\t\t\t\t\t\t" + "{a|" + value + "  条}",
      label: key,
      value,
      itemStyle: { borderWidth: 0 },
    };
  });

  // } else if (list.womStatusCount) {
  //   data = list?.womStatusCount?.map((item) => {
  //     nameArray.push(item.ORDERSTATUS + "\t\t\t" + item.COUNT + "个");
  //     return {
  //       name: item.ORDERSTATUS + "\t\t\t" + item.COUNT + "个",
  //       value: item.COUNT,
  //       itemStyle: { borderWidth: 2 },
  //     };
  //   });
  //   list["total"] = list?.womStatusCount?.reduce(
  //     (sum, item) => sum + item.COUNT,
  //     0
  //   );
  // }
  const myBarChart = echarts.init(this.$refs.chart);
  myBarChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // params 包含当前鼠标悬停的数据项信息
        const { seriesName, name, value, percent, data } = params;
        return `${data.label} : ${value} (${percent ? percent : 0}%)`;
      },
      textStyle: {
        rich: {
          a: {
            color: "#686D81",
            fontSize: 16,
            fontWeight: 700,
          },
        },
      },
    },
    color: [
      "#0293FD",
      "#06DCFD",
      "#FFE300",
      "#FFB600",
      "#FF9800",
      "#FF7900",
      "#FF6A00",
    ],
    title: {
      text: `{a|${list.title}总数量}\n\n{b|${list.total}}\n\n{c|今日新增${list.today}条}`,
      left: "35%",
      top: "32%",
      textAlign: "center",
      textStyle: {
        rich: {
          a: {
            color: "#55566D",
            fontSize: 16,
            fontWeight: 500,
          },
          b: {
            color: "#55566D",
            fontSize: 26,
            // padding: [3, 10, 5, 1],
            fontWeight: 700,
            lineHeight: 6,
            // textShadowColor: "#6eb5f2",
          },
          c: {
            padding: [14, 0, 0, 0],
            color: "#55566D",
            fontSize: 16,
            fontWeight: 500,
          },
        },
      },
    },
    legend: [
      {
        orient: "vertical",
        // data: nameArray,
        icon: "circle",
        left: "right",
        top: "center",
        align: "left",
        selectedMode: false,

        right: 10,
        bottom: 20,
        itemGap: 10,

        //图例标记的图形高度
        itemHeight: 12,
        //图例标记的图形宽度
        itemWidth: 12,
        formatter: (name) => {
          return name;
        },
        textStyle: {
          color: "#9599A7",
          rich: {
            a: {
              color: "#686D81",
              fontSize: 16,
              fontWeight: 600,
            },
          },
        },
      },
    ],
    series: [
      {
        name: "",
        type: "pie",
        clockwise: false,
        radius: ["69%", "100%"],
        width: "100%",
        height: "90%",
        emphasis: {
          scale: false,
        },
        avoidLabelOverlap: true,
        center: ["36%", "50%"],
        top: "center",
        fontFamily: "serif",
        itemStyle: {
          normal: {
            borderColor: "#fff",
            shadowColor: "#fff",
          },
        },
        label: {
          show: true,
          position: "inner",
          // rotate: "tangential",
          formatter: function (params) {
            return `{a|${params.percent ? params.percent + "%" : 0 + "%"}}`;
          },
          textStyle: {
            rich: {
              a: {
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                textShadowColor: "rgb(0,0,0,0.5)",
                textShadowBlur: 2,
                textShadowOffsetY: 2,
                fontFamily: "DINPro-Bold",
              },
            },
          },
        },
        data: data,
      },
    ],
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
