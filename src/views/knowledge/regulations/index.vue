<template>
  <div>
    <div class="pageStyle">
      <el-card class="box-card1" shadow="never">
        <jm-table :tableData="templateList" 
            :checkbox="false"
            @getList="getList" 
            :total="total" 
            :handleWidth="150"
            :columns="tablecolumns" ref="jmTable">
            <template slot="headerLeft">
                <el-button type="primary" icon="el-icon-plus" size="mini"  @click="uploadDialog('add')">上传</el-button>
              </template>
            <template #end_handle="scope">
              <el-button 
                size="mini" 
                type="text" 
                icon="el-icon-edit" 
                @click="handleUpdate(scope.row, 'edit')"
              >编辑</el-button>
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
      </el-card>
      <!-- 上传弹窗 -->
      <el-dialog title="上传" v-if="dialogTableVisible" :visible.sync="dialogTableVisible" width="600px" :destroy-on-close="true" @close="close">
        <div class="body_box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="规则类型" prop="ruleType">
              <el-select v-model="ruleForm.ruleType" placeholder="请选择">
                <el-option v-for="(item,index) in options" :key="index" :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标准状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :label="1">现行</el-radio>
                <el-radio :label="2">作废</el-radio>
                <el-radio :label="3">编辑</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布日期" prop="releaseDate">
              <el-date-picker type="date" placeholder="发布日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.releaseDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="实施日期" prop="effectiveDate">
              <el-date-picker type="date" placeholder="实施日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.effectiveDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="文件描述" prop="content">
              <el-input type="textarea" v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item label="规章制度" prop="fileResources" v-if="uploadShow">
              <el-upload
                class="upload-demo"
                :action="action"
                :headers="headers"
                :on-success="onSuccess"
                :on-error="onError"
                :file-list="ruleForm.fileResources">
                <el-button type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmClick" style="margin-right:100px;">确 认</el-button>
          <el-button @click="dialogTableVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ruleAdd,ruleType,ruleList,ruleListDel,ruleListEdit } from '@/api/knowledge'
import { download } from '@/utils'
import { getToken } from "@/utils/auth";
import JmTable from "@/components/JmTable1";
  export default {
    name:'regulations',
    components: { 
      JmTable
    },
    data(){
      return {
        // 表单头部
        tablecolumns:[
          { label: "文件名称", prop: "fileName"},
          { label: "文件简述", prop: "content" },
          { label: "规章类型", prop: "ruleType", formType: "select",options:[{label:'1',value:'1'}]},
          { label: "标准状态", prop: "status", formType: "select",options:[{label:'现行',value:1},{label:'作废',value:2},{label:'编辑',value:3}], styleFn(row){
            if(row.status == 1){
              return `color:#02B606`
            }else if(row.status == 2){
              return `color:#F77408`
            }else if(row.status == 3){
              return `color:#1F77FC`
            } 
          }
        },
          { label: "发布日期", prop: "releaseDate", formType: "date", },
          { label: "实施时间", prop: "effectiveDate", formType: "date", },
          { label: "更新人员", prop: "updateBy", },
          { label: "更新时间", prop: "updateTime", formType: "date",},
        ],
        // 表格数据
        templateList: [],
        // 总条数
        total: 0,
        // 遮罩层
        loading: true,
        dialogTableVisible:false, // 是否显示弹窗
        uploadShow: true, // 是否显示上传组件
        typeText:'', // 弹窗类型文本（如：edit || add）
        // 上传地址
        action:process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        ruleForm: {
          ruleType: '',
          status: 1,
          releaseDate:'',
          effectiveDate:'',
          content:'',
          fileResources:[],
        },
        // 规章制度类型
        options: [],
        rules: {
          ruleType: [
            { required: true, message: '请至少选择一个规则类型', trigger: 'change' }
          ],
          releaseDate: [
            {  required: true, message: '请选择日期', trigger: 'blur' }
          ],
          effectiveDate: [
            {  required: true, message: '请选择时间', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请填写文件描述', trigger: 'blur' }
          ],
          fileResources: [
            { type: 'array',required: true, message: '请上传规章制度', trigger: 'change' }
          ],
        },
      }
    },
    mounted(){
      this.getRouteData()
      this.getType()
    },
    methods:{
      // 获取路由参数
      getRouteData(){   
        console.log(this.$refs['jmTable'])
        let name = this.$route.query.name
        if(name){
          this.$refs['jmTable'].name = name
          this.$refs['jmTable'].handleQuery()
        }
        this.getList()
      },
      // 获取规章制度类型 
      getType(){
        ruleType().then(res=>{
          this.options = res.data
          if(res.data){
            res.data.forEach(item=>{
              item.label = item.dictLabel
              item.value = item.dictValue
            })
          }
          this.tablecolumns.forEach(item=>{
            if(item.prop == 'ruleType'){
              item.options = res.data
            }
          })
        })
      },
      // 获取表单数据
      getList(queryParams) {
        this.loading = true;
        ruleList(queryParams).then(res => {
          this.templateList = res.rows;
          this.total = res.total;
          this.loading = false;
        });
      },
      // 上传成功回调
      onSuccess(res,file){
        console.log(res,'上传成功~')
        this.ruleForm.fileResources.push({
          name:res.originalFileName,
          ...res
        })
      },
      // 上次失败回调
      onError(err,file){
        console.log(err,'上传失败~')
      },
      // 点击弹窗确认按钮
      confirmClick(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // console.log(this.ruleForm)
            let params = {
              ...this.ruleForm
            }
            // console.log(params)
            if(this.typeText == 'edit'){
              ruleListEdit(params).then(res=>{
                this.dialogTableVisible = false
                this.getList()
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              })
            }else if(this.typeText == 'add'){
              ruleAdd(params).then(res=>{
              this.dialogTableVisible = false
                this.getList()
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              }) 
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 点击编辑
      handleUpdate(row,text){
        console.log(row)
        this.typeText = text
        let keys = Object.keys(this.ruleForm)
        keys.forEach(item=>{
          this.ruleForm[item] = row[item]
        })
        this.dialogTableVisible = true // 是否显示弹窗
        this.uploadShow = false; // 是都显示上传组件
      },
      // 点击删除
      handleDelete(row){
        console.log(row)
        ruleListDel({id:row.id,fileId:row.fileId}).then(res=>{
          this.getList()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
      },
      // 点击下载
      handleDownload(row){
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        download(url)
      },
      // 点击预览
      handlePreview(row){
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        window.open(url)
      },
      // 点击上传按钮(新增)
      uploadDialog(text){
        this.typeText = text
        let keys = Object.keys(this.ruleForm)
        keys.forEach(item=>{
          if(item == 'fileResources'){
            this.ruleForm[item] = []
          }else if(item == 'status'){
            this.ruleForm[item] = 1
          }else{
            this.ruleForm[item] = ''
          }
        })
        this.dialogTableVisible = true
      },
      // 弹窗关闭回调
      close(){
        this.uploadShow = true
      }
    }
  }
</script>

<style lang="scss" scoped>
.body_box{
  width: 100%;
  height: 600px;
  padding-top:20px;
}
.dialog-footer{
  height: 66px;
  line-height: 66px;
  box-shadow: 0px 4px 10px 0px;
  text-align: center;
}
::v-deep .el-dialog__footer{
  padding: 0%;
}
::v-deep .el-dialog__header{
  border-bottom: 1px solid #D8D8D8;
}
::v-deep .el-dialog__body{
  height: calc(100% - 121px);
  padding:0  20px;
  display: flex;
}
</style>