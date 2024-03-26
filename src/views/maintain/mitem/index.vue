<template>
  <div class="app-container">
    <jm-table  :tableData="mitemList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary"  icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:mitem:add']">新增</el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete"
            v-hasPermi="['maintain:mitem:remove']">删除</el-button>
            <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleImport"
            v-hasPermi="['maintain:mitem:import']">导入</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['maintain:mitem:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['maintain:mitem:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:mitem:export']">导出</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:mitem:edit']">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:mitem:remove']">删除</el-button>
      </template>
    </jm-table>

    <!-- 添加或修改保养检修项目对话框 -->
    <el-drawer :title="title" :visible.sync="open" size="30%" append-to-body>
      <div class="drawer_form">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item class="p_input" label="保养项目编码" prop="itemCode">
            <el-input v-model="form.itemCode" placeholder="请输入保养项目编码" disabled />
          </el-form-item>
          <el-form-item label="保养项目名称" prop="itemName">
            <el-input class="p_input" v-model="form.itemName" placeholder="请输入保养项目名称" />
          </el-form-item>
          <el-form-item label="保养部位" prop="itemArea">
            <el-input class="p_input" v-model="form.itemArea" placeholder="请输入保养部位" />
          </el-form-item>
          <el-form-item label="保养类型" prop="itemType">
            <el-select v-model="form.itemType" placeholder="请选择保养类型">
              <el-option class="p_input" v-for="dict in dict.type.BYJX" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保养内容">
            <el-input class="p_input" type="textarea" v-model="form.itemContent" maxlength="100" show-word-limit placeholder="请输入保养部位" />
          </el-form-item>
          <el-form-item label="保养工具" prop="itemTool">
            <el-input class="p_input" v-model="form.itemTool" placeholder="请输入保养工具" />
          </el-form-item>
          <el-form-item label="状态" prop="itemStatus">
            <el-radio-group v-model="form.itemStatus">
              <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="p_input" type="textarea" v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer" style="text-align:center;padding-top: 10px;">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-drawer>
    <file-import @handleFileSuccess="handleFileSuccess" :downloadTemplateUrl="'/maintain/mitem/importTemplate'"
      ref="fileImport" :importUrl="'/maintain/mitem/importData'" :isUpdate="false"></file-import>
  </div>
</template>

<script>
import {
  listMitem,
  getMitem,
  delMitem,
  addMitem,
  updateMitem,
  changeItemStatus
} from '@/api/maintain/mitem'
import JmTable from '@/components/JmTable';
import fileImport from '@/components/FileImport'
export default {
  name: 'Mitem',
  dicts: ['BYJX', 'sys_normal_disable'],
  components: { JmTable,fileImport },
  data() {
    return {
      hasgetData:false,
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
      // 保养检修项目表格数据
      mitemList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemCode: null,
        itemName: null,
        itemArea: null,
        itemContent: null,
        itemType: null,
        itemTool: null,
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
       /*  itemCode: [{ required: true, message: '保养项目编码不能为空', trigger: 'blur' }], */
        itemName: [{ required: true, message: '保养项目名称不能为空', trigger: 'blur' }],
        itemArea: [{ required: true, message: '保养部位不能为空', trigger: 'blur' }],
        itemContent: [{ required: true, message: '保养内容不能为空', trigger: 'blur' }],
        itemType: [{ required: true, message: '保养类型不能为空', trigger: 'blur' }],
        //itemTool: [{ required: true, message: '保养工具不能为空', trigger: 'blur' }],
        itemStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      },
    }
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: '保养项编码', prop: 'itemCode' },
        { label: '保养项名称', prop: 'itemName' },
        { label: '保养部位', prop: 'itemArea' },
        { label: '保养类型', prop: 'itemType', formType: 'select', options: this.dict.type.BYJX, },
        { label: '保养内容', prop: 'itemContent', showOverflowTooltip:true},
        { label: '保养工具', prop: 'itemTool', },
        { label: '状态', prop: 'itemStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, },
        //{ label: '备注', prop: 'remark' },
        { label: '创建者', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime', formType: 'datetime' },
      ]
    },
  },
   created() {
    this.getList(this.queryParams)
  },
  methods: {
    /** 查询保养检修项目列表 */
    getList(queryParams) {
      !queryParams&&this.$refs.jmtable.resetPage()
      this.loading = true
      listMitem(queryParams).then((response) => {
        this.mitemList = response.rows
        this.total = response.total
        this.loading = false
        
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
        itemName: null,
        itemArea: null,
        itemContent: null,
        itemType: null,
        itemTool: null,
        itemStatus: '0',
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      }
      this.resetForm('form')
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
      this.title = '添加保养检修项目'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const itemId = row.itemId || this.ids
      getMitem(itemId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改保养检修项目'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.itemId != null) {
            updateMitem(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMitem(this.form).then((response) => {
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
      if(row.itemId||this.ids.length>0){
      this.$modal
        .confirm(!row.itemId?'确认删除吗？' :'是否确认删除保养检修项目编号为"' + row.itemCode + '"的数据项？')
        .then(function () {
          return delMitem(itemIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {this.ids=[]})
      }else{
          this.$modal.msgSuccess("请至少选择一项");
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'maintain/mitem/export',
        {
          ...this.queryParams,
        },
        `mitem_${new Date().getTime()}.xlsx`
      )
    },
    handleStatusChange(event, prop, row) {
      let text = row.itemStatus === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.itemCode + '"吗？')
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
    handleImport() {
      this.$refs.fileImport.upload.open = true
    },
    handleFileSuccess() {
      this.getList(this.queryParams)
    },
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-drawer__header{
  border-bottom:1px solid #DCDFE6;
  padding: 20px;
  margin-bottom: 12px;
}
.p_input {
  width: 90%;
}

.drawer_form {
  border-bottom:1px solid #DCDFE6;
  height: calc(100vh - 135px);
  overflow-y: scroll;
}
</style>
