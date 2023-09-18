<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="3">
          <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>
           {{ formTitle }}
        </el-col>
        <el-col :span="18" style="font-size: 12px;color: #888;padding-top: 4px;">
          说明：此功能针对老设备，新设备请走设备入库流程
        </el-col>
      </el-row>
      <el-steps :active="stepActive" style="width: 90%;margin: 0 auto;padding-top: 30px;">
        <el-step v-for="item in elstep" :key="item.title" :title="item.title" :description="item.description"></el-step>
      </el-steps>
    </el-card>
    <step1 v-if="stepActive==0" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step1>
    <step2 v-if="stepActive==1" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step2>
    <step3 v-if="stepActive==2" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step3>
    <step4 v-if="stepActive==3" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step4>
    <step5 v-if="stepActive==4" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step5>
  </div>
</template>

<script>
import { getBASE } from "@/api/equipment/BASE";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import step1 from "@/views/decive/book/add/step1";
import step2 from "@/views/decive/book/add/step2";
import step3 from "@/views/decive/book/add/step3";
import step4 from "@/views/decive/book/add/step4";
import step5 from "@/views/decive/book/add/step5";

export default {
  name: "bookadd",
  dicts: [
    'em_device_state',  'device_run_state', 'em_is_special',  'em_device_att', 
    'em_unit',  'em_device_level',  'em_device_financing',  'em_is_lease', 
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
    step1, step2, step3, step4, step5,
    devicebook: ()=> import("@/views/decive/book/index"),
  },
  props:{
    formTitle:{
      default:'',
      type: String,
    },
    deviceId: {
      default:'',
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
        console.log(val);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      elstep:[
        { title: "维护基础信息", description: "编辑设备重要数据和常规数据" },
        { title: "维护其他信息", description: "编辑财务数据、购置数据和扩展属性" },
        { title: "维护主要指标", description: "编辑六大主要设备指标" },
        { title: "维护关联备件", description: "编辑备品备件、易损件信息" },
        { title: "上传图片和技术资料", description: "上传设备图片和相关技术资料" },
      ],
      stepActive: 0,
    };
  },
  created() {
  },
  methods: {
    prvstep(){
      this.stepActive --
    },
    nextstep(){
      this.stepActive ++
    },
    backparent(){
      this.$emit('back')
    },
    getFormDataParams(){
      var formData = JSON.parse(JSON.stringify(this.formData))
      var aa = formData.emArchivesExtendAtt
      aa['fieldValue'] = JSON.stringify(aa['fieldValue'])
      aa['componentContent'] = JSON.stringify(aa['componentContent'])
      return formData
    },
  }
};
</script>