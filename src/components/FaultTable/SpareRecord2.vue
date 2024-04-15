<template>
  <div class="app-container2">
    <div class="title">
      <i class="el-icon-caret-right"
        ><span class="icon-text">备件记录</span>
        请维护使用部位和替换的原件信息</i
      >
      <el-button
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        v-if="!disabled"
        >新增备件</el-button
      >
    </div>

    <div>
      <ContTable
        :tableData="standardList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        ref="jmtable"
        :isRadio="isChoose"
        :handleWidth="230"
        :columns="columns"
        :showSearch="false"
        :isShow="disabled"
        :rightToolbarShow="false"
        :showOperate="!disabled"
      >
        <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
            >删除</el-button
          >
        </template></ContTable
      >
    </div>

    <!-- 添加设备 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="30%"
      :append-to-body="true"
      :wrapperClosable="false"
      :before-close="close"
    >
      <TitleForm
        :columns="columns2"
        :formData="form"
        @submitForm="submitForm"
        ref="titleform"
        :disabled="disabled"
      >
        <template #footer>
          <div class="container-box2">
            <el-button @click="saveHandle" type="primary">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>

    <!-- 选择备件 -->
    <el-drawer
      title="选择备件"
      :visible.sync="drawersupplier"
      size="60%"
      direction="rtl"
      :append-to-body="true"
      :wrapperClosable="false"
    >
      <spareList
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></spareList>
    </el-drawer>

    <!-- 添加供应商对话框 -->
    <el-drawer
      title="选择供应商"
      :visible.sync="drawersupplier2"
      size="60%"
      direction="rtl"
      :append-to-body="true"
      :wrapperClosable="false"
    >
      <supplier
        @submitRadio="submitRadio2"
        :isRadio="true"
        @close="closesupplier2"
      ></supplier>
    </el-drawer>
  </div>
