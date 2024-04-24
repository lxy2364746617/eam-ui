<template>
  <div class="locationDetails pageStyle">
    <el-card shadow="never" style="height:100%">
      <!-- 面包线 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
        <el-breadcrumb-item v-for="(item,index) in breadcrumbArr" :key="index">{{item.deptName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 基本信息 -->
      <div class="details_baseData">
        <div class="details_baseData_img">
          <el-image :src="src||require('@/assets/images/noImg.png')" style="width: 120px;height:100px;" :key="src">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size:30px;color:#909399"></i>
            </div>
          </el-image>
          <el-image :src="src1||require('@/assets/images/noImg.png')"  style="width: 120px;height:100px;">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size:30px;color:#909399"></i>
            </div>
          </el-image>
        </div>
        <div class="details_baseData_form" >
          <!-- <jm-form
              :showButton= "false"
              :columns="columns"
              :formData="formData"
              :labelWidth="'150px'"
              >
            </jm-form> -->
            <el-form :model="formData" inline >
              <el-row>
                <el-col :span="16">
                  <el-form-item label="功能位置名称:" label-width="120px" prop="deptName" :rules="[{required:true}]">
                <el-input v-model="formData.deptName" disabled style="width:206px"></el-input>
              </el-form-item>
              <el-form-item label="所属组织:" label-width="120px" prop="orgName" :rules="[{required:true}]">
                <el-input v-model="formData.orgName" disabled style="width:206px"></el-input>
              </el-form-item>
              <el-form-item label="功能位置编码:" label-width="120px" prop="deptCode" :rules="[{required:true}]">
                <el-input v-model="formData.deptCode" disabled style="width:206px"></el-input>
              </el-form-item>
              <el-form-item label="设备位置属性:" label-width="120px" prop="funAttr" :rules="[{required:true}]">
                <el-select v-model="formData.funAttr" disabled style="width:206px">
                  <el-option v-for="item in funAttrOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注:" label-width="80px" prop="remark" :rules="[{required:true}]">
                <el-input   type="textarea" :rows="4" v-model="formData.remark" disabled></el-input>
              </el-form-item>
                </el-col>
              </el-row>

            </el-form>
        </div>
      </div>
      <!-- 详情 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备" name="first"  v-hasPermi="['equipment:base:list']"
        >
          <jm-table :tableData="templateList"
          :checkbox="true"
          @getList="getDevice"
          :total="total"
          :columns="tablecolumns" ref="jmTable">
          <template slot="headerLeft">
              <el-button type="primary" icon="el-icon-download" size="mini"  @click="downloadClick">下载</el-button>
            </template>
          </jm-table>
        </el-tab-pane>
        <el-tab-pane label="文件" name="second">
          <jm-table :tableData="templateList1"
          :checkbox="false"
          @getList="getFile"
          :total="total1"
          :columns="tablecolumns1" ref="jmTable1">
          <template slot="headerLeft">
              <el-button type="primary" icon="el-icon-plus" size="mini"  @click="addClick"
                         v-hasPermi="['system:location:insertPic']"
              >上传</el-button>
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
              @click="handlePreview(scope.row)"
            >预览</el-button>
          </template>
          </jm-table>
        </el-tab-pane>
        <el-tab-pane label="位置图片" name="third">
           <draggable v-model="sysFileResources" @change='imgMove'>
            <transition-group>
              <div class="el-upload-list__item" v-for="item in sysFileResources" :key="item.id">
                  <img :src="item.url" style="width:100%">
                  <div class="img_btn" >
                      <span
                      @click="handlePictureCardPreview(item)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span> 
                    <span
                      @click="handleRemove(item)"
                    >
                      <i class="el-icon-delete"></i>
                    </span> 
                  </div>
              </div>    
            </transition-group>
            <div slot="footer" class="el-upload-list__item" style="display:inline-block;width:148px;height:148px">
              <el-upload
              style="float:right"
            :action="action"
            :headers="headers"
            list-type="picture-card"
            :on-success="onSuccess"
            :file-list="sysFileResources"
            :show-file-list="false"
            accept="image/png,image/jpeg"
            :key="'1'"
            >
            <i slot="default" class="el-icon-plus"></i>
        </el-upload>
            </div>
        </draggable> 
         <!-- <el-upload
            :action="action"
            :headers="headers"
            list-type="picture-card"
            :on-success="onSuccess"
            :file-list="sysFileResources"
            accept="image/png,image/jpeg"
            >
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
         </el-upload> -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      title="上传"
      :visible.sync="uploadDialogVisible"
      width="500px">
      <div class="upload_box">
         <el-upload
          class="upload-demo"
          :action="action"
          :headers="headers"
          :on-success="onSuccessFile"
          :on-error="onErrorFile"
          :file-list="fileList"
           drag
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
<!--           <el-button type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
 -->        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="filePrimary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import JmTable from "@/components/JmTable1";
import JmForm from "@/components/JmForm1";
import { getToken } from "@/utils/auth";
import draggable from 'vuedraggable'
import { locationDetail,getLocationAttr,locationDetailDevice,locationDetailFile,getDeviceStatus,getDeviceAtt,uploadSave,locationDetailFileDelete,updateSortNum } from '@/api/Location'
  export default {
    name:'locationDetails',
    components: {
      JmForm,
      JmTable,
      draggable
    },
    data(){
      return {
        breadcrumbArr:[],
        src:'',
        src1:'',
        columns:[
          { label: '功能位置名称', prop: 'deptName',required: true, formDisabled: true, span:8,placeholder:' '},
          { label: '所属组织', prop: 'orgName',required: true, formDisabled: true,span:8, },
          { label: '功能位置编码', prop: 'deptCode',required: true, formDisabled: true,  span:8, },
          { label: '设备位置属性', prop: 'funAttr',required: true, formDisabled: true,formType: 'select', options:[], span:8, },
          { label: '备注', prop: 'remark', required: true,formType: 'textarea',formDisabled: true,span:16,},
        ],
        formData: {
          orgName:'',
          deptName:'',
          deptCode:'',
          funAttr:'',
          remark:''
        },
        activeName: 'first', // 默认选中tabs
        // 表格数据
        templateList: [],
        templateList1: [],
        loading: true,
        // 总条数
        total: 0,
        total1: 0,
        // 表格头部
        tablecolumns:[
          { label: "设备编码", prop: "deviceCode" },
          { label: "设备名称", prop: "deviceName" },
          { label: "规格型号", prop: "specs" },
          { label: "设备类别", prop: "categoryName", },
          { label: "设备状态", prop: "deviceStatus",formType: "select",options:[], styleFn(row){
            if(row.deviceStatus == '在用'){
              return `color:#FFF;background-color:#0EB912;padding:5px;border-radius: 5px;`
            }else if(row.deviceStatus == '修理'){
              return `color:#FFF;background-color:#EE3232;padding:5px;border-radius: 5px;`
            }else if(row.deviceStatus == '备用'){
              return `color:#FFF;background-color:#4A92FC;padding:5px;border-radius: 5px;`
            }else if(row.deviceStatus == '闲置'){
              return `color:#FFF;background-color:#1F77FC;padding:5px;border-radius: 5px;`
            }
            else if(row.deviceStatus == '待处置'){
              return `color:#FFF;background-color:#6802B6;padding:5px;border-radius: 5px;`
            }
            else if(row.deviceStatus == '待报废'){
              return `color:#FFF;background-color:#F88221;padding:5px;border-radius: 5px;`
            }
            else if(row.deviceStatus == '已报废'){
              return `color:#FFF;background-color:#848484;padding:5px;border-radius: 5px;`
            }
          }},
          { label: "财务资产编码", prop: "propertyCode", },
          // { label: "功能位置", prop: "b", },
          { label: "重要等级", prop: "level", },
          { label: "所属子公司", prop: "subCompanyName", },
          { label: "所属组织", prop: "affDeptName", },
          { label: "当前使用组织", prop: "currDeptName", },
          { label: "购置日期", prop: "createTime",},
          { label: "设备属性", prop: "deviceAtt",formType: "select",options:[] },
          { label: "上级设备", prop: "parentDeviceName", },
        ],
        tablecolumns1:[
          { label: "文件名称", prop: "originalFileName" },
          { label: "上传时间", prop: "createTime" },
          { label: "上传人员", prop: "createBy" },
          { label: "文件大小", prop: "fileSize", },
        ],
        // 位置图片
        action:process.env.VUE_APP_BASE_API + "/common/upload", // 上传地址
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        funAttrOption:[],
        sysFileResources:[], // 图片集合
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        busId:'',
        uploadDialogVisible:false, // 是否显示上传弹窗
        fileList:[], // 上传弹窗，文件列表
      }
    },
    computed:{
      funAttr1:function () {
        return  this.findName(this.columns[3].options,this.formData.funAttr)
      }
    },
    mounted(){
      this.getRouteData()
      this.getAttr()
      this.getStatus()
      this.getAtt()
    },
    methods:{
      imgMove(e){
        let arr = this.sysFileResources.map(item=>item.id)
        updateSortNum(arr).then(res=>{
          this.getBaseInfo()
        }
          
          
        )
      },
      // 获取路由参数
      getRouteData(){
        let BreadcrumbArr = JSON.parse(this.$route.query.BreadcrumbArr)
         console.log(this.$route.query,'路由参数')
        if(BreadcrumbArr){
          this.breadcrumbArr = BreadcrumbArr.reverse()
          let id = this.breadcrumbArr[this.breadcrumbArr.length-1].id
           this.busId = this.$route.query.i
          //this.busId = id
          console.log(BreadcrumbArr,id,this.busId)
          this.getBaseInfo()
          this.getDevice()
          this.getFile()
          this.getImg()
        }
      },
      // 获取设备状态
      getStatus(){
        getDeviceStatus().then(res=>{
          /* console.log(res,'设备状态') */
          if(res.data){
            res.data.forEach(item=>{
              item.label= item.dictLabel
              item.value = item.dictValue
            })
            this.tablecolumns.forEach(item=>{
              if(item.prop =='deviceStatus'){
                item.options = res.data
              }
            })
          }
        })
      },
      // 获取设备属性
      getAtt(){
        getDeviceAtt().then(res=>{
          /* console.log(res,'设备属性') */
          if(res.data){
            res.data.forEach(item=>{
              item.label= item.dictLabel
              item.value = item.dictValue
            })
            this.tablecolumns.forEach(item=>{
              if(item.prop =='deviceAtt'){
                item.options = res.data
              }
            })
          }
        })
      },
      // 获取设备列表
      getDevice(query){
        let params = {
          location:this.busId,
          ...query
        }
        locationDetailDevice(params).then(res=>{
          /* console.log(res,'设备列表') */
          res.rows.forEach(item=>{
            if(item?.archivesOther?.propertyCode){
              item.propertyCode = item.archivesOther.propertyCode
            }
          })
          this.templateList = res.rows
          this.total = res.total
        })
      },
      // 获取位置图片列表
      getImg(){
        let params = {
          busId:this.busId,
          origin:'FLP',
        }
        locationDetailFile(params).then(res=>{
          /* console.log(res,'图片列表') */
          this.sysFileResources=[]
          res.rows.forEach(item=>{
            this.sysFileResources.push({
              name:item.originalFileName,
              url:`${process.env.VUE_APP_BASE_API}${item.fileName}`,
              id:item.id
            })
          })
        })
      },
      // 获取文件列表
      getFile(){
        let params = {
          busId:this.busId,
          origin:'FLF',
        }
        locationDetailFile(params).then(res=>{
          /* console.log(res,'文件列表') */
          this.templateList1 = res.rows
          this.total1 = res.total
        })
      },
      // 获取功能位置属性
      getAttr(){
        getLocationAttr().then(res=>{
          /* console.log(res,'功能位置属性') */
          if(res.data){
            res.data.forEach(item=>{
              item.label= item.dictLabel
              item.value = item.dictValue
            })
            this.funAttrOption =res.data
              console.log('this.funAttrOption',this.funAttrOption)
            this.columns.forEach(item=>{
              if(item.prop =='funAttr'){
                item.options = res.data
                
              }
            })
          }
        })
      },
      // 点击切换tabs
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      // 获取基本信息
      getBaseInfo(){
        console.log('getbaseInfo',this.busId)
        locationDetail({id:this.busId}).then(res=>{
          /* console.log(res,'基本信息') */
          this.columns.forEach(item=>{
            if(res.data[item.prop]){
              this.formData[item.prop] = res.data[item.prop]
            }

0          })
          this.src = res.data.bannerUrl?`${process.env.VUE_APP_BASE_API}${res.data.bannerUrl}`:false
          this.src1 = res.data.qrCode?`${process.env.VUE_APP_BASE_API}${res.data.qrCode}`:false
          console.log(this.src)
        })
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
        this.uploadDialogVisible = true
        this.fileList = []
      },
      // 统一删除文件和图片
      deleteFile(id){
        locationDetailFileDelete(id).then(res=>{
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getFile()
          this.getBaseInfo()
        })
      },
      // 文件-点击删除
      handleDelete(row){
        this.$modal.confirm('是否确认删除？').then(()=>{
          this.deleteFile(row.id)
        })
        
      },
      // 文件-点击下载
      handleDownload(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.fileName}`
        this.$download.resource(row.fileName)
       // this.download('common/download', {}, row.originalFileName)
      },
      // 文件-点击预览
      handlePreview(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.fileName}`
        window.open(url)
      },
      // 设备-点击下载
      downloadClick(row){
        // console.log(row)
        this.download('equipment/base/export',{location:this.busId},`device_${new Date().getTime()}.xlsx`)
      },
      // 位置图片-删除
      handleRemove(file) {
        this.$modal.confirm('是否确认删除？').then(()=>{
          this.sysFileResources.forEach((item,idx)=>{
          if(item.uid == file.uid){
            this.sysFileResources.splice(idx,1)
          }
        })
        locationDetailFileDelete(file.id).then(
          this.getBaseInfo()
        )
        })
        
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /* handleDownload(file) {
        console.log(file);
      }, */
      // 上传成功回调
      onSuccess(res,file,fileList){
        let imgTypeArr=['png','jpg','gif','jpeg','jfif','pjp','pjpeg']
        if(imgTypeArr.includes(file.name.substring(file.name.lastIndexOf('.')+1))){
          fileList[fileList.length-1]={
          busId : this.busId,
          origin : 'FLP',
          ...fileList[fileList.length-1],
          ...fileList[fileList.length-1].response,
          url:`${process.env.VUE_APP_BASE_API}${fileList[fileList.length-1].response.fileName}`
        }
         //fileList[fileList.length?fileList.length-1:0]=Object.assign(res,{busId:this.busId,origin:'FLP'})
        //this.sysFileResources = fileList; 
        // 自动保存
        uploadSave([fileList[fileList.length-1]]).then(res=>{
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          let params = {
          busId:this.busId,
          origin:'FLP',
        }
        locationDetailFile(params).then(res=>{
          res.rows&&(()=>{fileList[fileList.length-1].id = res.rows[res.rows.length-1].id})()
          this.sysFileResources=fileList
        })
          this.getBaseInfo() 
        })
        }else{
          this.$message.error('上传图片格式错误，请重新上传')
        }
       
      },
      // 上传弹窗，文件上传成功回调
      onSuccessFile(res,file,fileList){
        if(res.code==200){
           let keys = Object.keys(res)
        fileList.forEach(item=>{
          item.busId = this.busId,
          item.origin = 'FLF'
          keys.forEach(key=>{
            item[key] = res[key]
          })
        })
        }else{
          fileList.pop()
          this.$message.error(res.msg)
        }
       this.fileList = fileList
      },
      // 上传弹窗，文件上传失败回调
      onErrorFile(err,file){
        this.$message.error('上传失败');
      },
      // 上传弹窗，点击确认按钮
      filePrimary(){
        this.uploadDialogVisible = false
        // 自动保存
        
        this.fileList.forEach(item=>{
          item=Object.assign(item,item.response)
        })
        uploadSave(this.fileList).then(res=>{
          /* console.log(res,'文件保存成功') */
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getFile()
        })
      },
      findName(options, value) {
        var name = "";
        for (let i = 0; i < options.length; i++) {
          if (options[i].value == value) {
            name = options[i].label;
          }
        }
        return name || value;
      },
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
  ::v-deep .el-image{
    background-color: #F5F7FA;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .upload_box{
    min-height: 400px;
  }
  .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    position: relative;
    &:hover{
      .img_btn{
        text-align: center;
        line-height: 148px;
        font-size: 22px;
        display: flex;
        color: white;
        justify-content: space-evenly;
        span{
          cursor: pointer;
        }
      }
    }
} 
 .img_btn{
  width:100%;
  height: 100%;
   background-color: rgba(0,0,0,.5);
   position: absolute;
   top: 0;
   display: none;
} 
</style>
