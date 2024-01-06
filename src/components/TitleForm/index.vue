<template>
  <div>
    <div v-if="!disabled && showButton" style="float: right; margin-top: -65px">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
    </div>
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
          <Request
            v-else-if="col.formType == 'table'"
            :orderCode="formData.orderCode"
            :disabled2="disabled"
          >
          </Request>
          <Relevance
            v-else-if="col.formType == 'document'"
            @fileResourceList="fileResourceList"
            @delFileList="delFileList"
            :formData="formData"
            :disabled="disabled"
          ></Relevance>
          <SparePart
            v-else-if="col.formType == 'sparePart'"
            @standardList="standardList"
            :formData="formData"
            :disabled="disabled"
          ></SparePart>
          <DotRoute
            v-else-if="col.formType == 'dotRoute'"
            @lineDTOList="lineDTOList"
            :formData="formData"
            :disabled="disabled"
          ></DotRoute>
          <MaintenanceRoute
            v-else-if="col.formType == 'maintenanceRoute'"
            @lineDTOListMaintenance="lineDTOListMaintenance"
            @lineDTOListMaintainItems="lineDTOListMaintainItems"
            :formData="formData"
            :disabled="disabled"
          ></MaintenanceRoute>
          <DotEqm
            v-else-if="col.formType == 'dotEqm'"
            @XDJSB="xdjsb"
            :formData="formData"
            :disabled="disabled"
          ></DotEqm>
          <MaintenanceEqm
            v-else-if="col.formType == 'maintenanceEqm'"
            :formData="formData"
            @deviceDTOListMaintenance="deviceDTOListMaintenance"
            @MaintenanceEqmMaintainItems="MaintenanceEqmMaintainItems"
          ></MaintenanceEqm>
          <EquipMessage
            v-else-if="col.formType == 'equipMessage'"
            @SBXX="sbxx"
            :formData="formData"
            :disabled="disabled"
            ref="message"
          ></EquipMessage>
          <Personnel
            v-else-if="col.formType == 'personnel'"
            :formData="formData"
            :disabled="disabled"
          ></Personnel>
          <PersonnelUpkeep
            v-else-if="col.formType == 'personnelUpkeep'"
            :formData="formData"
            :disabled="disabled"
          ></PersonnelUpkeep>
          <Equip
            v-else-if="col.formType == 'equip'"
            @womDevices="womDevices"
            :disabled="disabled"
            :formData="formData"
          ></Equip>
          <el-button
            v-else-if="col.formType == 'fileBtn'"
            type="primary"
            icon="el-icon-plus"
            :disabled="col.formDisabled || disabled"
            @click="AddFile2"
            >{{ col.btnText }}</el-button
          >
          <el-button
            v-else-if="col.formType == 'fileBtn2'"
            type="primary"
            icon="el-icon-plus"
            :disabled="col.formDisabled || disabled"
            @click="AddFile3"
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
            :value="formData['fileList']"
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
              :disabled="col.formDisabled || disabled"
              v-hasPermi="['equipment:book:add']"
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
              style="width: 100%"
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
              style="height: 33px; line-height: 32px"
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

    <!-- btn上传文件 -->
    <el-drawer
      title="选择文件"
      :visible.sync="filedrawer3"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false"
    >
      <file-upload
        :drag="true"
        @uploadChange="uploadChange4"
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
import Request from "@/components/FaultTable/index";
import Relevance from "@/components/FaultTable/Relevance";
import SparePart from "@/components/FaultTable/SparePart";
import DotRoute from "@/components/FaultTable/DotRoute";
import MaintenanceRoute from "@/components/FaultTable/MaintenanceRoute";
import DotEqm from "@/components/FaultTable/DotEqm";
import MaintenanceEqm from "@/components/FaultTable/MaintenanceEqm";
import EquipMessage from "@/components/FaultTable/EquipMessage";
import Personnel from "@/components/FaultTable/Personnel";
import PersonnelUpkeep from "@/components/FaultTable/PersonnelUpkeep";
import Equip from "@/components/FaultTable/Equip";

