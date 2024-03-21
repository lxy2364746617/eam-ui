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
            icon="el-icon-minus"
            size="mini"
            v-hasPermi="['sparepart:spareInAndOut:out']"
            @click="handleAdd('备件出库')"
            >出库</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            v-hasPermi="['sparepart:spareInAndOut:in']"
            @click="handleAdd('备件入库')"
            >入库</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            :loading="btnLoading"
            @click="AddFile"
            >导入</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
            v-hasPermi="['sparepart:spareInAndOut:download']"
            >下载</el-button
          >
        </el-col>
      </template>
      <!-- <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleUpdate(scope.row, 'edit')"
          >编辑</el-button
        >
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          >删除</el-button
        >
      </template> -->
    </ContTable>
    <!-- 添加对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      :before-close="closeDrawer"
      size="60%"
    >
      <TitleForm
        :columns="columnsForm"
        :formData="formDataNow"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'120px'"
        :disabled="disabledForm"
      >
        <template #footer>
          <div v-if="title === '备件出库'">
            <span style="padding-left: 20px">选择出入库明细</span>
            <el-table
              class="table"
              v-loading="loading"
              :data="inOutList"
              @selection-change="handleSelectionChange2"
              ref="multipleTable"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="序号" align="center" type="index" />
              <el-table-column
                label="供应商编码"
                align="center"
                prop="supplierCode"
                width="200"
              />
              <el-table-column
                label="供应商名称"
                align="center"
                prop="supplierName"
                width="150"
              />
              <el-table-column
                label="存储位置"
                align="center"
                prop="locationCode"
                width="230"
                ><template slot-scope="scope">
                  <span
                    v-html="
                      findTreeName(locationOptions, scope.row.locationCode)
                    "
                  ></span> </template
              ></el-table-column>
              <el-table-column
                label="库存数量"
                align="center"
                prop="inventory"
              />
              <el-table-column label="单位" align="center" prop="unit">
                <template slot-scope="scope">
                  <span
                    v-html="
                      findName(dict.type.spare_parts_unit, scope.row.unit)
                    "
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                label="出库数量"
                align="center"
                prop="quantity"
                width="300"
              >
                <template slot-scope="scope"
                  ><el-input-number
                    v-model="scope.row.quantity"
                    placeholder="请输入"
                    :max="scope.row.inventory"
                    :min="0"
                  ></el-input-number
                ></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="form-footer">
            <el-button
              @click="save"
              v-if="title === '备件出库'"
              type="primary"
              :disabled="submitTJ"
              >提交</el-button
            >
            <el-button @click="save" v-else type="primary">提交</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>

    <!-- 添加供应商对话框 -->
    <el-drawer
      title="选择供应商"
      :visible.sync="drawersupplier"
      size="70%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <supplier
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></supplier>
    </el-drawer>
    <!-- 选择备件 -->
    <el-drawer
      title="选择备件"
      :visible.sync="drawerPartCode"
      size="60%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <spareList
        @submitRadio="submitPartCoder"
        :isRadio="true"
        @close="closePartCoder"
      ></spareList>
    </el-drawer>
    <!-- 关联关联备件需求 -->
    <el-drawer
      title="关联备件需求"
      :visible.sync="drawerRequirement"
      size="70%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <requirement
      v-if="drawerRequirement"
        @submitRadio="submitRequirement"
        :isRadio="true"
        :searchValue="[
          { prop: 'apvStatus', value: 'completed' },
          { prop: 'partCode', value: formDataNow.partCode },
        ]"
        @close="closeRequirement"
      ></requirement>
    </el-drawer>

    <!-- 关联备件领用请求 -->
    <el-drawer
      title="关联备件领用"
      :visible.sync="drawerSpareReceive"
      size="70%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <spareReceive
        v-if="drawerSpareReceive"
        @submitRadio="submitSpareReceive"
        :isRadio="true"
        :searchValue="[
          { prop: 'approvalStatus', value: 'completed' },
          { prop: 'partCode', value: formDataNow.partCode },
        ]"
        @close="closeSpareReceive"
      ></spareReceive>
    </el-drawer>

    <!-- 上传文件 -->
    <!-- <el-drawer
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
    </el-drawer> -->
  </Wrapper>
</template>

