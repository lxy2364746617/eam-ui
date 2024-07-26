<template>
  <div class="pageStyle">
    <el-card class="box-card1" shadow="never">
      <div class="top">
        <div class="search">
          <div class="search_center">
            <el-input placeholder="知识搜索" clearable  prefix-icon="el-icon-search" v-model="search_text" v-hasPermi="['kdb:indexSearch:search']">
              <el-button  slot="append" style="font-size:20px;height: 50px;" :class="{btnactive:btnactive}"  icon="el-icon-microphone" @click="searchByYy"></el-button>
            </el-input>
            <el-button type="primary"  style="margin-left:20px" @click="searchClick" >搜 索</el-button>
          </div>
        </div>
        <div class="imgBox">
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in imgList" :key="index" >
              <div class="imgItem" :style="{ backgroundImage: `url(${item.imgUrl})` }" @click="imgClick(item)">
                <span class="imgText">{{item.text}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <div class="bottom_box">
      <div class="bottom_left">
          <div class="left_top">
            <el-card class="box-card left" shadow="never" v-hasPermi="['kdb:indexFault:list']">
              <div slot="header" class="clearfix">
                <span class="clearfix_text">故障案例 <i class="clearfix_new">NEW</i></span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="ClickMore('gzal')">查看更多</el-button>
              </div>
              <div class="content_body">
                <el-table
                  :data="tableData.dataList"
                  height="178"
                  stripe
                  @row-click="rowClick"
                  :row-style="{'cursor': 'pointer'}"
                  :header-cell-style="{
                    backgroundColor:'#E8F3FF'
                  }">
                  <el-table-column v-for="(item,index) in tableData.headerList" :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :show-overflow-tooltip="true"
                  :minWidth="item.minWidth"></el-table-column>
                </el-table>
              </div>
            </el-card>
            <el-card class="box-card right" shadow="never" v-hasPermi="['kdb:indexTech:list']">
              <div slot="header" class="clearfix">
                <span class="clearfix_text">技术资料 <i class="clearfix_new">HOT</i></span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="ClickMore('jszl')">查看更多</el-button>
              </div>
              <div class="content_body">
                <div v-for="(item,index) in jszlData.list" :key="index" class="textItem" @click=jszlClick(item)>
                  <i class="title1 iconfont" :class="item.icon"></i>
                  <p class="text">{{item.originalFileName}}</p>
                  <span class="clickNo" :style="{color:item.color}">点击NO.{{index+1}}</span>
                </div>
              </div>
            </el-card>
          </div>
          <div class="left_bottom">
            <el-card class="box-card" shadow="never" v-hasPermi="['kdb:indexMaintain:list']">
              <div slot="header" class="clearfix">
                <span>运维文档</span>
              </div>
              <div class="content_body content_body2">
                <el-row :gutter="20" style="width:100%">
                  <el-col :span="6" v-for="(item,index) in ywwdData.list" :key="index">
                    <div class="wd_box" @click="ywwdClick(item)">
                      <p class="el-icon-folder-opened icon_top"></p>
                      <p class="name" >{{item.fileName}}</p>
                      <p class="type">类型:{{getName(item.kdbType)}}</p>
                      <el-divider></el-divider>
                      <p class="icon_bottom"><span class="el-icon-right" ></span></p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
      </div>
      <div class="bottom_right">
        <div class="gzzd">
          <el-card class="box-card" shadow="never" v-hasPermi="['kdb:indexRule:list']">
            <div slot="header" class="clearfix">
              <span class="clearfix_text">规章制度 <i class="clearfix_new">NEW</i></span>
            </div>
            <div class="content_body1">
              <div v-for="(item,index) in gzzdData.list" :key="index" class="zd_text" @click="gzzdClick(item)">
                <p>{{item.fileName}}</p>
                <el-divider></el-divider>
                <p>{{item.content}}</p>
                <el-divider></el-divider>
                <p>实施时间：{{item.effectiveDate}}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { navFaultCaseList,navTechList,navMaintainList,maintainType,navRuleList } from '@/api/knowledge'
