<template>
  <div class="box">
    <slot></slot>

    <jm-table
      :tableData="equipmentList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="showEquipSelectDialog = true"
          >选取设备</el-button
        >
        <el-button
          type="primary"
          plain
          size="mini"
          @click="showBatchConfigDialog = true"
          >批量配置</el-button
        >
        <el-button
          type="danger"
          plain
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete()"
          >删除</el-button
        >
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, 'view')"
          v-hasPermi="['equipment:book:edit']"
          >详情</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, 'edit')"
          v-hasPermi="['equipment:book:edit']"
          >修改</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['equipment:book:remove']"
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
    <el-form style="margin-top: 10px">
      <el-form-item label="设备回退附件" required>
        <el-upload>
          <el-button type="primary" plain size="mini" icon="el-icon-upload"
            >上传</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- 选择设备 -->
    <el-dialog
      title="设备档案"
      :visible.sync="showEquipSelectDialog"
      width="80%"
    >
      <jm-table :columns="equipSelectColumns" :tableData="equipData"></jm-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEquipSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="showEquipSelectDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 批量配置 -->
    <el-dialog
      title="批量配置"
      :visible.sync="showBatchConfigDialog"
      width="30%"
    >
      <el-form class="form" label-width="110px">
        <el-form-item label="目标功能位置" required>
          <el-select :style="{ width: '100%' }"></el-select>
        </el-form-item>
        <el-form-item label="目标设备状态" required>
          <el-select :style="{ width: '100%' }"></el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBatchConfigDialog = false">取 消</el-button>
        <el-button type="primary" @click="showBatchConfigDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getEquipList } from "@/api/property/turnover.js";
import JmTable from "@/components/JmTable";
export default {
  components: {
    JmTable,
  },
  props: {},
  data() {
    return {
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      equipmentList: [],
      isChoose: false,
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
      addDetails: false,
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      radioRow: {},
      // 选择设备弹框
      showEquipSelectDialog: false,
      // 设备档案列表
      equipData: [],
      // 批量配置弹框
      showBatchConfigDialog: false,
    };
  },
  computed: {
    columns() {
      return [
        { label: "创建时间", prop: "deviceName", tableVisible: true },
        {
          label: "设备名称",
          prop: "specs",
          formType: "data",
          tableVisible: true,
        },
        { label: "规格型号", prop: "categoryId", tableVisible: true },
        {
          label: "自设设备编码",
          prop: "deviceAtt",
          formType: "select",
          options: [],
          tableVisible: true,
        }, //(1 设备、2 部件)
        { label: "设备类别", prop: "categoryId", tableVisible: true },
        { label: "功能位置", prop: "categoryId", tableVisible: true },
        { label: "设备编号", prop: "categoryId", tableVisible: true },
        { label: "使用部门", prop: "categoryId", tableVisible: true },
        { label: "所属组织", prop: "categoryId", tableVisible: true },
        { label: "当前使用组织", prop: "categoryId", tableVisible: true },
        { label: "设备状态", prop: "categoryId", tableVisible: true },
        {
          label: "目标功能位置",
          prop: "categoryId",
          tableVisible: true,
        },
        { label: "目标设备状态", prop: "categoryId", tableVisible: true },
      ];
    },
    equipSelectColumns() {
      return [
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "specs", tableVisible: true },
        { label: "自设设备编码", prop: "selfEquipNo", tableVisible: true },
        {
          label: "设备状态",
          prop: "deviceStatus",
          tableVisible: true,
        },
        {
          label: "设备类别",
          prop: "categoryName",
          tableVisible: true,
        },
        { label: "功能位置", prop: "location", tableVisible: true },
        { label: "使用部门", prop: "useDeptName", tableVisible: true },
        {
          label: "所属组织",
          prop: "affDeptName",
          tableVisible: true,
        },
        {
          label: "当前使用组织",
          prop: "currDeptName",
          tableVisible: true,
        },
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
      ];
    },
  },
  created() {
    this.getListOfEquip();
  },
  methods: {
    // 删除设备
    handleDelete(row) {
      console.log("row=====>", row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    getListOfEquip() {
      console.log("queryParams=====>", this.queryParams);
      getEquipList(this.queryParams).then((res) => {
        this.equipData = res.rows;
        this.total = res.total;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  padding: 14px 15px;

  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .controls {
    padding-top: 15px;
    width: 100%;
    height: auto;
    padding-bottom: 30px;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #e9eaef;
      background: linear-gradient(
        139deg,
        #62b0ff 44.05%,
        #007bfe 105.54%,
        #007bfe 118.67%,
        #007bfe 129.22%
      );
      padding: 0;
    }
  }

  .overflow-hidden {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.form {
  width: 100%;
}
</style>
