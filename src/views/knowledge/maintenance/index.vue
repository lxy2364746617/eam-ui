<template>
  <div>
    <div class="pageStyle">
      <el-card class="box-card1" shadow="never">
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
              @click="handlePreview(scope.row)"
            >预览</el-button>
          </template>
        </jm-table>
      </el-card>
      <!-- 上传弹窗 -->
      <el-dialog title="上传" v-if="dialogTableVisible" :visible.sync="dialogTableVisible" width="500px">
        <div class="body_box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="类型" prop="kdbType">
              <el-select v-model="ruleForm.kdbType" placeholder="请选择">
                <el-option-group
                  v-for="group in options"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="运维文档" prop="fileResources">
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
import { maintainList,maintainType,maintainAdd,maintainListDel } from '@/api/knowledge'
import { download } from '@/utils'
import { getToken } from "@/utils/auth";
import JmTable from "@/components/JmTable1";
  export default {
    name:'maintenance',
    components: { 
      JmTable
    },
    data(){
      return {
        // 表单头部
        tablecolumns:[
          { label: "文件名称", prop: "fileName" },
          { label: "类型", prop: "kdbType", formType: "selectF",options:[],type:'template',template(row,item){
            let text = ''
            item.options.forEach(items=>{
              items.options.forEach(itemss=>{
                if(row[item.prop] == itemss.value){
                  text = itemss.label
                }
              })
            })
            return `<span>${text}</span>`
          }},
          { label: "计划编码", prop: "planCode" },
          { label: "计划名称", prop: "planName", },
          { label: "上传人员", prop: "createBy", },
          { label: "上传时间", prop: "createTime",formType: "date", formType: "daterange",width:200 },
        ],
        // 表格数据
        templateList: [],
        // 总条数
        total: 0,
        // 遮罩层
        loading: true,
        dialogTableVisible:false, // 是否显示弹窗
        ruleForm: {
          kdbType: '',
          fileResources:[],
        },
        rules: {
          kdbType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          fileResources: [
            { type: 'array',required: true, message: '请上传运维文档', trigger: 'change' }
          ],
        },
        options: [],
        // 上传地址
        action:process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
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
        let id = this.$route.query.id
        if(id){
          this.getList({id:id})
          // this.$refs['jmTable'].queryParams.fileName = fileName
          // this.$refs['jmTable'].handleQuery() // 模拟搜索
        }else{
          this.getList()
        }
      },
      // 点击新增
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
      // 获取表单数据
      getList(queryParams) {
        this.loading = true;
        maintainList(queryParams).then(response => {
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 获取运维文档类型 
      getType(){
        maintainType().then(res=>{
          // console.log(res.data)
          this.options = res.data
          this.tablecolumns.forEach(item=>{
            if(item.prop == 'kdbType'){
              item.options = res.data
            }
          })
        })
      },
      // 上传成功回调
      onSuccess(res,file,fileList){
        // console.log(res,'上传成功~')
        let keys = Object.keys(res)
        fileList.forEach(item=>{
          keys.forEach(key=>{
            item[key] = res[key]
          })
        })
        this.ruleForm.fileResources = fileList;
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
            this.ruleForm.fileResources[0].kdbType = this.ruleForm.kdbType
            let params = [{
              ...this.ruleForm.fileResources[0]
            }]
            maintainAdd(params).then(res=>{
              this.dialogTableVisible = false
              this.getList()
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
            }) 
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 点击删除
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
      // 点击下载
      handleDownload(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        download(url)
      },
      // 点击预览
      handlePreview(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        window.open(url)
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