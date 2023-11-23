import * as echarts from "echarts";

export function chartOption() {
  let arrX = [];
  let arrY = [];
  JSON.parse(JSON.stringify(this.datas)).forEach((item) => {
    arrX.push(item.countNum);
    arrY.push(item.groupName);
  });
  const myBarChart = echarts.init(this.$refs.chart);
  myBarChart.setOption({
    backgroundColor: "#fff",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(0, 0, 0,.7)",

      textStyle: {
        color: "#fff",
      },
      // formatter: function (params) {
      //   var value = params[0].value;
      //   var tooltipContent = "Data : " + params[0].axisValueLabel + "<br/>";
      //   tooltipContent += "Value: " + value;
      //   return tooltipContent;
      // },
      formatter: function (params) {
        var value = params[0].value;
        var tooltipContent = params[0].axisValueLabel + "<br/>";
        tooltipContent += "设备: " + value + "台";
        return tooltipContent;
      },
      extraCssText: "box-shadow: 0 0 6px #2ADEFC inset;",
    },
    xAxis: {
      type: "category",
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#749DC0",
        },
      },
      axisLabel: {
        interval: 0, // 强制显示所有标签
        formatter: function (value) {
          // 在适当的位置插入换行符，这里是在字符数超过5的位置插入换行
          return value.replace(/(.{2})/g, "$1\n");
        },
        textStyle: {
          color: "#55566D",
          fontSize: 14,
        },
      },

      axisTick: {
        show: false,
      },
      data: arrY,
    },
    yAxis: [
      {
        inverse: false,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },

        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#55566D",
            fontSize: 16.25,
          },
        },
      },
    ],
    series: [
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [0, 0],
        symbolOffset: [0, 0],
        symbolPosition: "end",
        label: {
          normal: {
            show: true,
            position: "top",
            fontSize: 16,
            fontWeight: "bold",
            color: "#55566D",
          },
        },
        color: "#2DB1EF",
        data: arrX,
      },

      {
        type: "pictorialBar",
        itemStyle: {
          normal: {
            color: "#061348",
          },
        },
        symbol:
          "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAyCAYAAAAus5mQAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEJSURBVHgBzdlLCgIxEEXRintxnbbrFHQlEr2I2NK//OtdCISQwRlXmSn3iBeTDdw9RpPsi5MEznHvE0wpcNGm+ZMOcAVHGsANHPkDd3DkCzzAkR8wAUc+wEScPe06HpiBs3OYxgIzcVzHAQtwNAZYiKP+wAoc9QVW4qgfsAGO+gAb4ag9sCGO2gIb46gdsAOO2gA74age2BFHdcDOOCoHDsBRGXAQjvKBA3GUBxyMo3SgA47SgE44OgY64mgf6IyjbaAAjtaBIjhaAoVw9A8Uw9EPKIijD1AUR0EZRyFpku6Eo9PhD0cc7QOdcbQNFMDROlAER0ugEO7TbO1ktziZXNI4ksaRNM7sBbzLD6Enz0ClAAAAAElFTkSuQmCC",
        symbolRepeat: "auto",
        symbolMargin: -2.5,
        symbolSize: [12, 10],
        symbolPosition: "start",
        symbolBoundingData: 60,
        symbolClip: true,
        z: 2,
        data: arrX,
        animationEasing: "elasticOut",
      },
      {
        type: "pictorialBar",
        itemStyle: {
          normal: {
            color: "#ACF4FF",
          },
        },
        symbol: "rect",
        symbolSize: [16, 4],
        symbolOffset: [0, 0],
        symbolPosition: "end",

        animation: false,
        data: arrX,
      },
      {
        type: "pictorialBar",
        itemStyle: {
          normal: {
            color: "#ADE0FF",
          },
        },
        symbol: "rect",
        symbolSize: [16, 4],
        symbolOffset: [0, 0],
        symbolPosition: "start",
        animation: false,
        data: arrX,
      },
      // {
      //   type: "pictorialBar",
      //   itemStyle: {
      //     normal: {
      //       color: "#ACF4FF",
      //     },
      //   },
      //   symbol:
      //     "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABICAYAAACECrc3AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQoSURBVHgBzZlJb9QwHMWf07C0EmJpC2WTKLQfALHc4QCIG8sBJJYb9GPMR4BbOcHwBRAnlgu9AScWIbFIMC1LAQmJcoHCQM2znbSZGWfidIn9pGk6dvz6Yvs3yb8j4KqPsh9NnIZEje+Gup4rcR0CV7BbPEcZ/z84xXE1jt+aNsdOg6fkRvzGBUR8SWyiSfdwEer87Q1c9V1uwAzO09f4Z1Qc0FzZGAef4eARHlfnnPmF/Q/ZewXf8B57xSxcpPx/4DLHnuG7Ub7WuAV8IGNey5pkWY8z2Ahb11rPFfiOOTzi8QZ2Oi6rlD14Tj+1rKC/Cdfhbw9YkxGGMchgB/WeE3ra82Zuhq8JnjPOPXcfbuEEprAZ63BA7znQX7bOXPeAY+jFL4YDl6sYiAf4x5kbdQyn9BV9nPEDGqQMEDZ1bndPtOaku9E6gx5ptYXjz/pCQM+0tvgLAreK/k1MxaHQmmhGhwP9d4hn5k9Oyq0JreNAAa2CQMjStA4lQBh/mTtzyn+Cx3EMi3tpY6zDBUAr+yf0ymTCKQm8k58RAK08R/k/a++KCmlKaRUlaW1qWsdcaeXxta07DoVWLu2sPaBNHmjNU2wdvIL3VuTQ6h7QE61uAVNaR0vS+rMEreojbbj7smYVtYTzSKtVDblBzWAQtHbog9yEv7is7iRB0NriP82L/W381Z3kSJX31kL/SWyhp/GX6I+dwymtIK2JepNwyn+bahDOQ5fp3porteea8/7b0ma3ungRT8JlaSUQqX9/tsutLq6AVm6ds8nDsmNdXDGt/Awe4ST0tp8mcgZXTitQpi72QGue7HWxB1qt6mmviz3SavGvcxXb6mKPtLb4R/SXupCbjEOhdd4feMz+Oi/8qWowdXEAtGb8r9H/btoYh0JrEq6eDWeaG3I6BFo5UVfTZc0qDoVW/vbK1q0oDoLWcnWxB1rzFOeEm0B5WgcTIGp6WWU5Wt0DeqLVLeAi6la95xpLp7U4oGdarXor15u6OABaO/SC/hEuxaHQavE/CV0XN+TRKu+tTv5z2M8LV/4DcSi0ak3T34RT/tuNjauW6d6aK7Xn+risEf3nTDglt7q4AloZ7BzHXeRrINtVHLAiWjlO+Zf4vrhiWmGe5EvUxRXTilJ1sQda8+3b5YnWnHQ3W2fQI622cOrbhoWAnmnNBFP+j7V/DxpxKLSac/mvg9R/l3hi8jbkUAi0Uj+0v6D/LnEnbYxDoTUJV8+GM80N+SkEWvUkJcuaVRwKrZyEl7bu7nVxhbSWr4srpjVP3erisrQOJkDUCmmNOml1D+iJVreAi6VVLWvP0mgtDuiZ1jx/UxcHQKvVH6ouDoTWDv8mTnBVdF18rMp7q5O/wD5uh2s8DriXnUqfZB9mcTihdU/XcwVuJ7TeQhn/Jg5xAtR2U498+A8kReVWbC9s7QAAAABJRU5ErkJggg==",
      //   symbolSize: [12, 14.4],
      //   symbolOffset: [0, 0],
      //   symbolPosition: "start",
      //   animation: false,
      //   data: arrX,
      // },
    ],
  });
  window.addEventListener("resize", function () {
    myBarChart.resize();
  });
  return myBarChart;
}
