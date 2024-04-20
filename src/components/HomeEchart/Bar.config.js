import * as echarts from "echarts";

export function chartOption() {
  let list = JSON.parse(JSON.stringify(this.datas));
  let nameArray = [];
  let data = [];
  // if (list.stateList) {
  data = list?.stateList?.map((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    nameArray.push(key + "\t\t\t" + value);
    return {
      name: key + "\t\t\t" + value,
      value,
      itemStyle: { borderWidth: 2 },
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
    },
    title: {
      text: "总数量" + "\n\n" + list.total,
      subtext: list.stateList && "今日新增" + list.today,
      left: "40%",
      top: "32%",
      textAlign: "center",
      textStyle: {
        color: "#686D81",
        fontSize: 18,
      },
      subtextStyle: {
        fontSize: 14,
        color: "#000",
      },
    },
    legend: [
      {
        orient: "vertical",
        data: nameArray,
        icon: "rect",
        left: "right",
        top: "center",
        align: "left",
        itemGap: 10,

        //图例标记的图形高度
        itemHeight: 12,
        //图例标记的图形宽度
        itemWidth: 12,
      },
    ],
    series: [
      {
        name: "",
        type: "pie",
        clockwise: false,
        radius: ["68%", "90%"],
        width: "100%",
        height: "90%",
        emphasis: {
          scale: false,
        },
        avoidLabelOverlap: true,
        center: ["41%", "50%"],
        top: "center",
        itemStyle: {
          normal: {
            borderColor: "#fff",
            shadowColor: "#fff",
          },
        },
        label: {
          show: true,
          position: "inside",
          color: "#666",
          formatter: function (params) {
            return params.percent ? params.percent : 0 + "%";
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
