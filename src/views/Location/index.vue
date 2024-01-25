<template>
  <div class="location pageStyle">
    <!--部门数据-->
    <div class="location_left">
      <el-card shadow="never" style="margin-right:10px;height:100%">
        <jm-user-tree :treeData="deptOptions" @handleNodeClick="handleNodeClick">
          <template slot="middle-pos">
            <el-button type="text" icon="el-icon-document-add" @click="addTreeItem"></el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="editTreeItem"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteTreeItem(nowClickTreeItem)"></el-button>
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
            <el-button size="mini" v-show="isBaseData" @click="detailsClick" type="primary">查看详情</el-button>
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
              >
            </jm-form>
          </div>
          <div class="content_right">
            <el-image :src="src"></el-image>
          </div>
        </div>
      </el-card>
      <!-- 下级信息 -->
      <el-card shadow="never" style="margin-top:10px;">
        <jm-table :tableData="templateList"
          :checkbox="false"
          @getList="getList" 
          :total="total"
          :columns="tablecolumns" ref="jmTable">
          <template slot="headerLeft">
              <el-button type="primary" icon="el-icon-plus" size="mini"  @click="downloadClick">下载</el-button>
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
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleDetails(scope.row)"
            >详情</el-button>
          </template>
        </jm-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import JmUserTree from "@/components/JmUserTree1";
import JmTable from "@/components/JmTable1";
import JmForm from "@/components/JmForm";
import { getLocationTree,locationInfo,saveOrUpdate,getLocationAttr,locationRemove } from '@/api/Location'
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
        nowClickTreeItem: "",
        rightTitle: '基本信息',
        columns:[
          { label: '所属组织', prop: 'orgName',required: true, formDisabled: true,span:24, },
          { label: '功能位置名称', prop: 'deptName',required: true, formDisabled: true, span:24,  },
          { label: '功能位置编码', prop: 'deptCode',required: true, formDisabled: true,  span:24, },
          { label: '功能位置属性', prop: 'funAttr',formType: 'select', options:[{label:'其他',value:'qt'}], span:24,formDisabled: true, },
          { label: '上级功能位置', prop: 'parentDeptName',span:24,formDisabled: true,formVisible:true },
          { label: '备注', prop: 'remark',formType: 'textarea',span:24,formDisabled: true, },
        ],
        formData: {
          deptName:'',
          orgName:'',
          deptCode:'',
          funAttr:'',
          parentDeptName:'',
          remark:''
        },
        src:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
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
          { label: "功能位置属性", prop: "funAttr", formType: "selectF",options:[],type:'template',template(row,item){
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
          }
        })
      },
      // 点击树节点回调
      handleNodeClick(row){
        console.log(row)
        if(!this.isBaseData){
          this.$message('请退出当前编辑')
        }else{
          this.nowClickTreeItem = row
          this.getBaseInfo()
        }
      },
      // 获取基本信息
      getBaseInfo(){
        console.log(this.nowClickTreeItem)
        locationInfo({id:this.nowClickTreeItem.id}).then(res=>{
          console.log(res,'基本信息')
          this.columns.forEach(item=>{
            if(res.data.baseInfo[item.prop]){
              this.formData[item.prop] = res.data.baseInfo[item.prop]
            }else{
              this.formData[item.prop] = ''
            }
          })
          console.log(this.formData)
          this.templateList = res.data.nextList

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
      // 获取树数据
      getTreeData(){
        getLocationTree().then(res=>{
          console.log(res,'tree-data')
          this.deptOptions = res.data
        })
      },
      // 树节点新增
      addTreeItem(){
        this.rightTitle = '新增下级功能位置'
        this.isBaseData = false;
        let arr = ['deptName','funAttr','remark']
        this.columns.forEach(item=>{
          if(arr.includes(item.prop)){
            item.formDisabled = false
          }
        })
        arr.forEach(item=>{
          this.formData[item]= ''
        })
      },

      // 树节点编辑
      editTreeItem(){
        this.rightTitle = '编辑基本细腻'
        this.isBaseData=false
        let arr = ['deptName','funAttr','remark']
        this.columns.forEach(item=>{
          if(arr.includes(item.prop)){
            item.formDisabled = false
          }
          if(['parentDeptName'].includes(item.prop)){
            item.formVisible = false
          }
        })
        arr.forEach(item=>{
          this.formData[item]= ''
        })
      },
      // 树节点删除
      deleteTreeItem(row) {
        console.log(row)
        let params = {
          deptId:[]
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
        // this.isBaseData=true
        // this. this.rightTitle = '基本信息'
        // this.$refs["form"].validate(valid => {
        //   if (valid) {
        //     let params = {
        //       ancestors: "0,100",
        //       deptName: this.this.nowClickTreeItem.name,
        //       flag: "Y",
        //       funAttr: this.nowClickTreeItem.code,
        //       funAttrName: this.nowClickTreeItem.key,
        //       parentDeptCode: "11501",
        //       parentDeptId: 129,
        //       remark: "备注"
        //     }
        //     // 新增或编辑
        //     saveOrUpdate().then(res=>{
        //       console.log(res,'新增成功')
        //       this.$message({
        //         message: '操作成功！',
        //         type: 'success'
        //       })
        //     })
        //   }
        // });
      },
      // 表单关闭回调
      cancel(){
        this.rightTitle = '基本信息'
        this.isBaseData=true
        this.columns.forEach(item=>{
          item.formDisabled = true
        })
      },
      // 点击保存
      saveClick(){
        console.log(this.$refs['form'])
        this.$refs['form'].submitForm()
      },
      // 点击详情
      detailsClick(){
        this.$router.push({})
      },
      // 点击表格删除
      handleDelete(row){
        console.log(row)
        // maintainListDel({id:row.id,fileId:row.fileId}).then(res=>{
        //   this.getList()
        //   this.$message({
        //     message: '操作成功！',
        //     type: 'success'
        //   })
        // })
      },
      // 点击表格编辑
      handleEdit(row){
        console.log(row)
        // maintainListDel({id:row.id,fileId:row.fileId}).then(res=>{
        //   this.getList()
        //   // this.$message({
        //   //   message: '操作成功！',
        //   //   type: 'success'
        //   // })
        // })
      },
      // 点击表格详情
      handleDetails(row){
        console.log(row)
        this.$router.push({name:'LocationDetails'})
      },
      // 点击下载
      downloadClick(row){
        // console.log(row)
        let url = `${process.env.VUE_APP_BASE_API}${row.filePath}`
        download(url)
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
  
</style>