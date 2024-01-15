<template>
  <div>
    <div class="title" style="margin-top: 20px;">
      <span style="font-size: 14px;font-weight: bold;">父级设备信息</span>
      <span style="float: right;">
        <el-button
        v-if="!isReadonly"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >选择父级设备</el-button>
        <el-button
        v-if="!isReadonly"
          type="danger"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleRemove"
        >解除父级设备</el-button>
      </span>
    </div>
    <el-row :gutter="20" style="margin-top: 30px;" v-if="parentData">
      <!--图-->
      <el-col :span="10" :xs="24">
        <img :src="mainImage" alt="" srcset="" style="width: 100%;">
      </el-col>
      <!-- 文 -->
      <el-col :span="14" :xs="24">
        <jm-form 
          class="mr20"
          :columns="columns" 
          :formData="parentData" 
          :hideBorder="disabled1"
          :disabled="disabled1"
          :labelPosition="'left'"
          :showButton="false"
          ref="jmform1">
        </jm-form>
      </el-col>
    </el-row>
    <div style="text-align: center;font-size: 14px;color: #aaa;margin-top: 50px;" v-if="!parentData">无父级设备</div>
    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择上级设备"
      :visible="drawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false">
      <parentdevice @submitRadio="submitRadio" @close="close" :formData="formData"></parentdevice>
    </el-drawer>
  </div>
</template>

<script>
import { listResource, addResource, delResource } from "@/api/system/resource";
import { getBASE, removeParentEmBASE, addParentEmBASE } from "@/api/equipment/BASE";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import parentdevice from "@/views/device/book/device";

export default {
  name: "bookadd",
  dicts: [
    'em_device_state',
    'em_device_level',
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, parentdevice, 
  },
  props:{
    isReadonly:{
      type:Boolean,
      default:false,
    },
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
    mainImage(){
      return process.env.VUE_APP_BASE_API + this.parentData.mainImage
    }, 
    // 列信息
    columns(){
      return [
        { label:"设备编码", prop:"deviceCode", span: 24,  },
        { label:"设备名称", prop:"deviceName", span: 24,  },
        { label:"规格型号", prop:"specs", span: 24, },
        { label:"设备类别", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions, span: 24,  },
        { label:"设备状态", prop:"deviceStatus", formType: 'select', options: this.dict.type.em_device_state, span: 24,  },
        { label:"功能位置", prop:"location", span: 24,  },
        { label:"重要等级", prop:"level", formType: 'select', options: this.dict.type.em_device_level, span: 24, }, //(A、B、C)
        // { label:"所属子公司", prop:"", span: 24, },
        { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions, span: 24,  },
        { label:"当前使用组织", prop:"currDeptId", formType: 'selectTree', options: this.deptOptions, span: 24,  },
      ]
    },
  },
  data() {
    return {
      parentData: {},
      fileList: [],
      fileType: ['png','jpg','bmp','jpeg','pdf','gif'],
      disabled1: true,
      disabled2: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
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
        busId: this.formData.deviceId,
        category: 2,
      },
      // 表单校验
      rules: {
        userName: [
          {  message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          {  message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          {  message: "用户密码不能为空", trigger: "blur" },
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
    // this.getList(this.queryParams)
    this.getDeviceParent()
    this.getTreeSelect()
  },
  methods: {
    handleRemove(){
      const deviceId = this.formData.deviceId
      this.$modal.confirm('是否确认解除父级设备？').then(function() {
        return removeParentEmBASE(deviceId)
      }).then(() => {
        this.$set(this.formData,'parentId','')
        this.$set(this.formData,'parentDeviceName','')
        this.parentData = {}
        this.$modal.msgSuccess("解除成功");
      }).catch(() => {});
    },
    submitRadio(row){
      var obj = {
        deviceId: this.formData.deviceId,
        parentId: row.deviceId,
        parentDeviceName: row.deviceName,
      }
      addParentEmBASE(obj).then(response => {
        this.$set(this.formData,'parentId',row.deviceId)
        this.$set(this.formData,'parentDeviceName',row.deviceName)
        this.$modal.msgSuccess("修改成功");
        this.getDeviceParent()
      });
      this.close()
    },
    handleAdd(){
      this.drawer = true;
    },
    getTreeSelect(){
      equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
      listDept().then(response => {
        this.deptOptions = response.data;
      });
    },
    getDeviceParent(){
      const deviceId = this.formData.parentId
      getBASE(deviceId).then(response => {
        this.parentData = response.data||null;
      })
      .catch(err => {
        console.log(err,333);
      });
    },
    handlePreview(row){
      window.open(process.env.VUE_APP_BASE_API+row.fileName)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var name = row.originalFileName;
      var id = row.id;
      this.$modal.confirm('是否确认删除名称为"' + name + '"的数据项？').then(function() {
        return delResource(id);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
        this.$refs.jmtable.getList()
      }).catch(() => {});
    },
    downloadFile(row){
      this.download('common/download', {
        fileName: row.fileName
      }, row.originalFileName)
    },
    uploadChange2(val){
      this.fileList = val
      this.fileList.forEach(b => {
        b.busId = this.formData.deviceId
      });
    },
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
    submitFiles(row){
      // 发送 this.fileList
      addResource(this.fileList).then(response => {
        this.$modal.msgSuccess("上传成功");
        this.$refs.jmtable.getList()
      });
      this.close()
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      listResource(queryParams).then(response => {
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
