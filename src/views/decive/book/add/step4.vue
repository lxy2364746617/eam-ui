<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="3">
          <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>
           {{ formTitle }}
        </el-col>
        <el-col :span="18" style="font-size: 12px;color: #888;padding-top: 4px;">
          说明：此功能针对老设备，新设备请走设备入库流程
        </el-col>
      </el-row>
      <el-steps :active="stepActive" style="width: 90%;margin: 0 auto;padding-top: 30px;">
        <el-step v-for="item in elstep" :title="item.title" :description="item.description"></el-step>
      </el-steps>
    </el-card>
    <el-card shadow="never" style="margin-top: 10px;">
      <p><i class="el-icon-magic-stick"></i> 重要数据</p>
      <jm-form 
        class="mr20"
        :columns="columns" 
        :formData="formData" 
        :showButton="false"
        @submitForm="submitForm" 
        ref="jmform1">
      </jm-form>
      <p><i class="el-icon-magic-stick"></i> 常规数据</p>
      <jm-form 
        class="mr20"
        :columns="columns2" 
        :showButton="false"
        :formData="formData" 
        @submitForm="submitForm" 
        ref="jmform2">
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
import { listBASE, getBASE, delBASE, addBASE, updateBASE } from "@/api/equipment/BASE";
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
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, 
    devicebook: ()=> import("@/views/decive/book/index"),
  },
  props:{
    formTitle:{
      default:'',
      type: String,
    }
  },
  computed:{
    // 列信息
    columns(){
      return [
        { label:"设备名称", prop:"deviceName", tableVisible: true, span: 8, required: true, },
        { label:"设备编码", prop:"deviceCode", tableVisible: true, span: 8, required: true, },
        { label:"设备状态", prop:"deviceStatus", formType: 'select', options: this.dict.type.em_device_state, tableVisible: true, span: 8, required: true, },
        { label:"运行状态", prop:"runStatus", formType: 'select', options: this.dict.type.device_run_state, tableVisible: true, span: 8, },
        { label:"设备类别", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions, tableVisible: true, span: 8, required: true, },
        { label:"是否是特种设备", prop:"isSpecial", formType: 'select', options: this.dict.type.em_is_special, tableVisible: false, span: 8, required: true, }, //(Y 是、N 否)
        { label:"功能位置", prop:"LOCATION", tableVisible: true, span: 8, required: true, },
        { label:"规格型号", prop:"sModel", tableVisible: true, span: 8, },
        { label:"设备属性", prop:"deviceAtt", formType: 'select', options: this.dict.type.em_device_att, tableVisible: true, span: 8, required: true, },  //(1 设备、2 部件)
        { label:"当前使用组织", prop:"currDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: true, span: 8, required: true, },
        { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: true, span: 8, required: true, },
        { label:"上级设备", prop:"parentDeviceName", clickFn: ()=>{this.drawer=true}, tableVisible: true, readonly: true, span: 8, }, //(0 父级)
        { label:"重要等级", prop:"LEVEL", formType: 'select', options: this.dict.type.em_device_level, tableVisible: true, span: 8, }, //(A、B、C)
        { label:"使用部门", prop:"useDeptId", formType: 'selectTree', options: this.deptOptions, tableVisible: false, span: 8, required: true, },
      ]
    },
    columns2(){
      return [
        { label:"批次编号", prop:"batchNo", tableVisible: false, span: 8, },
        { label:"煤安标志证号", prop:"logoNo", tableVisible: false, span: 8, },
        { label:"存放位置", prop:"POSITION", formType: 'selectTree', options: this.deptOptions, tableVisible: false, span: 8, },
        { label:"防爆合格证", prop:"CERTIFICATE", tableVisible: false, span: 8, },
        { label:"计量单位", prop:"UNIT", formType: 'select', options: this.dict.type.em_unit, tableVisible: false, span: 8, }, //(台、个、座、件)
        { label:"重量(千克)", prop:"WEIGHT", tableVisible: false, span: 8, },
        { label:"大小/尺寸mm", prop:"SIZE", tableVisible: false, span: 8, },
        { label:"是否融资设备", prop:"isFinan", formType: 'select', options: this.dict.type.em_device_financing, tableVisible: false, span: 8, },//(Y 是、N 否)
        { label:"融资设备到期日", prop:"finanTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"折旧年限", prop:"depLife", tableVisible: false, span: 8, },
        { label:"是否租赁设备", prop:"isLease", formType: 'select', options: this.dict.type.em_is_lease, tableVisible: false, span: 8, },//(Y 是、N 否)
        { label:"租赁设备到期日", prop:"leaseTime", formType: 'date', tableVisible: false, span: 8, },
        { label:"备注", prop:"REMARK", formType: 'textarea', tableVisible: false, span: 24, },
        // { label:"财务资产编码", prop:"propertyCode", tableVisible: true, span: 8, },
        // { label:"设备id", prop:"deviceId", tableVisible: false, span: 8, },
        // { label:"提交时间", prop:"sumbitTime", tableVisible: false, span: 8, },
        // { label:"完成时间", prop:"finishTime", tableVisible: false, span: 8, },
        // { label:"消耗时间", prop:"takeTime", tableVisible: false, span: 8, },
        // { label:"设备来源", prop:"SOURCE", tableVisible: false, span: 8, },//(C 复制、N 新增)
        // { label:"设备二维码", prop:"qrCode", tableVisible: false, span: 8, },
      ]
    },
  },
  data() {
    return {
      elstep:[
        { title: "维护基础信息", description: "编辑设备重要数据和常规数据" },
        { title: "维护其他信息", description: "编辑财务数据、购置数据和扩展属性" },
        { title: "维护主要指标", description: "编辑六大主要设备指标" },
        { title: "维护关联备件", description: "编辑备品备件、易损件信息" },
        { title: "上传图片和技术资料", description: "上传设备图片和相关技术资料" },
      ],
      stepActive: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formData: {},
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
    this.getTreeSelect()
  },
  methods: {
    closeform(){

    },
    prvstep(){
      this.stepActive --
    },
    nextstep(){
      this.stepActive ++
    },
    save(){

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
    backparent(){
      this.$emit('back')
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
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(function() {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getBASE().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getBASE(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateBASE(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBASE(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
        return delBASE(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>