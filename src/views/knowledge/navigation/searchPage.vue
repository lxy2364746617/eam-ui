<template>
  <div class="searchPage pageStyle">
    <el-card class="box-card" shadow="never">
      <div class="search">
          <div class="search_center">
            <el-input placeholder="知识搜索" v-model="search_text"></el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-left:20px" @click="searchClick">搜 索</el-button>
            <el-button type="info" icon="el-icon-arrow-left" style="margin-left:20px" @click="backClick">返 回</el-button>
          </div>
        </div>
      <div class="search_text" v-hasPermi="['kdb:history:list']">
        <span>历史搜索：</span>
        <el-tag v-for="(item,index) in tags" :key="index" type="info" @close="handleClose(item)" @click="handleClick(item)">{{item.searchContent}}</el-tag>
      </div>
      <div class="content_box">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p class="title"><i class="el-icon-s-order"></i>故障案例</p>
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item v-for="(item,index) in gzal.list" :key="index" :name="item.id">
                  <template slot="title">
                    <div class="gzal_title_box">
                      {{`${item.caseNo}${item.faultName}`}}<i class="right_sz iconfont icon-uniEAD1" @click.stop="rowClick(item)"></i>
                    </div>
                  </template>
                  <div>
                    <p><span style="font-weight:bold">故障设备：</span>{{item.deviceName}}</p>
                    <p><span style="font-weight:bold">故障描述：</span>{{item.faultInfo}}</p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p class="title"><i class="el-icon-s-order"></i>技术资料</p>
              <div class="ul">
                <div class="li" v-for="(item,index) in jszl.list" :key="index">
                  <p class="icon"><i class="icon_left el-icon-s-ticket"></i> {{item.fileName}}<i class="icon_right iconfont icon-uniEAD1" @click="jszlClick(item)"></i></p>
                  <p class="text">{{item.deviceName}}</p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p class="title"><i class="el-icon-s-order"></i>运维文档</p>
              <div class="ul">
                <div class="li" v-for="(item,index) in ywwd.list" :key="index">
                  <p class="icon"><i class="icon_left el-icon-s-ticket"></i> {{item.fileName}} <i class="icon_right iconfont icon-uniEAD1" @click="ywwdClick(item)"></i></p>
                  <p class="text">{{item.planName}}</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
import { navSearchList,searchHistoryList,searchHistoryAdd } from '@/api/knowledge'
  export default {
    name:'searchPage',
    data(){
      return {
        search_text:'',
        tags: ['搜索一','搜索二','搜索三','搜索四','搜索五'],
        activeNames: [],
        gzal:{
          list:[]
        },
        jszl:{
          list:[]
        },
        ywwd:{
          list:[]
        }
      }
    },
    watch: {
    // 监听路由参数的变化
    '$route.query.searchText': {
        immediate: true,
        handler(newVal, oldVal) {
          console.log('参数变化了');
          this.getRouteData()
        }
      }
    },
    methods:{
      // 获取路由参数
      getRouteData(){
        let text = this.$route.query.searchText
        console.log(text)
        if(text){
          this.search_text = text
          this.getSearchList(text)
        }
      },
      // 获取历史搜索列表
      getSSLSList(){
        searchHistoryList().then(res=>{
          console.log(res,'搜素历史')
          // if(res.rows.length > 6){
          //   res.rows.length = 6
          // }
          this.tags = res.rows
        })
      },
      // 获取搜索结果
      getSearchList(){
        let params = {
          search: this.search_text
        }
        navSearchList(params).then(res=>{
          // console.log(res,'搜索结果')
          // 新增历史记录
          searchHistoryAdd({searchContent:this.search_text}).then(res=>{
            this.getSSLSList()
          })
          // 赋值
          this.gzal.list = res.data.kdbFaultSearchVos
          this.jszl.list = res.data.kdbEquSearchVos
          this.ywwd.list = res.data.kdbMaintainSearchVos
          if(this.gzal.list.length){
            this.activeNames = []
            this.activeNames.push(res.data.kdbFaultSearchVos[0].id)
          }
        })
      },
      // 关闭tag
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      // 点击tag
      handleClick(row){
        console.log(row)
        this.search_text = row.searchContent
        this.getSearchList()
      },
      // 点击搜索
      searchClick(){
        this.getSearchList()
        // let text = this.search_text
        // if(this.tags.length < 5){
        //   if(text){
        //     if(!this.tags.includes(text)){
        //       this.tags.push(text)
        //     }
        //   }
        // }
        // console.log(this.tags)
      },
      // 点击返回按钮
      backClick(){
        this.$router.push({name:'navigation'})
      },
      // 点击故障案例小手跳转及查看详情
      rowClick(row){
        // console.log(row)
        this.$router.push({name:'faults_details',query:{orderCode:row.orderCode,deviceCode:row.deviceCode,id:row.id,caseNo:row.caseNo}})
      },
      // 点击技术资料每一行
      jszlClick(row){
        // console.log(row)
        this.$router.push({name:'technology',query:{id:row.id}})
      },
      // 点击运维文档每一行
      ywwdClick(row){
        // console.log(row)
        this.$router.push({name:'maintenance',query:{id:row.id}})
      },
    }
  }
</script>

<style lang="scss" scoped>
.search{
  display: flex;
  align-items: center;
  justify-content: center;
  .search_center{
    width: 896px;
    display: flex;
    margin-top:25px
  }
}
.search_text{
  text-align: center;
  // padding-left: 15%;
  margin:20px 20px 0 20px;
}
.content_box{
  padding: 20px;
  .grid-content{
    border-radius: 10px;
    background-color: #E0EAFF;
    height: 610px;
    padding: 10px;
    overflow-y: auto;
  }
  .title{
    margin: 0px;
    line-height: 40px;
    font-weight: bold;
    margin-bottom:10px;
    i{
      color: #1F77FC;
      font-size: 25px;
      margin-right:10px;
    }

  }
  .gzal_title_box{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    line-height: 20px;
    .right_sz{
      color:#1F77FC;
      cursor: pointer;
    }
  }
  .ul{
    border: 1px solid #D9D9D9;
    .li{
      padding: 10px;
      // height: 50px;
      background-color: #FAFAFA;
      border-bottom: 1px solid #D9D9D9;
      p{
        margin: 0;
        height: 25px;
        line-height: 25px;

      }
      .text{
        font-size: 13px;
      }
      .icon{
        position: relative;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
        padding-right: 25px;
        .icon_left{
          margin-right: 10px;
          color: #1F77FC;
        }
        .icon_right{
          color: #1F77FC;
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
::v-deep .el-tag.el-tag--info{
  margin-left: 15px;
  cursor: pointer;
}
::v-deep .el-input--medium .el-input__inner{
  height: 51px;
  line-height: 51px;
}
::v-deep .el-card__body{
  padding: 0;
}
::v-deep .el-collapse-item__content{
  // background-color: #E0EAFF;
  padding: 0 15px;
  position: relative;

}
::v-deep .el-collapse-item__arrow{
  position: absolute;
  left: 25px;
}
::v-deep .el-collapse-item__header{
  background-color: #FAFAFA;
  padding-left: 10px;
}

</style>
