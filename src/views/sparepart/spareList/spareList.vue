<template>
  <div class="app-container">
    <ContTable
      :tableData="equipmentList"
      @handleSelectionChange="handleSelectionChange"
      @getList="getList"
      :total="total"
      ref="jmtable"
      :initLoading="false"
      :handleWidth="150"
      :columns="columns"
      :isRadio="isRadio"
    >
    </ContTable>
    <div
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
  </div>
</template>

<script>
import ContTable from "@/components/ContTable";
import { listDept } from "@/api/system/dept";
import { getManagementList } from "@/api/sparePart/sparePartList";
import { getLocationTree } from "@/api/Location";
export default {
  dicts: ["spare_parts_unit", "spare_parts_type"],
  components: {
    ContTable,
  },
  props: {
    isRadio: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      // 选中数组
      ids: [],
      partsCodes: [],
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
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单是否禁用
      disabled: false,

      multiple: true,
      radioRow: {},
      checkBoxRows: [],
      locationOptions: [],
    };
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "备件编码", prop: "partCode", span: 22, required: true },
        { label: "备件名称", prop: "partName", span: 22, required: true },
        {
          label: "备件类别",
          prop: "partType",
          span: 22,
          required: true,
          formType: "select",
          options: this.dict.type.spare_parts_type,
        },
        { label: "规格型号", prop: "sModel", span: 22, width: 150 },

        {
          label: "默认供应商",
          prop: "supplierName",
          readonly: true,
          clickFn: () => {
            this.drawersupplier = true;
          },
          span: 22,
          width: 280,
        },
        { label: "当前库存", prop: "inventory", span: 22, formType: "number" },
        {
          label: "单位",
          prop: "unit",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
        },
        {
          label: "默认存储位置",
          prop: "locationCode",
          span: 22,
          width: 150,
          options: this.locationOptions,
          formType: "selectTree",
        },
        {
          label: "所属组织",
          prop: "affDept",
          span: 22,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
          required: true,
        },
        {
          label: "预计使用时间",
          prop: "useDate",
          span: 22,
          formType: "date",
        },
        {
          label: "使用场景说明",
          prop: "scene",
          formType: "textarea",
          rows: 4,
          span: 22,
          width: 200,
        },
      ];
    },
  },
  created() {
    this.getTreeSelect();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submitRadio() {
      if (this.isRadio) {
        // 单选
        this.$emit("submitRadio", this.radioRow);
      } else {
        // 多选
        this.$emit("submitRadio", this.checkBoxRows);
      }
    },
    getTreeSelect() {
      getLocationTree().then((res) => {
        this.locationOptions = this.getTree(res.data);
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
        this.getList(this.queryParams);
      });
    },
    getTree(arr) {
      arr.forEach((item) => {
        item.id = item.deptCode;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTree(item.children);
        }
      });
      return arr;
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      getManagementList(queryParams).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.partsCodes = selection.map((item) => item.partsCode);
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.checkBoxRows = selection;
    },
  },
};
</script>

<style lang='scss' scoped>
.form-footer {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
</style>