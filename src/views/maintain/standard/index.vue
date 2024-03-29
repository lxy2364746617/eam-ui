<template>
  <div class="app-container">
    <jm-table v-if="showstate" :tableData="standardList" @getList="getList" @handleSelectionChange="handleSelectionChange"
      :total="total" ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange" @rowClick='rowClick'>
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:standard:add']">新增</el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete"
            v-hasPermi="['maintain:standard:remove']">删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['maintain:standard:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:standard:export']">导出</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:standard:edit']">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:standard:remove']">删除</el-button>
        <el-button size="mini" type="text" @click="CopyTo(scope.row)"
          v-hasPermi="['maintain:standard:edit']">复制到</el-button>
      </template>
    </jm-table>
    <el-dialog :visible='checkVisible'  :before-close="()=>checkVisible=false" width="80%" :close-on-click-modal='false'>
      <el-tabs v-model="activeName">
      <el-tab-pane label='日常点检' name='RCDJ'> </el-tab-pane>
      <el-tab-pane label='精密点检' name='JMDJ'> </el-tab-pane>
      <el-tab-pane label='专职点检' name='ZZDJ'> </el-tab-pane>
    </el-tabs>
    <el-table :data="tableData">
      <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="巡点检项目编码" align="center" prop="itemCode" min-width="150" />
        <el-table-column label="部件" align="center" prop="partsName" min-width="200"></el-table-column>
        <el-table-column label="巡点检内容" align="center" prop="itemContent" min-width="150" />
        <el-table-column label="巡点检点数" align="center" prop="checkNum" min-width="150"></el-table-column>
        <el-table-column label="巡点检状态" align="center" prop="checkStatus" min-width="150"></el-table-column>
        <el-table-column label="巡点检标准" align="center" prop="checkStandard" min-width="150"></el-table-column>
        <el-table-column label="巡点检方法" align="center" prop="itemMethod" min-width="150" />
        <el-table-column label="巡点检结果类型" align="center" prop="checkResType" min-width="150"></el-table-column>
        <el-table-column label="巡点检结果设置" align="center" prop="checkResult" min-width="150"></el-table-column>
        <el-table-column label="定量值" align="center" prop="quotaValue" min-width="150"></el-table-column>
        <el-table-column label="定量上限" align="center" prop="quotaUpper" min-width="150"></el-table-column>
        <el-table-column label="定量下限" align="center" prop="quotaLower" min-width="150"></el-table-column>
        <el-table-column label="定量单位" align="center" prop="quotaUnit" min-width="150"></el-table-column>
    </el-table>
    </el-dialog>
    
  </div>
</template>

<script>
import {
  listStandard,
  delStandard,
  addStandard,
  updateStandard,
  changeItemStatus,
  scheckList
} from '@/api/maintain/standard'
import JmTable from '@/components/JmTable';
import JmForm from "@/components/JmForm";
import { equipmentTree } from '@/api/equipment/category';
import { listDept } from '@/api/system/dept';
import { getLocationTree} from '@/api/Location'

