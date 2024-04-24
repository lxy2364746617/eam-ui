<template>
  <div class="app-container">
    <jm-table
      :tableData="faultcodeList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :handleWidth="230"
      :columns="columns"
      :isRadio="isRadio"
      :showOperate="false"
    >
      <!-- <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['maintain:faultcode:add']"
            >新增</el-button
          >
          <el-button
            type="success"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="['maintain:faultcode:edit']"
            >导入</el-button
          >
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="importTemplate"
            v-hasPermi="['maintain:faultcode:export']"
            >下载模板</el-button
          >
        </el-col>
      </template> -->
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:faultcode:edit']"
          >修改</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:faultcode:remove']"
          >删除</el-button
        >
      </template>
    </jm-table>
    <div
      style="
        position: absolute;
        bottom: 0px;
        width: 100%;
        background-color: #fff;
        text-align: center;
        padding: 20px;
        border-top: 1px solid #ddd;
      "
    >
      <el-button size="mini" @click="close">取消</el-button>
      <el-button
        size="mini"
        @click="submitRadio"
        type="primary"
        :disabled="multiple"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  listFaultcode2,
  getFaultcode,
  delFaultcode,
  addFaultcode,
  updateFaultcode,
} from "@/api/monitor/faultcode";
import JmTable from "@/components/JmTable";
import fileImport from "@/components/FileImport";
export default {
  components: { JmTable, fileImport },
  dicts: ["kdb_fault_type"],
  props: {
    isRadio: {
      default: true,
      type: Boolean,
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
        status: "0",
        delFlag: null,
        remark: null,
        userId: null,
        deptId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 表单参数
      form: {},
      isEdit: false,
      statusArr: [
        { label: "启用", value: "0", class: "green" },
        { label: "停用", value: "1" },
      ],
      radioRow: {},
      checkBoxRows: [],
    };
  },
  computed: {
    columns() {
      return [
        { label: "故障代码", prop: "faultCode" },
        { label: "故障名称", prop: "faultName" },
        { label: "故障症状", prop: "symptom" },
        {
          label: "故障分类",
          prop: "faultType",
          formType: "select",
          options: this.dict.type.kdb_fault_type,
        },
        {
          label: "状态",
          prop: "status",
          formType: "select",
          options: this.statusArr,
        },
        { label: "创建人", prop: "createBy" },
        { label: "创建时间", prop: "createTime", formType: "date" },
      ];
    },
  },
  created() {
    setTimeout(() => {
      this.getList();
    }, 1);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submitRadio() {
      if (this.isRadio) {
        // 单选
        this.$emit("submitRadio", this.radioRow);
      } else {
        // 多选
        this.$emit("submitRadio", this.checkBoxRows);
      }
    },
    /** 查询故障代码管理列表 */
    getList() {
      this.loading = true;
      listFaultcode2(this.queryParams).then((response) => {
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
        updateTime: null,
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
      this.ids = selection.map((item) => item.codeId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.checkBoxRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isEdit = false;
      this.reset();
      this.open = true;
      this.title = "添加故障代码管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isEdit = true;
      this.reset();
      const codeId = row.codeId || this.ids;
      getFaultcode(codeId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改故障代码管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.codeId != null) {
            updateFaultcode(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFaultcode(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除故障代码管理编号为"' + codeIds + '"的数据项？')
        .then(function () {
          return delFaultcode(codeIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /* 导入 */
    handleImport() {
      this.$refs.fileImport.upload.open = true;
    },
    handleFileSuccess() {
      this.getList(this.queryParams);
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "/maintain/faultCode/importTemplate",
        {},
        `faultCode${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
