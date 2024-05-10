<template>
  <div :class="{ show: show }" class="header-search">
    <el-button
      class="headersearchbtn"
      type="primary"
      icon="el-icon-microphone"
      size="medium"
      @click.stop="click"
      style="width: 30px"
    ></el-button>
    <!-- <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" /> -->
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="请输入搜索内容"
      class="header-search-select"
      @change="change"
    >
    <el-option
        :value="search"
        :label="search"
      />
      <!-- <el-option
        v-for="option in options"
        :key="option.item.path"
        :value="option.search"
        :label="option.item.title.join(' > ')"
      /> -->
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from "fuse.js/dist/fuse.min.js";
import path from "path";
import {startRecorder,closetWebSocke} from "./ars.js"

export default {
  name: "HeaderSearch",
  data() {
    return {
      /* search: "", */
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined,
    };
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes;
    },
    search() {
      return this.$store.state.arsMsg.outputMessage;
    }
  },
  watch: {
    search() {
      console.log(this.search)
    },
    routes() {
      this.searchPool = this.generateRoutes(this.routes);
    },
    searchPool(list) {
      this.initFuse(list);
    },
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  mounted() {
    console.log(this.$store.state,this.$store.state.arsMsg.outputMessage)
    this.searchPool = this.generateRoutes(this.routes);
  },
  methods: {
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
        startRecorder()
      }else{
        closetWebSocke()
        this.$store.commit('arsMsg/updateOutputMessage','')
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.$store.commit('arsMsg/updateOutputMessage','')
      this.options = [];
      this.show = false;
    },
    change(val) {
      const path = val.path;
      if (this.ishttp(val.path)) {
        // http(s):// 路径新窗口打开
        const pindex = path.indexOf("http");
        window.open(path.substr(pindex, path.length), "_blank");
      } else {
        this.$router.push(val.path);
      }
      this.search = "";
      this.options = [];
      this.$nextTick(() => {
        this.show = false;
      });
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: "title",
            weight: 0.7,
          },
          {
            name: "path",
            weight: 0.3,
          },
        ],
      });
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = "/", prefixTitle = []) {
      let res = [];

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue;
        }

        const data = {
          path: !this.ishttp(router.path)
            ? path.resolve(basePath, router.path)
            : router.path,
          title: [...prefixTitle],
        };

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title];

          if (router.redirect !== "noRedirect") {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data);
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(
            router.children,
            data.path,
            data.title
          );
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes];
          }
        }
      }
      return res;
    },
    querySearch(query) {
      if (query !== "") {
        this.options = this.fuse.search(query);
      } else {
        this.options = [];
      }
    },
    ishttp(url) {
      return url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.header-search {
  // font-size: 0 !important;
  .headersearchbtn {
    border: 1px solid #fff;
    border-radius: 10px;
    transform: translateY(1px);
    background: linear-gradient(to bottom right, #62b0fe, #1b8aff, #007bfe);
    ::v-deep i {
      margin-left: -6px;
      transform: scale(1.5);
    }
  }
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 10px;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 100px;
      margin-left: 10px;
    }
  }
}
.el-select-dropdown__item.selected {
    color: #007bfe;
    font-weight: 700;
    max-width: 200px;
    max-height: 200px;
    /* overflow: auto; */
    white-space: normal;
    overflow-y: auto;
}
</style>
