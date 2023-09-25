<template>
  <div class="wrapper">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.wrapper {
  font-family: PingFang SC;
  color: #55566d;
  width: 100%;
  // min-height: 805px;
  height: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 15px;
  padding: 20px 10px;
  padding-right: 25px;
  margin: 8px;
  .title {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: left;
  }
}
</style>
