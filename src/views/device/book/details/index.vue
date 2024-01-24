<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="19">
          <!-- <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>  -->
          <span style="font-size: 14px;"> {{ formTitle }}</span> 
        </el-col>
        <el-col :span="5" v-if="disabled1" style="font-size: 12px;color: #888;">
          <!-- <el-button type="text" icon="el-icon-s-help">快速工单</el-button> -->
          <el-button v-if="!isReadonly" type="text" icon="el-icon-edit" @click="disabled1=false">编辑</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 10px;">
        <el-col :span="6">
          <img v-if="mainImage.indexOf('null')==-1" :src="mainImage" alt="" srcset="" style="width: 50%;vertical-align: top;height: 100px;">
          <img v-if="qrCode.indexOf('null')==-1" @click="opendrawer" class="qrcodeimg" :src="qrCode" alt="" srcset="">
        </el-col>
        <el-col :span="15" style="font-size: 12px;color: #888;padding-top: 4px;">
          <jm-form 
            class="mr20"
            v-if="formData1"
            :columns="columns" 
            :formData="formData1" 
            :showButton="false"
            :disabled="disabled1"
            ref="jmform1">
          </jm-form>
        </el-col>
        <el-col :span="3">
          <span v-if="disabled1">
            <el-progress type="circle" :percentage="formData.integrity" :width="70"></el-progress>
            <div style="font-size: 12px;">资料完整度{{formData.integrity}}%</div> 
          </span>
          <span v-else>
            <el-button type="primary" @click="save" size="mini">确认</el-button>
            <br><br>
            <el-button size="mini" @click="close">取消</el-button>
          </span>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabs" :key="item.label" v-if="item.visible">
          <component :is="item.name" :isReadonly='isReadonly' v-if="formData1" :formData="formData1"  @submitForm="submitForm" @close="close"></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="设备二维码"
      :visible.sync="drawer"
      direction="rtl"
      size="40%"
      :destroy-on-close="true">
      <div id="printContent">
        <table class="qrcode" cellspacing="0">
          <tr>
            <td style="width: 20%;">设备名称</td>
            <td colspan="2" style="width: 50%;">{{ formData.deviceName }}</td>
          </tr>
          <tr>
            <td>设备编码</td>
            <td>{{ formData.deviceCode }}</td>
            <td rowspan="4" style="text-align: center;width: 30%;">
              <img v-if="qrCode.indexOf('null')==-1" :src="qrCode" width="60%" alt="" srcset="">
            </td>
          </tr>
          <tr>
            <td>规格型号</td>
            <td>{{ formData.specs }}</td>
          </tr>
          <tr>
            <td>设备类别</td>
            <td>{{ categoryName }}</td>
          </tr>
          <tr>
            <td>功能位置</td>
            <td>{{ formData.location }}</td>
          </tr>
        </table>
      </div>
      <div style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
        <el-button size="mini" @click="drawer=false">关闭</el-button>
        <el-button size="mini" @click="handlePrint" type="primary">打印</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { equipmentTree } from "@/api/equipment/category";
