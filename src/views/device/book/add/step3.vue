<template>
  <div>
    <el-card shadow="never" style="margin-top: 10px;">
      <div v-if="formData.emArchivesIndex!=null">
        <p><i class="el-icon-magic-stick"></i> 主要指标</p>
        <jm-form 
          :forceUpdate="true"
          class="mr20"
          :columns="formData.emArchivesIndex.componentContent" 
          :showButton="false"
          :formData="formData.emArchivesIndex.fieldValue"
          ref="jmform1">
        </jm-form>
      </div>
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
      },
    };
  },
  created() {
    this.getTreeSelect()
    console.log('step3-formData:"',this.formData)
  },
  mounted(){
    this.$refs.jmform1.$forceUpdate()
    console.log(this.formData,33333);
  },
  methods: {
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
      if(jmform1){
        this.submitForm(fn)
      }
    },
    /** 提交按钮 */
    submitForm: function(fn) {
      var formData = this.$parent.getFormDataParams();
      if (formData.deviceId != undefined) {
        updateBASE(formData).then(response => {
          this.$modal.msgSuccess("修改成功");
          if(typeof fn == 'function') fn()
        });
      } else {
        addBASE(formData).then(response => {
          this.$modal.msgSuccess("保存成功");
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