<template>
  <div class="app-container">
    <jm-table :tableData="plineList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:mline:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:mline:export']">导出</el-button>
        </el-col> -->
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:mline:edit']">编辑</el-button>
        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:mline:remove']">删除</el-button></template>
    </jm-table>
  </div>
</template>

<script>
import {
  listMline,
  getMline,
  delMline,
  addMline,
  updateMline,
  changeItemStatus
} from '@/api/maintain/mline'
import JmTable from '@/components/JmTable';
export default {
  name: "Template",
  dicts: ['sys_normal_disable'],
  components: { JmTable },
  computed: {
    // 列信息
    columns() {
      return [
        { label: '维保路线编码', prop: 'lineCode', class: true },
        { label: '维保路线名称', prop: 'lineName', },
        { label: '状态', prop: 'lineStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, span: 24},
        { label: '创建人', prop: 'createBy', },
        { label: '创建时间', prop: 'createTime', formType: 'date' },
        { label: '更新者', prop: 'updateBy' },
        { label: '更新时间', prop: 'updateTime', formType: 'date' },
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
      // 总条数
      total: 0,
      // 巡点检路线表格数据
      plineList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lineCode: null,
        lineName: null,
        lineStatus: null,
        delFlag: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 表单参数
      form: {},
    }
  },
  created() {
    this.getList(this.queryParams)
  },
  methods: {
    /** 查询巡点检路线列表 */
    getList(queryParams) {
      this.loading = true
      listMline(queryParams).then((response) => {
        this.plineList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.lineId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleStatusChange(event, prop, row) {
      let text = row.lineStatus === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.lineName + '"吗？')
        .then(function () {
          return changeItemStatus(row.lineId, row.lineStatus)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.lineStatus = row.lineStatus === '0' ? '1' : '0'
        })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/maintain/mline/add', query: { l: '', d: false } })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/maintain/mline/add', query: { l: row.lineId, d: false, i: true } })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.lineId != null) {
            updateMline(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMline(this.form).then((response) => {
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
      const lineIds = row.lineId || this.ids
      this.$modal
        .confirm('是否确认删除巡点检路线名称为"' + row.lineName + '"的数据项？')
        .then(function () {
          return delMline(lineIds)
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
        'maintain/pline/export',
        {
          ...this.queryParams,
        },
        `pline_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
