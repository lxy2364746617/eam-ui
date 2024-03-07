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
            v-hasPermi="['sparepart:spareList:add']"
            >添加</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            :loading="btnLoading"
            @click="handleImport"
            v-hasPermi="['sparepart:spareList:export']"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
            v-hasPermi="['sparepart:spareList:download']"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleDetails(scope.row, 'details')"
          v-hasPermi="['sparepart:spareList:details']"
          >详情</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleUpdate(scope.row, 'edit')"
          v-hasPermi="['sparepart:spareList:edit']"
          >编辑</el-button
        >
        <el-button
          v-hasPermi="['sparepart:spareList:delete']"
          size="mini"
          type="text"
          @click="handleDelete(scope.row)"
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

    <!-- 导入 -->
    <file-import
      @handleFileSuccess="handleFileSuccess"
      :downloadTemplateUrl="'/attachment/importTemplate'"
      ref="fileImport"
      :isUpdate="true"
      :importUrl="'/attachment/import'"
    ></file-import>
  </Wrapper>
</template>

<script>
import ContTable from "@/components/ContTable";
import Wrapper from "@/components/wrapper";
import JmForm from "@/components/JmForm";
import { listDept } from "@/api/system/dept";
import supplier from "@/views/sparepart/supplier";
import { saveAs } from "file-saver";
import {
  getManagementList,
  addManagement,
  updateManagement,
  delManagement,
  exportManagementList,
} from "@/api/sparePart/sparePartList";
import fileImport from "@/components/FileImport";
import { getLocationTree } from "@/api/Location";
export default {
  dicts: ["em_property_type", "spare_parts_unit", "spare_parts_type"],
  components: {
    ContTable,
    JmForm,
    supplier,
    Wrapper,
    fileImport,
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
      locationOptions: [],
      editValue: null,
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
          formDisabled: this.title === "新增备件" ? false : true,
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
          formDisabled: this.title === "新增备件" ? false : true,
          min: 1,
        },
        {
          label: "单位",
          prop: "unit",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
        },
        {
          label: "默认存储位置",
          prop: "locationCode",
          span: 22,
          width: 150,
          options: this.locationOptions,
          formType: "selectTree",
        },
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
    // ! 提供下载列表字段
    convertToDefaultObject(columns) {
      const defaultObject = {};

      columns.forEach((column) => {
        if (column.prop) {
          defaultObject[column.prop] = null;
        }
      });

      return defaultObject;
    },
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
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.fileImport.upload.open = true;
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.getList(this.queryParams);
    },
    // 下载
    handleDownload() {
      exportManagementList({
        ids: this.ids.length > 0 ? this.ids : null,
        ...this.convertToDefaultObject(this.columns),
      }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `spareList_${new Date().getTime()}`);
      });
    },
    getTreeSelect() {
      getLocationTree().then((res) => {
        this.locationOptions = this.getTree(res.data);
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
        this.getList(this.queryParams);
      });
    },
    getTree(arr) {
      arr.forEach((item) => {
        item.id = item.deptCode;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTree(item.children);
        }
      });
      return arr;
    },
    findTreeName(options, value) {
      var name = "";
      function Name(name) {
        this.name = name;
      }
      var name1 = new Name("");
      this.forfn(options, value, name1);
      return name1.name;
    },
    forfn(options, value, name1) {
      function changeName(n1, x) {
        n1.name = x;
      }
      for (let i = 0; i < options.length; i++) {
        if (options[i].id == value) {
          changeName(name1, options[i].label);
        }
        if (options[i].children) {
          this.forfn(options[i].children, value, name1);
        }
      }
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
      this.title = "新增备件";
      this.$refs.titleform.clearValidate();
      this.formDataNow = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.drawer = true;
      this.title = "编辑备件";
      this.formDataNow = {
        ...row,
        partType: "" + row.partType,
        unit: "" + row.unit,
        inventory: undefined,
      };
      this.editValue = {
        ...row,
        partType: "" + row.partType,
        unit: "" + row.unit,
      };
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
      // formVal["locationName"] = this.findTreeName(
      //   this.locationOptions,
      //   formVal.location
      // );
      if (formVal.id) {
        // if (this.editValue.unit !== formVal.unit)
        //   this.$modal.msgWarning(
        //     "该备件有库存，无法修改单位。没有库存可以修改单位！"
        //   );
        updateManagement(formVal).then((res) => {
          if (res.code === 200) {
            this.$message.success("编辑成功！");
            this.getList(this.queryParams);
            this.close();
          }
        });
      } else {
        if (
          this.equipmentList.some((item) => item.partCode === formVal.partCode)
        ) {
          this.$modal.msgWarning("备件编码已存在，请重新输入！");
          return;
        }
        addManagement(formVal).then((res) => {
          if (res.code === 200) {
            this.$message.success("新增成功！");
            this.getList(this.queryParams);
            this.close();
          }
        });
      }
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