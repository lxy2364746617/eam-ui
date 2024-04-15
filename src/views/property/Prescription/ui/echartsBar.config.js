import * as echarts from "echarts";

export function chartOption() {
  let chartData = JSON.parse(JSON.stringify(this.datas)).map((item) => {
    if (
      item.groupName == "A" ||
      item.groupName == "B" ||
      item.groupName == "C"
    ) {
      return {
        value: item.countNum,
        name: item.groupName + "级",
      };
    }
    return {
      value: item.countNum,
      name: item.groupName,
    };
  });
  // max
  let chartMax = chartData.reduce((per, cur) =>
    per.value > cur.value ? per : cur
  );
  const colorList = [
    "#115FEA",
    "#10EBE3",
    "#10A9EB",
    "#EB9C10",
    "#2E10EB",
    "#9B10EB",
  ];
  function getPosition(str) {
    switch (String(str).length) {
      case 1:
        return "24.5%";
      case 2:
        return "24%";
      case 3:
        return "23%";
      case 4:
        return "22%";
      case 5:
        return "21%";
      default:
        return "20%";
    }
  }

  const sum = JSON.parse(JSON.stringify(chartData)).reduce(
    (per, cur) => per + cur.value,
    0
  );
  const gap = (1 * sum) / 100;
  const pieData1 = [];
  const pieData2 = [];
  const gapData = {
    name: "",
    value: gap,
    itemStyle: {
      color: "transparent",
    },
  };
  for (let i = 0; i < chartData.length; i++) {
    // 第一圈数据
    pieData1.push({
      ...chartData[i],
      itemStyle: {
        borderRadius: 10,
      },
    });
    pieData1.push(gapData);

    // 第二圈数据
    pieData2.push({
      ...chartData[i],
      itemStyle: {
        color: colorList[i],
        opacity: 0.21,
      },
    });
    pieData2.push(gapData);
  }
  const myBarChart = echarts.init(this.$refs.chart);
  myBarChart.setOption({
    backgroundColor: "#fff",
    title: [
      {
        text: chartMax.name,
        x: getPosition(chartMax.name),
        y: "42%",
        textStyle: {
          fontSize: 12,
          fontWeight: "bolder",
          color: "#55566D",
        },
      },
      {
        text: chartMax.value ? chartMax.value + "个" : "",
        x: getPosition(chartMax.value),
        y: "49%",
        textStyle: {
          fontSize: 12,
          color: "#55566D",
        },
      },
    ],
    tooltip: {
      show: true,
      backgroundColor: "rgba(0, 0, 0,.8)",
      textStyle: {
        color: "#fff",
      },
    },
    legend: {
      show: true,
      right: "2%",
      top: "center",
      align: "left",
      itemGap: 10,
      // icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,

      // symbolKeepAspect: false,
      textStyle: {
        color: "#55566D",
        rich: {
          name: {
            verticalAlign: "right",
            align: "left",
            width: 120,
            fontSize: 12,
            color: "#55566D",
          },

          percent: {
            padding: [0, 0, 0, 8],
            color: "#55566D",
          },
        },
        borderWidth: 53, // 间距的宽度
      },
      formatter: (name) => {
        const item = chartData.find((i) => {
          return i.name === name;
        });
        const p = item.value;
        if (name) return "{name|" + name + "}" + "{percent|" + p + "}" + "个";
      },
    },
    grid: {
      top: 35,
      right: 30,
      bottom: 20,
      left: 30,
    },
    color: colorList,
    series: [
      {
        name: "",
        type: "pie",
        roundCap: true,
        radius: ["66%", "70%"],
        center: ["28%", "50%"],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: pieData1,
      },
      {
        type: "pie",
        radius: ["66%", "54%"],
        center: ["28%", "50%"],
        gap: 1.71,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        silent: true,
        data: pieData2,
      },
      {
        type: "pie",
        center: ["28%", "50%"],
        radius: [0, "45.6%"],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          color: "rgba(75, 126, 203,.1)",
        },
        silent: true,
        data: [
          {
            value: 100,
            name: "",
          },
        ],
      },
    ],
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
