<template>
  <div class="pageStyle">
      <el-card class="box-card1" shadow="never">
        <jm-table :tableData="templateList"
        :queryParams="table_search_params"
        :handleWidth="200"
        @getList="getList"
        :checkbox="false"
        :total="total"
        :columns="tablecolumns"
        @linkClick='linkClick'
        ref="jmTable"
        v-hasPermi="['kdb:tech:list']"
        >
            <template slot="headerLeft">
              <el-button type="primary"
                         v-hasPermi="['kdb:tech:add']"
                         icon="el-icon-plus" size="mini"  @click="addClick">上传</el-button>
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
                v-if="viewType.includes(scope.row.fileType)"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handlePreview(scope.row)"
              >预览</el-button>
            </template>
        </jm-table>
      </el-card>
      <!-- 上传弹窗 -->
      <el-dialog  title="上传" :visible.sync="dialogTableVisible" :fullscreen="true">
        <div class="dialog_left">
          <div class="title"><i class="el-icon-s-operation"></i>已选择的设备</div>
          <div class="btn_box">
            <el-button type="primary" size="mini"  @click="sbDialog">点击选择设备</el-button>
            <span class="num">已选{{templateList1.length}}台设备</span>
          </div>
          <jm-table :tableData="templateList1"
            :checkbox="false"
            :showSearch="false"
            :showPage="false"
            :columns="tablecolumns1"
            @getList="getListUpload">
            <template #end_handle="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="uploadDelete(scope.row)"
                v-hasPermi="['kdb:tech:remove']"
              >删除</el-button>
            </template>
          </jm-table>
        </div>
        <div class="dialog_right">
          <div class="title"><i class="el-icon-upload"></i>上传资料</div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="上传技术资料" prop="sysFileResources">
              <el-upload
                class="upload-demo"
                :action="action"
                :headers="headers"
                :on-success="onSuccess"
                :on-error="onError"
                :file-list="ruleForm.sysFileResources">
                <el-button type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogConfirmClick" style="margin-right:150px;">确 认</el-button>
          <el-button @click="dialogTableVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 选择设备弹窗 -->
      <el-dialog title="选择设备" :visible.sync="dialogSbVisible" :fullscreen="true" v-hasPermi="['equipment:base:listBySearch']">
        <div class="dialog_left1" ref="left_box">
          <el-input
            v-show="!isHide"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div style="text-align:right;margin-top:20px;">
            <el-button :icon="mergeIcon" style="font-size:20px;padding:5px;" @click="mergeBtn"></el-button>
          </div>
          <el-tree
            v-show="!isHide"
            class="filter-tree"
            :data="dataTree"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="treeClick"
            ref="tree">
          </el-tree>
        </div>
        <div class="dialog_right1" ref="right_box">
          <el-input placeholder="设备名称/设备编码/设备批次号" v-model="searchText" style="width:500px;margin-bottom:20px;">
            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <jm-table :tableData="templateList2"
              :showSearch="false"
              :showOperate="false"
              :columns="tablecolumns2"
              @handleSelectionChange="handleSelectionChange"
              :total="total2"
              @getList="getListDevice"
              >
            </jm-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmDeviceClick" style="margin-right:150px;">确 认</el-button>
          <el-button @click="dialogSbVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>

