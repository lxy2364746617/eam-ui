<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="19">
          <i
            class="el-icon-back"
            @click="backparent"
            style="color: #007bfe; cursor: pointer"
          ></i>
          <span style="font-size: 14px"> {{ formTitle }}</span>
        </el-col>
        <el-col :span="5" v-if="disabled1" style="font-size: 12px; color: #888">
          <!-- <el-button type="text" icon="el-icon-s-help">快速工单</el-button> -->
          <el-button type="text" icon="el-icon-edit" @click="disabled1 = false"
            >编辑</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 10px">
        <el-col :span="6">
          <img
            :src="mainImage"
            alt=""
            srcset=""
            style="width: 50%; vertical-align: top; height: 100px"
          />
          <img
            :src="qrCode"
            alt=""
            srcset=""
            style="width: 50%; vertical-align: top"
          />
        </el-col>
        <el-col
          :span="15"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          <jm-form
            class="mr20"
            :columns="columns"
            :formData="formData1"
            :showButton="false"
            :disabled="disabled1"
            ref="jmform1"
          >
          </jm-form>
        </el-col>
        <el-col :span="3">
          <span v-if="disabled1">
            <el-progress
              type="circle"
              :percentage="68"
              :width="70"
            ></el-progress>
            <div style="font-size: 12px">资料完整度68%</div>
          </span>
          <span v-else>
            <el-button type="primary" @click="save" size="mini">确认</el-button>
            <br /><br />
            <el-button size="mini" @click="close">取消</el-button>
          </span>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="item in tabs"
          :key="item.label"
          v-if="item.visible"
        >
          <component
            :is="item.name"
            :formData="formData1"
            @submitForm="submitForm"
            @close="close"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { modifyBASE } from "@/api/equipment/BASE";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import step1 from "@/views/device/book/details/step1";
import step2 from "@/views/device/book/details/step2";
import step3 from "@/views/device/book/details/step3";
import step4 from "@/views/device/book/details/step4";
import step5 from "@/views/device/book/details/step5";
import step6 from "@/views/device/book/details/step6";
import step7 from "@/views/device/book/details/step7";
import step8 from "@/views/device/book/details/step8";
export default {
  name: "bookadddetails",
  dicts: ["em_device_state", "device_run_state"],
  components: {
    Treeselect,
    JmUserTree,
    JmTable,
    JmForm,
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8,
    devicebook: () => import("@/views/device/book/index"),
  },
  computed: {
    mainImage() {
      return process.env.VUE_APP_BASE_API + this.formData.mainImage;
    },
    qrCode() {
      return process.env.VUE_APP_BASE_API + this.formData.qrCode;
    },
    // 列信息
    columns() {
      return [
        { label: "设备名称", prop: "deviceName", span: 12, required: true },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "select",
          options: this.dict.type.em_device_state,
          span: 12,
          required: true,
        },
        { label: "设备编码", prop: "deviceCode", span: 12, required: true },
        {
          label: "运行状态",
          prop: "runStatus",
          formType: "select",
          options: this.dict.type.device_run_state,
          span: 12,
        },
      ];
    },
    tabs() {
      return [
        { label: "基本信息", name: "step1", visible: true },
        {
          label: "主要指标",
          name: "step2",
          visible: this.formData.emArchivesIndex,
        },
        {
          label: "特种设备信息",
          name: "step8",
          visible: this.formData.emArchivesSpecial,
        },
        { label: "设备图片及位置", name: "step3", visible: true },
        { label: "技术资料", name: "step4", visible: true },
        { label: "备件备品", name: "step5", visible: true },
        {
          label: "关联设备",
          name: "step6",
          visible: this.formData.deviceAtt == 1,
        },
        {
          label: "关联部件",
          name: "step7",
          visible: this.formData.deviceAtt == 0,
        },
      ];
    },
  },
  props: {
    formTitle: {
      default: "提示信息",
      type: String,
    },
    deviceId: {
      default: "",
      type: String,
    },
    formData: {
      default: {},
      type: Object,
    },
  },
  watch: {
    formData: {
      handler(val) {
        this.formData1 = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      activeName: "step1",
      disabled1: true,
      formData1: {},
    };
  },
  created() {
    console.log("========================", this.$props);
  },
  methods: {
    tabsHandleClick() {},
    close(callback) {
      this.formData1 = JSON.parse(JSON.stringify(this.formData));
      this.disabled1 = true;
      if (callback) callback();
    },
    async save(fn) {
      var jmform1 = await this.$refs.jmform1.submitForm();
      if (jmform1) {
        this.submitForm();
      }
    },
    /** 提交按钮 */
    submitForm(callback) {
      var formData1 = this.getFormDataParams();
      modifyBASE(formData1).then((response) => {
        this.$modal.msgSuccess("修改成功");
        this.setSuccessData();
        this.disabled1 = true;
        if (callback) callback(formData1);
      });
    },
    setSuccessData() {
      Object.assign(this.formData, this.formData1);
    },
    backparent() {
      this.$emit("back");
    },
    getFormDataParams() {
      var formData1 = JSON.parse(JSON.stringify(this.formData1));
      if (window.sessionStorage.getItem("purchasePlanDetailId")) {
        formData1["id"] = Number(
          window.sessionStorage.getItem("purchasePlanDetailId")
        );
        formData1["purchasePlanDetailId"] = Number(
          window.sessionStorage.getItem("purchasePlanDetailId")
        );
      }
      console.log("========================", this.formData1);
      var aa = formData1.emArchivesExtendAtt;
      aa["fieldValue"] = JSON.stringify(aa["fieldValue"]);
      aa["componentContent"] = JSON.stringify(aa["componentContent"]);

      var bb = formData1.emArchivesIndex;
      bb["fieldValue"] = JSON.stringify(bb["fieldValue"]);
      bb["componentContent"] = JSON.stringify(bb["componentContent"]);

      var cc = formData1.emArchivesSpecial;
      if (cc) {
        cc["fieldValue"] = JSON.stringify(cc["fieldValue"]);
        cc["componentContent"] = JSON.stringify(cc["componentContent"]);
      }

      return formData1;
    },
  },
};
</script>