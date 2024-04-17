<template>
  <div>
    <el-card shadow="never" style="margin-top: 10px;">
      <p><i class="el-icon-magic-stick"></i> 财务数据</p>
      <jm-form 
        class="mr20"
        :columns="columns" 
        :formData="formData.archivesOther" 
        :showButton="false"
        ref="jmform1">
      </jm-form>
      <p><i class="el-icon-magic-stick"></i> 制造商数据</p>
      <jm-form 
        class="mr20"
        :columns="columns2" 
        :showButton="false"
        :formData="formData.archivesOther" 
        ref="jmform2">
      </jm-form>
      <div v-if="formData.emArchivesExtendAtt!=null">
        <p><i class="el-icon-magic-stick"></i> 扩展数据</p>
        <jm-form 
          class="mr20"
          :columns="formData.emArchivesExtendAtt.componentContent" 
          :showButton="false"
          :formData="formData.emArchivesExtendAtt.fieldValue"
          ref="jmform3">
        </jm-form>
      </div>
      <!-- 添加或修改设备平台_表单模板对话框 -->
      <el-drawer
        title="选择上级设备"
        :visible.sync="drawer"
        direction="rtl"
        size="80%"
        :wrapperClosable="false">
        <devicebook isChoose @submitRadio="submitRadio" @close="close"></devicebook>
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
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "bookadd",
  dicts: [
    'em_property_type', 
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
    devicebook: ()=> import("@/views/device/book/index"),
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
  },
  computed:{
    // 列信息
    columns(){
      return [
        { label:"财务资产编码", prop:"propertyCode", span: 8, },
        { label:"资产原值(元)", prop:"propertyOv", span: 8, inputFn:()=>{
         return this.formData.archivesOther.propertyOv=this.floatInput(this.formData.archivesOther.propertyOv)
        } },
        { label:"资产权属占比", prop:"propertyOs", span: 8, },
        { label:"资产净值(元)", prop:"propertyNv", span: 8, inputFn:()=>{
         return this.formData.archivesOther.propertyNv=this.floatInput(this.formData.archivesOther.propertyNv)
        }},
        { label:"资产类别", prop:"propertyType", formType: 'select', options: this.dict.type.em_property_type, span: 8, },
      ]
    },
    columns2(){
      return [
        { label:"关联购置单号", prop:"makerNo", tableVisible: false, formDisabled: true, span: 8, },
        { label:"行号", prop:"makerLn", tableVisible: false, formDisabled: true, span: 8, },
        { label:"启用日期", prop:"makerEnTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"制造商", prop:"maker", tableVisible: false, span: 8, },
        { label:"入账日期", prop:"makerAoTime", formType: 'date', tableVisible: false, span: 8, }, 
        { label:"到货日期", prop:"makerMoaTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"出厂编号", prop:"makerPdNo", tableVisible: false, span: 8, },
        { label:"出厂日期", prop:"makerPdTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"使用年限", prop:"makerExp", tableVisible: false, span: 8, },
      ]
    },
  },
  data() {
    return {
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
      categoryOptions: undefined,
      deptOptions: undefined,
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
    
    if(!this.formData.archivesOther){
      this.$set(this.formData,'archivesOther',{})
    }
    this.getTreeSelect()
  },
  methods: {
     //处理两位小数
    floatInput(val) {
      let checkPlan = "" + val;
      checkPlan = checkPlan
        .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
        .replace(/^\./g, "") // 保证第一个为数字而不是.
        .replace(/^\0/g, "") // 保证第一个为数字而不是0
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
        //此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        checkPlan = parseFloat(checkPlan) + "";
      } else if (checkPlan.indexOf(".") >= 0) {
        checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      }
      //this.$nextTick(() => (val = checkPlan * 1));
      return checkPlan;
    },
    closeform(){
      this.$modal
        .confirm('是否确定不保存直接退出？').then(
          ()=>{this.$emit('closeform')} 
        )
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
      var jmform3 = true
      if(this.$refs.jmform3){
        jmform3 = await this.$refs.jmform3.submitForm()
      }
      if(jmform1  && jmform2 && jmform3){
        this.submitForm(fn)
      }
    },
    /** 提交按钮 */
    submitForm:async function(fn) {
      var formData = this.$parent.getFormDataParams();
      if (formData.deviceId != undefined) {
       await updateBASE(formData).then(response => {
          this.$modal.msgSuccess("修改成功");
          if(typeof fn == 'function') fn()
        });
      } else {
       await addBASE(formData).then(response => {
          this.$modal.msgSuccess("保存成功");
          if(typeof fn == 'function') fn()
        });
      }
      this.$emit('closeform')
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
      equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
      listDept().then(response => {
        this.deptOptions = response.data;
      });
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
