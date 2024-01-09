<template>
  <div class="pageStyle">
    <el-card class="box-card1" shadow="never">
      <div class="top">
        <div class="search">
          <div class="search_center">
            <el-input placeholder="知识搜索" v-model="search_text"></el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-left:20px">搜 索</el-button>
          </div>
        </div>
        <div class="imgBox">
          <el-row :gutter="20">
            <el-col :span="6" v-for="(item,index) in imgList" :key="index">
              <div class="imgItem" :style="{ backgroundImage: `url(${item.imgUrl})` }">
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
            <el-card class="box-card left" shadow="never">
              <div slot="header" class="clearfix">
                <span class="clearfix_text">故障案例 <i class="clearfix_new">NEW</i></span>
                <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
              </div>
              <div class="content_body">
                <el-table
                  :data="tableData.dataList"
                  height="178"
                  stripe
                  :header-cell-style="{
                    backgroundColor:'#E8F3FF'
                  }"
                  border
                  style="width: 100%">
                  <el-table-column v-for="(item,index) in tableData.headerList" :key="index" 
                  :prop="item.prop" 
                  :label="item.label" 
                  :show-overflow-tooltip="true"
                  :minWidth="item.minWidth"></el-table-column>
                </el-table>
              </div>
            </el-card>
            <el-card class="box-card right" shadow="never">
              <div slot="header" class="clearfix">
                <span class="clearfix_text">技术资料 <i class="clearfix_new">HOT</i></span>
                <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
              </div>
              <div class="content_body">
                <div v-for="(item,index) in jszlData.list" :key="index" class="textItem">
                  <span class="title">{{ item.title }}</span>
                  <p>{{item.content}}</p>
                  <span class="clickNo" :style="{color:item.color}">{{item.clickNo}}</span>
                </div>
              </div>
            </el-card>
          </div>
          <div class="left_bottom">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>运维文档</span>
                <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
              </div>
              <div class="content_body content_body2">
                <el-row :gutter="20" style="width:100%">
                  <el-col :span="6" v-for="(item,index) in ywwdData.list" :key="index">
                    <div class="wd_box">
                      <p class="el-icon-folder-opened icon_top"></p>
                      <p class="name">{{item.name}}</p>
                      <p class="type">{{item.type}}</p>
                      <el-divider></el-divider>
                      <p class="icon_bottom"><span class="el-icon-right"></span></p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
      </div>
      <div class="bottom_right">
        <div class="gzzd">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="clearfix_text">规章制度 <i class="clearfix_new">NEW</i></span>
              <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
            </div>
            <div class="content_body1">
              <div v-for="(item,index) in gzzdData.list" :key="index" class="zd_text">
                <p>{{item.title}}</p>
                <el-divider></el-divider>
                <p>{{item.content}}</p>
                <el-divider></el-divider>
                <p>{{item.date}}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
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
            { prop:'albm',label:'案例编码',minWidth:'80px'},
            { prop:'gzdm',label:'故障代码',minWidth:'80px'},
            { prop:'gzmc',label:'故障名称',minWidth:'80px'},
            { prop:'ljal',label:'累计案例',minWidth:'80px'},
            { prop:'cs',label:'次数',minWidth:'50px'},
            { prop:'tjsj',label:'添加时间'},
          ],
          dataList:[
            { albm: '1',gzdm: 'ZZSHNTPSJ-03',gzmc: '我出故障啦',ljal:'案例一',cs:'20',tjsj:'2023-11-11'},
            { albm: '1',gzdm: 'ZZSHNTPSJ-03',gzmc: '我出故障啦',ljal:'案例一',cs:'20',tjsj:'2023-11-11'},
            { albm: '1',gzdm: 'ZZSHNTPSJ-03',gzmc: '我出故障啦',ljal:'案例一',cs:'20',tjsj:'2023-11-11'},
            { albm: '1',gzdm: 'ZZSHNTPSJ-03',gzmc: '我出故障啦',ljal:'案例一',cs:'20',tjsj:'2023-11-11'},
          ]
        },
        jszlData:{
          list:[
            {title:'插图',content:'某文件解决技术方案.doc',clickNo:'点击NO.1',color:'#FC297D'},
            {title:'插图插图',content:'某文件解决技术方案.doc',clickNo:'点击NO.2',color:'#FFB64F'},
            {title:'插插图插图图',content:'某文件解决技术方案.doc',clickNo:'点击NO.3',color:'#007BFE'},
            {title:'插插图插图插图图',content:'某文件解决技术方案.doc',clickNo:'点击NO.4'},
          ]
        },
        gzzdData:{
          list:[
            {title:'我是规章要求.doc',content:'我是规章制度描述,我是规章制度描述我是规章制度描述,我是规章制度描述我是规章制度描述。',date:'2023-11-08 17:48'},
            {title:'我是规章要求.doc',content:'我是规章制度描述,我是规章制度描述我是规章制度描述,我是规章制度描述我是规章制度描述。',date:'2023-11-08 17:48'},
            {title:'我是规章要求.doc',content:'我是规章制度描述,我是规章制度描述我是规章制度描述,我是规章制度描述我是规章制度描述。',date:'2023-11-08 17:48'},
            {title:'我是规章要求.doc',content:'我是规章制度描述,我是规章制度描述我是规章制度描述,我是规章制度描述我是规章制度描述。',date:'2023-11-08 17:48'},
          ]
        },
        ywwdData:{
          list:[
            {name:'文档1.doc',type:'故障案例'},
            {name:'文档1.doc',type:'故障案例'},
            {name:'文档1.doc',type:'故障案例'},
            {name:'文档1.doc',type:'故障案例'},
            {name:'文档1.doc',type:'故障案例'},
            {name:'文档1.doc',type:'故障案例'},
          ]
        }
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
      justify-content: space-between;
      .title{
        width: 130px;
        margin: 0;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
      .clickNo{
        width: 100px;
        text-align: right;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
      p{
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
  height: 561px;
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
  background-color: #F7FBFF;
  border: 1px solid #E9EAEF;
  padding: 10PX 10px 0 10px;
  margin-bottom: 10PX;
  p{
    margin: 0;
    line-height: 25px;
  }
  .name{
    font-size: 20px;
  }
  .icon_top{
    color:#FFB64F;
    font-size: 23px;
    font-weight: bold;
  }
  .icon_bottom{
    text-align: right;
    span{
      font-size: 23px;
      color:#FFB64F;
      font-weight: bold;
      line-height: 30px;
    }
  }
}
.zd_text{
  background-color: #F7FBFF;
  border: 1px solid #E9EAEF;
  padding: 10PX;
  margin-bottom: 10PX;
  border-radius: 5px;
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


.box-card1{
  margin-top: 0;
}
</style>