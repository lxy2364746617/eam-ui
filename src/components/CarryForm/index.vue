<template>
  <div>
    <!-- <div v-if="!disabled && showButton" style="float: right; margin-top: -65px">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
    </div> -->
    <el-form
      ref="formform"
      size="small"
      :model="formData"
      :rules="rules"
      :label-position="labelPosition"
      :label-width="labelWidth || '120px'"
    >
      <el-row :gutter="10">
        <slot name="customForm"></slot>
        <el-col
          :span="col.span || 12"
          v-for="col in columns"
          :key="col.prop"
          v-if="col.formVisible != false"
        >
          <el-form-item
            v-if="col.subTitle"
            :label="col.label"
            class="subtitle"
          ></el-form-item>
          <!-- 这里传入乱七八糟的东西 -->
          <EquipArr
            v-else-if="col.formType == 'equipArr'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
          >
          </EquipArr>
          <EquipOne v-else-if="col.formType == 'equipOne'" :formData="formData">
          </EquipOne>

          <Relevance
            v-else-if="col.formType == 'document'"
            @fileResourceList="fileResourceList"
            @delFileList="delFileList"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
          ></Relevance>
          <SpareRecord
            v-else-if="col.formType == 'spareRecord'"
            @spareRecord="spareRecord"
            @delAttachmentList="delAttachmentList"
            @updateAttachmentiist="updateAttachmentiist"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
          ></SpareRecord>
          <TimeLog
            v-else-if="col.formType == 'timeLog'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
            @timeLog="timeLog"
          ></TimeLog>
          <Expense
            v-else-if="col.formType == 'expense'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
            @expense="expense"
          ></Expense>
          <MaintenanceRecord
            v-else-if="col.formType == 'maintenanceRecord'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
            @maintenanceRecord="maintenanceRecord"
          ></MaintenanceRecord>
          <MaintenanceContent
            v-else-if="col.formType == 'maintenanceContent'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
            @maintenanceContent="maintenanceContent"
          ></MaintenanceContent>
          <InspectContent
            v-else-if="col.formType == 'inspectContent'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
            @inspectContent="inspectContent"
          ></InspectContent>
          <ExpenseInspect
            v-else-if="col.formType == 'expenseInspect'"
            :disabled="col.formDisabled || disabled"
            :formData="formData"
            @expenseInspect="expenseInspect"
          ></ExpenseInspect>

          <el-button
            v-else-if="col.formType == 'fileBtn'"
            type="primary"
            icon="el-icon-plus"
            :disabled="col.formDisabled || disabled"
            @click="AddFile2"
            >{{ col.btnText }}</el-button
          >
          <div
            v-else-if="col.formType == 'blank'"
            :style="{ width: col.width + 'px', height: col.height + 'px' }"
          >
            {{ col.label }}
          </div>

          <image-upload
            v-else-if="col.formType == 'upload'"
            class="upload-demo"
            :fileType="['jpg', 'png']"
            @uploadChange="uploadChange1"
            :value="col.props"
            :disabled="disabled"
            :extraData="{ category: 1 }"
            :listType="'picture-card'"
          >
          </image-upload>
          <el-form-item
            v-else
            :label="col.label"
            :prop="col.prop"
            :class="{ hideBorder: hideBorder }"
            :required="col.required"
          >
            <editor
              v-if="col.formType == 'editor'"
              v-model="formData[col.prop]"
              :min-height="192"
            />
            <!-- 文件上传 -->
            <el-button
              v-else-if="col.formType == 'file'"
              type="primary"
              icon="el-icon-plus"
              @click="AddFile"
              >{{ col.btnText }}</el-button
            >
            <!-- 多选框 -->

            <el-checkbox-group
              v-model="formData[col.prop]"
              v-else-if="col.formType == 'checkbox'"
              :disabled="col.formDisabled || disabled"
            >
              >
              <el-checkbox
                v-for="item in col.options"
                :label="item"
                :key="item"
                >{{ item }}</el-checkbox
              >
            </el-checkbox-group>
            <span v-else-if="col.formType == 'blank'">{{
              formData[col.prop]
            }}</span>
            <el-select
              v-else-if="col.formType == 'select'"
              v-model="formData[col.prop]"
              placeholder="请选择"
              @change="col.selectfn ? col.selectfn() : (() => {})()"
              filterable
              clearable
              :disabled="col.formDisabled || disabled"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in col.options"
                :key="item.value"
              >
                <span v-if="col.optionShowValue" style="float: left">{{
                  item.label
                }}</span>
                <span
                  v-if="col.optionShowValue"
                  style="float: right; color: #8492a6; font-size: 13px"
                  >{{ item.value }}</span
                >
              </el-option>
            </el-select>
            <el-select
              v-else-if="col.formType == 'selectTag'"
              v-model="formData[col.prop]"
              placeholder="请选择"
              @change="col.selectfn ? col.selectfn() : (() => {})()"
              filterable
              clearable
              :disabled="col.formDisabled || disabled"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in col.options"
                :key="item.value"
              >
                <el-tag
                  class="selectTag"
                  effect="light"
                  :type="item.raw.listClass"
                >
                  {{ item.label }}
                </el-tag>
              </el-option>
            </el-select>
            <el-radio-group
              v-else-if="col.formType == 'radio'"
              v-model="formData[col.prop]"
              :disabled="col.formDisabled || disabled"
              @input="col.changeFn"
            >
              <el-radio
                :label="item.value"
                :value="item.value"
                v-for="item in col.options"
                :key="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <el-date-picker
              v-else-if="col.formType == 'date'"
              v-model="formData[col.prop]"
              value-format="yyyy-MM-dd"
              size="small"
              type="date"
              clearable
              :disabled="col.formDisabled || disabled"
              style="width: auto"
              placeholder="选择日期"
            >
            </el-date-picker>
            <el-date-picker
              v-else-if="col.formType == 'datetime'"
              v-model="formData[col.prop]"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              type="datetime"
              clearable
              :disabled="col.formDisabled || disabled"
              style="width: 100%"
              placeholder="选择日期"
            >
            </el-date-picker>
            <treeselect
              size="small"
              v-else-if="col.formType == 'selectTree'"
              v-model="formData[col.prop]"
              :options="col.options"
              clear-value-text="清除"
              no-options-text="暂无数据"
              clearValueText="清除"
              noOptionsText="暂无数据"
              placeholder="请选择"
              :default-expand-level="4"
              :appendToBody="true"
              :normalizer="normalizer"
              :disabled="col.formDisabled || disabled"
              :zIndex="9999"
              style="height: 32px; line-height: 32px"
            />
            <el-input
              v-else-if="col.formType == 'textarea'"
              type="textarea"
              v-model="formData[col.prop]"
              placeholder="请输入"
              :rows="col.rows"
              :disabled="col.formDisabled || disabled"
            />
            <el-input-number
              v-else-if="col.formType == 'number'"
              v-model="formData[col.prop]"
              placeholder="请输入"
              :step="1"
              style="width: 100%"
              controls-position="right"
              :disabled="col.formDisabled || disabled"
            ></el-input-number>
            <span v-else-if="col.formType == 'span'">{{
              formData[col.prop]
            }}</span>
            <el-input
              v-else
              v-model="formData[col.prop]"
              placeholder="请输入"
              :readonly="col.readonly"
              :disabled="col.formDisabled || disabled"
              @click.native="col.clickFn ? col.clickFn() : (() => {})()"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <slot name="footer"></slot>

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
        @uploadChange="uploadChange2"
        :listType="'picture-card'"
        style="padding: 0 20px"
      >
      </file-upload>
    </el-drawer>

    <!-- btn上传文件 -->
    <el-drawer
      title="选择文件"
      :visible.sync="filedrawer2"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false"
    >
      <file-upload
        :drag="true"
        @uploadChange="uploadChange3"
        :listType="'picture-card'"
        style="padding: 0 20px"
      >
      </file-upload>
    </el-drawer>
  </div>
