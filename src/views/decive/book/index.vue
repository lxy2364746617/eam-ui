<template>
  <div class="app-container">
    <el-row :gutter="20" v-show="!addEdit">
      <!--部门数据-->
      <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree 
          :treeData="deptOptions" 
          @handleNodeClick="handleNodeClick" 
          style="position: fixed;top: 121px;height: calc(100vh - 141px);">
        </jm-user-tree>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <el-row v-if="!isChoose" :gutter="20" style="border-bottom: 5px solid #efefef;margin-bottom: 20px;">
          <el-col :span="6" :xs="24" v-for="item in 4" :key="item">
            <div style="display: inline-block;vertical-align: middle;font-size: 40px;margin-left: 20px;color: #007bfe;"><i class="el-icon-share"></i></div>
            <div style="display: inline-block;vertical-align: middle;margin-left: 20px;"><p>数量</p><p>2222</p></div>
          </el-col>
        </el-row>
        <jm-table
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="isChoose"
          :handleWidth="230"
          :columns="columns">
          <template slot="headerLeft" v-if="!isChoose">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                :loading="btnLoading"
                @click="handleAdd"
                v-hasPermi="['equipment:book:add']"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-upload2"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['equipment:book:add']"
              >导入</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="el-icon-document"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['equipment:book:add']"
              >设备指标</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['equipment:book:add']"
              >下载</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['equipment:book:remove']"
              >删除</el-button>
            </el-col> -->
          </template>
          <template #end_handle="scope" v-if="!isChoose">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              :loading="btnLoading"
              @click="handleUpdate(scope.row,'view')"
              v-hasPermi="['equipment:book:edit']"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              :loading="btnLoading"
              @click="handleUpdate(scope.row,'edit')"
              v-hasPermi="['equipment:book:edit']"
            >修改</el-button>
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
              @click="handleSet(scope.row)"
              v-hasPermi="['equipment:book:edit']"
            >提交</el-button>
          </template>
        </jm-table>
      </el-col>
    </el-row>
    <div v-if="isChoose" style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
    <add-edit v-if="addEdit" :formTitle="title" :formData="formData" @back="back()"></add-edit>
  </div>
</template>

