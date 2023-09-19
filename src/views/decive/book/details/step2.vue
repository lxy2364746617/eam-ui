<template>
  <div>
    <p class="subtitle"><i class="el-icon-magic-stick"></i> 主要指标
      <span v-if="disabled5" class="rightbutton">
        <el-button type="text" icon="el-icon-edit" @click="disabled5=false">编辑</el-button>
      </span><span v-else class="rightbutton">
        <el-button type="text" @click="save('5')">确认</el-button>
        <el-button type="text" @click="closeEdit('5')">取消</el-button>
      </span>
    </p>
    <jm-form 
      class="mr20"
      :columns="formData.emArchivesIndex.componentContent" 
      :hideBorder="disabled5"
      :labelPosition="'left'"
      :disabled="disabled5"
      :showButton="false"
      :formData="formData.emArchivesIndex.fieldValue"
      ref="jmform5">
    </jm-form>
    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择上级设备"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false">
      <devicebook isChoose @submitRadio="submitRadio" @close="close"></devicebook>
    </el-drawer>
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
    'em_device_state',  'device_run_state', 'em_is_special',  'em_device_att', 
    'em_unit',  'em_device_level',  'em_device_financing',  'em_is_lease', 
    'em_property_type', 
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
    devicebook: ()=> import("@/views/decive/book/index"),
  },
  props:{
    formData: {
      default: ()=>{},
      type: Object,
    },
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

    // 列信息
    columns(){
      return [
        { label:"设备类别", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions, tableVisible: true, span: 12, required: true, },
        { label:"规格型号", prop:"sModel", tableVisible: true, span: 12, },
        { label:"功能位置", prop:"location", tableVisible: true, span: 12, required: true, },
        { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: true, span: 12, required: true, },
        { label:"当前使用组织", prop:"currDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: true, span: 12, required: true, },
        { label:"使用部门", prop:"useDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: false, span: 12, required: true, },
        { label:"重要等级", prop:"level", formType: 'select', options: this.dict.type.em_device_level, tableVisible: true, span: 12, }, //(A、B、C)
        { label:"是否是特种设备", prop:"isSpecial", formType: 'select', options: this.dict.type.em_is_special, tableVisible: false, span: 12, required: true, }, //(Y 是、N 否)
        { label:"设备属性", prop:"deviceAtt", formType: 'select', options: this.dict.type.em_device_att, tableVisible: true, span: 12, required: true, },  //(1 设备、2 部件)
        { label:"上级设备", prop:"parentDeviceName", clickFn: ()=>{this.drawer=true}, tableVisible: true, readonly: true, span: 12, }, //(0 父级)
      ]
    },
    columns2(){
      return [
        { label:"批次编号", prop:"batchNo", tableVisible: false, span: 12, },
        { label:"煤安标志证号", prop:"logoNo", tableVisible: false, span: 12, },
        { label:"防爆合格证", prop:"certificate", tableVisible: false, span: 12, },
        { label:"计量单位", prop:"unit", formType: 'select', options: this.dict.type.em_unit, tableVisible: false, span: 12, }, //(台、个、座、件)
        { label:"大小/尺寸mm", prop:"size", tableVisible: false, span: 12, },
        { label:"折旧年限", prop:"depLife", tableVisible: false, span: 12, },
        { label:"存放位置", prop:"position", formType: 'selectTree', options: this.deptOptions, tableVisible: false, span: 12, },
        { label:"重量(千克)", prop:"weight", tableVisible: false, span: 12, },
        { label:"是否融资设备", prop:"isFinan", formType: 'select', options: this.dict.type.em_device_financing, tableVisible: false, span: 12, },//(Y 是、N 否)
        { label:"融资设备到期日", prop:"finanTime", formType: 'date', tableVisible: false, span: 12, },
        { label:"是否租赁设备", prop:"isLease", formType: 'select', options: this.dict.type.em_is_lease, tableVisible: false, span: 12, },//(Y 是、N 否)
        { label:"租赁设备到期日", prop:"leaseTime", formType: 'date', tableVisible: false, span: 12, },
        { label:"备注", prop:"remark", formType: 'textarea', tableVisible: false, span: 24, },
      ]
    },
    columns3(){
      return [
        { label:"财务资产编码", prop:"propertyCode", tableVisible: true, span: 12, },
        { label:"资产原值(元)", prop:"propertyOv", tableVisible: true, span: 12, },
        { label:"资产权属占比", prop:"propertyOs", tableVisible: true, span: 12, },
        { label:"资产净值(元)", prop:"propertyNv", tableVisible: true, span: 12, },
        { label:"资产类别", prop:"propertyType", formType: 'select', options: this.dict.type.em_property_type, tableVisible: true, span: 12, },
      ]
    },
    columns4(){
      return [
        { label:"关联购置单号", prop:"makerNo", tableVisible: false, formDisabled: true, span: 12, },
        // { label:"行号", prop:"makerLn", tableVisible: false, formDisabled: true, span: 12, },
        { label:"入账日期", prop:"makerAoTime", formType: 'date', tableVisible: false, span: 12, }, 
        { label:"启用日期", prop:"makerEnTime", formType: 'date', tableVisible: false, span: 12, },
        { label:"制造商", prop:"maker", tableVisible: false, span: 12, },
        { label:"出厂日期", prop:"makerPdTime", formType: 'date', tableVisible: false, span: 12, },
        { label:"到货日期", prop:"makerMoaTime", formType: 'date', tableVisible: false, span: 12, },
        { label:"出厂编号", prop:"makerPdNo", tableVisible: false, span: 12, },
        { label:"使用年限", prop:"makerExp", tableVisible: false, span: 12, },
      ]
    },
  },
  data() {
    return {
      disabled5: true,
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
    async save(formref){
      var flag = await this.$refs['jmform'+formref].submitForm()
      if(flag){
        this.$emit('submitForm',(val)=>{
          if(val){
            this['disabled'+formref] = true;
          }
        })
      }
    },
    closeEdit(formref){
      this.$emit('close',(val)=>{
        this['disabled'+formref] = true;
      })
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
<style scoped lang="scss">
  .subtitle{
    background: #ebf4fc;
    line-height: 40px;
    & > .rightbutton{
      margin-right: 20px;
      float: right;
    }
  }
</style>
