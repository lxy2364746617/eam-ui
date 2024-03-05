<template>
  <div class="app-container2">
    <div class="title">
      更换备件
      <el-button
        v-if="!disabled"
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        >新增备件</el-button
      >
    </div>
    <el-row :gutter="24" style="margin: 10px 0px">
      <el-col :span="12">
        <el-form-item label="领用单号" prop="receiptCode">
          <el-input
            v-model="formData.receiptCode"
            placeholder="请输入领用单号"
            @click.native="openSb"
          /> </el-form-item
      ></el-col>
      <el-col :span="12">
        <el-form-item label="领用人" prop="recruiterName">
          <el-input
            v-model="formData.recruiterName"
            placeholder="请输入领用人"
            disabled
          /> </el-form-item
      ></el-col>
      <el-col :span="12">
        <el-form-item label="领用时间" prop="receiptDate">
          <el-date-picker
            format="yyyy-MM-dd"
            v-model="formData.receiptDate"
            type="date"
            style="width: 100%"
            placeholder="请选择领用时间"
            disabled
          >
          </el-date-picker> </el-form-item
      ></el-col>
    </el-row>
    <div class="container-box1">
      <el-table
        class="table"
        v-loading="loading"
        :data="standardList"
        @selection-change="handleSelectionChange"
        ref="queryTable"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column
          label="备件名称"
          align="center"
          prop="attachmentName"
          min-width="150"
        />
        <el-table-column label="备件编码" align="center" prop="attachmentCode">
        </el-table-column>
        <el-table-column
          label="规格型号"
          align="center"
          prop="specs"
          min-width="150"
        />
        <el-table-column
          label="备件类别"
          align="center"
          prop="attachmentType"
          min-width="150"
        >
          <template slot-scope="scope">
            <span
              v-html="
                findName(dict.type.spare_parts_type, scope.row.attachmentType)
              "
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          label="单位"
          align="center"
          prop="unit"
          min-width="150"
        >
          <template slot-scope="scope">
            <span
              v-html="findName(dict.type.spare_parts_unit, scope.row.unit)"
            ></span> </template
        ></el-table-column>
        <el-table-column
          label="领用数量"
          align="center"
          prop="replaceNum"
          min-width="150"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.replaceNum"
              placeholder="请输入领用数量"
              v-if="scope.row.editType"
            />
            <span v-else v-html="scope.row.replaceNum"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          min-width="150"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              placeholder="请输入备注"
              v-if="scope.row.editType"
            />
            <span v-else v-html="scope.row.remark"></span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="150"
          v-if="!disabled"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope)"
              v-hasPermi="['maintain:standard:edit']"
              >{{ scope.row.editType ? "保存" : "编辑" }}</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
              v-hasPermi="['maintain:standard:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="30%"
      :wrapperClosable="false"
      :before-close="close"
    >
      <TitleForm
        :columns="columns"
        :formData="form"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'140px'"
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
    <!-- 添加领用数据 -->
    <el-drawer
      title="选择备件领用单号"
      :visible.sync="choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <spareReceive
        @submitRadio="submitSpareReceive"
        :isRadio="true"
        @close="closeSpareReceive"
         :searchValue="[
          { prop: 'approvalStatus', value: 'completed' },
        ]"
      ></spareReceive>
    </el-drawer>

    <!-- 选择备件 -->
    <el-drawer
      title="选择备件"
      :visible.sync="drawersupplier"
      size="60%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <spareList
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></spareList>
    </el-drawer>
  </div>
</template>
<script>
import SelectRecipient from "./SelectRecipient.vue";
import spareList from "@/views/sparepart/spareList/spareList.vue";
import spareReceive from "@/views/sparepart/spareReceive/spareReceive.vue";
import { getAttachmentDetail } from "@/api/sparePart/spareReceive";
export default {
  components: { SelectRecipient, spareList, spareReceive },
  dicts: ["spare_parts_unit", "spare_parts_type"],
  data() {
    return {
      standardList: [],
      loading: false,
      btnLoading: false, // 表单参数
      choosedrawer: false,
      drawer: false,
      form: {},
      drawersupplier: false,
    };
  },
  props: {
    formData: {
      default: {},
      type: Object,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    standardList: {
      handler(val) {
        this.$emit("standardList", val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
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
          label: "规格型号",
          prop: "specs",
          span: 22,
          formDisabled: true,
        },
        {
          label: "备件类别",
          prop: "attachmentType",
          span: 22,
          required: true,
          formType: "select",
          options: this.dict.type.spare_parts_type,
          formDisabled: true,
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
        {
          label: "领用数量",
          prop: "replaceNum",
          formType: "number",
          span: 22,
          min:1,
        },
        {
          label: "备注",
          prop: "remark",
          formType: "textarea",
          rows: 4,
          span: 22,
        },
      ];
    },
  },
  methods: {
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    // ! 选择备件
    submitRadio(row) {
      this.$set(this.form, "attachmentCode", row.partCode);
      this.$set(this.form, "attachmentName", row.partName);
      this.$set(this.form, "specs", row.sModel);
      this.$set(this.form, "attachmentType", row.partType);
      this.$set(this.form, "unit", row.unit);
      this.$set(this.form, "supplierName", row.supplierName);
      this.closesupplier();
    },
    closesupplier() {
      this.drawersupplier = false;
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    submitForm(formVal) {
      let newValue = JSON.parse(JSON.stringify(formVal));
      this.standardList = this.standardList.concat([newValue]);
      this.close();
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$refs.titleform.resetFields();

      this.drawer = false;
    },
    openSb() {
      this.choosedrawer = true;
    },
    handleSelectionChange() {},
    handleAdd() {
      this.drawer = true;
    },
    submitSpareReceive(row) {
      this.formData.receiptCode = row.receiptCode;
      this.formData.recruiterName = row.recruiterName;
      this.formData.receiptDate = row.receiptDate;
      getAttachmentDetail({ receiptCode: this.formData.receiptCode }).then(
        (res) => {
          if (res.code == 200) {
            this.standardList = this.standardList.concat(
              res.data.parts.map((item) => ({
                attachmentName: item.partName,
                attachmentCode: item.partCode,
                attachmentType: item.partType,
                specs: item.sModel,
                unit: item.unit,
                replaceNum: item.quantity,
                remark: item.remark,
              }))
            );
          }
        }
      );
      this.choosedrawer = false;
    },
    closeSpareReceive() {
      this.choosedrawer = false;
    },
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.$set(
        this.standardList[scope.$index],
        "editType",
        this.standardList[scope.$index].editType ? false : true
      );
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          that.standardList.splice(scope.$index, 1);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang='scss' scoped>
.app-container2 {
  position: relative;
  display: flex;
  flex-direction: column;

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
  .container-box2 {
    flex-shrink: 0;
    background-color: #fff;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ddd;
    z-index: 2;
  }
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
  height: 30px;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 18px;
}
</style>
