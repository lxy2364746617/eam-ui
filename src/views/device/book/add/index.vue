<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="3">
          <!-- <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i> -->
           {{ formTitle }}
        </el-col>
        <el-col :span="18" style="font-size: 12px;color: #888;padding-top: 4px;">
          说明：此功能针对老设备，新设备请走设备入库流程
        </el-col>
      </el-row>
      <el-steps :active="stepActive" style="width: 90%;margin: 0 auto;padding-top: 30px;">
        <el-step v-for="item in elstep" v-if="item.visible" :name="item.title" :key="Math.random()" :title="item.title" :description="item.description"></el-step>
      </el-steps>
    </el-card>
    
    <step1 v-if="stepActive==0" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent" :isEdit='isEdit'></step1>
    <step2 v-if="stepActive==1" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step2>
    <step3 v-if="elstep[2].visible?stepActive==2:false" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step3>
    <step4 v-if="elstep[2].visible?stepActive==3:stepActive==2" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step4>
    <step5 v-if="elstep[2].visible?stepActive==4:stepActive==3" :formData="formData" :stepActive="stepActive" @nextstep="nextstep" :elstep="elstep" @prvstep="prvstep" @closeform="backparent"></step5>
  </div>
</template>

<script>
import { getBASE } from "@/api/equipment/BASE";
import Treeselect from "@riophae/vue-treeselect";
import { findByTemplateType } from "@/api/equipment/attribute";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import step1 from "@/views/device/book/add/step1";
import step2 from "@/views/device/book/add/step2";
import step3 from "@/views/device/book/add/step3";
import step4 from "@/views/device/book/add/step4";
import step5 from "@/views/device/book/add/step5";

