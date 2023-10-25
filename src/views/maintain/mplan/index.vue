<template>
  <div class="app-container">
    <jm-table :tableData="mplanList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:mplan:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:mplan:export']">导出</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:mplan:edit']">编辑</el-button>
        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:mplan:remove']">删除</el-button></template>
    </jm-table>
  </div>
</template>

<script>
import {
  listMplan,
  getMplan,
  delMplan,
  addMplan,
  updateMplan,
  changeItemStatus
} from '@/api/maintain/mplan'
import JmTable from '@/components/JmTable';
export default {
  name: "Template",
  dicts: ['mro_m_cycle_type', 'sys_normal_disable', 'mro_m_item_type'],
  computed: {
    // 列信息
    columns() {
      return [
        { label: '保养计划编码', prop: 'planCode', class: true },
        { label: '保养计划名称', prop: 'planName', class: true },
        { label: '计划开始时间', prop: 'planBeginTime', formType: 'date' },
        { label: '计划结束时间', prop: 'planEndTime', formType: 'date' },
        { label: '下次执行日期', prop: 'nextExecuteTime', formType: 'date' },
        { label: '状态', prop: 'planStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, span: 24, formVisible: false, },
        { label: '保养类型', prop: 'itemType', formType: 'select', options: this.dict.type.mro_m_item_type, },
        { label: '保养周期', prop: 'planCycle', },
        { label: '保养周期类别', prop: 'planCycleType', formType: 'select', options: this.dict.type.mro_m_cycle_type, },
        // { label: '本次执行日期', prop: 'thisExecuteTime', formType: 'date' },
         // { label: '下次执行日期', prop: 'nextExecuteTime', formType: 'date' },
        { label: '保养班组', prop: 'groupId', },
        // { label: '保养执行人', prop: 'executor', },
        { label: '保养负责人', prop: 'director', },
        // { label: '其他执行人', prop: 'otherExecutor', },
        { label: '备注', prop: 'remark', },
        // { label: '创建者', prop: 'createBy', },
        // { label: '创建时间', prop: 'createTime', formType: 'date' },
        // { label: '更新者', prop: 'updateBy' },
        // { label: '更新时间', prop: 'updateTime', formType: 'date' },
      ]
    },
  },
  components: { JmTable },
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
      // 总条数
      total: 0,
      // 巡点检计划表格数据
      mplanList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: null,
        planCode: null,
        planName: null,
        planStatus: null,
        itemType: null,
        planCycle: null,
        planCycleType: null,
        planBeginTime: null,
        planEndTime: null,
        thisExecuteTime: null,
        nextExecuteTime: null,
        groupId: null,
        executor: null,
        director: null,
        otherExecutor: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planId: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList(this.queryParams)
  },
  methods: {
    /** 查询巡点检计划列表 */
    getList(queryParams) {
      this.loading = true
      listMplan(queryParams).then((response) => {
        this.mplanList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.planId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleStatusChange(event, prop, row) {
      let text = row.planStatus === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.planName + '"吗？')
        .then(function () {
          return changeItemStatus(row.planId, row.planStatus)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.planStatus = row.planStatus === '0' ? '1' : '0'
        })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/maintain/mplan/add', query: { l: '', d: false } })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/maintain/mplan/add', query: { l: row.planId, d: false, i: true } })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.planId != null) {
            updateMplan(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMplan(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const planIds = row.planId || this.ids
      this.$modal
        .confirm('是否确认删除巡点检计划名称为"' + row.planName + '"的数据项？')
        .then(function () {
          return delMplan(planIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'maintain/mplan/export',
        {
          ...this.queryParams,
        },
        `mplan_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