import {startRecorder,closetWebSocke} from "@/components/HeaderSearch/ars.js"
  export default {
    name:'navigation',
    data(){
      return {
        search_text:'',
        imgList:[
          {text:"故障案例",imgUrl:require('@/assets/images/zhishi/gzal.png')},
          {text:"技术资料",imgUrl:require('@/assets/images/zhishi/jszl.png')},
          {text:"运维文档",imgUrl:require('@/assets/images/zhishi/ywwd.png')},
          {text:"规章制度",imgUrl:require('@/assets/images/zhishi/gzzd.png')},
        ],
        tableData: {
          headerList:[
            { prop:'code',label:'故障代码',minWidth:'80px'},
            { prop:'faultName',label:'故障名称',minWidth:'80px'},
            { prop:'total',label:'累计案例次数',minWidth:'80px'},
            { prop:'creatTime',label:'添加时间'},
          ],
          dataList:[]
        },
        jszlData:{
          list:[]
        },
        gzzdData:{
          list:[]
        },
        ywwdData:{
          list:[]
        },
        typeArr:[],
        btnactive:false
      }
    },
    computed:{
      search() {
        return this.$store.state.arsMsg.outputMessage1;
      }
    },
    watch:{
      search() {
      this.search_text = this.search
    },
    },
    mounted(){
      maintainType().then(res=>{
            res.data.forEach(item=>{
             if (item.children.length>0)
             this.typeArr= this.typeArr.concat(item.children)
            })
          })
      this.getGzglList()
      this.getJszlList()
      this.getYwwdList()
      this.getGzzdList()
    },
    methods:{
    searchByYy(){
      this.btnactive = true
      startRecorder('知识导航',(()=>{this.btnactive=false}))
    },
      getName(val){
        return this.typeArr.filter(item=>item.id==val)[0].label
      },
      // 点击搜索按钮
      searchClick(){
        closetWebSocke()
        this.$router.push({name:'searchPage',query:{searchText:this.search_text}})
      },
      // 点击故障案例更多
      ClickMore(type){
        if(type == 'gzal'){
          //this.getGzglList(20)
          this.$router.push({path:'/knowledge/faults'})
        }else if(type == 'jszl'){
          //this.getJszlList(20)
          this.$router.push({path:'/knowledge/technology'})
        }

      },
      // 获取故障案例列表
      getGzglList(pageSize = 10){
        let params = {
          pageNum: 1,
          pageSize: pageSize
        }
        navFaultCaseList(params).then(res=>{
          this.tableData.dataList = res.rows
        })
      },
      // 获取技术资料
      getJszlList(pageSize = 10){
        let params = {
          pageNum: 1,
          pageSize: pageSize
        }
        navTechList(params).then(res=>{
          this.jszlData.list = res.rows
          if(this.jszlData.list){
            let colorArr = ['#FC297D','#FFB64F','#007BFE']
            let iconObj = {jpg:'icon-JPGtubiao',word:'icon-word1',pdf:'icon-PDFtubiao',mp4:'icon-MPtubiao',txt:'icon-TXTtubiao',png:'icon-PNGtubiao',qt:'icon-fuwenben'}
            this.jszlData.list.forEach((item,idx)=>{
              if(colorArr[idx]){
                item.color = colorArr[idx]
              }
              let fileName = item.originalFileName.slice(item.originalFileName.indexOf('.'),item.originalFileName.length)
              if(fileName == '.jpg'){
                item.icon = iconObj.jpg
              }else if(fileName == '.doc'){
                item.icon = iconObj.word
              }else if(fileName == '.pdf'){
                item.icon = iconObj.pdf
              }else if(fileName == '.mp4'){
                item.icon = iconObj.mp4
              }else if(fileName == '.txt'){
                item.icon = iconObj.txt
              }else if(fileName == '.png'){
                item.icon = iconObj.png
              }else{
                item.icon = iconObj.qt
              }
            })
          }
        })
      },
      // 获取运维文档
      getYwwdList(){
        navMaintainList().then(res=>{
          this.ywwdData.list = res.rows
          console.log(this.ywwdData.list)
          // 获取运维文档类型
          
        })
      },
      // 获取规章制度
      getGzzdList(){
        navRuleList().then(res=>{
          this.gzzdData.list = res.rows
        })
      },
      // 点击img触发
      imgClick(row){
        // console.log(row.text)
        switch(row.text){
          case '故障案例':{
            this.gzalClick()
            break
          }
          case '技术资料':{
            this.jszlClick()
            break
          }
          case '运维文档':{
            this.ywwdClick()
            break
          }
          case '规章制度':{
            this.gzzdClick()
            break
          }
        }
      },
      // 点击img故障案例跳转
      gzalClick(){
        this.$router.push({name:'faults'})
      },
      // 点击故障案例的每一行触发
      rowClick(row = {}){
        // console.log(row)
        this.$router.push({name:'faults',query:{data:JSON.stringify({code:row.code})}})
      },
      // 点击技术资料每一行
      jszlClick(row = {}){
        this.$router.push({name:'technology',query:{id:row.id}})
      },
      // 点击运维文档每一行
      ywwdClick(row = {}){
        // console.log(row)
        this.$router.push({name:'maintenance',query:{id:row.id}})
      },
      // 点击规章制度每一行
      gzzdClick(row = {}){
        // console.log(row)
        this.$router.push({name:'regulations',query:{id:row.id}})
      }
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
    margin: 25px 0;
  }
}
.imgBox{
  background: #E3EBFE;
  padding: 20px 100px;
  .imgItem{
    height: 234px;
    // background: #FFF;
    background-repeat: no-repeat;
    background-position: center;
    // background-size: 130%;
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    .imgText{
      display: block;
      width: 100%;
      position: absolute;
      bottom: 35px;
      text-align: center;
    }
  }
}
.bottom_box{
  display: flex;
  flex-wrap: wrap;
}
.box-card{
  border-radius: 15px;
  padding-bottom:10px;
}
.bottom_left{
  width: 70%;
    .left_top{
      display: flex;
      flex-wrap: wrap;
      .left{
        width: 50%;
      }
      .right{
        width: calc(50% - 10px);
        margin-left: 10px;
        
      }
    }
    .textItem{
      display: flex;
      line-height: 35px;
      cursor: pointer;
      .title1{
        margin-right: 20px;
        font-size: 20px;
      }
      .clickNo{
        text-align: right;
        width: 100px;
        text-align: right;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
      .text{
        width: 80%;
        padding: 0;
        margin: 0;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
    }
}
.content_body{
  padding: 10px 15px;
  height: 200px;
  overflow-y: auto;
}
.content_body1{
  padding: 10px 15px;
  height: 562px;
  overflow-y: auto;
}
.content_body2{
  height: 290px;
  display: flex;
  flex-wrap: wrap;
}
.bottom_right{
  width: calc(30% - 10px);
  margin-left: 10px;
}
.left_bottom{
  width: 100%;
}

.clearfix_text{
  position: relative;
}
.clearfix_new{
  position: absolute;
  top: -10px;
  font-weight: normal;
  line-height: 14.04px;
  letter-spacing: 0em;
  color: #FF2828;
  font-size: 12px;
}
.wd_box{
  width: 100%;
  height:130px;
  background-color: #F7FBFF;
  border: 1px solid #E9EAEF;
  border-radius: 8px;
  padding: 10PX 10px 0 10px;
  margin-bottom: 10PX;
  cursor: pointer;
  
  p{
    overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
    margin: 0;
    line-height: 25px;
  }
  .type{
    font-size: 13px;
  }
  .icon_top{
    color:#FFB64F;
    font-size: 23px;
    // font-weight: bold;
  }
  .icon_bottom{
    text-align: right;
    span{
      font-size: 23px;
      color:#FFB64F;
      line-height: 30px;
      // font-weight: bold;
      cursor: pointer;
    }
  }
}
.zd_text{
  background-color: #F7FBFF;
  border: 1px solid #E9EAEF;
  padding: 10PX;
  margin-bottom: 10PX;
  border-radius: 5px;
  cursor: pointer;
  p{
    margin: 0;
    line-height: 30px;
  }
}
.zd_text:nth-last-child(1){
  margin-bottom: 0;
}
.el-divider--horizontal{
  margin:5px 0;
}
::v-deep .el-input--medium .el-input__inner{
  height: 51px;
  line-height: 51px;
}
::v-deep .el-card__body{
  padding: 0;
}
::v-deep .el-card{
  margin-top: 10px;
}
// ::v-deep .el-table tr{
//   cursor: pointer;
// }

.box-card1{
  margin-top: 0;
}

.icon-JPGtubiao {
  color:#E986A5;
}

.icon-word1 {
  color:#4070FF;
}

.icon-PDFtubiao {
  color:#F05542;
}

.icon-MPtubiao{
  color:#14A9DA;
}

.icon-PNGtubiao {
  color:#FCCC00;
}

.icon-TXTtubiao{
  color:#49B08F;
}

.icon-fuwenben{
  color:#13227A;
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