</template>
<script>
import Schema from "async-validator";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Relevance from "@/components/FaultTable/Relevance";
import EquipArr from "@/components/FaultTable/EquipArr";
import EquipOne from "@/components/FaultTable/EquipOne";
import SpareRecord from "@/components/FaultTable/SpareRecord";
import TimeLog from "@/components/FaultTable/TimeLog";
import Expense from "@/components/FaultTable/Expense";
import MaintenanceRecord from "@/components/FaultTable/MaintenanceRecord";
import MaintenanceContent from "@/components/FaultTable/MaintenanceContent";
import InspectContent from "@/components/FaultTable/InspectContent";
import ExpenseInspect from "@/components/FaultTable/ExpenseInspect";

// 设置报错提示信息
Schema.messages.required = (fieldName) => {
  return "此项为必填项";
};
export default {
  name: "CarryForm",
  components: {
    Treeselect,
    Relevance,
    EquipArr,
    EquipOne,
    SpareRecord,
    TimeLog,
    Expense,
    MaintenanceRecord,
    MaintenanceContent,
    InspectContent,
    ExpenseInspect,
  },
  props: {
    columns: {
      default: () => [],
      type: Array,
    },
    formData: {
      default: () => {},
      type: Object,
    },
    hideBorder: {
      default: false,
      type: Boolean,
    },
    showButton: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    labelWidth: {
      default: "",
      type: String,
    },
    labelPosition: {
      default: "right",
      type: String,
    },
  },

  data() {
    return {
      // form: {},
      rules: {},
      //文档
      filedrawer: false,
      filedrawer2: false,
      fileType: [".xlsx"],
      fileList: [],
      fileList2: [],
    };
  },
  created() {},
  mounted() {
    // this.resetFields();
    this.clearValidate();
  },
  methods: {
    expenseInspect(val) {
      this.formData["checkCosts"] = val;
    },
    inspectContent(val) {
      this.formData = Object.assign(this.formData, val);
    },
    // 维修内容记录 委外
    maintenanceContent(val) {
      this.formData["repairInfoOutDTO"] = val;
    },
    // 批量维修记录
    maintenanceRecord(val) {
      this.formData["repairInfoDTO"] = val;
    },
    // 费用核算
    expense(val) {
      this.formData["costDTOList"] = val;
    },
    // 人员与工时记录
    timeLog(val) {
      this.formData["addWorkHoursList"] = val;
    },
    //上传文件
    AddFile() {
      this.filedrawer = true;
    },
    AddFile2() {
      this.filedrawer2 = true;
    },
    uploadChange2(val) {
      val = val.url;
      this.fileList = this.fileList.concat(val);
      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "file")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = this.fileList;

      this.filedrawer = false;
    },
    uploadChange3(val) {
      this.fileList2 = this.fileList2.concat(val);
      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "fileBtn")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = this.fileList2;

      this.filedrawer2 = false;
    },
    uploadChange1(e) {
      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "upload")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = e;
    },

    fileResourceList(val) {
      this.formData["addFileList"] = val.filter((item) => !item.id);
    },
    delFileList(val) {
      this.formData["delFileList"] = val;
    },
    spareRecord(val) {
      this.formData["addAttachmentDTOList"] = val.filter((item) => !item.id);
    },
    delAttachmentList(val) {
      this.formData["delAttachmentList"] = val;
    },
    updateAttachmentiist(val) {
      this.formData["updateAttachmentiist"] = val;
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (JSON.stringify(node.children) == "[]") {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs["formform"].clearValidate();
      });
    },
    resetFields() {
      this.$nextTick(() => {
        this.$refs["formform"].resetFields();
      });
    },
    async submitForm() {
      try {
        //调用表单的validate方法，执行表单校验
        await this.$refs["formform"].validate();
      } catch (e) {
        //如果表单有报错，则进入catch，此时直接return不执行表单提交
        return false;
      }
      this.$emit("submitForm", this.formData);
      return true;
    },
    close() {
      this.clearValidate();
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-input.is-disabled .el-input__inner,
::v-deep .el-textarea.is-disabled .el-textarea__inner,
::v-deep .el-radio__input.is-disabled .el-radio__inner {
  background-color: #f9f9f9;
  border-color: #dddddd;
  color: #000;
  cursor: not-allowed;
}

::v-deep .el-radio__input.is-disabled.is-checked {
  .el-radio__inner {
    &::after {
      background-color: #000;
    }
  }
  & + .el-radio__label {
    color: #000;
  }
}
::v-deep .vue-treeselect--disabled .vue-treeselect__control {
  cursor: not-allowed;
}
.el-select.el-select--small {
  width: 100%;
}
::v-deep .hideBorder {
  .vue-treeselect__control,
  .el-input__inner,
  .el-textarea__inner {
    border: none !important;
    background-color: #fff !important;
    cursor: default !important;
  }
  .el-input__suffix,
  .el-input__prefix {
    display: none !important;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 15px !important;
  }
}
.subtitle {
  //   border-bottom: 1px solid #ddd;
  background-color: #ebf4fc;

  ::v-deep .el-form-item__label {
    // &::before {
    //   content: "";
    //   display: inline-block;
    //   vertical-align: middle;
    //   transform: translateX(-20px);
    //   margin-top: -2.5px;
    //   width: 2px;
    //   height: 33px;
    //   background-color: #1f77fc;
    // }
    color: #55566d;
    font-weight: bold;
    width: 300px !important;
    text-align: left;
    font-size: 16px;
    padding-left: 20px;
  }
}
.selectTag {
  background: none !important;
  border: none;
  margin: 0;
  padding: 0;
  height: auto;
  line-height: normal;
}
.upload-demo {
  margin: 20px 0;
}
</style>
