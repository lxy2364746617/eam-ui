<template>
  <div class="location pageStyle">
    <!--部门数据-->
    <div class="location_left">
      <el-card shadow="never" style="margin-right:10px;height:100%">
        <jm-user-tree :treeData="deptOptions" @handleNodeClick="handleNodeClick" :defaultExpIds="defaultExpIds">
          <template slot="middle-pos">
            <el-button type="text" icon="el-icon-document-add" @click="addTreeItem"
                       v-hasPermi="['system:location:add']"
            ></el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="editTreeItem" v-if="locationFlag=='Y'"
                       v-hasPermi="['system:location:add']"
            ></el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteTreeItem(nowClickTreeItem)" v-if="locationFlag=='Y'"
                       v-hasPermi="['system:location:remove']"
            ></el-button>
          </template>
        </jm-user-tree>
      </el-card>
    </div>
    <!--用户数据-->
    <div class="location_right">
      <!-- 基本信息 -->
      <el-card shadow="never">
        <div slot="header" class="location_right_header">
          <span>{{ rightTitle }}</span>
          <div>
            <el-button size="mini" v-show="!isBaseData" @click="cancel">取消</el-button>
            <el-button size="mini" v-show="!isBaseData" @click="saveClick" type="primary">保存</el-button>
            <el-button size="mini" v-show="isBaseData" @click="detailsClick" type="primary"
            >查看详情</el-button>
          </div>
        </div>
        <div class="content">
          <div class="content_left">
            <jm-form
              :showButton= "false"
              :columns="columns"
              :formData="formData"
              :labelWidth="'150px'"
              @submitForm="submitForm"
              ref='form'
              :labelPosition="'left'"
              >
            </jm-form>
          </div>
          <div class="content_right">
            <el-image :src="src||require('@/assets/images/noImg.png')" style="width: 180px;height:180px;">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size:30px;color:#909399"></i>
              </div>
            </el-image>
          </div>
        </div>
      </el-card>
      <!-- 下级信息 -->
      <el-card shadow="never" style="margin-top:10px;">
        <jm-table :tableData="templateList"
          :handleWidth="200"
          :checkbox="true"
          @getList="getList"
          :total="total"
          @handleSelectionChange="handleSelectionChange"
          :columns="tablecolumns" ref="jmTable">
          <template slot="headerLeft">
              <el-button type="primary" plain icon="el-icon-plus" size="mini"  @click="downloadClick"
                         v-hasPermi="['system:location:export']"
              >下载</el-button>
            </template>
          <template #end_handle="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleDetails(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </jm-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import JmUserTree from "@/components/JmUserTree1";