<script>
import { findByTemplateType } from "@/api/equipment/template";
import { listBASE, getBASE, delBASE, addBASE, updateBASE } from "@/api/equipment/BASE";
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import addEdit from "@/views/decive/book/add/index";
import JmTable from "@/components/JmTable";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "devicebook",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { Treeselect, JmUserTree, JmTable, addEdit },
  props:{
    isChoose:{
      default:false,
      type: Boolean,
    }
  },
  computed:{
    // 列信息
    columns(){
      return [
        { label:"设备编码", prop:"deviceCode", tableVisible: true, },
        { label:"设备名称", prop:"deviceName", tableVisible: true, },
        { label:"规格型号", prop:"sModel", tableVisible: true, },
        { label:"设备类别", prop:"categoryId", tableVisible: true, },
        { label:"设备属性", prop:"deviceAtt", formType: 'select', options:[], tableVisible: true, },  //(1 设备、2 部件)
        { label:"财务资产编码", prop:"propertyCode", tableVisible: true, },
        { label:"功能位置", prop:"LOCATION", tableVisible: true, },
        { label:"重要等级", prop:"LEVEL", formType: 'select', options:[], tableVisible: true, }, //(A、B、C)
        { label:"上级设备", prop:"parentId", formType: 'select', options:[], tableVisible: true, }, //(0 父级)
        { label:"所属组织", prop:"affDeptId", tableVisible: true, },
        { label:"当前使用组织", prop:"currDeptId", tableVisible: true, },
      ]
    },
  },
  data() {
    return {
      btnLoading: false,
      formData: {
        archivesOther: {}, // 步骤2
        emArchivesExtendAtt: [], // 步骤2-扩展数据
        archivesIndexList: [], // 步骤3
        archivesPartsList: [], // 步骤4
        fileResourceList: [],  // 步骤5
      },
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
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      addEdit: false,
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      radioRow: {},
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
    this.getTree();
  },
  methods: {
    close(){
      this.$emit('close')
    },
    submitRadio(){
      this.$emit('submitRadio',this.radioRow)
    },
    back(){
      this.addEdit=false
      this.getList(this.queryParams)
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
    /** 查询部门下拉树结构 */
    getTree() {
      equipmentTree().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      this.ids = selection.map(item => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0]
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
    setFormLabel(arr){
      arr.forEach(b => {
        b.label=b.fieldName;
        b.prop=b.fieldCode;
        b.required = b.required=='0'?true:false;

      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.btnLoading = true
      findByTemplateType({templateType: 'K'}).then(response => {
        this.formData = this.$options.data().formData;
        this.formData.emArchivesExtendAtt = response.data;
        this.formData.archivesIndexList = response.data;
        var aa = [
          {
              "createBy": "buyunxuyong",
              "createTime": "2023-09-13 11:38:53",
              "updateBy": null,
              "updateTime": null,
              "remark": "12",
              "fieldId": 13,
              "templateId": 2,
              "fieldCode": "aqsq",
              "fieldName": "12",
              
              "valuePath": "12",
              "required": null,
              "isModify": "0",
              "componentType": "input",
              "componentContent": "12",
              "disabled": null
          },
          {
              "createBy": "buyunxuyong",
              "createTime": "2023-09-13 16:06:10",
              "updateBy": null,
              "updateTime": null,
              "remark": "1111",
              "fieldId": 21,
              "templateId": 2,
              "fieldCode": "dewde",
              "fieldName": "1111",
              
              "valuePath": "1111",
              "required": "0",
              "isModify": "0",
              "componentType": "input",
              "componentContent": "1111",
              "disabled": null
          },
          {
              "createBy": "buyunxuyong",
              "createTime": "2023-09-13 16:08:02",
              "updateBy": null,
              "updateTime": null,
              "remark": "11",
              "fieldId": 23,
              "templateId": 2,
              "fieldCode": "vfvf",
              "fieldName": "11",
              
              "valuePath": "11",
              "required": "0",
              "isModify": "0",
              "componentType": "input",
              "componentContent": "11",
              "disabled": null
          },
          {
              "createBy": "buyunxuyong",
              "createTime": "2023-09-13 16:08:57",
              "updateBy": null,
              "updateTime": null,
              "remark": "11",
              "fieldId": 24,
              "templateId": 2,
              "fieldCode": "cdacad",
              "fieldName": "11",
              
              "valuePath": "11",
              "required": "0",
              "isModify": "0",
              "componentType": "input",
              "componentContent": "11",
              "disabled": null
          },
          {
              "createBy": "buyunxuyong",
              "createTime": "2023-09-13 16:41:16",
              "updateBy": null,
              "updateTime": null,
              "remark": "1221",
              "fieldId": 28,
              "templateId": 2,
              "fieldCode": "vfewvf",
              "fieldName": "12",
              
              "valuePath": "12",
              "required": "0",
              "isModify": "0",
              "componentType": "input",
              "componentContent": "122",
              "disabled": null
          }
        ]
        this.setFormLabel(aa)
        this.formData.emArchivesExtendAtt = {
          componentContent: aa,
          fieldValue: {},
        }
        this.formData.archivesIndexList = {
          componentContent: aa,
          fieldValue: {},
        }
        this.addEdit = true;
        this.title = "新增设备";
        this.btnLoading = false
      });

      // this.reset();
      // getBASE().then(response => {
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加用户";
      //   this.form.password = this.initPassword;
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.btnLoading = true
      const deviceId = row.deviceId
      getBASE(deviceId).then(response => {
        this.title = "编辑设备";
        this.formData = response.data;
        if(this.formData.emArchivesExtendAtt){
          this.formData.emArchivesExtendAtt.componentContent = JSON.parse(this.formData.emArchivesExtendAtt.componentContent)
          this.formData.emArchivesExtendAtt.fieldValue = JSON.parse(this.formData.emArchivesExtendAtt.fieldValue)
          this.setFormLabel(this.formData.emArchivesExtendAtt.componentContent)
        }
        if(this.formData.archivesOther==null){
          this.formData.archivesOther = {}
        }
        this.addEdit = true;
        this.btnLoading = false
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + deviceIds + '"的数据项？').then(function() {
        return delBASE(deviceIds);
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