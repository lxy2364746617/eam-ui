<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"  icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['maintain:classes:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:CLASSES:edit']">修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="primary"  icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:CLASSES:remove']">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary"  icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:CLASSES:export']">导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="班次编码" align="center" prop="classesCode" />
      <el-table-column label="班次类型" align="center" prop="classesType" />
      <el-table-column label="班次时间" align="center"  width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.classesBeginEtime }}-{{ scope.row.classesEndEtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:CLASSES:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:classes:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改运维计划班次管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px"  :close-on-click-modal='false'>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" inline>
        <el-form-item label="班次类型" prop="classesType" :rules="[{required:true}]">
          <el-select v-model="form.classesType" placeholder="请选择班次类型"  >
              <el-option v-for="item in this.dict.type.maintain_classes_type" :key="item.value" :value='item.value' :label='item.label'></el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="班次开始时间" prop="classesBeginEtime" :rules="[{required:true}]">
          <el-time-picker v-model="form.classesBeginEtime"  placeholder="请选择班次开始时间" format="HH:mm" value-format='HH:mm' ></el-time-picker>
        </el-form-item>
        <el-form-item label="班次结束时间" prop="classesEndEtime" :rules="[{required:true}]">
          <el-time-picker v-model="form.classesEndEtime"  placeholder="请选择班次结束时间" format="HH:mm" value-format='HH:mm'></el-time-picker>
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
  listClasses,
  detailClasses,
  addClasses,
  updateClasses,
  removeClasses
} from "@/api/maintain/classes";

export default {
  name: "CLASSES",
  dicts:['maintain_classes_type'],
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
      // 运维计划班次管理表格数据
      classesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ID: null,
        deptId: null,
        tenantId: null,
        classesCode: null,
        delFlag: null,
        classesType: null,
        classesTime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 表单参数
      form: {
        classesType: null,
      },
      // 表单校验
      rules: {
        ID: [{ required: true, message: "主键不能为空", trigger: "blur" }],
        deptId: [
          { required: true, message: "部门id不能为空", trigger: "blur" },
        ],
        tenantId: [
          { required: true, message: "公司id不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询运维计划班次管理列表 */
    getList() {
      this.loading = true;
      listClasses(this.queryParams).then((response) => {
        this.classesList = response.rows;
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
      this.form = {};
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增班次";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const ID = row.id 
      detailClasses({id:ID}).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑班次";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateClasses(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClasses(this.form).then((response) => {
              this.form={}
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
      const IDs = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除班次编码为"' + row.classesCode + '"班次？')
        .then(function () {
          return removeClasses({id:IDs});
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/maintain/classes/export",
        {
          ...this.queryParams,
        },
        `CLASSES_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog:not(.is-fullscreen) {
    margin-top: 20vh !important;
}
</style>
