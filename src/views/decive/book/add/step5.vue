<template>
  <div>
    <el-card shadow="never" style="margin-top: 10px;">
      <p><i class="el-icon-magic-stick"></i> 设备图片</p>
      <image-upload 
        :fileType="['jpg','png']"
        @uploadChange="uploadChange1"
        :value="formData.imgFileResourceList"
        :extraData="{'category':1}"
        :listType="'picture-card'">

      </image-upload>
      <p><i class="el-icon-magic-stick"></i> 技术资料</p>
      <file-upload 
        :drag="true"
        :extraData="{'category':2}"
        @uploadChange="uploadChange2"
        :value="formData.genFileResourceList"
        :listType="'picture-card'">

      </file-upload>
    </el-card>
    <el-card shadow="never" style="margin-top: 10px;text-align: right;">
      <el-button size="mini" @click="closeform">取消</el-button>
      <el-button size="mini" @click="prvstep" type="primary" v-if="stepActive>=1">上一步</el-button>
      <el-button size="mini" @click="nextstep" type="primary" v-if="stepActive<=(elstep[2].visible?elstep.length-2:elstep.length-3)">下一步</el-button>
      <el-button size="mini" @click="save" type="primary">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import { listBASE, addBASE, updateBASE } from "@/api/equipment/BASE";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
export default {
  name: "bookadd",
  dicts: [
    
  ],
  components: { 
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
  mounted(){
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
      // 表格数据
      equipmentList: null,
      // 总条数
      total: 0,
      formDataNow: {},
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
    this.getTreeSelect()
  },
  methods: {
    uploadChange1(val){
      this.formData.imgFileResourceList = val
    },
    uploadChange2(val){
      this.formData.genFileResourceList = val
    },
    closeform(){
      this.$emit('closeform')
    },
    prvstep(){
      this.save(()=>{
        this.$emit('prvstep')
      })
    },
    nextstep(){
      this.save(()=>{
        this.$emit('nextstep')
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.partsCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    close(){
      this.drawer = false
    },
    // form保存
    saveToTable(){
      if(this.title == "新增设备"){
        this.formData.archivesPartsList.push(JSON.parse(JSON.stringify(this.formDataNow)))
        this.total = this.formData.archivesPartsList.length
      }
      this.close()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.drawer = true;
      this.title = "新增设备";
      this.formDataNow = {}
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.drawer = true;
      this.title = "编辑设备";
      this.formDataNow = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const partsCodes = row.partsCode || this.ids;
      this.$modal.confirm('是否确认删除备件编码为"' + partsCodes + '"的数据项？')
      .then(() =>{
        console.log(this.formData.archivesPartsList,444);
        this.formData.archivesPartsList = this.formData.archivesPartsList.filter((b)=>{
          return partsCodes.indexOf(b.partsCode)<0
        })
        this.total = this.formData.archivesPartsList.length
      })
      .catch(() => {});
    },
    save(fn){
      this.submitForm(fn)
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
    getTreeSelect(){
      equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
      listDept().then(response => {
        this.deptOptions = response.data;
      });
    },
  }
};
</script>