import JmTable from "@/components/JmTable1";
import JmForm from "@/components/JmForm1";
import { flat,parentTree } from "@/utils/index.js"
import { getLocationTree,locationInfo,saveOrUpdate,getLocationAttr,locationRemove} from '@/api/Location'
  export default {
    name:'Location',
    components: {
      JmUserTree,
      JmForm,
      JmTable
    },
    data(){
      return {
        // 部门树选项
        deptOptions: [],
        defaultExpIds:[],
        nowClickTreeItem: "",
        rightTitle: '基本信息',
        columns:[
          { label: '所属组织', prop: 'orgName',required: true, formDisabled: true,span:24, },
          { label: '功能位置名称', prop: 'deptName',required: true, formDisabled: true, span:24,  },
          { label: '功能位置编码', prop: 'deptCode',required: true, formDisabled: true,  span:24, },
          { label: '功能位置属性', prop: 'funAttr',formType: 'select', options:[], span:24,formDisabled: true, },
          { label: '上级功能位置', prop: 'parentDeptName',span:24,formDisabled: true,formVisible: false},
          { label: '备注', prop: 'remark',formType: 'textarea',span:24,formDisabled: true, },
        ],
        checkBoxData:[], // 多选数据
        formData: {
          deptName:'',
          orgName:'',
          deptCode:'',
          funAttr:'',
          parentDeptName:'',
          remark:''
        },
        locationFlag:'Y',
        src:'', // 二维码路径
        isBaseData: true, // 是否为基本信息
        // 表格数据
        templateList: [],
        loading: true,
        // 总条数
        total: 0,
        // 表格头部
        tablecolumns:[
          { label: "功能位置名称", prop: "deptName" },
          { label: "功能位置编码", prop: "deptCode" },
          { label: "功能位置属性", prop: "funAttr", formType: "select",options:[],type:'template'},
          { label: "所属组织", prop: "orgName", },
          { label: "上级功能位置", prop: "parentDeptName", },
          { label: "备注", prop: "remark", },
        ],
        // 是否有下级信息
        isChildren: true,
      }
    },
    mounted(){
      this.getTreeData()
      this.getAttr()
    },
    methods:{
      // 扁平化树结构为数组，根据ID获取所有上级
      flatFn(id){
        let arr = flat(this.deptOptions)
        return parentTree(arr,id)
      },
      findTreeName(options, value) {
      var name = "";
      function Name(name) {
        this.name = name;
      }
      var name1 = new Name("");
      this.forfn(options, value, name1);
      return name1.name;
    },
    forfn(options, value, name1) {
      function changeName(n1, x) {
        n1.name = x;
      }
      for (let i = 0; i < options.length; i++) {
        if (options[i].deptId == value) {
          changeName(name1, options[i].deptName);
        }
        if (options[i].children) {
          this.forfn(options[i].children, value, name1);
        }
      }
    },
      // 设置是否显示上级功能位置
      setShowParentLocation(Boolean){
        this.columns.forEach(item=>{
          if(['parentDeptName'].includes(item.prop)){
            item.formVisible = Boolean
          }
        })
      },
      // 获取功能位置属性
      getAttr(){
        getLocationAttr().then(res=>{
          console.log(res,'功能位置属性')
          if(res.data){
            res.data.forEach(item=>{
              item.label= item.dictLabel
              item.value = item.dictValue
            })
            this.columns.forEach(item=>{
              if(item.prop =='funAttr'){
                item.options = res.data
              }
            })
            this.tablecolumns.forEach(item=>{
              if(item.prop =='funAttr'){
                item.options = res.data
              }
            })
          }
        })
      },
      // 点击树节点回调
      handleNodeClick(row){
        console.log(row)
        if(!this.isBaseData){
          this.$message('请保存或退出当前编辑')
        }else{
          this.nowClickTreeItem = row
          this.locationFlag=row.locationFlag
          this.getBaseInfo()
        }
      },
      // 获取基本信息
      getBaseInfo(){
        let params = {
          id:this.nowClickTreeItem.id,
          pageNum:1,
          pageSize:10,
        }
        locationInfo(params).then(res=>{
          console.log(res,'基本信息')
          this.columns.forEach(item=>{
            if(res.data.baseInfo[item.prop]){
              this.formData[item.prop] = res.data.baseInfo[item.prop]
            }else{
              this.formData[item.prop] = ''
            }
          })
          this.templateList = res.data.nextList.records || []
          this.templateList&&this.templateList.forEach(item=>{
            item.parentDeptName=this.findTreeName(this.deptOptions,item.parentId)
          })
          this.total = res.data.nextList.total
          this.src = res.data.baseInfo.qrCode?`${process.env.VUE_APP_BASE_API}${res.data.baseInfo.qrCode}`:false
        })
      },
      // 获取表格数据
      getList(queryParams) {
        this.loading = true;
        let params = {
          ...queryParams,
          id:this.nowClickTreeItem.id
        }
        locationInfo(params).then(response => {
          console.log(response)
          this.templateList = response.data.nextList.records || []
          this.templateList&&this.templateList.forEach(item=>{
            item.parentDeptName=this.findTreeName(this.deptOptions,item.parentId)
          })
          this.total = response.data.nextList.total;
          this.loading = false;
        });
      },
      // 多选表格回调
      handleSelectionChange(data){
        console.log(data)
        this.checkBoxData = data
      },
      // 获取树数据
      getTreeData(){
        getLocationTree().then(res=>{
          console.log(res,'tree-data')
          this.deptOptions = res.data
          //展开一二级
          let arr=[]
          this.deptOptions.forEach(item=>{
            arr.push(item.id)
            /* if(item.children.length>0){
              item.children.forEach(item2=>{
            arr.push(item2.id)
              })
            } */
          })
          this.defaultExpIds=arr
        })
      },
      // 树节点新增
      addTreeItem(){
        this.rightTitle = '新增下级功能位置'
        this.isBaseData = false;
        let editShowArr = ['deptName','funAttr','remark']
        this.setShowParentLocation(true)
        this.columns.forEach(item=>{
          if(editShowArr.includes(item.prop)){
            item.formDisabled = false
            this.formData[item.prop]= ''
          }
        })
        this.$refs['form'].clearValidate();
      },
      // 树节点编辑
      editTreeItem(){
        this.rightTitle = '编辑基本信息'
        this.isBaseData=false
        let arr = ['deptName','funAttr','remark']
        this.setShowParentLocation(false)
        this.columns.forEach(item=>{
          if(arr.includes(item.prop)){
            item.formDisabled = false
          }
        })
        this.$refs['form'].clearValidate();
      },
      // 树节点删除
      deleteTreeItem(row) {
        console.log(row)
        let params = {
          deptId:[],
        }
        params.deptId.push(row.deptId)
        this.$modal.confirm('是否确认删除？').then(function() {
          return locationRemove(params);
        }).then(() => {
          this.$modal.msgSuccess("操作成功");
          this.getTreeData();
        }).catch(() => {});
      },
      /** 提交按钮 */
      submitForm: function(formdata) {
        console.log(formdata,'提交表单')
        console.log(this.nowClickTreeItem,'当前节点数据')
        let id = this.rightTitle == '编辑基本信息'?this.nowClickTreeItem.id:''
        let params = {
          ancestors: this.nowClickTreeItem.ancestors,
          deptName: formdata.deptName,
          flag: "Y",
          funAttr: formdata.funAttr,
          parentDeptCode: this.nowClickTreeItem.deptCode,
          parentDeptId: this.nowClickTreeItem.deptId,
          remark: formdata.remark,
          id:id
        }
        // 新增或编辑
        saveOrUpdate(params).then(res=>{
          this.cancel()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getTreeData( )
        })

      },
      // 点击表单取消
      cancel(){
        this.rightTitle = '基本信息'
        this.isBaseData=true
        this.setShowParentLocation(false)
        this.columns.forEach(item=>{
          item.formDisabled = true
        })
        this.getBaseInfo()
      },
      // 点击保存
      saveClick(){
        console.log(this.$refs['form'])
        this.$refs['form'].submitForm()
      },
      // 点击详情
      detailsClick(){
        let BreadcrumbArr = this.flatFn(this.nowClickTreeItem.deptId)
        this.$router.push({name:'LocationDetails',query:{BreadcrumbArr:JSON.stringify(BreadcrumbArr),i:this.nowClickTreeItem.id}})
      },
      // 点击表格删除
      handleDelete(row){
        this.deleteTreeItem(row)
      },
      // 点击表格编辑
      handleEdit(row){
        console.log(row)
        this.handleNodeClick(row)
        this.editTreeItem()
      },
      // 点击表格详情
      handleDetails(row){
        console.log(row)
        let BreadcrumbArr = this.flatFn(this.nowClickTreeItem.deptId)
        this.$router.push({name:'LocationDetails',query:{BreadcrumbArr:JSON.stringify(BreadcrumbArr),i:row.id}})
      },
      // 点击下载
      downloadClick(row){
        let ids = []
        this.checkBoxData.forEach(item=>{
          ids.push(item.id)
        })
        let params = {}
        if(this.checkBoxData.length){
          params.ids = ids
        }else{
          params.id = this.nowClickTreeItem.id
        }
        this.download('/system/location/export',{
          ...params
        },`location_${new Date().getTime()}.xlsx`)
      },
    }
  }
</script>

<style lang="scss" scoped>
.location{
  display: flex;
  .location_left{
    width: 350px;
  }
  .location_right{
    width: calc(100% - 350px);
    .content{
      display: flex;
      .content_left{
        width: calc(100% - 260px);
      }
      .content_right{
        width: 260px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 30px 0 50px;
        box-sizing: border-box;
      }
    }
    .location_right_header{
      display: flex;
      justify-content: space-between;
    }
  }
}
::v-deep .el-card__body{
  height: 100%;
}
::v-deep .el-image{
  background-color: #F5F7FA;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