export default {
  name: "Template",
  dicts: ['em_is_special', 'sys_normal_disable'],
  components: { JmTable, JmForm },
  computed: {
    // 列信息
    columns() {
      return [
        // { label: '序号', prop: 'standardId' },
        // { label: '设备ID', prop: 'deviceId' },
        { label: '设备编码', prop: 'deviceCode', class: true },
        { label: '设备名称', prop: 'deviceName', },
        { label: '规格型号', prop: 'specs', },
        {
          label: '设备类别',
          prop: 'categoryId',
          formType: 'selectTree',
          options: this.categoryOptions,
          width: 280,
        },
        { label: '功能位置', prop: 'location',options:this.locationOptions,formType: 'selectTree',width: 180,},
        { label: '是否特种设备', prop: 'isSpecial', formType: 'select', options: this.dict.type.em_is_special, },
        {
          label: '当前使用组织', prop: 'currDeptId', formType: 'selectTree',
          options: this.deptOptions,
          width: 180,
        },
        {
          label: '所属组织', prop: 'affDeptId', formType: 'selectTree',
          options: this.deptOptions,
          width: 180,
        },
        { label: '状态', prop: 'standardStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, span: 24 },
        // { label: '备注', prop: 'remark' },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime', formType: 'daterange',width:200 },
        // { label: '更新者', prop: 'updateBy' },
        // { label: '更新时间', prop: 'updateTime', formType: 'date' },
      ]
    },
    form_columns() {
      return [
        { label: "设备名称", prop: "deviceName", span: 8, required: true, },
        { label: "设备编码", prop: "deviceCode", span: 8, required: true, },
        { label: "设备类别", prop: "categoryId", formType: 'selectTree', options: this.categoryOptions, span: 8, required: true, },
        { label: "是否是特种设备", prop: "isSpecial", formType: 'select', options: this.dict.type.em_is_special, tableVisible: false, span: 8, formDisabled: true, required: true, }, //(Y 是、N 否)
        { label: "功能位置", prop: "location", span: 8, required: true, },
        { label: "规格型号", prop: "specs", span: 8, },
        { label: "当前使用组织", prop: "currDeptId", formType: 'selectTree', options: this.deptOptions, span: 8, required: true, },
        { label: "所属组织", prop: "affDeptId", formType: 'selectTree', options: this.deptOptions, span: 8, required: true, },
        { label: "状态", prop: "deviceStatus", formType: 'selectTag', options: this.dict.type.sys_normal_disable, span: 8, required: true, },
        { label: "备注", },
      ]
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 维护计划_巡点检标准表格数据
      standardList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: null,
        deviceName: null,
        deviceCode: null,
        categoryId: null,
        isSpecial: null,
        location: null,
        specs: null,
        currDeptId: null,
        affDeptId: null,
        standardStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      checkQueryParams:{
        pageNum: 1,
        pageSize: 10,
      },
      // 表单校验
      valueMap: {},
      // 部门树选项
      deptOptions: [],
      categoryOptions: [],
      locationOptions:[],
      showstate: true,
      tableData:[],
      activeName:'RCDJ',
      checkVisible:false
    }
  },
  watch:{
    activeName(newval){
      this.checkQueryParams.itemType=newval
      scheckList(this.checkQueryParams).then(res=>{
          this.tableData=res.rows
        })
    }
  },
  created() {
    this.getTree()
    this.getTreeSelect()
    this.getList(this.queryParams)
  },
  mounted(){
  },
  methods: {
    /** 查询设备档案下拉树结构 */
    getTree() {
      this.showstate = false;
      equipmentTree().then((response) => {
        this.categoryOptions = response.data
        // 方便获取父级tree;
        this.loops(this.categoryOptions)
      }).then(() => {
        this.showstate = true;
      })
      getLocationTree().then(res=>{
        this.locationOptions=this.getTreeName(res.data)
      })
    },
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
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data
      })
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
    /** 查询维护计划_巡点检标准列表 */
    getList(queryParams) {
      this.loading = true
      listStandard(queryParams).then((response) => {
        this.standardList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
      rowClick(row){
        this.checkQueryParams.itemType='RCDJ'
        this.checkQueryParams.standardId=row.standardId
        scheckList(this.checkQueryParams).then(res=>{
          this.tableData=res.rows
          this.checkVisible=true
        })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.standardId)
      this.queryParams.exportIds = selection.map((item) => item.standardId).join(',')
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/maintain/patrol/p_standard/add', query: { l: '', d: false } })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/maintain/patrol/p_standard/add', query: { l: row.standardId, d: false, i: true } })
    },
     /** 复制按钮操作 */
    CopyTo(row) {
      this.$router.push({ path: '/maintain/patrol/p_standard/copyTo', query: { l: row.standardId,deviceId:row.deviceId} })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const standardIds = row.standardId || this.ids
      if(row.standardId||this.ids.length>0){
      this.$modal
        .confirm(!row.standardId?'确认删除吗？' :'是否确认删除设备名称为"' + row.deviceName + '"的数据项？')
        .then(function () {
          return delStandard(standardIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
      }else{
        this.$modal.msgSuccess("请至少选择一项");
      }
    },
    // 巡点检项目状态修改
    handleStatusChange(event, prop, row) {
      let text = row.standardStatus === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.deviceName + '"吗？')
        .then(function () {
          return changeItemStatus(row.standardId, row.standardStatus)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.standardStatus = row.standardStatus === '0' ? '1' : '0'
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'maintain/standard/export',
        {
          ...this.queryParams,
        },
        `standard_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog:not(.is-fullscreen){
    margin: 15vh auto !important;
    max-height: 70vh;
    overflow-y: auto;
  }
::v-deep .el-dialog__wrapper{
  position: fixed;
  left:200px !important;
}
</style>