<script>
import ContTable from "@/components/ContTable";
import Wrapper from "@/components/wrapper";
import { listDept } from "@/api/system/dept";
import supplier from "@/views/sparepart/supplier";
import {
  getStockInOutList,
  getStockInOutCondition,
  stockOut,
  stockIn,
  stockInOutDownload,
} from "@/api/sparePart/spareInAndOut";
import spareList from "@/views/sparepart/spareList/spareList.vue";
import requirement from "@/views/sparepart/requirement/requirement.vue";
import spareReceive from "@/views/sparepart/spareReceive/spareReceive.vue";
import { getLocationTree } from "@/api/Location";
export default {
  dicts: [
    "em_property_type",
    "spare_parts_unit",
    "spare_out_type",
    "spare_in_type",
  ],
  components: {
    ContTable,
    supplier,
    Wrapper,
    spareList,
    requirement,
    spareReceive,
  },

  mounted() {},
  data() {
    return {
      loading: false,
      // 选中数组
      ids: [],
      partsCodes: [],
      // 选中出入库明细数组
      ids2: [],
      selectionRow: [],
      selectionRow2: [],
      partsCodes2: [],
      // 显示搜索条件
      showSearch: true,
      // 表格数据
      equipmentList: null,
      inOutList: [],
      // 总条数
      total: 0,
      formDataNow: {},
      drawer: false,
      drawersupplier: false,
      drawerPartCode: false,
      drawerRequirement: false,
      drawerSpareReceive: false,
      // 弹出层标题
      title: "",
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
      selectTab: [],
      // 文件上传
      //   filedrawer: false,
      //   fileType: [".xlsx"],
      //   fileList: [],
      //   btnLoading: false,
      locationOptions: [],
    };
  },
  watch: {
    "formDataNow.quantitySum": {
      handler(val) {
        if (this.title !== "备件出库") return;
        if (val) {
          if (!this.formDataNow.partCode)
            return this.$message.warning("请选择备件");
          this.selectTab = [];
          let sum = JSON.parse(JSON.stringify(val));
          for (let i = 0; i < this.inOutList.length; i++) {
            if (sum - this.inOutList[i].inventory >= 0) {
              this.selectTab.push(this.inOutList[i]);
              this.inOutList[i].quantity = this.inOutList[i].inventory;
              sum = sum - this.inOutList[i].inventory;
            } else {
              if (sum === 0) continue;
              this.selectTab.push(this.inOutList[i]);
              this.inOutList[i].quantity = sum;

              sum = 0;
            }
          }
          // 选择多选框
          if (sum === 0) {
            this.$refs.multipleTable.clearSelection();
            this.selectTab.forEach((row) => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          }
          // this.selectTab.forEach((row) => {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          // });
        } else {
          this.$refs.multipleTable.clearSelection();
          this.inOutList = this.inOutList.map((item) => ({
            ...item,
            quantity: null,
          }));
        }
      },
      deep: true,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        {
          label: "出入库编号",
          prop: "inOutCode",
          span: 22,
          required: true,
          width: 200,
        },
        {
          label: "操作类型",
          prop: "operationType",
          span: 22,
          required: true,
          formType: "select",
          options: this.dict.type.spare_out_type.concat(
            this.dict.type.spare_in_type
          ),
        },
        {
          label: "备件编码",
          prop: "partCode",
          span: 22,
          required: true,
          width: 150,
        },
        { label: "备件名称", prop: "partName", span: 22, width: 150 },
        { label: "数量", prop: "quantity", span: 22 },
        {
          label: "单位",
          prop: "unit",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
        },
        { label: "供应商", prop: "supplierName", span: 22, width: 150 },
        {
          label: "存储位置",
          prop: "locationCode",
          span: 22,
          width: 230,
          options: this.locationOptions,
          formType: "selectTree",
        },
        { label: "规格型号", prop: "sModel", span: 22, width: 150 },
        { label: "关联请求", prop: "relatedRequestCode", span: 22, width: 150 },
        { label: "出入库原因", prop: "reason", span: 22, width: 150 },
        { label: "操作人员", prop: "operatorName", span: 22, width: 150 },
        {
          label: "操作时间",
          prop: "createTime",
          span: 22,
          width: 150,
          formType: "date",
        },
      ];
    },
    columnsForm() {
      if (this.title === "备件出库") {
        return [
          {
            label: "操作类型",
            prop: "operationType",
            span: 13,
            required: true,
            formType: "select",
            options: this.dict.type.spare_out_type,
          },
          {
            label: "备件编码",
            prop: "partCode",
            span: 13,
            required: true,
            clickFn: () => {
              this.drawerPartCode = true;
            },
          },
          {
            label: "备件名称",
            prop: "partName",
            span: 13,
            required: true,
            formDisabled: true,
          },
          { label: "规格型号", prop: "sModel", span: 13, formDisabled: true },
          {
            label: "出库数量",
            prop: "quantitySum",
            span: 13,
            formType: "number",
            required: true,
            min: 1,
          },
          {
            label: "单位",
            prop: "unit",
            span: 13,
            formType: "select",
            options: this.dict.type.spare_parts_unit,
            required: true,
            formDisabled: true,
          },

          {
            label: "关联请求编码",
            prop: "relatedRequestCode",
            readonly: true,
            clickFn: () => {
              if (!this.formDataNow.partCode) {
                this.$message.warning("请先选择备件编码");
                return;
              }
            this.drawerSpareReceive = true;

              // this.drawerRequirement = true;
            },
            span: 13,
          },
          {
            label: "出库原因",
            prop: "reason",
            span: 13,
            formType: "textarea",
            rows: 4,
          },
        ];
      } else {
        return [
          {
            label: "操作类型",
            prop: "operationType",
            span: 13,
            required: true,
            formType: "select",
            options: this.dict.type.spare_in_type,
          },
          {
            label: "备件编码",
            prop: "partCode",
            span: 13,
            required: true,
            clickFn: () => {
              this.drawerPartCode = true;
            },
          },
          {
            label: "备件名称",
            prop: "partName",
            span: 13,
            required: true,
            formDisabled: true,
          },
          { label: "规格型号", prop: "sModel", span: 13, formDisabled: true },
          {
            label: "入库数量",
            prop: "quantity",
            span: 13,
            formType: "number",
            required: true,
            min: 1,
          },
          {
            label: "单位",
            prop: "unit",
            span: 13,
            formType: "select",
            options: this.dict.type.spare_parts_unit,
            required: true,
            formDisabled: true,
          },
          {
            label: "供应商",
            prop: "supplierName",
            span: 13,
            clickFn: () => {
              this.drawersupplier = true;
            },
          },
          {
            label: "存储位置",
            prop: "locationCode",
            span: 13,
            options: this.locationOptions,
            formType: "selectTree",
          },
          {
            label: "关联请求编码",
            prop: "relatedRequestCode",
            readonly: true,
            clickFn: () => {
              if (!this.formDataNow.partCode) {
                this.$message.warning("请先选择备件编码");
                return;
              }
              this.drawerRequirement = true;
            },
            span: 13,
          },
          {
            label: "入库原因",
            prop: "reason",
            span: 13,
            formType: "textarea",
            rows: 4,
          },
        ];
      }
    },
    submitTJ() {
      return !(
        this.formDataNow.quantitySum !== 0 &&
        this.formDataNow.quantitySum ===
          this.selectionRow2.reduce((v, t) => v + t.quantity, 0)
      );
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
    closeDrawer() {
      this.drawer = false;
      this.inOutList = null;
    },
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    // 上传
    // AddFile() {
    //   this.btnLoading = true;
    //   this.filedrawer = true;
    // },
    // uploadChange() {
    //   this.$message.success("文件上传成功！");
    //   this.filedrawer = false;
    //   this.btnLoading = true;
    // },
    // 下载

    handleDownload() {
      stockInOutDownload({
        ids: this.ids.length > 0 ? this.ids : null,
        ...this.convertToDefaultObject(this.columns),
      }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `spareInAndOut_${new Date().getTime()}`);
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
    // ! 选择备件
    submitPartCoder(row) {
      this.formDataNow = { operationType: this.formDataNow.operationType };
      this.$set(this.formDataNow, "partCode", row.partCode);
      this.$set(this.formDataNow, "partName", row.partName);
      this.$set(this.formDataNow, "partType", row.partType);
      this.$set(this.formDataNow, "sModel", row.sModel);
      this.$set(this.formDataNow, "unit", String(row.unit));
      if (this.title === "备件入库") {
        this.$set(this.formDataNow, "locationCode", row.locationCode);
        this.$set(this.formDataNow, "supplierName", row.supplierName);
        this.$set(this.formDataNow, "supplierId", row.supplierId);
      }
      getStockInOutCondition(row.partCode).then((res) => {
        this.inOutList = res.data.filter((item) => item.inventory !== 0);
      });
      this.closePartCoder();
    },
    closePartCoder() {
      this.drawerPartCode = false;
    },
    // ! 选择备件需求
    submitRequirement(row) {
      this.$set(this.formDataNow, "relatedRequestCode", row.demandCode);
      this.closeRequirement();
    },
    closeRequirement() {
      this.drawerRequirement = false;
    },
    // ! 选择备件领用
    submitSpareReceive(row) {
      this.$set(this.formDataNow, "relatedRequestCode", row.receiptCode);
      this.closeSpareReceive();
    },
    closeSpareReceive() {
      this.drawerSpareReceive = false;
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
      getStockInOutList(queryParams).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.partsCodes = selection.map((item) => item.partsCode);
      this.selectionRow = selection;
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.id);
      this.partsCodes2 = selection.map((item) => item.partsCode);
      this.selectionRow2 = selection;
    },
    close() {
      this.drawer = false;
    },
    /** 新增按钮操作 */
    handleAdd(title) {
      this.drawer = true;
      this.title = title;
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
      const partsCodes = row.partsCode || this.partsCodes;
      this.$modal
        .confirm('是否确认删除备件编码为"' + partsCodes + '"的数据项？')
        .then(() => {
          // return delParts(ids);
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
      this.inOutList = null;
    },
    /** 提交按钮 */
    submitForm(formVal) {
      delete formVal.quantitySum;

      if (this.title === "备件出库") {
        let formValue = this.selectionRow2.map((item) => ({
          ...item,
          ...formVal,
          inventoryId: item.id,
        }));
        stockOut(formValue).then((res) => {
          if (res.code === 200) {
            this.getList(this.queryParams);
            this.$message.success("出库成功");
          }
        });
      } else {
        if (formVal.locationCode)
          formVal["locationName"] = this.findTreeName(
            this.locationOptions,
            formVal.locationCode
          );
        stockIn(formVal).then((res) => {
          if (res.code === 200) {
            this.getList(this.queryParams);
            this.$message.success("入库成功");
          }
        });
      }
      this.close();
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
.table {
  padding: 20px;
}
::v-deep .el-table th.el-table__cell {
  background-color: #e7f3ff;
}
</style>