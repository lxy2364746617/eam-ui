<template>
  <div>
    <el-card shadow="never" style="margin-top: 10px">
      <jm-table
        :tableData="equipmentList"
        @handleSelectionChange="handleSelectionChange"
        @getList="getList"
        :total="total"
        ref="jmtable"
        :initLoading="false"
        :handleWidth="130"
        :showSearch="false"
        :paginationShow="false"
        :columns="columns"
      >
        <template slot="headerLeft">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['property:base:addParentEm']"
              >添加</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete(0)"
              v-hasPermi="['property:base:removeParentEm']"
              >解除</el-button
            >
          </el-col>
        </template>
        <template #end_handle="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.index,scope.row,'edit')"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(1, scope)"
            >解除</el-button
          >
        </template>
      </jm-table>
      <el-drawer
        :title="title"
        :visible.sync="drawer"
        direction="rtl"
        size="70%"
        :wrapperClosable="false"
      >
        <!-- <jm-form 
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
      </jm-form> -->
        <jm-table
          v-if="drawer"
          :tableData="partsData"
          :columns="columns"
          @handleSelectionChange="handleSelectionChange2"
          @getList="getList2"
          :total="total2"
          :initLoading="false"
          :handleWidth="130"
          :showOperate="false"
          size="60%"
        >
        </jm-table>
        <div style="width: 100%; height: 48px"></div>
        <div
          style="
            position: absolute;
            bottom: 0px;
            width: 100%;
            background-color: #fff;
            text-align: center;
            padding: 10px;
            border-top: 1px solid #ddd;
          "
        >
          <el-button size="mini" @click="close">取消</el-button>
          <el-button size="mini" @click="saveToTable" type="primary"
            >确定</el-button
          >
        </div>
      </el-drawer>
    </el-card>
    <el-card shadow="never" style="margin-top: 10px; text-align: right">
      <el-button size="mini" @click="closeform">取消</el-button>
      <el-button
        size="mini"
        @click="prvstep"
        type="primary"
        v-if="stepActive >= 1"
        >上一步</el-button
      >
      <el-button
        size="mini"
        @click="nextstep"
        type="primary"
        v-if="stepActive <= elstep.length - 2"
        >下一步</el-button
      >
      <el-button size="mini" @click="save" type="primary">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import { updateBASE, addBASE } from "@/api/equipment/BASE";
import {
  listParts,
  addParts,
  updateParts,
  delParts,
  selectPage,
} from "@/api/equipment/parts";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import supplier from "@/views/device/book/supplier";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "bookadd",
  dicts: ["em_property_type"],
  components: {
    Treeselect,
    JmUserTree,
    JmTable,
    JmForm,
    supplier,
  },
  props: {
    stepActive: {
      default: 0,
      type: Number,
    },
    elstep: {
      default: [],
      type: Array,
    },
    formData: {
      default: {},
      type: Object,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "备件名称", prop: "partName", span: 24 },
        { label: "备件编码", prop: "partCode", span: 24 },
        { label: "规格型号", prop: "sModel", span: 24 },
        { label: "备件类别", prop: "partType", span: 24 },
        { label: "单位", prop: "unit", span: 24 },
        { label: "当前库存", prop: "inventory", span: 24 },
        { label: "供应商名称", prop: "supplierName", span: 24 },
        { label: "存储位置", prop: "locationName", span: 24 },
        { label: "所属组织", prop: "affDeptName", span: 24 },
      ];
    },
  },
  mounted() {
    // console.log(this.formData.archivesPartsList,44);
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
      equipmentList: [],
      // 总条数
      total: 0,
      formDataNow: {},
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
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: this.formData.deviceId,
      },
      partsData: [], //选择列表
      // 总条数
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
      },
      total2: 0,
      // 表单校验
      pushList: [], //多选框选中数据
    };
  },
  created() {
    this.getTreeSelect();
    this.getList(this.queryParams);
  },
  methods: {
    /** 查询用户列表 */
    getList(queryParams) {
      queryParams.deviceId = this.queryParams.deviceId;
      this.loading = true;
      listParts(queryParams).then((response) => {
        this.$set(this, "equipmentList", response.rows);
        this.total = response.total;
        this.loading = false;
      });
    },
    /* 添加备品备件 */
    getList2(queryParams) {
      this.loading = true;
      let ids = this.equipmentList.map((item) => {
        return item.partCode;
      });
      queryParams.exportIds = ids.join(",");
      selectPage(queryParams).then((response) => {
        /* let list_id = this.equipmentList.length>0? this.equipmentList.map(item=>item.partCode):[];
          let arr= response.data.records.filter(item=>{
            return list_id.indexOf(item.partCode) == -1;
          })*/
        this.$set(this, "partsData", response.rows);

        this.total2 = response.total;
        this.pushList = [];
      });
    },
    closeform() {
      this.$emit("closeform");
    },
    prvstep() {
      this.save(() => {
        this.$emit("prvstep");
      });
    },
    nextstep() {
      this.save(() => {
        this.$emit("nextstep");
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.partCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.pushList = selection;
    },
    close() {
      this.drawer = false;
      this.pushList = [];
    },
    // form保存
    saveToTable() {
      this.equipmentList = this.equipmentList.concat(this.pushList);
      this.close();
      // this.submitForm(()=>{
      //   this.getList(this.queryParams)
      // })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.drawer = true;
      this.title = "新增设备";
      this.getList2(this.queryParams2);
      this.formDataNow = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.drawer = true;
      this.title = "编辑设备";
      this.formDataNow = row;
    },
    /** 删除按钮操作 */
    handleDelete(type, item) {
      const partCode = type == 1 ? [item.row.partCode] : this.ids;
      this.$modal
        .confirm('是否确认删除备件编码为"' + partCode + '"的数据项？')
        .then(() => {
          let arr = this.equipmentList.filter((item) => {
            return partCode.indexOf(item.partCode) == -1;
          });
          this.$set(this, "equipmentList", arr);
          this.total = this.equipmentList.length;
        })
        .catch(() => {});
    },
    save(fn) {
      this.submitForm(fn);
    },
    /** 提交按钮 */
    submitForm: async function (fn) {
      var formData = this.$parent.getFormDataParams();
      formData.archivesPartsList = this.equipmentList;
      if (formData.deviceId != undefined) {
        await updateBASE({ ...formData }).then((response) => {
          this.$modal.msgSuccess("修改成功");
          if (typeof fn == "function") fn();
        });
      } else {
        await addBASE({ ...formData }).then((response) => {
          this.$modal.msgSuccess("保存成功");
          if (typeof fn == "function") fn();
        });
      }
      this.$emit("closeform");
    },
    getTreeSelect() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
        this.$forceUpdate();
      });
    },
  },
};
</script>