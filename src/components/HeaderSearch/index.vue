<template>
  <div :class="{ show: true }" class="header-search">
    <el-button
      class="headersearchbtn"
      type="primary"
      icon="el-icon-search"
      size="medium"
      @click.stop="click"
      style="width: 30px"
    ></el-button>
    <!-- <el-button
      class="headersearchbtn"
      type="primary"
      icon="el-icon-microphone"
      size="medium"
      @click.stop="click"
      style="width: 30px"
    ></el-button> -->
    <!-- <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" /> -->
    <!-- <el-select
      ref="headerSearchSelect"
      v-model="searchText"
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
    >
    </el-option>
       <el-option
        v-for="option in options"
        :key="option.item.path"
        :value="option.search"
        :label="option.item.title.join(' > ')"
      /> 
    </el-select> -->
    <el-tooltip  effect="dark" :content="searchText" placement="bottom" >
      <div class="header-search-select">
        <el-input v-model="searchText" ref="headerSearchSelect" @change='changeSearch'>
          <el-button :class='{btnactive:btnactive}' style="width:40px;padding-left:13px" slot="append"  icon="el-icon-microphone" @click="searchYy"></el-button>
        </el-input>
      </div>
    
    </el-tooltip>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from "fuse.js/dist/fuse.min.js";
import path from "path";
import {startRecorder,closetWebSocke} from "./ars.js"
export default {
  dicts:['XDJ','BYJX','DQJY','SBWX'],
  name: "HeaderSearch",
  data() {
    return {
      /* search: "", */
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined,
      searchText:'',
      btnactive:false
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
      this.searchText = this.search
      console.log(this.search)
    },
    routes() {
      this.searchPool = this.generateRoutes(this.routes);
    },
    searchPool(list) {
      this.initFuse(list);
    },
    show(value) {
      /* if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      } */
    },
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes);
  },
  methods: {
    changeSearch(val){
      if(val){
        if(val.includes('设备领用')) this.$router.push({ path: '/property/purchase/annual',  })
        else if(val.includes('购置年度计划')) this.$router.push({ path: '/property/purchase/temporarily',  })
        else if(val.includes('购置临时计划')) this.$router.push({ path: '/property/backspace',  })
        else if(val.includes('设备购置入库')) this.$router.push({ path: '/property/purchase/warehousing',  })
        else if(val.includes('设备回退')) this.$router.push({ path: '/property/backspace',  })
        else if(val.includes('设备移交')) this.$router.push({ path: '/property/turnOver',  })
        else if(val.includes('设备调剂')) this.$router.push({ path: '/property/prescription',  })
        else if(val.includes('设备报废')) this.$router.push({ path: '/property/scrapping',  })
        else if(val.includes('位置状态变动')) this.$router.push({ path: '/property/position',  })
        else if(val.includes('工单请求')) {//打开工单
          this.$router.push({ path: '/work/request',  })
          const orderType = this.dict.type.XDJ.concat(this.dict.type.BYJX,this.dict.type.SBWX,this.dict.type.DQJY)
          console.log(orderType)
          if(val.includes('新增')){//是否新增
            this.$router.push({ path: '/work/requestAdd', })
            orderType.forEach(item => {//判断是否需要工单类型
              if(val.includes(item.label)) {
                this.$router.push({ path: '/work/requestAdd',query: { msg: item.value }  })
              }
            });
          }
        }
        else if(val.includes('工单调度')) this.$router.push({ path: '/work/schedule',  })
        else if(val.includes('待办任务')) this.$router.push({ path: '/work/quest',  })
        else if(val.includes('工单记录')) this.$router.push({ path: '/work/record',  })
        else if(val.includes('工单日历')) this.$router.push({ path: '/work/calendar',  })
        else if(val.includes('备件列表')) this.$router.push({ path: '/sparepart/spareList',  })
        else if(val.includes('备件需求')) this.$router.push({ path: '/sparepart/requirement',  })
        else if(val.includes('备件领用')) this.$router.push({ path: '/sparepart/spareReceive',  })
        else if(val.includes('备件出入库')) this.$router.push({ path: '/sparepart/spareInAndOut',  })
        else if(val.includes('巡点检项目')) this.$router.push({ path: '/devops/patrol/item',  })
        else if(val.includes('巡点检标准')) this.$router.push({ path: '/devops/patrol/pstandard',  })
        else if(val.includes('巡点检路线')) this.$router.push({ path: '/devops/patrol/pline',  })
        else if(val.includes('巡点检计划')) this.$router.push({ path: '/devops/patrol/pplan',  })
        else if(val.includes('保养检修项目')) this.$router.push({ path: '/devops/maintain/mitem',  })
        else if(val.includes('保养检修标准')) this.$router.push({ path: '/devops/maintain/mstandard',  })
        else if(val.includes('保养检修路线')) this.$router.push({ path: '/devops/maintain/mline',  })
        else if(val.includes('保养检修计划')) this.$router.push({ path: '/devops/maintain/mplan',  })
        else if(val.includes('定期检验计划')) this.$router.push({ path: '/devops/regular/rplan',  })
        else if(val.includes('故障代码管理')) this.$router.push({ path: '/devops/fault/faultcode',  })
        else if(val.includes('知识导航')) this.$router.push({ path: '/knowledge/navigation',  })
        else if(val.includes('故障案例库')) this.$router.push({ path: '/knowledge/faults',  })
        else if(val.includes('技术资料库')) this.$router.push({ path: '/knowledge/technology',  })
        else if(val.includes('运维文档库')) this.$router.push({ path: '/knowledge/maintenance',  })
        else if(val.includes('规章制度库')) this.$router.push({ path: '/knowledge/regulations',  })
        else {
          const msg = new SpeechSynthesisUtterance('搜索中，请稍候'); // 创建语音消息
          window.speechSynthesis.speak(msg); // 播放语音
          this.$router.push({ path: '/decive/book', query: { msg: val } })
        }
      }
      
    },
    searchYy(){
      this.searchText=''
      this.btnactive = true
      startRecorder('',(()=>{this.btnactive = false}))
    },
    click() {
      this.show = !this.show;
      /* if (this.show) {
        //this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
        
      }else{
        //this.searchText=''
        this.btnactive = false
        closetWebSocke()
        this.$store.commit('arsMsg/updateOutputMessage','')
      } */
      if(this.searchText){
        this.changeSearch(this.searchText)
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.btnactive = false
      closetWebSocke()
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
      width: 200px;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.el-select-dropdown__item.selected{
  white-space: normal ;
  height: auto ;
  overflow-y:auto ;
}
.el-tooltip__popper.is-dark {
    background: #303133;
    color: #FFF;
    max-width: 200px;
}
@keyframes example {
  0% {opacity: 0.3;}
  50%{opacity: 1;}
  100% {opacity: 0.3;}
}
 
@-webkit-keyframes example 
{
  0% {opacity: 0.3;}
  50%{opacity: 1;}
  100% {opacity: 0.3;}
}
.btnactive{
  background: #1b8aff !important;
  color: white !important;
  
  animation-name: example;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  -webkit-animation-name: example;
  -webkit-animation-duration: 2s;
  -webkit-animation-iteration-count: infinite;
}
</style>
