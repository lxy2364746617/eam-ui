<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主键" prop="codeId">
        <el-input
          v-model="queryParams.codeId"
          placeholder="请输入主键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="故障代码" prop="faultCode">
        <el-input
          v-model="queryParams.faultCode"
          placeholder="请输入故障代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="故障名称" prop="faultName">
        <el-input
          v-model="queryParams.faultName"
          placeholder="请输入故障名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="故障症状" prop="symptom">
        <el-input
          v-model="queryParams.symptom"
          placeholder="请输入故障症状"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="故障分析原因" prop="reasons">
        <el-input
          v-model="queryParams.reasons"
          placeholder="请输入故障分析原因"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="故障处理措施" prop="measure">
        <el-input
          v-model="queryParams.measure"
          placeholder="请输入故障处理措施"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="删除标志 0=存在,2=删除" prop="delFlag">
        <el-input
          v-model="queryParams.delFlag"
          placeholder="请输入删除标志 0=存在,2=删除"
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
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门Id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入部门Id"
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
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
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
        <el-date-picker clearable
          v-model="queryParams.updateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
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
          v-hasPermi="['maintain:faultcode:add']"
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
          v-hasPermi="['maintain:faultcode:edit']"
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
          v-hasPermi="['maintain:faultcode:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['maintain:faultcode:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="faultcodeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="codeId" />
      <el-table-column label="故障代码" align="center" prop="faultCode" />
      <el-table-column label="故障名称" align="center" prop="faultName" />
      <el-table-column label="故障分类" align="center" prop="faultType" />
      <el-table-column label="故障症状" align="center" prop="symptom" />
      <el-table-column label="故障分析原因" align="center" prop="reasons" />
      <el-table-column label="故障处理措施" align="center" prop="measure" />
      <el-table-column label="启用状态(0=启动、1 停用)" align="center" prop="status" />
      <el-table-column label="删除标志 0=存在,2=删除" align="center" prop="delFlag" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="部门Id" align="center" prop="deptId" />
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
            v-hasPermi="['maintain:faultcode:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['maintain:faultcode:remove']"
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

    <!-- 添加或修改故障代码管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="codeId">
          <el-input v-model="form.codeId" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="故障代码" prop="faultCode">
          <el-input v-model="form.faultCode" placeholder="请输入故障代码" />
        </el-form-item>
        <el-form-item label="故障名称" prop="faultName">
          <el-input v-model="form.faultName" placeholder="请输入故障名称" />
        </el-form-item>
        <el-form-item label="故障症状" prop="symptom">
          <el-input v-model="form.symptom" placeholder="请输入故障症状" />
        </el-form-item>
        <el-form-item label="故障分析原因" prop="reasons">
          <el-input v-model="form.reasons" placeholder="请输入故障分析原因" />
        </el-form-item>
        <el-form-item label="故障处理措施" prop="measure">
          <el-input v-model="form.measure" placeholder="请输入故障处理措施" />
        </el-form-item>
        <el-form-item label="删除标志 0=存在,2=删除" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志 0=存在,2=删除" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="部门Id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门Id" />
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
import { listFaultcode, getFaultcode, delFaultcode, addFaultcode, updateFaultcode } from "@/api/monitor/faultcode";

export default {
  name: "Faultcode",
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
      // 故障代码管理表格数据
      faultcodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        codeId: null,
        faultCode: null,
        faultName: null,
        faultType: null,
        symptom: null,
        reasons: null,
        measure: null,
        status: null,
        delFlag: null,
        remark: null,
        userId: null,
        deptId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        codeId: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询故障代码管理列表 */
    getList() {
      this.loading = true;
      listFaultcode(this.queryParams).then(response => {
        this.faultcodeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        codeId: null,
        faultCode: null,
        faultName: null,
        faultType: null,
        symptom: null,
        reasons: null,
        measure: null,
        status: null,
        delFlag: null,
        remark: null,
        userId: null,
        deptId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.codeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加故障代码管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const codeId = row.codeId || this.ids
      getFaultcode(codeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改故障代码管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.codeId != null) {
            updateFaultcode(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFaultcode(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const codeIds = row.codeId || this.ids;
      this.$modal.confirm('是否确认删除故障代码管理编号为"' + codeIds + '"的数据项？').then(function() {
        return delFaultcode(codeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('maintain/faultcode/export', {
        ...this.queryParams
      }, `faultcode_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
