<template>
  <div class="box">
    <slot></slot>

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
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        { label: "设备类别", prop: "categoryId", tableVisible: true },
        {
          label: "设备属性",
          prop: "deviceAtt",
          formType: "select",
          options: [],
          tableVisible: true,
        }, //(1 设备、2 部件)
        { label: "财务资产编码", prop: "propertyCode", tableVisible: true },
        { label: "功能位置", prop: "LOCATION", tableVisible: true },
        {
          label: "重要等级",
          prop: "LEVEL",
          formType: "select",
          options: [],
          tableVisible: true,
        }, //(A、B、C)
        {
          label: "上级设备",
          prop: "parentId",
          formType: "select",
          options: [],
          tableVisible: true,
        }, //(0 父级)
        { label: "所属组织", prop: "affDeptId", tableVisible: true },
        { label: "当前使用组织", prop: "currDeptId", tableVisible: true },
      ];
    },
  },
  watch: {},
  created() {},
  // mounted() { this.getList() },
  methods: {
    /** 查询用户列表 */
    getList(queryParams) {
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
