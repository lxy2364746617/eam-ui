<template>
  <div>
    <jm-table
      :tableData="equipmentList"
      @getList="getList"
      :total="total"
      ref="jmtable"
      :handleWidth="230"
      :columns="columns">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
          >上传</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="downloadFile(scope.row)"
          v-hasPermi="['equipment:book:edit']"
        >下载</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['equipment:book:remove']"
        >删除</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-add"
          v-if="fileType.includes(scope.row.fileType)"
          @click="handlePreview(scope.row)"
          v-hasPermi="['equipment:book:edit']"
        >预览</el-button>
      </template>
    </jm-table>
    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择文件"
      :visible.sync="drawer"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false">
      <file-upload 
        :drag="true"
        style="margin-left: 20px;"
        :extraData="{'category':2}"
        @uploadChange="uploadChange2"
        :listType="'picture-card'">
      </file-upload>
      <div style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
        <el-button size="mini" @click="close">取消</el-button>
        <el-button size="mini" @click="submitFiles" type="primary" :disabled="fileList.length==0">确定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { listResource, addResource, delResource } from "@/api/system/resource";
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
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
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

  },
  data() {
    return {
      fileList: [],
      fileType: ['png','jpg','bmp','jpeg','pdf','gif'],
      columns: [
        { label:"文件名称", prop:"originalFileName", span: 12, required: true, },
        { label:"上传时间", prop:"createTime", formType: 'date', span: 12, required: true, },
        { label:"上传人员", prop:"createBy", span: 12, required: true, },
        { label:"文件大小", prop:"fileSize", span: 12, required: true, },
      ],
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
    this.getList(this.queryParams)
  },
  methods: {
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
    handleAdd(){
      this.fileList = []
      this.drawer = true;
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
