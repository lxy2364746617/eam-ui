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
        <el-button type="primary" plain size="mini">选取设备</el-button>
        <el-button type="primary" plain size="mini">批量配置</el-button>
      </template>
    </jm-table>
  </div>
</template>
<script>
import {
  listBASE,
  getBASE,
  delBASE,
  addBASE,
  updateBASE,
} from "@/api/equipment/BASE";
import { getAssociatedPlan } from "@/api/property/purchase";
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
        { label: "创建时间", prop: "createdTime", tableVisible: true },
        {
          label: "设备名称",
          prop: "deviceName",
          formType: "data",
          tableVisible: true,
        },
        { label: "规格型号", prop: "categoryId", tableVisible: true },
        { label: "设备编码", prop: "categoryId", tableVisible: true },
        { label: "设备类别", prop: "categoryId", tableVisible: true },
        { label: "功能位置", prop: "categoryId", tableVisible: true },
        { label: "设备批次号", prop: "categoryId", tableVisible: true },
        { label: "设备状态", prop: "categoryId", tableVisible: true },
        { label: "审批状态", prop: "categoryId", tableVisible: true },
        { label: "目标功能位置", prop: "categoryId", tableVisible: true },
        { label: "目标设备状态", prop: "categoryId", tableVisible: true },
        { label: "目标使用组织", prop: "categoryId", tableVisible: true },
        { label: "目标使用部门", prop: "categoryId", tableVisible: true },
      ];
    },
  },
  watch: {},
  created() {},
  // mounted() { this.getList() },
  methods: {
    /** 查询用户列表 */
    getAssociatedPlan(queryParams) {
      this.loading = true;
      listBASE(queryParams).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
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
</style>
