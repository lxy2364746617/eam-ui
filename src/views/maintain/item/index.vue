<template>
  <div class="app-container">
    <jm-table :tableData="itemList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:item:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleImport"
            v-hasPermi="['equipment:book:add']">导入</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['maintain:item:edit']">修改</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['maintain:item:remove']">删除</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:item:export']">导出</el-button>
        </el-col> -->
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:item:edit']">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:item:remove']">删除</el-button>
      </template>
    </jm-table>

    <!-- 导入 -->
    <file-import @handleFileSuccess="handleFileSuccess" :downloadTemplateUrl="'/maintain/item/importTemplate'"
      ref="fileImport" :importUrl="'/maintain/item/importData'" :isUpdate="false"></file-import>

    <!-- 添加或修改维护计划_巡点检项目对话框 -->
    <el-drawer :title="title" :visible.sync="open" size="30%" append-to-body>
      <el-form ref="form" class="p_form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="巡点检项目编码:">
          <el-input v-model="form.itemCode" class="p_input" placeholder="请输入巡点检项目编码" disabled />
        </el-form-item>
        <el-form-item label="巡点检内容:" prop="itemContent">
          <el-input class="p_input" v-model="form.itemContent" placeholder="请输入巡点检内容" />
        </el-form-item>
        <el-form-item label="巡点检方法:" prop="itemMethod">
          <el-select v-model="form.itemMethod" placeholder="请选择巡点检方法">
            <el-option class="p_input" v-for="dict in dict.type.mro_item_method" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡点检类型:" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择巡点检类型">
            <el-option class="p_input" v-for="dict in dict.type.mro_item_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="itemStatus">
          <el-radio-group v-model="form.itemStatus">
            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input class="p_input" type="textarea" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  listItem,
  getItem,
  delItem,
  addItem,
  updateItem,
  changeItemStatus,
} from '@/api/maintain/item'
import JmTable from '@/components/JmTable';
import fileImport from '@/components/FileImport'
export default {
  name: 'Item',
  dicts: ['sys_normal_disable', 'mro_item_method', 'mro_item_type'],
  components: { JmTable, fileImport },
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
      // 维护计划_巡点检项目表格数据
      itemList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemCode: null,
        itemContent: null,
        itemMethod: null,
        itemType: null,
        itemStatus: null,
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
        itemContent: [
          { required: true, message: '巡点检内容不能为空', trigger: 'blur' },
        ],
        itemMethod: [
          { required: true, message: '巡点检方法不能为空', trigger: 'blur' },
        ],
        itemType: [
          { required: true, message: '巡点检类型不能为空', trigger: 'blur' },
        ],
        itemStatus: [
          { required: true, message: '状态不能为空', trigger: 'blur' },
        ],
      },

    }
  },
  computed: {
    // 列信息
    columns() {
      return [
        // { label: '序号', prop: 'itemId' },
        { label: '巡点检项目编码', prop: 'itemCode' },
        { label: '巡点检内容', prop: 'itemContent' },
        { label: '巡点检方法', prop: 'itemMethod', formType: 'select', options: this.dict.type.mro_item_method, },
        { label: '巡点检类型', prop: 'itemType', formType: 'select', options: this.dict.type.mro_item_type, },
        { label: '状态', prop: 'itemStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime', formType: 'date' },
        { label: '修改人', prop: 'updateBy' },
        { label: '修改时间', prop: 'updateTime', formType: 'date' }
      ]
    },
  },
  created() {
    this.getList(this.queryParams)
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.fileImport.upload.open = true
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.getList(this.queryParams)
    },
    /** 查询维护计划_巡点检项目列表 */
    getList(queryParams) {
      this.loading = true
      listItem(queryParams).then((response) => {
        this.itemList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 巡点检项目状态修改
    handleStatusChange(event, prop, row) {
      let text = row.itemStatus === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.itemContent + '"吗？')
        .then(function () {
          return changeItemStatus(row.itemId, row.itemStatus)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.itemStatus = row.itemStatus === '0' ? '1' : '0'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        itemId: null,
        itemCode: null,
        itemContent: null,
        itemMethod: null,
        itemType: null,
        itemStatus: '0',
        remark: null,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('jmtable')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.itemId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加巡点检项目'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const itemId = row.itemId || this.ids
      getItem(itemId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改巡点检项目'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.itemId != null) {
            updateItem(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addItem(this.form).then((response) => {
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
      const itemIds = row.itemId || this.ids
      this.$modal
        .confirm(
          '是否确认删除巡点检项目编码为"' + row.itemCode + '"的数据项？'
        )
        .then(function () {
          return delItem(itemIds)
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
        'maintain/item/export',
        {
          ...this.queryParams,
        },
        `item_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
<style scoped>
.p_input {
  width: 90%;
}

.p_form {
  height: calc(100vh - 139px);
}
</style>
