<template>
  <div>
    <jm-table
      v-show="radio3=='列表'"
      :tableData="equipmentList"
      @handleSelectionChange="handleSelectionChange"
      @getList="getList"
      :total="total"
      ref="jmtable"
      :initLoading="false"
      :handleWidth="130"
      :columns="columns">
      <!-- <template slot="right_end">
        <el-radio-group v-model="radio3" size="mini" style="margin-left: 10px;">
          <el-radio-button label="图示"></el-radio-button>
          <el-radio-button label="列表"></el-radio-button>
        </el-radio-group>
      </template> -->
      <template slot="headerLeft" v-if="!isReadonly">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >解除</el-button>
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isReadonly">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,'edit')"
        >修改</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
        >删除</el-button>
      </template>
    </jm-table>
    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false">
      <jm-form 
        class="mr20"
        :columns="columns" 
        :showButton="false"
        :formData="formDataNow"
        ref="jmform1">
        <template slot="footer">
          <div style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button size="mini" @click="save" type="primary">确定</el-button>
          </div>
        </template>
      </jm-form>
    </el-drawer>
    <div v-show="radio3=='图示'">
      <div style="text-align: right;">
        <el-radio-group v-model="radio3" size="mini" style="margin-left: 10px;">
          <el-radio-button label="图示"></el-radio-button>
          <el-radio-button label="列表"></el-radio-button>
        </el-radio-group>
      </div>
      <el-row :gutter="2">
        <el-col :span="8" v-for="item in equipmentList" :key="item.partsCode">
          <el-card style="margin-bottom: 2px;font-size: 14px;">
            <p>
              <span style="margin-right:10px">{{ item.partsName }} </span> <span>[{{ item.partsCode }}] </span> 
              <span style="float: right;">
                <el-tag size="mini" type="success">在用</el-tag>
              </span>
            </p>
            <el-row :gutter="2">
              <el-col :span="10">
                图片
              </el-col>
              <el-col :span="14">
                <p>规格型号:{{ item.partspecs }}</p>
                <p>设备类型:{{ item.partsType }}</p>
                <p>功能位置:{{ item.location }}</p>
                <p>所属子公司:{{ item.orgId }}</p>
                <p>所属组织:</p>
                <p>重要等级:{{ item.unit }}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 添加供应商对话框 -->
    <el-drawer
        title="选择供应商"
        :visible.sync="drawersupplier"
        size="60%"
        direction="rtl"
        :wrapperClosable="false">
        <supplier  @submitRadio="submitRadio" :isRadio="true" @close="closesupplier" :isHidden='drawersupplier'></supplier>
      </el-drawer>
  </div>
</template>

<script>
import { listParts, addParts, updateParts, delParts } from "@/api/equipment/parts";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import { listDept } from "@/api/system/dept";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import supplier from "@/views/device/book/supplier";

export default {
  name: "bookadd",
  dicts: [
    'em_property_type', 
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, supplier, 
  },
  props:{
    isReadonly:{
      type:Boolean,
      default:false,
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
        { label:"备件名称", prop:"partsName", span: 24, },
        { label:"备件编码", prop:"partsCode", span: 24, },
        { label:"规格型号", prop:"partsModel", span: 24, },
        { label:"备件类别", prop:"partsType", span: 24, },
        { label:"单位", prop:"unit", span: 24, },
        { label:"当前库存", prop:"stock", span: 24, },
        { label:"供应商名称", prop:"supName", readonly: true, clickFn:()=>{this.drawersupplier=true}, span: 24, },
        { label:"存储位置", prop:"location", span: 24, },
        { label:"所属组织", prop:"orgId", span: 24, formType: 'selectTree', options: this.deptOptions },
      ]
    },
  },
  mounted(){
    
  },
  data() {
    return {
      radio3:'列表',
      // 列信息
      // columns: [
      //   { label:"备件名称", prop:"partsName", span: 24, },
      //   { label:"备件编码", prop:"partsCode", span: 24, },
      //   { label:"规格型号", prop:"partspecs", span: 24, },
      //   { label:"备件类别", prop:"partsType", span: 24, },
      //   { label:"单位", prop:"unit", span: 24, },
      //   { label:"当前库存", prop:"stock", span: 24, },
      //   { label:"供应商名称", prop:"supName", readonly: true, clickFn:()=>{this.drawersupplier=true}, span: 24, },
      //   { label:"存储位置", prop:"location", span: 24, },
      //   { label:"所属组织", prop:"orgId", span: 24, formType: 'selectTree', options: this.deptOptions },hs
      // ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      partsCodes: [],
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
      drawersupplier: false,
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
        deviceId: this.formData.deviceId,
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
  async created() {
    await this.getTreeSelect()
    await this.getList(this.queryParams)
    
  },
  methods: {
    getTreeSelect(){
      this.deptOptions=[]
      listDept().then(response => {
        this.$set(this,'deptOptions',response.data)
        this.$forceUpdate()
      });
    },
    closesupplier(){
      this.drawersupplier = false
    },
    submitRadio(row){
      this.$set(this.formDataNow,'supName',row.supplierName)
      // this.$set(this.formData,'parentDeviceName',row.deviceName)
      this.closesupplier()
    },
    /** 查询用户列表 */
    getList(queryParams) {
      queryParams.deviceId = this.queryParams.deviceId
      this.loading = true;
      listParts(queryParams).then(response => {
          this.$set(this,'equipmentList',response.rows)
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.partsCodes = selection.map(item => item.partsCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    close(){
      this.drawer = false
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.drawer = true;
      this.title = "新增设备";
      this.formDataNow = {
        deviceId: this.queryParams.deviceId
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.drawer = true;
      this.title = "编辑设备";
      this.formDataNow = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const partsCodes = row.partsCode || this.partsCodes;
      this.$modal.confirm('是否确认删除备件编码为"' + partsCodes + '"的数据项？').then(() =>{
        return delParts(ids);
      }).then(() => {
        this.getList(this.queryParams);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    save(){
      this.submitForm()
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.formDataNow.id != undefined) {
        updateParts(this.formDataNow).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.getList(this.queryParams)
          this.close()
        });
      } else {
        addParts(this.formDataNow).then(response => {
          this.$modal.msgSuccess("保存成功");
          this.getList(this.queryParams)
          this.close()
        });
      }
    },
  }
};
</script>