<template>
  <div class="app-container">
    <el-row :gutter="20" v-show="!addEdit && !deviceIndexVisible">
      <!--部门数据-->
      <!-- <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree 
          :treeData="categoryOptions" 
          @handleNodeClick="handleNodeClick" 
          style="position: fixed;top: 121px;height: calc(100vh - 141px);">
        </jm-user-tree>
      </el-col>-->
      <div>
        <el-popover
          placement="bottom"
          title
          style="position: fixed; z-index: 1009; top: 65px; right: 10px"
          trigger="click"
          content
        >
          <el-button
            type="primary"
            size="small"
            slot="reference"
            style="
              border-radius: 10px;
              width: 42px;
              height: 36px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 20px;
            "
            ><svg
              data-v-199549f2=""
              width="22"
              height="22"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                data-v-199549f2=""
                d="M16.9053 10.1252H24.0479C24.8213 10.1252 25.2081 9.72383 25.2081 8.9211V6.20235C25.2081 5.39961 24.8213 4.99532 24.0479 4.99532H16.9053C16.1319 4.99532 15.7452 5.39668 15.7452 6.20235V8.9211C15.7452 9.72383 16.1319 10.1252 16.9053 10.1252ZM18.3995 17.8156C18.6163 18.0412 18.9122 18.1701 19.2198 18.1701H24.0538C24.6954 18.1701 25.2139 17.6311 25.2139 16.9631V14.2648C25.2198 13.9426 25.0997 13.6291 24.8799 13.4006C24.6631 13.1691 24.3643 13.0402 24.0508 13.0402H19.2168C18.9063 13.0402 18.6075 13.1691 18.3877 13.4006C18.168 13.632 18.0508 13.9426 18.0538 14.2648V14.8537H8.20708V10.1457H10.7559C11.0723 10.1516 11.3741 10.0227 11.5967 9.79122C11.8194 9.55977 11.9424 9.24629 11.9366 8.91817V6.19942C11.9366 5.87715 11.8106 5.56661 11.5909 5.34102C11.3682 5.1125 11.0665 4.98946 10.7559 4.99532H5.16021C4.85259 4.99532 4.55669 5.12422 4.3399 5.34981C4.1231 5.5754 4.00005 5.88301 4.00005 6.20235V8.9211C3.99712 9.24336 4.11431 9.55684 4.33404 9.78536C4.55084 10.0168 4.84966 10.1457 5.16314 10.1457H6.72173V23.6486C6.72173 23.8537 6.80083 24.05 6.93853 24.1936C7.07916 24.34 7.26958 24.4221 7.46587 24.4221H18.0626V25.008C18.0626 25.3273 18.1856 25.635 18.4024 25.8606C18.6192 26.0861 18.9151 26.2121 19.2227 26.2121H24.0567C24.6983 26.2121 25.2169 25.6731 25.2169 25.008V22.2893C25.2169 21.9699 25.0938 21.6623 24.877 21.4367C24.6602 21.2111 24.3643 21.0852 24.0567 21.0852H19.2227C18.9151 21.0852 18.6192 21.2111 18.4024 21.4367C18.1856 21.6623 18.0626 21.9699 18.0626 22.2893V22.8781H8.20708V16.3772H18.0596V16.9631C18.0596 17.2854 18.1827 17.59 18.3995 17.8156Z"
                fill="#565C6B"
              ></path>
              <path
                data-v-199549f2=""
                d="M16.9053 10.1252H24.0479C24.8213 10.1252 25.2081 9.72383 25.2081 8.9211V6.20235C25.2081 5.39961 24.8213 4.99532 24.0479 4.99532H16.9053C16.1319 4.99532 15.7452 5.39668 15.7452 6.20235V8.9211C15.7452 9.72383 16.1319 10.1252 16.9053 10.1252ZM18.3995 17.8156C18.6163 18.0412 18.9122 18.1701 19.2198 18.1701H24.0538C24.6954 18.1701 25.2139 17.6311 25.2139 16.9631V14.2648C25.2198 13.9426 25.0997 13.6291 24.8799 13.4006C24.6631 13.1691 24.3643 13.0402 24.0508 13.0402H19.2168C18.9063 13.0402 18.6075 13.1691 18.3877 13.4006C18.168 13.632 18.0508 13.9426 18.0538 14.2648V14.8537H8.20708V10.1457H10.7559C11.0723 10.1516 11.3741 10.0227 11.5967 9.79122C11.8194 9.55977 11.9424 9.24629 11.9366 8.91817V6.19942C11.9366 5.87715 11.8106 5.56661 11.5909 5.34102C11.3682 5.1125 11.0665 4.98946 10.7559 4.99532H5.16021C4.85259 4.99532 4.55669 5.12422 4.3399 5.34981C4.1231 5.5754 4.00005 5.88301 4.00005 6.20235V8.9211C3.99712 9.24336 4.11431 9.55684 4.33404 9.78536C4.55084 10.0168 4.84966 10.1457 5.16314 10.1457H6.72173V23.6486C6.72173 23.8537 6.80083 24.05 6.93853 24.1936C7.07916 24.34 7.26958 24.4221 7.46587 24.4221H18.0626V25.008C18.0626 25.3273 18.1856 25.635 18.4024 25.8606C18.6192 26.0861 18.9151 26.2121 19.2227 26.2121H24.0567C24.6983 26.2121 25.2169 25.6731 25.2169 25.008V22.2893C25.2169 21.9699 25.0938 21.6623 24.877 21.4367C24.6602 21.2111 24.3643 21.0852 24.0567 21.0852H19.2227C18.9151 21.0852 18.6192 21.2111 18.4024 21.4367C18.1856 21.6623 18.0626 21.9699 18.0626 22.2893V22.8781H8.20708V16.3772H18.0596V16.9631C18.0596 17.2854 18.1827 17.59 18.3995 17.8156Z"
                fill="white"
              ></path></svg
          ></el-button>
          <jm-user-tree
            :treeData="categoryOptions"
            @handleNodeClick="handleNodeClick"
            style="height: calc(100vh - 141px)"
          ></jm-user-tree>
        </el-popover>
      </div>
      <!--用户数据-->
      <el-col :span="24" :xs="24" v-show="!addDetails">
        <el-row
          v-if="!isChoose"
          :gutter="10"
          style="margin-bottom: 20px; text-align: center"
        >
          <el-col
            :span="6"
            :xs="24"
            v-for="item in countColumn"
            :key="item.prop"
          >
            <div
              style="
                background-color: rgb(247, 251, 255);
                padding-top: 15px;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid rgb(233, 234, 239);
              "
            >
              <div style="font-size: 30px">
                <p
                  style="
                    width: 45px;
                    height: 45px;
                    margin: 0px auto;
                    display: flex;
                    color: rgb(255, 255, 255);
                    background-color: rgb(0, 123, 254);
                    border-radius: 50%;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                  "
                >
                  <i :class="item.icon"></i>
                </p>
              </div>
              <div v-if="item.label">
                <el-row>
                  <el-col :span="24">
                    <p style="color: #666; font-size: 12px; margin: 5px auto">
                      {{ item.label }}
                    </p>
                    <p
                      style="
                        font-size: 20px;
                        font-weight: bold;
                        margin: 7px auto;
                        padding-bottom: 10px;
                      "
                    >
                      {{ countData[item.prop] }}
                    </p>
                  </el-col>
                </el-row>
              </div>
              <div v-if="item.children">
                <el-row>
                  <el-col
                    :span="8"
                    v-for="(item2, index2) in item.children"
                    :key="item2.index"
                  >
                    <p
                      :style="{ color: item2.color }"
                      style="font-size: 12px; margin: 5px auto"
                    >
                      {{ item2.label }}
                    </p>
                    <p
                      style="
                        font-size: 20px;
                        font-weight: bold;
                        margin: 7px auto;
                        padding-bottom: 10px;
                      "
                    >
                      {{ countData[item2.prop] }}
                    </p>
                  </el-col>
                </el-row>
              </div>
            </div>
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
          :columns="columns"
        >
          <template slot="headerLeft" v-if="!isChoose">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :loading="btnLoading"
                @click="handleOpen"
                v-hasPermi="['equipment:base:add']"
                >新增</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
                v-hasPermi="['equipment:base:import']"
                >导入</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-document"
                size="mini"
                @click="handleDevice"
                >设备指标</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['equipment:base:export']"
                >下载</el-button
              >
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
            </el-col>-->
          </template>
          <template #end_handle="scope" v-if="!isChoose">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              :loading="btnLoading"
              @click="handleUpdate(scope.row, 'view')"
              v-hasPermi="['equipment:base:query']"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              :loading="btnLoading"
              @click="handleUpdate(scope.row, 'edit')"
              v-hasPermi="['equipment:base:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['equipment:base:remove']"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-add"
              @click="handleSet(scope.row)"
              v-hasPermi="['equipment:book:edit']"
              >提交</el-button
            >
          </template>
        </jm-table>
      </el-col>
      <el-col :span="24" :xs="24" v-if="addDetails">
        <add-details
          :formData="formData"
          :formTitle="title"
          @back="back()"
        ></add-details>
      </el-col>
    </el-row>
    <div
      v-if="isChoose"
      style="
        position: absolute;
        bottom: 0px;
        width: 100%;
        background-color: #fff;
        text-align: center;
        padding: 20px;
        border-top: 1px solid #ddd;
      "
    >
      <el-button size="mini" @click="close">取消</el-button>
      <el-button
        size="mini"
        @click="submitRadio"
        type="primary"
        :disabled="multiple"
        >确定</el-button
      >
    </div>
    <add-edit
      v-if="addEdit"
      :formTitle="title"
      :formData="formData"
      @back="back()"
    ></add-edit>
    <device-index
      v-if="deviceIndexVisible"
      @back="deviceIndexVisible = false"
    ></device-index>
    <!-- 导入 -->
    <file-import
      @handleFileSuccess="handleFileSuccess"
      :downloadTemplateUrl="'/equipment/base/importTemplate'"
      ref="fileImport"
      :importUrl="'/equipment/base/importData'"
    ></file-import>
    <!-- 新增 -->
    <el-drawer
      title="新增设备"
      :visible.sync="addItem.addDrawer"
      direction="rtl"
      :wrapperClosable="false"
      destroy-on-close
    >
      <el-radio-group v-model="addItem.addRadio" style="margin-left: 20px">
        <el-row style="margin-bottom: 20px; margin-top: 20px">
          <el-col :span="10" style="line-height: 40px">
            <el-radio :label="1">复制设备</el-radio>
          </el-col>
          <el-col :span="14" v-if="addItem.addRadio == 1">
            <el-input
              readonly
              @click.native="addItem.choosedrawer = true"
              v-model="addItem.copyInputName"
              placeholder="请选择"
            ></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-radio :label="2">新增设备</el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleAdd" size="small"
          >确 定</el-button
        >
        <el-button @click="addItem.addDrawer = false" size="small"
          >取 消</el-button
        >
      </div>
    </el-drawer>
    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择设备"
      :visible.sync="addItem.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        :isChoose="true"
        @submitRadio="submitRadio2"
        @close="addItem.choosedrawer = false"
      ></parentdevice>
    </el-drawer>
  </div>