// 设置报错提示信息
Schema.messages.required = (fieldName) => {
  return "此项为必填项";
};
export default {
  name: "TitleForm",
  components: {
    Treeselect,
    Request,
    Relevance,
    SparePart,
    DotRoute,
    MaintenanceRoute,
    DotEqm,
    MaintenanceEqm,
    EquipMessage,
    Personnel,
    PersonnelUpkeep,
    Equip,
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
      filedrawer: false,
      filedrawer2: false,
      filedrawer3: false,
      fileType: [".xlsx"],
      fileList: [],
      rules: {},
      fileList2: [],
      fileList3: [],
    };
  },
  created() {},
  mounted() {
    // this.resetFields();
    this.clearValidate();
  },
  methods: {
    AddFile2() {
      this.filedrawer2 = true;
    },
    AddFile3() {
      this.filedrawer3 = true;
    },
    //上传文件
    AddFile() {
      this.filedrawer = true;
    },
    // setEquipMessage(data) {
    //   //
    //   this.$nextTick(() => {
    //     this.$refs.message.setFormData(data);
    //   });
    // },
    // 定期检验设备
    womDevices(val) {
      this.formData["womDevices"] = val;
    },
    // 保养路线 调整项目
    lineDTOListMaintainItems(val) {
      this.formData["maintainItems"] = val;
    },
    // 保养路线
    lineDTOListMaintenance(val) {
      this.formData["lineDTOList"] = val;
    },
    // 保养设备 调整项目
    MaintenanceEqmMaintainItems(val) {
      this.formData["maintainItems"] = val;
    },
    // 保养设备
    deviceDTOListMaintenance(val) {
      this.formData["deviceDTOList"] = val;
    },
    // 巡点捡路线
    lineDTOList(val) {
      this.formData["lineDTOList"] = val;
    },
    // 设备信息
    sbxx(val) {
      if (!val.deviceCode) return;
      let newVal = {
        deviceName: val.deviceName,
        deviceCode: val.deviceCode,
        categoryId: val.categoryId,
        isSpecial: val.isSpecial,
        specs: val.specs,
        currDeptId: val.currDeptId,
        affDeptId: val.affDeptId,
        deviceStatus: val.deviceStatus,
        remark: val.remark,
        faultInfoDTO: val.faultInfoDTO,
      };
      this.formData["deviceDTOList"] = [newVal];
      this.formData = Object.assign(this.formData, val.faultInfoDTO);
    },
    // 巡点捡设备
    xdjsb(val) {
      // ! 巡点捡设备
      if (val.length) {
        this.formData["deviceDTOList"] = val;
      }
    },
    // 上传图片
    uploadChange1(e) {
      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "upload")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = e;
    },
    uploadChange2(val) {
      this.fileList = val[0].url;

      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "file")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = this.fileList;

      this.filedrawer = false;
    },
    uploadChange3(val) {
      this.fileList2 = val[0].url;
      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "fileBtn")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = this.fileList2;

      this.filedrawer2 = false;
    },
    uploadChange4(val) {
      this.fileList3 = val[0].url;
      let props = JSON.parse(JSON.stringify(this.columns))
        .filter((item) => item.formType == "fileBtn2")
        .map((item) => item.prop);
      this.formData[`${props[0]}`] = this.fileList3;

      this.filedrawer3 = false;
    },
    standardList(val) {
      this.formData["attachmentDTOList"] = val;
    },
    // 关联附件
    fileResourceList(val) {
      this.formData["addFileList"] = val.filter((item) => !item.id);
    },
    delFileList(val) {
      this.formData["delFileList"] = val;
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
    color: #555;
    font-weight: 700;
    text-align: left;
    font-size: 14px;
    padding-left: 18px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 30px;
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
::v-deep .el-table {
  margin-bottom: 20px;
}
</style>
