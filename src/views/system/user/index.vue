<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div style="width:100%"></div>
        <jm-user-tree
          :treeData="deptOptions"
          @handleNodeClick="handleNodeClick"
          style="width:100%; height: 78vh"
        ></jm-user-tree>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" style="height:78vh;overflow:auto">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            :tableVisible="tableVisible"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
            v-if="tableVisible['userId']"
          />
          <el-table-column
            label="用户名"
            align="center"
            key="userName"
            prop="userName"
            v-if="tableVisible['userName']"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="姓名"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="tableVisible['nickName']"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="岗位"
            align="center"
            key="postName"
            prop="postName"
            v-if="tableVisible['postName']"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="班组"
            align="center"
            key="userGroup"
            prop="userGroup"
            v-if="tableVisible['userGroup']"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="技能等级"
            align="center"
            key="level"
            prop="level"
            width="160"
            v-if="tableVisible['level']"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.level"
                :max="5"
                disabled
                :colors="[
                  '#02b606',
                  '#02b606',
                  '#02b606',
                  '#02b606',
                  '#02b606',
                ]"
                void-icon-class="el-icon-star-off"
                :icon-classes="iconClasses"
                disabled-void-color="#C6D1DE"
              ></el-rate>
            </template>
          </el-table-column>
          <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="tableVisible['dept.deptName']"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="菜单角色"
            align="center"
            key="deptrole"
            prop="roleName"
            v-if="tableVisible['roleName']"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="tableVisible['phonenumber']"
            width="120"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
            v-if="tableVisible['status']"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            v-if="tableVisible['createTime']"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-hasPermi="['system:user:query']"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                >删除</el-button
              >
              <el-dropdown
                size="mini"
                @command="(command) => handleCommand(command, scope.row)"
                v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
              >
                <el-button size="mini" type="text" icon="el-icon-d-arrow-right"
                  >更多</el-button
                >
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="handleResetPwd"
                    icon="el-icon-key"
                    v-hasPermi="['system:user:resetPwd']"
                    >重置密码</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="handleAuthRole"
                    icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']"
                    >分配角色</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="用户名"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                placeholder="请输入用户名"
                maxlength="30"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item prop="postId" label="岗位">
              <el-select
                v-model="form.postIds"
                multiple
                placeholder="请选择岗位"
                :disabled='readOnly'
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入用户昵称"
                maxlength="30"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单角色">
              <el-select
                v-model="form.roleIds"
                multiple
                placeholder="请选择菜单角色"
                :disabled='readOnly'
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.sex" :disabled='readOnly' placeholder="请选择性别">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组">
              <el-select v-model="form.groupId" placeholder="请选择班组" :disabled='readOnly'>
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户身份" prop="userIdentity">
              <el-input
                v-model="form.userIdentity"
                placeholder="请输入用户身份"
                maxlength="30"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :show-count="true"
                placeholder="请选择所属部门"
                @select='selecttree'
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户密码"
              prop="password"
              
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属二级单位" prop="subCompanyId">
              <el-input
                v-model="form.subCompanyName" disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属组织" prop="affDeptId">
              <el-input
                v-model="form.affDeptName" disabled 
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入电话"
                maxlength="11"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属租赁公司" prop="affLeaseDeptId">
              <el-select v-model="form.affLeaseDeptId" :disabled='readOnly'>
                <el-option v-for="item in affLeaseDeptOptions" :key="item.deptId" :value="item.deptId" :label="item.deptName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input
                v-model="form.address"
                placeholder="请输入地址"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input
                v-model="form.fax"
                placeholder="请输入传真"
                :disabled='readOnly'
              />
            </el-form-item>
          </el-col>
          
        
          
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  :disabled='readOnly'
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          
        
          
          <el-col :span="12">
            <el-form-item label="技能等级">
              <el-rate
                v-model="form.level"
                :max="5"
                :disabled='readOnly'
                style="margin-top: 4%"
                :colors="[
                  '#02b606',
                  '#02b606',
                  '#02b606',
                  '#02b606',
                  '#02b606',
                ]"
                void-icon-class="el-icon-star-off"
                :icon-classes="iconClasses"
                disabled-void-color="#C6D1DE"
              ></el-rate>
            </el-form-item>
          </el-col>
        
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                :disabled='readOnly'
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!readOnly" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">{{readOnly?'关 闭':'取 消'}}</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox
              v-model="upload.updateSupport"
            />是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  deptTreeSelect,
  optionDept
} from "@/api/system/user";
import { findAll } from "@/api/system/group";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  dicts: ["sys_normal_disable", "sys_user_sex", "system_group_type"],
  components: { Treeselect, JmUserTree },
  data() {
    return {
      readOnly:false,
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
      // 用户表格数据
      userList: null,
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
      // 角色选项
      roleOptions: [],
      //班组选项
      groupOptions: [],
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
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      //租赁公司
      affLeaseDeptOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 列信息
      columns: [
        { key: 0,prop:'userId', label: `用户编号`, visible: true },
        { key: 1,prop:'userName', label: `用户名`, visible: true },
        { key: 2,prop:'nickName', label: `姓名`, visible: true },
        { key: 3,prop:'postName', label: `岗位`, visible: true },
        { key: 4,prop:'userGroup', label: `班组`, visible: true },
        { key: 5,prop:'level', label: `技能等级`, visible: true },
        { key: 6,prop:'dept.deptName', label: `部门`, visible: true },
        { key: 7,prop:'roleName', label: `菜单角色`, visible: true },
        { key: 8,prop:'phonenumber', label: `手机号码`, visible: true },
        { key: 9,prop:'status', label: `状态`, visible: true },
        { key: 10,prop:'createTime', label: `创建时间`, visible: true },
      ],
      tableVisible: {},
      iconClasses: ["el-icon-star-off", "el-icon-star-off", "el-icon-star-off"], //星级图标
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        postId: [
          { required: true, message: "岗位不能为空", trigger: "blur" },
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "所属部门不能为空", trigger: "blur" },
        ],
        affDeptId: [
          { required: true, message: "所属组织不能为空", trigger: "blur" },
        ],
        subCompanyId: [
          { required: true, message: "所属二级单位不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.columns.forEach((b) => {
      this.$set(
        this.tableVisible,
        b.prop,
        b.tableVisible == false ? false : true
      );
    });
    this.getList();
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });
    findAll().then((res) => {
      this.groupOptions = res.data;
    });
  },
  methods: {
    selecttree(option){
      this.form.affLeaseDeptId=''
      optionDept({deptId:option.id}).then(res=>{
        //this.form.subCompanyId=res.subCompany.deptId
        this.$set(this.form,'subCompanyId',res.subCompany.deptId)
        this.form.subCompanyName=res.subCompany.deptName
        //this.form.affDeptId=res.affDept.deptId
        this.$set(this.form,'affDeptId',res.affDept.deptId)
        this.form.affDeptName=res.affDept.deptName
        this.affLeaseDeptOptions=res.affLease
      })
      
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
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
        userName: '',
        nickName: '',
        password: '',
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
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
      this.ids = selection.map((item) => item.userId);
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
      this.readOnly=false
      getUser().then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
     /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      this.readOnly=true
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
        response.data.deptId&&optionDept({deptId:response.data.deptId}).then(res=>{
          this.form.subCompanyId=res.subCompany.deptId
          this.form.subCompanyName=res.subCompany.deptName
          this.form.affDeptId=res.affDept.deptId
          this.form.affDeptName=res.affDept.deptName
          this.affLeaseDeptOptions=res.affLease
          console.log(this.form)
        })
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.readOnly=false
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
        response.data.deptId&&optionDept({deptId:response.data.deptId}).then(res=>{
          this.form.subCompanyId=res.subCompany.deptId
          this.form.subCompanyName=res.subCompany.deptName
          this.form.affDeptId=res.affDept.deptId
          this.form.affDeptName=res.affDept.deptName
          this.affLeaseDeptOptions=res.affLease
          console.log(this.form)
        })
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.form)
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {},
        `user_template_${new Date().getTime()}.xlsx`
      );
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
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%;
}
::v-deep .el-dialog__body {
    padding: 30px 45px 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    max-height: 70vh;
    overflow: auto;
}
::v-deep .el-form-item__content,.vue-treeselect{
  height: 36px !important;
}

</style>