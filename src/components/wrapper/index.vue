<template>
  <div class="wrapper app-container">
    <div class="title">{{ title2 }}</div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
  },
  data() {
    return {
      title2: "",
    };
  },
  mounted() {
    this.title2 = this.$route.meta.title;
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.wrapper {
  font-family: PingFang SC;
  color: #55566d;

  .title {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: left;
  }
}
</style>