</template>
<script>
import ContTable from "@/components/ContTable/index3";
import { listDept } from "@/api/system/dept";
import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";
import spareList from "@/views/sparepart/spareList/spareList.vue";
import supplier from "@/views/sparepart/supplier";
export default {
  components: { ContTable, spareList, supplier },
  dicts: ["spare_parts_unit", "spare_parts_type"],
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: () => {},
      type: Object,
    },
  },
  data() {
    return {
      drawersupplier: false,
      drawersupplier2: false,
      standardList: [],
      loading: false,
      btnLoading: false,
      form: {},
      drawer: false,

      deptOptions: null,
      formParams: {
        prtOrg: "Y",
      },
      isChoose: false,
      flag: {
        isSub: "提交",
        index: null,
      },
      delAttachmentList: [],
      updateAttachmentiist: [],
    };
  },
  watch: {
    standardList: {
      handler(val) {
        this.$emit(
          "spareRecord",
          val.map((item) => ({
            ...item,
            createTime: this.parseTime(item.createTime),
          }))
        );
      },
      deep: true,
      immediate: true,
    },
    "formData.itemId": {
      handler(val) {
        // if (val) {
        //   if (this.deptOptions && this.formData.attachmentDTOList) {
        //     this.standardList = this.formData.attachmentDTOList;
        //   }
        // } else {
        //   this.standardList = [];
        // }
      },
      deep: true,
    },
    delAttachmentList: {
      handler(val) {
        if (val.length > 0) {
          this.$emit("delAttachmentList", val);
        }
      },
      deep: true,
      immediate: true,
    },
    updateAttachmentiist: {
      handler(val) {
        if (val.length > 0) {
          this.$emit("updateAttachmentiist", val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    await this.getDeptTree();
    // if (this.deptOptions && this.formData.attachmentDTOList) {
    //   this.standardList = this.formData.attachmentDTOList ?? [];
    // }
    if (this.formData.orderCode) {
      request({
        url: "/wom/repair/getWomAttachmentList",
        method: "get",
        params: { orderCode: this.formData.orderCode },
      }).then((res) => {
        if (res.code === 200) {
          this.standardList = res.data.map((item) => ({
            ...item,
            id: uuidv4(),
          }));
        }
      });
    }
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "备件编码",
          prop: "attachmentCode",
          required: true,
          span: 22,
          clickFn: () => {
            this.drawersupplier = true;
          },
        },
        {
          label: "备件名称",
          prop: "attachmentName",
          required: true,
          span: 22,
          formDisabled: true,
        },
        {
          label: "备件类别",
          prop: "attachmentType",
          span: 22,
          formDisabled: true,
        },
        { label: "规格型号", prop: "specs", span: 22, formDisabled: true },
        {
          label: "供应商名称",
          prop: "supplierName",
          span: 22,
        },
        { label: "使用部位", prop: "location", required: true, span: 22 },
        {
          label: "更换数量",
          prop: "replaceNum",
          required: true,
          span: 22,
          formType: "number",
          min: 1,
        },
        {
          label: "单位",
          prop: "unit",
          required: true,
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          formDisabled: true,
        },
        { label: "原件编码", prop: "scriptCode", required: true, span: 22 },
        {
          label: "更换日期",
          prop: "createTime",
          required: true,
          span: 22,
          formType: "date",
          // width:180
        },
      ];
    },
    columns2() {
      return [
        {
          label: "备件编码",
          prop: "attachmentCode",
          required: true,
          span: 22,
          clickFn: () => {
            this.drawersupplier = true;
          },
        },
        {
          label: "备件名称",
          prop: "attachmentName",
          required: true,
          span: 22,
          formDisabled: true,
        },

        {
          label: "规格型号",
          prop: "specs",
          span: 22,
          formDisabled: true,
        },
        {
          label: "备件类别",
          prop: "attachmentType",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_type,
          formDisabled: true,
        },
        {
          label: "供应商名称",
          prop: "supplierName",
          span: 22,
          clickFn: () => {
            this.drawersupplier2 = true;
          },
        },
        { label: "使用部位", prop: "location", required: true, span: 22 },
        {
          label: "更换数量",
          prop: "replaceNum",
          required: true,
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
          formDisabled: true,
        },
        { label: "原件编码", prop: "scriptCode", required: true, span: 22 },
        {
          label: "更换时间",
          prop: "createTime",
          required: true,
          span: 22,
          formType: "date",
        },
      ];
    },
  },
  methods: {
    submitRadio2(row) {
      this.$set(this.form, "supplierName", row.supplierName);
      this.$set(this.form, "supplierCode", row.supplierCode);
      this.$set(this.form, "supplierId", row.id);
      this.closesupplier2();
    },
    // ! 选择备件
    submitRadio(row) {
      // this.$set(this.form, "attachmentCode", row.partCode);
      // this.$set(this.form, "attachmentName", row.partName);
      // this.$set(this.form, "specs", row.sModel);
      // this.$set(this.form, "attachmentType", row.partType);
      // this.$set(this.form, "unit", row.unit);
      delete row.createTime;
      delete row.id;
      delete row.location;
      this.form = {
        ...row,
        attachmentCode: row.partCode,
        attachmentName: row.partName,
        specs: row.sModel,
        attachmentType: "" + row.partType,
        unit: "" + row.unit,
      };

      this.closesupplier();
    },
    closesupplier() {
      this.drawersupplier = false;
    },
    closesupplier2() {
      this.drawersupplier2 = false;
    },
    getList(id) {},
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    handleCancel() {
      this.close();
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    close() {
      this.$refs.titleform.resetFields();

      this.drawer = false;
    },
    submitForm(formVal) {
      if (this.flag.isSub === "新增") {
        let newValue = JSON.parse(JSON.stringify(formVal));
        this.standardList = this.standardList.concat([newValue]);
        this.close();
      } else if (this.flag.isSub === "编辑") {
        let newValue = JSON.parse(JSON.stringify(formVal));
        this.$set(this.standardList, this.flag.index, newValue);
        if (newValue.id) {
          const updateIndex = this.updateAttachmentiist.findIndex(
            (item) => item.id == newValue.id
          );
          if (updateIndex !== -1) {
            this.$set(this.updateAttachmentiist, updateIndex, newValue);
          } else {
            this.updateAttachmentiist.push(newValue);
          }
        }

        this.close();
      }
    },
    handleSelectionChange(value) {},
    handleAdd() {
      this.flag.isSub = "新增";
      this.flag.index = null;
      this.form = {};
      this.drawer = true;
    },
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.flag = { isSub: "编辑", index: scope.index };
      this.form = JSON.parse(JSON.stringify(scope.row));
      this.drawer = true;
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      if (scope.row.id) {
        this.$modal
          .confirm("是否确认删除？")
          .then(function () {
            that.delAttachmentList.push(scope.row);
            that.standardList.splice(scope.$index, 1);
          })
          .catch(() => {});
      } else {
        this.$modal
          .confirm("是否确认删除？")
          .then(function () {
            that.standardList.splice(scope.$index, 1);
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.app-container2 {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .container-box1 {
    max-height: 550px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  // .table {
  //   max-height: 550px;
  //   overflow-y: scroll;
  //   margin-bottom: 20px;
  // }
}
.container-box2 {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .el-select {
    width: 100%;
  }

  .el-tabs__nav-scroll {
    width: 50% !important;
    margin: 0 auto !important;
  }

  .el-tabs__nav-wrap {
    padding-top: 10px;
  }

  .el-tabs__nav-wrap::after {
    top: 0;
  }
}

.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  width: 100%;
  height: 36px;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-right: 18px;
  border-left: 5px solid #1f77fc;
  i {
    margin-right: 10px;
    color: #1f77fc;
    .icon-text {
      color: #555;
      font-weight: 700;
      padding-left: 5px;
    }
  }
}
</style>
