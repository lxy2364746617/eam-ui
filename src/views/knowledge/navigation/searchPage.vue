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
      <div class="search_text">
        <span>历史搜索：</span>
        <el-tag v-for="item in tags" :key="item" closable type="info" @close="handleClose(item)" @click="handleClick(item)">{{item}}</el-tag>
      </div>
      <div class="content_box">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p class="title"><i class="el-icon-s-order"></i>故障案例</p>
              <el-collapse v-model="activeNames" @change="handleChange" accordion>
                <el-collapse-item v-for="(item,index) in gzal.list" :key="index" :name="item.name">
                  <template slot="title">
                    <div class="gzal_title_box">
                      {{item.title}}<i class="right_sz iconfont icon-uniEAD1" @click.stop="rowClick(item)"></i>
                    </div>
                  </template>
                  <div>{{item.content}}</div>
                </el-collapse-item>
              </el-collapse>
            </div>
        </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p class="title"><i class="el-icon-s-order"></i>技术资料</p>
              <div class="ul">
                <div class="li" v-for="(item,index) in gzal.list" :key="index">
                  <p class="icon"><i class="icon_left el-icon-s-ticket"></i> 水泵入厂技术参数说明.pdf <i class="icon_right iconfont icon-uniEAD1" @click="jszlClick(item)"></i></p>
                  <p class="text">{{item.title}}</p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p class="title"><i class="el-icon-s-order"></i>运维文档</p>
              <div class="ul">
                <div class="li" v-for="(item,index) in gzal.list" :key="index">
                  <p class="icon"><i class="icon_left el-icon-s-ticket"></i> 水泵入厂技术参数说明.pdf <i class="icon_right iconfont icon-uniEAD1" @click="ywwdClick(item)"></i></p>
                  <p class="text">{{item.title}}</p>
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
  export default {
    name:'searchPage',
    data(){
      return {
        search_text:'',
        tags: ['搜索一','搜索二','搜索三','搜索四','搜索五'],
        activeNames: ['1'],
        gzal:{
          list:[
            {name:'1',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
            {name:'2',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
            {name:'3',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
            {name:'4',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
            {name:'5',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
            {name:'6',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
            {name:'7',title:'故障设备：1#水泵',content:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。'},
          ]
        }
      }
    },
    mounted(){
      this.getRouteData()
    },
    methods:{
      // 获取路由参数
      getRouteData(){
        let text = this.$route.query.searchText
        if(text){
          this.search_text = text
        }
      },
      // 关闭tag
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      // 点击tag
      handleClick(row){
        this.search_text = row
      },
      // 点击搜索
      searchClick(){
        let text = this.search_text
        if(this.tags.length < 5){
          if(text){
            if(!this.tags.includes(text)){
              this.tags.push(text)
            }
          }
        }
        console.log(this.tags)
      },
      handleChange(val) {
        console.log(val);
      },
      // 点击返回按钮
      backClick(){
        this.$router.push({name:'navigation'})
      },
      // 点击小手跳转及查看详情
      rowClick(){
        console.log(row)
        this.$router.push({name:'faults_details',query:{id:row.id}})
      },
      // 点击技术资料每一行
      jszlClick(row){
        console.log(row)
        this.$router.push({name:'technology',query:{code:row.code}})
      },
      // 点击运维文档每一行
      ywwdClick(row){
        console.log(row)
        this.$router.push({name:'maintenance',query:{code:row.code}})
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
  // text-align: center;
  padding-left: 25%;
  margin:20px 0;
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