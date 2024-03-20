<template>
  <div style="width: 100%; height: 100%">
    <div v-if="datas" ref="chart" style="width: 100%; height: 88%"></div>
    <div v-else>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import { chartOption } from "./Line.config";
export default {
  props: ["data"],
  data() {
    return {
      chart: null, // 用来获取实例
      mySetionChart: null, // 改变指向
      datas: this.data, // 数据
    };
  },
  created() {
    if (this.data) this.initChart();
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