import { techList,equipmentTree,equipmentTreeList,techAdd,techListDel,addClickNum } from '@/api/knowledge'
import { download } from '@/utils'
import { getToken } from "@/utils/auth";
import JmTable from "@/components/JmTable1";
import { equipmentTreeNoTemplate as deviceTree}  from '@/api/equipment/category'
import log from "../../monitor/job/log";
import { getLocationTree} from '@/api/Location'
import { listDept } from '@/api/system/dept'
  export default {
    name:'technology',
    components: {
      JmTable
    },
    data(){
      return {
        loading: true,
        // 技术资料表格搜索参数
        table_search_params:null,
        // 表单头部
        
        // 表格数据
        templateList: [],
        // 总条数
        total: 0,

        
        templateList1: [],
        // 上传地址
        action:process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        dialogTableVisible:false,
        // 选择设备
        ruleForm: {
          sysFileResources:[],
        },
        rules: {
          sysFileResources: [
            { type: 'array',required: true, message: '请上传技术资料', trigger: 'change' }
          ],
        },



        templateList2: [],
        // 总条数
        total2: 0,
        deviceCheckboxData:[], // 已选择的设备数据
        dialogSbVisible:false,
        filterText:'', // tree 搜索
        searchText:'', // 列表搜索
        treeId:'', // tree Id
        isHide: false, // 是否合并（隐藏）
        mergeIcon: 'el-icon-s-fold',  // 合并（icon）
        dataTree: [],
        categoryOptions:[],
        locationOptions:[],
        deptOptions:[],
        valueMap: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        viewType:['jpg','bmp', 'gif', 'jpg', 'jpeg', 'png','pdf' ]
      }
    },
    computed:{
      tablecolumns(){
        return[
          { label: "文件名称", prop: "fileName" },
          { label: "设备编码", prop: "deviceCode",type:'link'},
          { label: "设备名称", prop: "deviceName", },
          { label: "设备类别", prop: "categoryId",options:this.categoryOptions,formType: 'selectTree',width: 230, },/*  */
          { label: "规格型号", prop: "specs", },
          { label: "上传人员", prop: "createBy", },
          { label: "上传时间", prop: "createTime", formType: "datetime", formType: "daterange",width:200},
        ]
    },
    tablecolumns1(){
      return[
          { label: "设备名称", prop: "deviceName"},
          { label: "设备编码", prop: "deviceCode"},
          { label: "规格型号", prop: "specs"},
          { label: "设备类别", prop: "categoryId",formType: 'selectTree',options:this.categoryOptions,width: 280,},
          { label: "功能位置", prop: "location",options:this.locationOptions,formType: 'selectTree',width: 180,},
          { label: "设备批次号", prop: "batchNo"},
          { label: "所属子公司", prop: "subCompanyName"},
          { label: "所属组织", prop: "affDeptId",formType: 'selectTree',options: this.deptOptions,width: 180,},  
        ]
    },
    tablecolumns2(){
      return[
          { label: "设备名称", prop: "deviceName"},
          { label: "设备编码", prop: "deviceCode"},
          { label: "规格型号", prop: "specs"},
          { label: "设备类别", prop: "categoryId",formType: 'selectTree',options:this.categoryOptions,width: 280,},
          { label: "功能位置", prop: "location",options:this.locationOptions,formType: 'selectTree',width: 180,},
          { label: "设备批次号", prop: "batchNo"},
          { label: "所属子公司", prop: "subCompanyName"},
          { label: "所属组织", prop: "affDeptId",formType: 'selectTree',options: this.deptOptions,width: 180,},
        ]
    },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
   async created(){
     await deviceTree().then((response) => {
        this.categoryOptions = response.data
        // 方便获取父级tree
        this.loops(this.categoryOptions)
      })
     await getLocationTree().then(res=>{
        this.locationOptions=this.getTreeName(res.data)
      })
      await listDept().then((response) => {
        this.deptOptions = response.data
      })
      this.getRouteData()
    },
    methods:{
      getTreeName(arr){
      arr.forEach(item=>{
          item.value=item.deptId
          item.label=item.deptName
          item.isDisabled=item.locationFlag=='N'?true:false
          if(item.children&&item.children.length>0){
            this.getTreeName(item.children)
          }
        })
        return arr
    },
      // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        })
        node.children = this.loops(children, node)
        return node
      })
    },
      // 获取路由参数
      getRouteData(){
        let id = this.$route.query.id
        if(id){
          this.getList({id:id})
          // this.$refs['jmTable'].queryParams.id = id
          // this.$refs['jmTable'].handleQuery() // 模拟搜索
        }else{
          this.getList()
        }
      },
      // 获取表单数据
      getList(queryParams) {
        this.loading = true;
        techList(queryParams).then(response => {
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 点击删除
      handleDelete(row){
        this.$confirm('是否确定删除文件名为'+row.fileName+'的数据？').then(()=>{
          techListDel({id:row.id,fileId:row.fileId}).then(res=>{
          this.getList()
          this.$message({
          message: '操作成功！',
          type: 'success'
        })
        })
        })
        
      },
      // 点击下载
      handleDownload(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        download(url)
        addClickNum({id:row.id})
      },
      // 点击预览
      handlePreview(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        window.open(url)
        addClickNum({id:row.id})
      },
      // 点击添加（上传）
      addClick(){
        let keys = Object.keys(this.ruleForm)
        keys.forEach(item=>{
          if(item == 'sysFileResources'){
            this.ruleForm[item] = []
          }else{
            this.ruleForm[item] = ''
          }
        })
        this.templateList1 = []
        this.dialogTableVisible = true
      },




      // 获取上传表格数据
      getListUpload(queryParams) {
        this.loading = true;
        listlbase(queryParams).then(response => {
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 点击选择设备
      sbDialog(){
        this.treeId = ''
        this.searchText=''
        this.templateList2 = []
        this.getEquipmentTree()
      },
      // 上传成功回调
      onSuccess(res,file,fileList){
       // console.log(res,'上传成功~')
       if(res.code==200){
         let keys = Object.keys(res)
          keys.forEach(key=>{
            file[key] = res[key]
          })
       }else{
         fileList.pop()
         this.$message.error(res.msg)
       }
        this.ruleForm.sysFileResources = fileList;
      },
      // 上传失败回调
      onError(err,file){
        console.log(err,'上传失败~')
      },
      // 点击新增确认按钮
      dialogConfirmClick(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // console.log(this.ruleForm)
            let ids = []
            if(this.deviceCheckboxData){
              this.deviceCheckboxData.forEach(item=>{
                ids.push(item.deviceId)
              })
            }

            let params = {
              busId:ids,
              ...this.ruleForm
            }
            // console.log(params)
            techAdd(params).then(res=>{
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
        })
      },
      // 点击上传列表删除按钮
      uploadDelete(row){
        this.templateList1.forEach((item,idx)=>{
          if(item.deviceId == row.deviceId){
            this.templateList1.splice(idx,1)
          }
        })
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      },
      linkClick(row,item){
        console.log('linkclick')
        this.$router.push({name:'bookDetails',query:{i:row.deviceId}})
      },


      // 获取设备树
      getEquipmentTree(){
        deviceTree().then(res=>{
          // console.log(res)
          this.dataTree = res.data
          this.dialogSbVisible = true
        })
      },
      // 点击树节点回调
      treeClick(row,node,el){
        // console.log(row)
        this.treeId = row.id
        this.getListDevice({categoryId:row.id})
      },
      // 获取设备表格数据
      getListDevice(queryParams) {
        this.loading = true;
        queryParams.exportIds=this.templateList1.map(item=>item.deviceId).join(',')
        equipmentTreeList(queryParams).then(response => {
          this.templateList2 = response.rows;
          this.total2 = response.total;
          this.loading = false;
        });
      },
      // 树，搜索
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 点击左侧选择设备 按钮《隐藏》||《显示》
      mergeBtn(){
        this.isHide = !this.isHide
        // console.log(this.isHide)
        if(!this.isHide){
          this.$refs['left_box'].style.width = '30%'
          this.$refs['right_box'].style.width = '70%'
          this.mergeIcon = 'el-icon-s-fold'
        }else{
          this.$refs['left_box'].style.width = '50px'
          this.$refs['right_box'].style.width = 'calc(100% - 50px)'
          this.mergeIcon = 'el-icon-s-unfold'
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        // console.log(selection)
        this.deviceCheckboxData = selection
      },
      // 点击设备确认按钮
      confirmDeviceClick(){
        this.templateList1 = this.templateList1.concat(this.deviceCheckboxData) 
        this.dialogSbVisible = false
        console.log('this.templateList1:',this.templateList1)
        /* this.$message({
          message: '操作成功！',
          type: 'success'
        }) */
      },
      // 点击设备搜索按钮
      searchClick(){
        this.getListDevice({categoryId:this.treeId,searchValue:this.searchText})
      }
    }
  }
</script>

<style lang="scss" scoped>
.title{
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  i{
    font-size: 20px;
    color: #1F77FC;
    margin-right: 10px;
  }
}
.dialog_left{
  width: 70%;
  height:calc( 100vh - 121px);
  border-right: 1px solid #D8D8D8;
  overflow-y:auto;
  overflow-x:hidden;
}
.dialog_right{
  width: 30%;
  height: 100%;
  padding: 0 10px;
}
.dialog_left1{
  width: 25%;
  height: 100%;
  border-right: 1px solid #D8D8D8;
  padding: 20px 10px 20px 0;
  overflow: hidden;
  overflow-y: auto;
  transition: all 0.5s;
}
.dialog_right1{
  width: 75%;
  height:calc(100vh - 121px) ;
  padding: 20px 0 20px 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
.btn_box{
  margin-bottom: 20px;
  .num{
    margin-left: 20px;
  }
}
.page_box{
  padding: 20px 0;
  text-align: right;
}
.dialog-footer{
  height: 66px;
  line-height: 66px;
  box-shadow: 0px 4px 10px 0px;
  text-align: center;
}
::v-deep .el-dialog__header{
  border-bottom: 1px solid #D8D8D8;
}
::v-deep .el-dialog__body{
  height: calc(100% - 121px);
  padding:0  20px;
  display: flex;
}
::v-deep .el-dialog__footer{
  padding: 0%;
}
::v-deep .el-input-group__append button.el-button{
  background: #1F77FC;
  color: #FFF;
}
::v-deep .is-current>.el-tree-node__content{
  background-color: #007bfe!important;
  color: #fff!important;
}
// ::v-deep .el-tree-node__content:hover{
//   background-color: #deedfc!important;
// }
</style>
