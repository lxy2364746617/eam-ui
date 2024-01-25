<template>
  <div class="locationDetails pageStyle">
    <el-card shadow="never" style="height:100%">
      <!-- 面包线 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
        <el-breadcrumb-item v-for="(item,index) in breadcrumbArr" :key="index">{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 基本信息 -->
      <div class="details_baseData">
        <div class="details_baseData_img">
          <el-image :src="src" style="width: 120px;height:100px;"></el-image>
          <el-image :src="src"  style="width: 120px;height:100px;"></el-image>
        </div>
        <div class="details_baseData_form">
          <jm-form 
              :showButton= "false"
              :columns="columns" 
              :formData="formData" 
              :labelWidth="'150px'" 
              >
            </jm-form>
        </div>
      </div>
      <!-- 详情 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备" name="first">
          <jm-table :tableData="templateList"
          :checkbox="true"
          @getList="getList" 
          :total="total"
          :columns="tablecolumns" ref="jmTable">
          <template slot="headerLeft">
              <el-button type="primary" icon="el-icon-plus" size="mini"  @click="downloadClick">下载</el-button>
            </template>
          </jm-table>
        </el-tab-pane>
        <el-tab-pane label="文件" name="second">
          <jm-table :tableData="templateList"
          :checkbox="false"
          @getList="getList" 
          :total="total"
          :columns="tablecolumns" ref="jmTable">
          <template slot="headerLeft">
              <el-button type="primary" icon="el-icon-plus" size="mini"  @click="addClick">上传</el-button>
            </template>
          <template #end_handle="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-download"
              @click="handleDownload(scope.row)"
            >下载</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handlePreview (scope.row)"
            >详情</el-button>
          </template>
          </jm-table>
        </el-tab-pane>
        <el-tab-pane label="位置图片" name="third">
          <el-upload
  action="#"
  list-type="picture-card"
  :auto-upload="false">
    <i slot="default" class="el-icon-plus"></i>
    <div slot="file" slot-scope="{file}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
      >
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import JmTable from "@/components/JmTable1";
import JmForm from "@/components/JmForm";
  export default {
    name:'locationDetails',
    components: {
      JmForm,
      JmTable
    },
    data(){
      return {
        breadcrumbArr:[
          {name:'山西焦煤功能位置'},
          {name:'山焦西山'},
          {name:'白矿'},
          {name:'六采区'},
        ],
        src:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        columns:[
          { label: '所属组织', prop: 'categoryName',required: true, formDisabled: true,span:8, },
          { label: '功能位置名称', prop: 'categoryCode',required: true, formDisabled: true, span:8,  },
          { label: '功能位置编码', prop: 'parentCode',required: true, formDisabled: true,  span:8, },
          { label: '设备位置属性', prop: 'special',required: true, formDisabled: true,formType: 'select', options:[{label:'其他',value:'qt'}], span:8, },
          { label: '备注', prop: 'special', required: true,formType: 'textarea',formDisabled: true,span:16,},
        ],
        formData: {},
        activeName: 'second', // 默认选中tabs
        // 表格数据
        templateList: [],
        loading: true,
        // 总条数
        total: 0,
        // 表格头部
        tablecolumns:[
          { label: "功能位置名称", prop: "fileName" },
          { label: "功能位置编码", prop: "planCode" },
          { label: "功能位置属性", prop: "kdbType", formType: "selectF",options:[],type:'template',template(row,item){
            // let text = ''
            // item.options.forEach(items=>{
            //   items.options.forEach(itemss=>{
            //     if(row[item.prop] == itemss.value){
            //       text = itemss.label
            //     }
            //   })
            // })
            // return `<span>${text}</span>`
          }},
          { label: "所属组织", prop: "planName", },
          { label: "上级功能位置", prop: "createBy", },
          { label: "备注", prop: "createTime", },
        ],
        // 位置图片
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false
      }
    },
    methods:{
      // 点击切换tabs
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 获取表格数据
      getList(queryParams) {
        this.loading = true;
        maintainList(queryParams).then(response => {
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
       // 文件-点击新增
       addClick(){     
        let keys = Object.keys(this.ruleForm)
        keys.forEach(item=>{
          if(item == 'fileResources'){
            this.ruleForm[item] = []
          }else{
            this.ruleForm[item] = ''
          }
        })
        this.dialogTableVisible = true
      },
      // 文件-点击删除
      handleDelete(row){
        // console.log(row)
        maintainListDel({id:row.id,fileId:row.fileId}).then(res=>{
          this.getList()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
      },
      // 文件-点击下载
      handleDownload(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        download(url)
      },
      // 文件-点击预览
      handlePreview(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        window.open(url)
      },
      // 设备-点击下载
      downloadClick(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        download(url)
      },

      // 位置图片-上传
      handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      }
    }
  }
</script>

<style lang="scss" scoped>
.details_baseData{
  display: flex;
}
.details_baseData_img{
  width: 260px;
  display: flex;
  justify-content: space-between;
}
.details_baseData_form{
  width: calc(100% - 240px);
} 
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>