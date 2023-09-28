<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="3">
          <i
            class="el-icon-back"
            @click="backparent"
            style="color: #007bfe; cursor: pointer"
          ></i>
          {{ formTitle }}
        </el-col>
        <el-col
          :span="18"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          说明：此功能针对新设备入库，关联需求计划。老设备请在设备档案新增
        </el-col>
      </el-row>
      <el-steps
        :active="stepActive"
        style="width: 90%; margin: 0 auto; padding-top: 30px"
      >
        <el-step
          v-for="item in elstep"
          v-if="item.visible"
          :name="item.title"
          :key="item.title"
          :title="item.title"
          :description="item.description"
        ></el-step>
      </el-steps>
    </el-card>
    <step1
      v-if="stepActive == 0"
      :formData="formData"
      :stepActive="stepActive"
      @nextstep="nextstep"
      :elstep="elstep"
      @prvstep="prvstep"
      @closeform="backparent"
    ></step1>
    <step2
      v-if="stepActive == 1"
      :formData="formData"
      :stepActive="stepActive"
      @nextstep="nextstep"
      :elstep="elstep"
      @prvstep="prvstep"
      @closeform="backparent"
    ></step2>
    <step3
      v-if="elstep[2].visible ? stepActive == 2 : ''"
      :formData="formData"
      :stepActive="stepActive"
      @nextstep="nextstep"
      :elstep="elstep"
      @prvstep="prvstep"
      @closeform="backparent"
    ></step3>
    <step4
      v-if="elstep[2].visible ? stepActive == 3 : stepActive == 2"
      :formData="formData"
      :stepActive="stepActive"
      @nextstep="nextstep"
      :elstep="elstep"
      @prvstep="prvstep"
      @closeform="backparent"
    ></step4>
    <step5
      v-if="elstep[2].visible ? stepActive == 4 : stepActive == 3"
      :formData="formData"
      :stepActive="stepActive"
      @nextstep="nextstep"
      :elstep="elstep"
      @prvstep="prvstep"
      @closeform="backparent"
    ></step5>
  </div>
</template>

<script>
import { getBASE } from "@/api/equipment/BASE";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import step1 from "@/views/property/equipmentAcquisition/Warehousing/add/step1";
import step2 from "@/views/property/equipmentAcquisition/Warehousing/add/step2";
import step3 from "@/views/property/equipmentAcquisition/Warehousing/add/step3";
import step4 from "@/views/property/equipmentAcquisition/Warehousing/add/step4";
import step5 from "@/views/property/equipmentAcquisition/Warehousing/add/step5";

export default {
  dicts: [
    "em_device_state",
    "device_run_state",
    "em_is_special",
    "em_device_att",
    "em_unit",
    "em_device_level",
    "em_device_financing",
    "em_is_lease",
  ],
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
    devicebook: () => import("@/views/device/book/index"),
  },
  props: {
    formTitle: {
      default: "",
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
  watch: {},
  computed: {
    elstep() {
      return [
        {
          title: "维护基础信息",
          description: "编辑设备重要数据和常规数据",
          visible: true,
        },
        {
          title: "维护其他信息",
          description: "编辑财务数据、购置数据和扩展属性",
          visible: true,
        },
        {
          title: "维护主要指标",
          description: "编辑六大主要设备指标",
          visible: this.formData.emArchivesIndex != null,
        },
        {
          title: "维护关联备件",
          description: "编辑备品备件、易损件信息",
          visible: true,
        },
        {
          title: "上传图片和技术资料",
          description: "上传设备图片和相关技术资料",
          visible: true,
        },
      ];
    },
  },
  data() {
    return {
      stepActive: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    prvstep() {
      this.stepActive--;
    },
    nextstep() {
      this.stepActive++;
    },
    backparent() {
      this.$emit("back");
    },
    getFormDataParams() {
      var formData = JSON.parse(JSON.stringify(this.formData));
      if (window.sessionStorage.getItem("purchasePlanDetailId")) {
        formData["id"] = Number(
          window.sessionStorage.getItem("purchasePlanDetailId")
        );
        formData["purchasePlanDetailId"] = Number(
          window.sessionStorage.getItem("purchasePlanDetailId")
        );
      }
      var aa = formData.emArchivesExtendAtt;
      if (aa) {
        aa["fieldValue"] = JSON.stringify(aa["fieldValue"]);
        aa["componentContent"] = JSON.stringify(aa["componentContent"]);
      }

      var bb = formData.emArchivesIndex;
      if (bb) {
        bb["fieldValue"] = JSON.stringify(bb["fieldValue"]);
        bb["componentContent"] = JSON.stringify(bb["componentContent"]);
      }

      var cc = formData.emArchivesSpecial;
      if (cc) {
        cc["fieldValue"] = JSON.stringify(cc["fieldValue"]);
        cc["componentContent"] = JSON.stringify(cc["componentContent"]);
      }

      return formData;
    },
  },
  beforeDestroy() {
    window.sessionStorage.removeItem("purchasePlanDetailId");
  },
};
</script>