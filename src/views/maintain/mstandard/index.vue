<template>
  <div class="app-container">
    <jm-table :tableData="mstandardList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:mstandard:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['maintain:mstandard:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['maintain:mstandard:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:mstandard:export']">导出</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:mstandard:edit']">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:mstandard:remove']">删除</el-button>
        <el-button size="mini" type="text" v-hasPermi="['maintain:mstandard:remove']">复制到</el-button>
      </template>
    </jm-table>
  </div>
</template>

<script>
import {
  listMstandard,
  getMstandard,
  delMstandard,
  addMstandard,
  updateMstandard,
  changeItemStatus
} from '@/api/maintain/mstandard'
import JmTable from '@/components/JmTable';
export default {
  name: "Template",
  dicts: ['em_is_special', 'sys_normal_disable'],
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
      // 显示搜索条件
      // showSearch: true,
      // 总条数
      total: 0,
      // 保养检修标准表格数据
      mstandardList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
        deviceCode: null,
        categoryId: null,
        isSpecial: null,
        location: null,
        specs: null,
        currDeptId: null,
        affDeptId: null,
        standardStatus: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 表单校验
      rules: {
        standardId: [
          { required: true, message: '主键不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: '设备编码', prop: 'deviceCode', class: true },
        { label: '设备名称', prop: 'deviceName' },
        { label: '规格型号', prop: 'specs', },
        { label: '设备类别', prop: 'categoryId' },
        { label: '功能位置', prop: 'location', },
        // { label: '是否特种设备', prop: 'isSpecial', formType: 'select', options: this.dict.type.em_is_special, },
        { label: '当前使用组织', prop: 'currDeptId', },
        { label: '所属组织', prop: 'affDeptId', },
        { label: '状态', prop: 'standardStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, },
        // { label: '备注', prop: 'remark' },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime', formType: 'date' },
        { label: '更新人', prop: 'updateBy' },
        { label: '更新时间', prop: 'updateTime', formType: 'date' },
      ]
    },
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询保养检修标准列表 */
    getList() {
      this.loading = true
      listMstandard(this.queryParams).then((response) => {
        this.mstandardList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.standardId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/maintain/mstandard/add', query: { l: '', d: false } })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/maintain/mstandard/add', query: { l: row.standardId, d: false, i: true } })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.standardId != null) {
            updateMstandard(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMstandard(this.form).then((response) => {
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
      const standardIds = row.standardId || this.ids
      this.$modal
        .confirm(
          '是否确认删除保养检修标准编号为"' + standardIds + '"的数据项？'
        )
        .then(function () {
          return delMstandard(standardIds)
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
        'maintain/mstandard/export',
        {
          ...this.queryParams,
        },
        `mstandard_${new Date().getTime()}.xlsx`
      )
    },
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
  },
}
</script>