import { getBASE } from "@/api/equipment/BASE";
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
import step9 from "@/views/device/book/details/step9";
import step10 from "@/views/device/book/details/step10";
export default {
  name: "bookadddetails",
  dicts: [
    'em_device_state',  'device_run_state'
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
    step1, step2, step3, step4, step5, step6, step7, step8,step9,step10,
    devicebook: ()=> import("@/views/device/book/index"),
  },
  computed:{
    mainImage(){
      return process.env.VUE_APP_BASE_API + this.formData.mainImage 
    }, 
    qrCode(){
      return process.env.VUE_APP_BASE_API + this.formData.qrCode
    }, 
    // 列信息
    columns(){
      return [
        { label:"设备名称", prop:"deviceName", span: 12, required: true, },
        { label:"设备状态", prop:"deviceStatus", formType: 'select', options: this.dict.type.em_device_state, span: 12, required: true, },
        { label:"设备编码", prop:"deviceCode", span: 12, required: true, },
        { label:"运行状态", prop:"runStatus", formType: 'select', options: this.dict.type.device_run_state, span: 12, },
      ]
    },
    tabs(){
      return [
        { label: '基本信息', name:'step1', visible: true, },
        { label: '主要指标', name:'step2', visible: this.formData.emArchivesIndex, },
        { label: '特种设备信息', name:'step8', visible: this.formData.emArchivesSpecial, },  
        { label:'设备图片及位置', name:'step3', visible: true, },
        { label:'技术资料', name:'step4', visible: true, },
        { label:'备件备品', name:'step5', visible: true, },
        { label:'关联设备', name:'step6', visible: this.formData.deviceAtt==1, },
        { label:'关联部件', name:'step7', visible: this.formData.deviceAtt==0, },
        { label:'运维履历', name:'step9', visible: true, },
        { label:'周转履历', name:'step10', visible: true, },
      ]
    },
  },
  props:{
    // formTitle:{
    //   default:'提示信息',
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
    detailReadonly:{
      type:Boolean,
      default:false
    },
    detailId:{
      type:String,
      default:''
    }
  },
  watch: {
    // formData: {
    //   handler(val) {
    //     this.formData1 = JSON.parse(JSON.stringify(val))
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  data() {
    return {
      activeName: 'step1',
      disabled1: true,
      formData: {},
      formData1: null,
      formTitle: '编辑设备',
      drawer: false,
      // 部门树选项
      categoryOptions: [],
      categoryName: '',
      isReadonly:false,
    };
  },
  created() {
    this.getTreeSelect()
    // 编辑
    this.isReadonly=(this.$route.query.isReadonly||this.detailReadonly)?true:false
    const deviceId = this.$route.query.i||this.detailId
    this.formTitle = this.$route.query.t
    getBASE(deviceId).then(response => {
      
      // 第一步  特种设备
      if(response.data.emArchivesSpecial){
        response.data.emArchivesSpecial.componentContent = JSON.parse(response.data.emArchivesSpecial.componentContent)
        response.data.emArchivesSpecial.fieldValue = JSON.parse(response.data.emArchivesSpecial.fieldValue)
        this.setFormLabel(response.data.emArchivesSpecial.componentContent)
      }
      // 第二步
      if(response.data.archivesOther==null){
        response.data.archivesOther={}
      } 
      // 第二步  扩展数据
      if(response.data.emArchivesExtendAtt){
        response.data.emArchivesExtendAtt.componentContent = JSON.parse(response.data.emArchivesExtendAtt.componentContent)
        response.data.emArchivesExtendAtt.fieldValue = JSON.parse(response.data.emArchivesExtendAtt.fieldValue)
        this.setFormLabel(response.data.emArchivesExtendAtt.componentContent)
      }
      // 第三步 主要指标
      if(response.data.emArchivesIndex){
        response.data.emArchivesIndex.componentContent = JSON.parse(response.data.emArchivesIndex.componentContent)
        response.data.emArchivesIndex.fieldValue = JSON.parse(response.data.emArchivesIndex.fieldValue)
        this.setFormLabel(response.data.emArchivesIndex.componentContent)
      }

      this.formData = response.data;
      this.formData1 = JSON.parse(JSON.stringify(this.formData))
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
  },
  methods: {
    opendrawer(){
      // 查categoryId对应的名字
      this.loops(this.categoryOptions,this.formData.categoryId)
      this.drawer=true
    },
    getTreeSelect(){
      equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
    },
    // 递归获取treeselect父节点
    loops(arr,id) {
      var that = this;
        arr.forEach(element => {
          if(element.id==id){
            this.categoryName = element.label
          }
          if(element.children){
            that.loops(element.children,id)
          }
        });
    },
    handlePrint(){
      this.$print({
      	printable: 'printContent',
        type: 'html',
        header: '设备二维码',
        targetStyles: ['*'], // 打印内容使用所有HTML样式，没有设置这个属性/值，设置分页打印没有效果
      })
    },
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
              console.log(this,222);
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
    tabsHandleClick(){},
    close(callback){
      this.formData1 = JSON.parse(JSON.stringify(this.formData))
      this.disabled1 = true;
      if(callback) callback()
    },
    async save(fn){
      var jmform1 = await this.$refs.jmform1.submitForm()
      if(jmform1){
        this.submitForm()
      }
    },
    /** 提交按钮 */
    submitForm(callback) {
      var formData1 = this.getFormDataParams()
      console.log('formData1',formData1)
      modifyBASE(formData1).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.setSuccessData()
        this.disabled1 = true;
        if(callback) callback(formData1)
      });
    },
    setSuccessData(){
      Object.assign(this.formData,this.formData1)
    },
    backparent(){
      this.$emit('back')
    },
    getFormDataParams(){
      var formData1 = JSON.parse(JSON.stringify(this.formData1))
      var aa = formData1.emArchivesExtendAtt
      aa['fieldValue'] = JSON.stringify(aa['fieldValue'])
      aa['componentContent'] = JSON.stringify(aa['componentContent'])
      var bb = formData1.emArchivesIndex
      if (bb) {
        bb['fieldValue'] = JSON.stringify(bb['fieldValue'])
        bb['componentContent'] = JSON.stringify(bb['componentContent'])
        }
      var cc = formData1.emArchivesSpecial
      if(cc){
        cc['fieldValue'] = JSON.stringify(cc['fieldValue'])
        cc['componentContent'] = JSON.stringify(cc['componentContent'])
      }

      return formData1
    },
  }
};
</script>
<style scoped lang="scss">
.qrcode{
  margin-right: 20px;
  margin-left: 20px;
  td{
    padding: 5px;
    border: 1px solid #ddd;
  }
}
.qrcodeimg{
  width: 50%;
  vertical-align: top;
  cursor: pointer;
  transition: 0.2s all;
  &:hover{
    box-shadow: 0 0 5px #007bfe;
  }
} 
</style>