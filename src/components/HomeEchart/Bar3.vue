<template>
  <div style="width: 100%; height: 100%">
    <div v-if="datas" ref="chart" style="width: 100%; height: 100%"></div>
    <div
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
    </div>
  </div>
</template>

<script>
import { chartOption } from "./Bar.config3";
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
  created() {
    if (this.data && this.data?.stateList?.length) this.initChart();
  },
  methods: {
    initChart() {
      this.$nextTick(() => {
        this.mySetionChart = chartOption.call(this);
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
