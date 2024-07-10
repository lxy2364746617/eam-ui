
<template>
  <Wrapper>
    <div class="box-content">
      <div
        v-for="(item, index) in [
          {
            title: '西山',
            data: [
              { data: [8021, 159, 71, 70, 61, 65] },
              { data: [1078, 95, 114, 96, 57, 43] },
              { data: [592, 33, 3, 3, 1, 0] },
              { data: [201, 30, 0, 0, 0, 1] },
              { data: [0, 19, 5, 2, 2, 0] },
            ],
          },
          {
            title: '霍州',
            data: [
              { data: [8021, 159, 71, 70, 61, 65] },
              { data: [1078, 95, 114, 96, 57, 43] },
              { data: [592, 33, 3, 3, 1, 0] },
              { data: [201, 30, 0, 0, 0, 1] },
              { data: [0, 19, 5, 2, 2, 0] },
            ],
          },
          {
            title: '汾西',
            data: [
              { data: [8021, 159, 71, 70, 61, 65] },
              { data: [1078, 95, 114, 96, 57, 43] },
              { data: [592, 33, 3, 3, 1, 0] },
              { data: [201, 30, 0, 0, 0, 1] },
              { data: [0, 19, 5, 2, 2, 0] },
            ],
          },
          {
            title: '华晋',
            data: [
              { data: [8021, 159, 71, 70, 61, 65] },
              { data: [1078, 95, 114, 96, 57, 43] },
              { data: [592, 33, 3, 3, 1, 0] },
              { data: [201, 30, 0, 0, 0, 1] },
              { data: [0, 19, 5, 2, 2, 0] },
            ],
          },
        ]"
        :key="index"
        style="width: 49.5%; height: 48%"
      >
        <LineChart :data="item"></LineChart>
      </div>
    </div>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import LineChart from "./ui/LineChart";
export default {
  components: { Wrapper, LineChart },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.box-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