</template>

<script>
import { findByTemplateType } from "@/api/equipment/attribute";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import {
  listBASE,
  getBASE,
  delBASE,
  addBASE,
  updateBASE,
  countBASE,
  exportBASE,
  copyBASE,
} from "@/api/equipment/BASE";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import addEdit from "@/views/device/book/add";
import addDetails from "@/views/device/book/details";
import deviceIndex from "@/views/device/book/deviceIndex";
import JmTable from "@/components/JmTable";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import fileImport from "@/components/FileImport";
import parentdevice from "@/views/device/book/device";

export default {
  name: "devicebook",
  dicts: ["em_device_state", "em_device_att", "apv_status", "em_device_level"],
  components: {
    Treeselect,
    JmUserTree,
    JmTable,
    addEdit,
    addDetails,
    deviceIndex,
    fileImport,
    parentdevice,
  },
  props: {
    isChoose: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "设备编码", prop: "deviceCode", width: 200 },
        { label: "设备名称", prop: "deviceName", width: 200 },
        { label: "规格型号", prop: "specs", width: 200 },
        {
          label: "设备类别",
          prop: "categoryId",
          formType: "selectTree",
          options: this.categoryOptions,
          width: 280,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
        },
        { label: "财务资产编码", prop: "propertyCode", width: 200 },
        { label: "功能位置", prop: "location" },
        {
          label: "重要等级",
          prop: "level",
          formType: "select",
          options: this.dict.type.em_device_level,
        }, //(A、B、C)
        // { label:"所属子公司", prop:"",  },
        {
          label: "所属组织",
          prop: "affDeptId",
          formType: "selectTree",
          options: this.deptOptions,
          width: 180,
        },
        {
          label: "当前使用组织",
          prop: "currDeptId",
          formType: "selectTree",
          options: this.deptOptions,
          width: 180,
        },
        { label: "入账日期", prop: "makerAoTime", formType: "date" },
        {
          label: "设备属性",
          prop: "deviceAtt",
          formType: "select",
          options: this.dict.type.em_device_att,
        }, //(1 设备、2 部件)
        { label: "上级设备", prop: "parentDeviceName", width: 200 }, //(0 父级)
        {
          label: "审批状态",
          prop: "apvStatus",
          formType: "selectTag",
          options: this.dict.type.apv_status,
        }, //apv_status
      ];
    },
  },
  data() {
    return {
      addItem: {
        choosedrawer: false,
        copyInputName: "",
        copyInputId: "",
        addDrawer: false,
        addRadio: 1,
      },
      btnLoading: false,
      formData: {
        archivesOther: {}, // 步骤2 值
        emArchivesExtendAtt: {}, // 步骤2-扩展数据  模板 值
        emArchivesIndex: {}, // 步骤3 主要指标  模板 值
        emArchivesSpecial: {}, // 步骤3 特种设备  模板 值
        archivesPartsList: [], // 步骤4  表格
        genFileResourceList: [], // 步骤5  上传图片
        imgFileResourceList: [], // 步骤5  上传文件
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
      countData: {},
      countColumn: [
        { label: "设备数量", prop: "sumCount", icon: "el-icon-s-cooperation" },
        { label: "在用数量", prop: "zyCount", icon: "el-icon-tickets" },
        { label: "未审批数量", prop: "checkCount", icon: "el-icon-reading" },
        {
          children: [
            { label: "A级", prop: "a", color: "#24a71e" },
            { label: "B级", prop: "b", color: "#ffb64f" },
            { label: "C级", prop: "c", color: "#fc297d" },
          ],
          icon: "el-icon-pie-chart",
        },
      ],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      categoryOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      addEdit: false,
      addDetails: false,
      valueMap: {},
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
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: undefined,
      },
      deviceIndexVisible: false,
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
    this.getTree();
    this.getTreeSelect();
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.fileImport.upload.open = true;
    },
    /** 查询设备档案下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 设备指标
    handleDevice() {
      this.deviceIndexVisible = true;
      // var obj = {
      //   categoryId: this.queryParams.categoryId
      // }
      // listIndexBASE(obj).then(response => {

      // });
    },
    close() {
      this.$emit("close");
    },
    submitRadio() {
      this.$emit("submitRadio", this.radioRow);
    },
    submitRadio2(row) {
      this.addItem.copyInputName = row.deviceName;
      this.addItem.copyInputId = row.deviceId;
      this.addItem.choosedrawer = false;
    },
    back() {
      this.addEdit = false;
      this.addDetails = false;
      this.getList(this.queryParams);
    },
    handleOpen() {
      this.addItem.addDrawer = true;
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      var data = {
        categoryId: this.queryParams.categoryId,
        ...queryParams,
      };
      this.getCount(data);
      listBASE(data).then((response) => {
        response.rows.forEach((b) => {
          Object.assign(
            b,
            b.archivesOther ? b.archivesOther : {},
            b.emArchivesExtendAtt
              ? JSON.parse(b.emArchivesExtendAtt.fieldValue)
              : {},
            b.emArchivesIndex ? JSON.parse(b.emArchivesIndex.fieldValue) : {},
            b.emArchivesSpecial
              ? JSON.parse(b.emArchivesSpecial.fieldValue)
              : {}
          );
          if (b.emArchivesExtendAtt) {
            b.emArchivesExtendAtt.fieldValue = JSON.parse(
              b.emArchivesExtendAtt.fieldValue
            );
          }
          if (b.emArchivesIndex) {
            b.emArchivesIndex.fieldValue = JSON.parse(
              b.emArchivesIndex.fieldValue
            );
          }
          if (b.emArchivesSpecial) {
            b.emArchivesSpecial.fieldValue = JSON.parse(
              b.emArchivesSpecial.fieldValue
            );
          }
        });
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询统计 */
    getCount(queryParams) {
      countBASE(queryParams).then((response) => {
        this.countData = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.addDetails = false;
      this.queryParams.categoryId = data.parentId == 0 ? "" : data.id; // 如果是最外层，传空
      this.getCount({ categoryId: this.queryParams.categoryId });
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
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
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
    // setFormLabel(arr){
    //   arr.forEach(b => {
    //     b.label=b.fieldName;
    //     b.prop=b.fieldCode;
    //     b.required = b.required;
    //     b.disabled = b.disabled;
    //     b.formType = b.componentType;
    //     switch (b.componentType) {
    //       case 'select':
    //         b.options = [];
    //         // 字典
    //         if(b.dictionaryType){
    //           console.log(this,222);
    //           b.options = this.dict.type[b.dictionaryType]
    //         }
    //         break;
    //       case 'radio':
    //         b.options = [];
    //         if(b.dictionaryType){
    //           b.options = this.dict.type[b.dictionaryType]
    //         }
    //         break;

    //       default:
    //         break;
    //     }
    //   });
    // },
    /** 新增按钮操作 */
    handleAdd() {
      // this.btnLoading = true
      this.addItem.addDrawer = false;
      if (this.addItem.addRadio == 1) {
        // 复制
        if (this.addItem.copyInputName == "") {
          this.$modal.msgError("复制设备不能为空");
        } else {
          copyBASE({ deviceId: this.addItem.copyInputId }).then((response) => {
            // this.btnLoading = false
            this.getList();
          });
        }
      } else if (this.addItem.addRadio == 2) {
        // 新增
        this.$router.push({ path: "/device/book/add" });
        // // 获取扩展数据
        // findByTemplateType({templateType: 'K'}).then(response => {
        //   this.formData = this.$options.data().formData;
        //   this.setFormLabel(response.data)
        //   // 扩展数据
        //   this.formData.emArchivesExtendAtt = {
        //     componentContent: response.data,
        //     fieldValue: {},
        //   }
        //   this.addEdit = true;
        //   this.title = "新增设备";
        //   this.btnLoading = false
        // })
        // .catch(err => {
        //   this.btnLoading = false
        // });
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, f) {
      // this.btnLoading = true
      const deviceId = row.deviceId;
      if (f == "edit") {
        // this.addEdit = true;
        this.$router.push({ path: "/device/book/add?i=" + deviceId });
      } else if (f == "view") {
        this.title =
          this.getTreeParent(row.categoryId).join(" > ") +
          " > " +
          row.deviceName;
        this.$router.push({
          path: "/device/book/details?i=" + deviceId + "&t=" + this.title,
        });
        // this.addDetails = true;
      }
      // getBASE(deviceId).then(response => {
      //   this.title = "编辑设备";
      //   this.formData = response.data;

      //   // 第一步  特种设备
      //   if(this.formData.emArchivesSpecial){
      //     this.formData.emArchivesSpecial.componentContent = JSON.parse(this.formData.emArchivesSpecial.componentContent)
      //     this.formData.emArchivesSpecial.fieldValue = JSON.parse(this.formData.emArchivesSpecial.fieldValue)
      //     this.setFormLabel(this.formData.emArchivesSpecial.componentContent)
      //   }
      //   // 第二步
      //   if(this.formData.archivesOther==null){
      //     this.formData.archivesOther={}
      //   }
      //   // 第二步  扩展数据
      //   if(this.formData.emArchivesExtendAtt){
      //     this.formData.emArchivesExtendAtt.componentContent = JSON.parse(this.formData.emArchivesExtendAtt.componentContent)
      //     this.formData.emArchivesExtendAtt.fieldValue = JSON.parse(this.formData.emArchivesExtendAtt.fieldValue)
      //     this.setFormLabel(this.formData.emArchivesExtendAtt.componentContent)
      //   }
      //   // 第三步 主要指标
      //   if(this.formData.emArchivesIndex){
      //     this.formData.emArchivesIndex.componentContent = JSON.parse(this.formData.emArchivesIndex.componentContent)
      //     this.formData.emArchivesIndex.fieldValue = JSON.parse(this.formData.emArchivesIndex.fieldValue)
      //     this.setFormLabel(this.formData.emArchivesIndex.componentContent)
      //   }
      //   // var obj = {
      //   //   componentContent: [],
      //   //   fieldValue: {},
      //   // }
      //   // if(this.formData.emArchivesExtendAtt==null) this.formData.emArchivesExtendAtt=obj
      //   // if(this.formData.emArchivesIndex==null) this.formData.emArchivesIndex=obj
      //   // if(this.formData.emArchivesSpecial==null) this.formData.emArchivesSpecial=obj
      //   this.btnLoading = false
      //   if(f=='edit'){
      //     this.addEdit = true;
      //   }else if(f=='view'){
      //     this.title = this.getTreeParent(row.categoryId).join(' > ') + ' > ' + row.deviceName;
      //     this.addDetails = true;
      //   }
      // })
      // .catch(err => {
      //   console.log(err,333);
      //   this.btnLoading = false
      // });
    },
    getTreeParent(id) {
      const path = [];
      let current = this.valueMap[id];
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path;
    },
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal
        .confirm('是否确认删除用户编号为"' + deviceIds + '"的数据项？')
        .then(function () {
          return delBASE(deviceIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   this.download('system/user/export', {
    //     ...this.queryParams
    //   }, `user_${new Date().getTime()}.xlsx`)
    // },
    handleExport() {
      var obj = {
        categoryId: this.queryParams.categoryId,
      };
      this.download(
        "equipment/base/export",
        {
          ...obj,
        },
        `device_${new Date().getTime()}.xlsx`
      );
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
    handleFileSuccess() {
      this.getList(this.queryParams);
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: 50px;
  text-align: center;
  border-top: 1px solid #ddd;
}
</style>