import Wrapper from '@/components/wrapper';
<template>
  <Wrapper :title="title">
    <dir class="header">
      <div class="chart">
        <dir class="tag">可调剂设备子公司分布</dir>
        <BarChart></BarChart>
      </div>
      <div class="chart"></div>
      <div class="chart"></div>
    </dir>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import BarChart from "./ui/BarChart.vue";
export default {
  components: {
    Wrapper,
    BarChart,
  },
  data() {
    return {
      title: "",
    };
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  computed: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  height: 337px;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  background: #f7fbff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 15px;
  .chart {
    width: 460px;
    height: 270px;
    position: relative;
    background-color: #fff;
    &::before {
      content: "";
      display: block;
      width: 103.5%;
      height: 10%;
      background: url("../../../assets/images/chart-down.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: -7px;
      bottom: -18px;
      z-index: 2;
    }
    .tag {
      width: 100%;
      height: 38px;
      background: linear-gradient(0deg, #e7f3ff 0%, #e7f3ff 100%),
        url(<path-to-image>), lightgray 0px 0px / 97.436% 100% no-repeat;
      margin: 0;
      padding: 0;
      color: #55566d;
      display: flex;
      justify-content: start;
      align-items: center;
      &::before {
        content: "";
        width: 30px;
        height: 38px;
        margin-left: 10px;
        display: flex;
        background: url("../../../assets/images/tag.png");
      }
    }
  }
}
</style>
