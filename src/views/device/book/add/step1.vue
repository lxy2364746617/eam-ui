<template>
  <div>
    <el-card shadow="never" style="margin-top: 10px;">
      <p><i class="el-icon-magic-stick"></i> 重要数据</p>
      <jm-form 
        class="mr20"
        :columns="columns" 
        :formData="formData" 
        :showButton="false"
        ref="jmform1">
      </jm-form>
      <p><i class="el-icon-magic-stick"></i> 常规数据</p>
      <jm-form 
        class="mr20"
        :columns="columns2" 
        :showButton="false"
        :formData="formData" 
        ref="jmform2">
      </jm-form>
      <!-- 添加或修改设备平台_表单模板对话框 -->
      <el-drawer
        title="选择上级设备"
        :visible.sync="drawer"
        direction="rtl"
        :destroy-on-close="true"
        size="80%"
        :wrapperClosable="false">
        <parentdevice @submitRadio="submitRadio" @close="close" :deviceAtt='"0"'></parentdevice>
      </el-drawer>
    </el-card>
    <el-card shadow="never" style="margin-top: 10px;text-align: right;">
      <el-button size="mini" @click="closeform">取消</el-button>
      <el-button size="mini" @click="prvstep" type="primary" v-if="stepActive>=1">上一步</el-button>
      <el-button size="mini" @click="nextstep" type="primary" v-if="stepActive<=elstep.length-2">下一步</el-button>
      <el-button size="mini" @click="save" type="primary">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import { listBASE, addBASE, updateBASE } from "@/api/equipment/BASE";
