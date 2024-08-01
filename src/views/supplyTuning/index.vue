<template>
  <div></div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {
    window.open(
      "https://ahzkdl.com:81/login/cG9salNkb3Bqc29kanNhb3BbZGprYXNvZGpvcGpzYW9w/"
    );
    this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
    this.$router.go(-1); //跳回上页
  },

  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
