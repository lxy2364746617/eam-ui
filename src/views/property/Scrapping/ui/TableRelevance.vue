<template>
  <div class="box">
    <slot></slot>

    <jm-table
      :tableData="equipmentList"
      @getList="getAssociatedPlan"
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
          icon="el-icon-plus"
          @click="showAddDrawer"
          >新增</el-button
        >
        <el-button type="primary" plain size="mini" icon="el-icon-download"
          >下载</el-button
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
    <!-- 新增报废明细Drawer -->
    <add-detail-drawer ref="addDetail"></add-detail-drawer>
  </div>
</template>
<script>
import { equipmentTree } from "@/api/equipment/category";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
export default {
  components: {
    JmTable,
    JmForm,
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
      equipmentList: null,
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
      // 表格数据
      equipmentList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      categoryOptions: [],
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
    };
  },
  computed: {
    columns() {
      return [
        { label: "设备编码", prop: "deviceName", tableVisible: true },
        {
          label: "设备名称",
          prop: "sModel",
          formType: "data",
          tableVisible: true,
        },
        { label: "规格型号", prop: "categoryId", tableVisible: true },
        { label: "设备类别", prop: "categoryId", tableVisible: true },
        { label: "功能位置", prop: "categoryId", tableVisible: true },
        { label: "索引号", prop: "categoryId", tableVisible: true },
        { label: "设备状态", prop: "categoryId", tableVisible: true },
        { label: "资产类别", prop: "categoryId", tableVisible: true },
        { label: "单价", prop: "categoryId", tableVisible: true },
        { label: "已提折旧", prop: "categoryId", tableVisible: true },
        { label: "损失金额", prop: "categoryId", tableVisible: true },
        { label: "折旧年限", prop: "categoryId", tableVisible: true },
        { label: "已使用年限", prop: "categoryId", tableVisible: true },
        { label: "损失原因", prop: "categoryId", tableVisible: true },
        { label: "损失情况说明", prop: "categoryId", tableVisible: true },
        { label: "损失鉴定说明", prop: "categoryId", tableVisible: true },
      ];
    },
    detailColumns() {
      return [
        { label: "设备编码", prop: "deviceName", span: 24, required: true },
        { label: "设备名称", prop: "deviceName", span: 24, required: true },
        { label: "规格型号", prop: "deviceName", span: 24, required: true },
        {
          label: "设备类别",
          prop: "categoryId",
          span: 24,
          required: true,
          formType: "selectTree",
          options: this.categoryOptions,
        },
        {
          label: "功能位置",
          prop: "location",
          span: 24,
          required: true,
          formType: "select",
        },
        {
          label: "设备状态",
          prop: "deviceName",
          span: 24,
          required: true,
          formType: "select",
        },
        {
          label: "资产类别",
          prop: "deviceName",
          span: 24,
          required: true,
          formType: "select",
        },
        { label: "索引号", prop: "deviceName", span: 24, required: true },
        { label: "单价", prop: "deviceName", span: 24, required: true },
        { label: "已提折旧", prop: "deviceName", span: 24, required: true },
        { label: "损失金额", prop: "deviceName", span: 24, required: true },
        { label: "折旧年限", prop: "deviceName", span: 24, required: true },
        { label: "已使用年限", prop: "deviceName", span: 24, required: true },
        { label: "损失原因", prop: "deviceName", span: 24, required: true },
        {
          label: "损失情况说明",
          prop: "deviceName",
          span: 24,
          required: true,
          formType: "textarea",
        },
        {
          label: "损失鉴定说明",
          prop: "deviceName",
          span: 24,
          formType: "textarea",
        },
      ];
    },
  },
  created() {
    this.getTreeSelect();
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    getTreeSelect() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
      });
    },
    showAddDrawer() {
      this.$refs.addDetail.visible = true;
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
.drawer-footer {
  display: flex;
  justify-content: end;
  margin: 20px 0;
}
</style>
