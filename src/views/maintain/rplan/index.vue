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
      <el-form-item label="主键" prop="planId">
        <el-input
          v-model="queryParams.planId"
          placeholder="请输入主键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检验计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入检验计划编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检验计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入检验计划名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划状态" prop="planStatus">
        <el-select v-model="queryParams.planStatus" placeholder="请选择计划状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检验类型" prop="itemType">
        <el-select v-model="queryParams.itemType" placeholder="请选择检验类型" clearable>
          <el-option
            v-for="dict in dict.type.mro_r_item_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检验周期" prop="planCycle">
        <el-input
          v-model="queryParams.planCycle"
          placeholder="请输入检验周期"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检验周期类别" prop="planCycleType">
        <el-select v-model="queryParams.planCycleType" placeholder="请选择检验周期类别" clearable>
          <el-option
            v-for="dict in dict.type.mro_r_cycle_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划开始时间" prop="planBeginTime">
        <el-date-picker
          clearable
          v-model="queryParams.planBeginTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划开始时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划结束时间" prop="planEndTime">
        <el-date-picker
          clearable
          v-model="queryParams.planEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="本次执行日期" prop="thisExecuteTime">
        <el-date-picker
          clearable
          v-model="queryParams.thisExecuteTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择本次执行日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="下次执行日期" prop="nextExecuteTime">
        <el-date-picker
          clearable
          v-model="queryParams.nextExecuteTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择下次执行日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="检测单位" prop="supplierId">
        <el-input
          v-model="queryParams.supplierId"
          placeholder="请输入检测单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检测单位负责人" prop="leader">
        <el-input
          v-model="queryParams.leader"
          placeholder="请输入检测单位负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="内部负责人" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入内部负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['maintain:rplan:add']"
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
          v-hasPermi="['maintain:rplan:edit']"
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
          v-hasPermi="['maintain:rplan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['maintain:rplan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rplanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="planId" />
      <el-table-column label="检验计划编码" align="center" prop="planCode" />
      <el-table-column label="检验计划名称" align="center" prop="planName" />
      <el-table-column label="计划状态" align="center" prop="planStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.planStatus" />
        </template>
      </el-table-column>
      <el-table-column label="检验类型" align="center" prop="itemType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mro_r_item_type" :value="scope.row.itemType" />
        </template>
      </el-table-column>
      <el-table-column label="检验周期" align="center" prop="planCycle" />
      <el-table-column label="检验周期类别" align="center" prop="planCycleType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mro_r_cycle_type" :value="scope.row.planCycleType" />
        </template>
      </el-table-column>
      <el-table-column label="计划开始时间" align="center" prop="planBeginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planBeginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center" prop="planEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次执行日期" align="center" prop="thisExecuteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.thisExecuteTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下次执行日期" align="center" prop="nextExecuteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.nextExecuteTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测单位" align="center" prop="supplierId" />
      <el-table-column label="检测单位负责人" align="center" prop="leader" />
      <el-table-column label="内部负责人" align="center" prop="userId" />
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
            v-hasPermi="['maintain:rplan:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['maintain:rplan:remove']"
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

    <!-- 添加或修改定期检验_定期检验计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="planId">
          <el-input v-model="form.planId" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="检验计划编码" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入检验计划编码" />
        </el-form-item>
        <el-form-item label="检验计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入检验计划名称" />
        </el-form-item>
        <el-form-item label="计划状态" prop="planStatus">
          <el-radio-group v-model="form.planStatus">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检验类型" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择检验类型)">
            <el-option
              v-for="dict in dict.type.mro_r_item_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验周期" prop="planCycle">
          <el-input v-model="form.planCycle" placeholder="请输入检验周期" />
        </el-form-item>
        <el-form-item label="检验周期类别" prop="planCycleType">
          <el-select v-model="form.planCycleType" placeholder="请选择检验周期类别">
            <el-option
              v-for="dict in dict.type.mro_r_cycle_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planBeginTime">
          <el-date-picker
            clearable
            v-model="form.planBeginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndTime">
          <el-date-picker
            clearable
            v-model="form.planEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="本次执行日期" prop="thisExecuteTime">
          <el-date-picker
            clearable
            v-model="form.thisExecuteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择本次执行日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="下次执行日期" prop="nextExecuteTime">
          <el-date-picker
            clearable
            v-model="form.nextExecuteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择下次执行日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="检测单位" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入检测单位" />
        </el-form-item>
        <el-form-item label="检测单位负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入检测单位负责人" />
        </el-form-item>
        <el-form-item label="内部负责人" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入内部负责人" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRplan,
  getRplan,
  delRplan,
  addRplan,
  updateRplan,
} from '@/api/maintain/rplan'

export default {
  name: 'Rplan',
  dicts: ['mro_r_item_type', 'mro_r_cycle_type', 'sys_normal_disable'],
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
      // 定期检验_定期检验计划表格数据
      rplanList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: null,
        planCode: null,
        planName: null,
        planStatus: '0',
        itemType: null,
        planCycle: null,
        planCycleType: null,
        planBeginTime: null,
        planEndTime: null,
        thisExecuteTime: null,
        nextExecuteTime: null,
        supplierId: null,
        leader: null,
        userId: null,
        delFlag: null,
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
    this.getList()
  },
  methods: {
    /** 查询定期检验_定期检验计划列表 */
    getList() {
      this.loading = true
      listRplan(this.queryParams).then((response) => {
        this.rplanList = response.rows
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
        supplierId: null,
        leader: null,
        userId: null,
        delFlag: null,
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
      this.ids = selection.map((item) => item.planId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加定期检验_定期检验计划'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const planId = row.planId || this.ids
      getRplan(planId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改定期检验_定期检验计划'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.planId != null) {
            updateRplan(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRplan(this.form).then((response) => {
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
        .confirm(
          '是否确认删除定期检验_定期检验计划编号为"' + planIds + '"的数据项？'
        )
        .then(function () {
          return delRplan(planIds)
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
        'maintain/rplan/export',
        {
          ...this.queryParams,
        },
        `rplan_${new Date().getTime()}.xlsx`
      )
    },
  },
}
</script>