import { listDept } from "@/api/system/dept";
import { equipmentTree,equipmentTrees_noParent } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import parentdevice from "@/views/device/book/device";
import { getLocationTree} from '@/api/Location'
export default {
  name: "bookadd",
  dicts: [
    'em_device_state',  'device_run_state', 'em_is_special',  'em_device_att', 
    'em_unit',  'em_device_level',  'em_device_financing',  'em_is_lease', 
    'em_rent_out', 'em_is_relieve'
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, parentdevice,
  },
  props:{
    stepActive:{
      default:0,
      type: Number,
    },
    elstep:{
      default:[],
      type: Array,
    },
    formData: {
      default: {},
      type: Object,
    },
    isEdit:{
      default:false,
      type:Boolean
    }
  },
  watch:{
    'formData.categoryId':{
      handler(val) {
        this.getTreeItem(val,this.categoryOptions)
        var b = this.treeItem
        if(b.isSm == 'Y' && b.smAttributes){
          // this.$parent.elstep[2].visible = true
          if(this.formData.emArchivesIndex==null){
            this.formData.emArchivesIndex = {}
          }
          this.setFormLabel(b.smAttributes)
          this.$set(this.formData.emArchivesIndex, 'componentContent', b.smAttributes)
          this.$set(this.formData.emArchivesIndex, 'fieldValue', {})
        }else{
          // this.$parent.elstep[2].visible = false
          this.$set(this.formData,'emArchivesIndex',null)
        }
        if(b.isSpecial == 'Y'){
          this.$set(this.formData, 'isSpecial', 'Y')
          
          if(this.formData.emArchivesSpecial==null){
            this.formData.emArchivesSpecial = {}
          }
          if(b.specialAttributes!=null){
            this.setFormLabel(b.specialAttributes)
            this.$set(this.formData.emArchivesSpecial, 'componentContent', b.specialAttributes)
            this.$set(this.formData.emArchivesSpecial, 'fieldValue', {})
          }else{
            this.$set(this.formData,'emArchivesSpecial',null)
          }
        }else{
          this.$set(this.formData, 'isSpecial', 'N')
          
          this.$set(this.formData,'emArchivesSpecial',null)
        }
      },
      // immediate: true,
    }
  },
  computed:{
    // 列信息
    columns(){
      return [
        { label:"设备名称", prop:"deviceName", span: 8, required: true, },
        { label:"设备编码", prop:"deviceCode", span: 8, required: true,formDisabled:this.isEdit },
        { label:"设备状态", prop:"deviceStatus", formType: 'selectTag', options: this.dict.type.em_device_state, span: 8, required: true, },
        { label:"运行状态", prop:"runStatus", formType: 'select', options: this.dict.type.device_run_state, span: 8, },
        { label:"设备类别", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions, span: 8, required: true, },
        { label:"是否是特种设备", prop:"isSpecial", formType: 'select', options: this.dict.type.em_is_special, tableVisible: false, span: 8, formDisabled:true, required: true, }, //(Y 是、N 否)
        { label:"功能位置", prop:"location", span: 8, required: true,options:this.locationOptions,formType: 'selectTree', },
        { label:"规格型号", prop:"specs", span: 8, },
        { label:"设备属性", prop:"deviceAtt", formType: 'select', options: this.dict.type.em_device_att, span: 8, required: true, },  //(1 设备、2 部件)
        { label:"当前使用组织", prop:"currDeptId", formType: 'selectTree', options: this.deptOptions, span: 8, required: true, },
        { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions, span: 8, required: true, },
        { label:"上级设备", prop:"parentDeviceName", clickFn: ()=>{this.drawer=true}, readonly: true, span: 8, formVisible: this.formData.deviceAtt==1  }, //(0 父级)
        { label:"重要等级", prop:"level", formType: 'select', options: this.dict.type.em_device_level, span: 8, }, //(A、B、C)
        { label:"使用部门", prop:"useDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: false, span: 8, required: true, },
        { label:"自选设备编码", prop:"freeDeviceCode", span: 8, },
        { label:"14885类别", prop:"freeCategoryCode", span: 8, },
        ]
    },
    columns2(){
      return [
        { label:"批次编号", prop:"batchNo", tableVisible: false, span: 8, },
        { label:"煤安标志证号", prop:"logoNo", tableVisible: false, span: 8, },
        { label:"存放位置", prop:"position", formType: 'selectTree', options: this.deptOptions, tableVisible: false, span: 8, },
        { label:"防爆合格证", prop:"certificate", tableVisible: false, span: 8, },
        { label:"计量单位", prop:"unit", formType: 'select', options: this.dict.type.em_unit, tableVisible: false, span: 8, }, //(台、个、座、件)
        { label:"重量(千克)", prop:"weight", tableVisible: false, span: 8, },
        { label:"大小/尺寸mm", prop:"size", tableVisible: false, span: 8, },
        { label:"是否融资设备", prop:"isFinan", formType: 'select', options: this.dict.type.em_device_financing, tableVisible: false, span: 8, },//(Y 是、N 否)
        { label:"融资设备到期日", prop:"finanTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"折旧年限", prop:"depLife", tableVisible: false, span: 8, },
        { label:"是否租赁设备", prop:"isLease", formType: 'select', options: this.dict.type.em_is_lease, tableVisible: false, span: 8, },//(Y 是、N 否)
        { label:"租赁设备到期日", prop:"leaseTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"出租意向", prop:"rentOut", tableVisible: false, span: 8, formType: 'select', options: this.dict.type.em_rent_out, },
        { label:"是否跨子公司调剂", prop:"isRelieve", tableVisible: false, span: 8, formType: 'select', options: this.dict.type.em_is_relieve, },
        { label:"备注", prop:"remark", formType: 'textarea', tableVisible: false, span: 24, },
      ]
    },
  },
  data() {
    return {
      treeItem: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: null,
      drawer: false,
      // 弹出层标题
      title: "",
      // 部门树选项
      categoryOptions: [],
      deptOptions: [],
      locationOptions:[],
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getTreeSelect()
  },
  methods: {
    getTreeItem(id,arr){
      for (let i = 0; i < arr.length; i++) {
        const b = arr[i];
        if(b.id == id){
          this.treeItem = b
        }
        if(b.children){
          this.getTreeItem(id,b.children)
        }
      }
    },
    setFormLabel(arr){
      arr.forEach(b => {
        b.label=b.fieldName;
        b.prop=b.fieldCode;
        b.required = b.required=='0'?true:false;

      });
    },
    closeform(){
      this.$emit('closeform')
    },
    prvstep(){
      this.$emit('prvstep')
    },
    nextstep(){
      this.save(()=>{
        this.$emit('nextstep')
      })
    },
    async save(fn){
      var jmform1 = await this.$refs.jmform1.submitForm()
      var jmform2 = await this.$refs.jmform2.submitForm()
      if(jmform1 && jmform2){
        this.submitForm(fn)
      }
    },
    /** 提交按钮 */
    submitForm(fn) {
      var formData = this.$parent.getFormDataParams();
      if (formData.deviceId != undefined) {
        updateBASE(formData).then(response => {
          this.$modal.msgSuccess("修改成功");
          if(typeof fn == 'function') fn()
        });
      } else {
        addBASE(formData).then(response => {
          this.$modal.msgSuccess("保存成功");
          this.formData.deviceId = response.msg
          if(typeof fn == 'function') fn()
        });
      }
    },
    close(){
      this.drawer = false
    },
    submitRadio(row){
      this.$set(this.formData,'parentId',row.deviceId)
      this.$set(this.formData,'parentDeviceName',row.deviceName)
      this.close()
    },
    getTreeSelect(){
      equipmentTrees_noParent().then(response => {
        this.categoryOptions = response.data;
      });
      listDept().then(response => {
        this.deptOptions = response.data;
      });
      getLocationTree().then(res=>{
        this.locationOptions=this.getTree(res.data)
      })
    },
    getTree(arr){
      arr.forEach(item=>{
          item.value=item.deptId
          item.label=item.deptName
          item.isDisabled=item.locationFlag=='N'?true:false
          if(item.children&&item.children.length>0){
            this.getTree(item.children)
          }
        })
        return arr
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      listBASE(queryParams).then(response => {
          this.equipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
  }
};
</script>