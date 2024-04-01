<template>
  <div>
      <div class="article">
    <div class="title">{{form.noticeTitle}}</div>
    <div class="publish-time">发布时间：{{form.updateTime}} <p style="display:inline-block;margin:0 0 0 40px">发布人：{{form.issUser}}</p></div>
    <div class="summary" ><span style="font-weight:bolder">简介：</span>{{form.noticeIntro}}</div>
     <editor  v-model="form.noticeContent" :min-height="192" readOnly />
</div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {getNotice} from "@/api/system/notice";
export default {
    props:{
        id:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            form:{}
        }
    },
    created(){
        getNotice(this.id).then(res=>{
             this.form = res.data;
        })
    }
}
</script>

<style lang="scss" scoped>
.article {
        width: 100%;
        margin: 0 auto;
        padding:0 20px;
       
        font-family: Arial, sans-serif;
    }
    .title {
        font-size: 25px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;
    }
    .publish-time {
        font-size: 14px;
        color: #666;
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;
    }
    .summary {
        text-align: left;
        font-size: 14px;
        margin-bottom: 20px;
        text-indent: 28px;
        line-height: 28px;
        
    }
   ::v-deep .ql-toolbar.ql-snow{
        display: none !important;
        
    }
     ::v-deep .ql-container.ql-snow{
        border: 0 !important;
    }
    
   
</style>