<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="保养项目编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入保养项目编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保养项目名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入保养项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保养部位" prop="itemArea">
        <el-input
          v-model="queryParams.itemArea"
          placeholder="请输入保养部位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保养类型" prop="itemType">
        <el-select v-model="queryParams.itemType" placeholder="请选择保养类型" clearable>
          <el-option
            v-for="dict in dict.type.mro_m_item_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="保养工具" prop="itemTool">
        <el-input
          v-model="queryParams.itemTool"
          placeholder="请输入保养工具"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="itemStatus">
        <el-select v-model="queryParams.itemStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建者" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="更新者" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker
          clearable
          v-model="queryParams.updateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['maintain:mitem:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['maintain:mitem:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['maintain:mitem:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['maintain:mitem:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mitemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="itemId" v-if="false" />
      <el-table-column label="序号" align="center" />
      <el-table-column label="保养项编码" align="center" prop="itemCode" />
      <el-table-column label="保养项名称" align="center" prop="itemName" />
      <el-table-column label="保养部位" align="center" prop="itemArea" />
      <el-table-column label="保养内容" align="center" prop="itemContent" />
      <el-table-column label="保养类型" align="center" prop="itemType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mro_m_item_type" :value="scope.row.itemType" />
        </template>
      </el-table-column>
      <el-table-column label="保养工具" align="center" prop="itemTool" />
      <el-table-column label="状态" align="center" prop="itemStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.itemStatus" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['maintain:mitem:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['maintain:mitem:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改保养检修项目对话框 -->
    <el-drawer :title="title" :visible.sync="open" size="30%" append-to-body>
      <el-form ref="form" class="p_form" :model="form" :rules="rules" label-width="130px">
        <el-form-item class="p_input" label="保养项目编码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入保养项目编码" />
        </el-form-item>
        <el-form-item label="保养项目名称" prop="itemName">
          <el-input class="p_input" v-model="form.itemName" placeholder="请输入保养项目名称" />
        </el-form-item>
        <el-form-item label="保养部位" prop="itemArea">
          <el-input class="p_input" v-model="form.itemArea" placeholder="请输入保养部位" />
        </el-form-item>
        <el-form-item label="保养内容">
          <el-input class="p_input" v-model="form.itemContent" placeholder="请输入保养部位" />
        </el-form-item>
        <el-form-item label="保养类型" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择保养类型">
            <el-option
              class="p_input"
              v-for="dict in dict.type.mro_m_item_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养工具" prop="itemTool">
          <el-input class="p_input" v-model="form.itemTool" placeholder="请输入保养工具" />
        </el-form-item>
        <el-form-item label="状态" prop="itemStatus">
          <el-radio-group v-model="form.itemStatus">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input class="p_input" type="textarea" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  listMitem,
  getMitem,
  delMitem,
  addMitem,
  updateMitem,
} from '@/api/maintain/mitem'

export default {
  name: 'Mitem',
  dicts: ['mro_m_item_type', 'sys_normal_disable'],
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
        itemId: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询保养检修项目列表 */
    getList() {
      this.loading = true
      listMitem(this.queryParams).then((response) => {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
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
      this.$modal
        .confirm('是否确认删除保养检修项目编号为"' + itemIds + '"的数据项？')
        .then(function () {
          return delMitem(itemIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
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
