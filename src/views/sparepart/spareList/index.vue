<template>
  <Wrapper>
    <ContTable
      :tableData="equipmentList"
      @handleSelectionChange="handleSelectionChange"
      @getList="getList"
      :total="total"
      ref="jmtable"
      class="mt20"
      :initLoading="false"
      :handleWidth="150"
      :columns="columns"
    >
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >添加</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            :loading="btnLoading"
            @click="AddFile"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleDetails(scope.row, 'details')"
          >详情</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleUpdate(scope.row, 'edit')"
          >编辑</el-button
        >
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          >删除</el-button
        >
      </template>
    </ContTable>
    <!-- 添加对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
    >
      <TitleForm
        :columns="columns"
        :formData="formDataNow"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'120px'"
        :disabled="disabledForm"
      >
        <template #footer>
          <div class="form-footer">
            <el-button @click="save" type="primary">提交</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>

    <!-- 添加供应商对话框 -->
    <el-drawer
      title="选择供应商"
      :visible.sync="drawersupplier"
      size="60%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <supplier
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></supplier>
    </el-drawer>

    <!-- 上传文件 -->
    <el-drawer
      title="选择文件"
      :visible.sync="filedrawer"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false"
    >
      <file-upload
        :drag="true"
        @uploadChange="uploadChange"
        :listType="'picture-card'"
        style="padding: 0 20px"
      >
      </file-upload>
    </el-drawer>
  </Wrapper>
</template>

<script>
import ContTable from "@/components/ContTable";
import Wrapper from "@/components/wrapper";
import JmForm from "@/components/JmForm";
import { listDept } from "@/api/system/dept";
import supplier from "@/views/device/book/supplier";
import { saveAs } from "file-saver";
import {
  getManagementList,
  addManagement,
  updateManagement,
  delManagement,
  exportManagementList,
} from "@/api/sparePart/sparePartList";
export default {
  dicts: ["em_property_type", "spare_parts_unit", "spare_parts_type"],
  components: {
    ContTable,
    JmForm,
    supplier,
    Wrapper,
  },

  mounted() {},
  data() {
    return {
      loading: true,
      // 选中数组
      ids: [],
      partsCodes: [],
      // 显示搜索条件
      showSearch: true,
      // 表格数据
      equipmentList: null,
      // 总条数
      total: 0,
      formDataNow: {},
      drawer: false,
      drawersupplier: false,
      // 弹出层标题
      title: "新增设备",
      // 部门树选项
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单是否禁用
      disabled: false,
      disabledForm: false,

      // 文件上传
      filedrawer: false,
      fileType: [".xlsx"],
      fileList: [],
      btnLoading: false,
    };
  },
  computed: {
    // 列信息
    columns() {
      return [
        {
          label: "备件编码",
          prop: "partCode",
          span: 22,
          required: true,
          // formDisabled: this.title === "新增设备" ? false : true,
        },
        { label: "备件名称", prop: "partName", span: 22, required: true },
        {
          label: "备件类别",
          prop: "partType",
          span: 22,
          required: true,
          formType: "select",
          options: this.dict.type.spare_parts_type,
        },
        { label: "规格型号", prop: "sModel", span: 22, width: 150 },

        {
          label: "默认供应商",
          prop: "supplierName",
          readonly: true,
          clickFn: () => {
            this.drawersupplier = true;
          },
          span: 22,
          width: 280,
        },
        {
          label: "当前库存",
          prop: "inventory",
          span: 22,
          formType: "number",
        },
        {
          label: "单位",
          prop: "unit",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
        },
        { label: "默认存储位置", prop: "locationName", span: 22, width: 150 },
        {
          label: "所属组织",
          prop: "affDept",
          span: 22,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
          required: true,
        },
        {
          label: "预计使用时间",
          prop: "useDate",
          span: 22,
          formType: "date",
        },
        {
          label: "使用场景说明",
          prop: "scene",
          formType: "textarea",
          rows: 4,
          span: 22,
          width: 200,
        },
      ];
    },
  },
  created() {
    this.getTreeSelect();
  },
  methods: {
    // 详情
    handleDetails(row) {
      const spareId = "1";

      this.$router.push({
        path: "/sparepart/spareListDetails",
        query: {
          i: row,
        },
      });
    },
    // 导入
    AddFile() {
      this.btnLoading = true;
      this.filedrawer = true;
    },
    uploadChange() {
      this.$message.success("文件上传成功！");
      this.filedrawer = false;
      this.btnLoading = true;
    },
    // 下载
    handleDownload() {
      exportManagementList({ ids: this.ids }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `sparePart_${new Date().getTime()}`);
      });
    },
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
        this.getList(this.queryParams);
      });
    },
    closesupplier() {
      this.drawersupplier = false;
    },
    submitRadio(row) {
      this.$set(this.formDataNow, "supplierName", row.supplierName);
      this.$set(this.formDataNow, "supplierCode", row.supplierCode);
      this.$set(this.formDataNow, "supplierId", row.id);
      this.closesupplier();
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      getManagementList(queryParams).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.partsCodes = selection.map((item) => item.partsCode);
    },
    close() {
      this.drawer = false;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.drawer = true;
      this.title = "新增设备";
      this.$refs.titleform.clearValidate();
      this.formDataNow = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.drawer = true;
      this.title = "编辑设备";
      this.formDataNow = JSON.parse(JSON.stringify(row));
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const partCode = row.partCode || this.partsCodes;
      this.$modal
        .confirm('是否确认删除备件编码为"' + partCode + '"的数据项？')
        .then(() => {
          return delManagement(ids);
        })
        .then(() => {
          this.getList(this.queryParams);
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    save() {
      this.$refs.titleform.submitForm();
    },
    close() {
      this.drawer = false;
    },
    /** 提交按钮 */
    submitForm(formVal) {
      if (
        this.equipmentList.some((item) => item.partCode === formVal.partCode)
      ) {
        this.$modal.msgWarning("备件编码已存在，请重新输入！");
        return;
      }
      if (formVal.id) {
        updateManagement(formVal).then((res) => {
          if (res.code === 200) {
            this.$message.success("编辑成功！");
            this.getList(this.queryParams);
          }
        });
      } else {
        addManagement(formVal).then((res) => {
          if (res.code === 200) {
            this.$message.success("新增成功！");
            this.getList(this.queryParams);
          }
        });
      }

      this.close();
    },
  },
};
</script>

<style lang='scss' scoped>
.form-footer {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
</style>