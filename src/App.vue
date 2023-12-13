<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}

@media print {
  body * {
    visibility: hidden;
  }
  ::v-deep .el-scrollbar {
    display: none;
  }
  ::v-deep .main-container {
    margin-left: 0 !important;
  }
  ::v-deep .tags-view-container {
    display: none;
  }
  ::v-deep .app-main {
    padding-top: 0px !important;
  }
  ::v-deep .print * {
    visibility: visible;
  }
}
</style>