export default {
  name: "bookadd",
  dicts: [
    'em_device_state',  'device_run_state', 'em_is_special',  'em_device_att', 
    'em_unit',  'em_device_level',  'em_device_financing',  'em_is_lease', 
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
    step1, step2, step3, step4, step5,
    // devicebook: ()=> import("@/views/device/book/index"),
  },
  props:{
    // formTitle:{
    //   default:'',
    //   type: String,
    // },
    // deviceId: {
    //   default:'',
    //   type: String,
    // },
    // formData: {
    //   default: {},
    //   type: Object,
    // },
  },
  watch: {
    formData: {
      handler(val) {
      },
      immediate: true,
      deep: true,
    },
  },
  computed:{
    elstep(){
      return [
        { title: "维护基础信息", description: "编辑设备重要数据和常规数据", visible: true, },
        { title: "维护其他信息", description: "编辑财务数据、购置数据和扩展属性", visible: true, },
        { title: "维护主要指标", description: "编辑六大主要设备指标", visible: this.formData.emArchivesIndex!=null, },
        { title: "维护关联备件", description: "编辑备品备件、易损件信息", visible: true, },
        { title: "上传图片和技术资料", description: "上传设备图片和相关技术资料", visible: true, },
      ]
    }
  },
  data() {
    return {
      stepActive: 0,
      formTitle: '',
      formData: {
        deviceStatus: '备用'
      },
      isEdit:false
    };
  },
  created() {
    if(this.$route.query.i){
      // 编辑
      const deviceId = this.$route.query.i
      this.isEdit = this.$route.query.f=='edit'
      this.formTitle = "编辑设备"
      getBASE(deviceId).then(response => {
        
        // 第一步  特种设备
        if(response.data.emArchivesSpecial){
          response.data.emArchivesSpecial.componentContent = JSON.parse(response.data.emArchivesSpecial.componentContent)
          response.data.emArchivesSpecial.fieldValue = JSON.parse(response.data.emArchivesSpecial.fieldValue)
          // this.setFormLabel(response.data.emArchivesSpecial.componentContent)
        }
        // 第二步
        if(response.data.archivesOther==null){
          response.data.archivesOther={}
        } 
        // 第二步  扩展数据
        if(response.data.emArchivesExtendAtt){
          response.data.emArchivesExtendAtt.componentContent = JSON.parse(response.data.emArchivesExtendAtt.componentContent)
          response.data.emArchivesExtendAtt.componentContent.forEach(item=>{
            item.label=item.label||item.fieldName
            item.prop=item.prop||item.fieldCode
          })
          response.data.emArchivesExtendAtt.fieldValue = JSON.parse(response.data.emArchivesExtendAtt.fieldValue)
          // this.setFormLabel(response.data.emArchivesExtendAtt.componentContent)
        }
        // 第三步 主要指标
        if(response.data.emArchivesIndex){
          response.data.emArchivesIndex.componentContent = JSON.parse(response.data.emArchivesIndex.componentContent)
          response.data.emArchivesIndex.fieldValue = JSON.parse(response.data.emArchivesIndex.fieldValue)
          // this.setFormLabel(response.data.emArchivesIndex.componentContent)
        }

        this.formData = response.data;
        this.stepActive = this.formData.step;

        // var obj = {
        //   componentContent: [],
        //   fieldValue: {},
        // }
        // if(this.formData.emArchivesExtendAtt==null) this.formData.emArchivesExtendAtt=obj
        // if(this.formData.emArchivesIndex==null) this.formData.emArchivesIndex=obj
        // if(this.formData.emArchivesSpecial==null) this.formData.emArchivesSpecial=obj
      })
      .catch(err => {
      });
    }else{
      // 新增
      this.formTitle = "新增设备"
      // 获取扩展数据
      findByTemplateType({templateType: 'K'}).then(response => {
        // this.formData = this.$options.data().formData;
        this.setFormLabel(response.data)
        // 扩展数据
        /* this.formData.emArchivesExtendAtt = {
          componentContent: response.data,
          fieldValue: {},
        } */
        this.$set(this.formData,'emArchivesExtendAtt',{
          componentContent: response.data,
          fieldValue: {},
        })
      })
      .catch(err => {
      });
    }
    // this.queryParams.largeId = this.$route.query.l;
    // this.disabled = this.$route.query.d == 'true';
    // if(this.$route.query.l){
    //     this.getDetails(this.$route.query.l);
    // }
    // this.getTree();
    // this.getTreeSelect();
    // console.log(this.$route.query,222);

  },
  methods: {
    setFormLabel(arr){
      arr.forEach(b => {
        b.label=b.fieldName;
        b.prop=b.fieldCode;
        // b.required = b.required;
        b.required = b.required=='0'?true:false;
        b.disabled = b.disabled;
        b.formType = b.componentType;
        switch (b.componentType) {
          case 'select':
            b.options = [];
            // 字典
            if(b.dictionaryType){
              b.options = this.dict.type[b.dictionaryType]
            }
            break;
          case 'radio':
            b.options = [];
            if(b.dictionaryType){
              b.options = this.dict.type[b.dictionaryType]
            }
            break;
        
          default:
            break;
        }
      });
    },
    prvstep(){
      this.stepActive --
    },
    nextstep(){
      this.stepActive ++
    },
    backparent(){
      this.$store.dispatch('tagsView/delView', this.$route) // 关闭当前页
      this.$router.go(-1)//跳回上页
      // this.$emit('back')
    },
    getFormDataParams(){
      this.formData.step = this.stepActive;
      var formData = JSON.parse(JSON.stringify(this.formData))

      var aa = formData.emArchivesExtendAtt
      if(aa){
        aa['fieldValue'] = JSON.stringify(aa['fieldValue'])
        aa['componentContent'] = JSON.stringify(aa['componentContent'])
      }

      var bb = formData.emArchivesIndex
      if(bb){
        bb['fieldValue'] = JSON.stringify(bb['fieldValue'])
        bb['componentContent'] = JSON.stringify(bb['componentContent'])
      }
      
      var cc = formData.emArchivesSpecial
      if(cc){
        cc['fieldValue'] = JSON.stringify(cc['fieldValue'])
        cc['componentContent'] = JSON.stringify(cc['componentContent'])
      }

      return formData
    },
  }
};
</script>