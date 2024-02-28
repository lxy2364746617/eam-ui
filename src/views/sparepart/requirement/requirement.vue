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
import { getAttachmentList } from "@/api/sparePart/requirement";
export default {
  dicts: ["require_type", "wf_process_status"],
  components: {
    ContTable,
  },
  props: {
    isRadio: {
      default: true,
      type: Boolean,
    },
    searchValue: {
      default: [],
      type: Array,
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
    };
  },
  computed: {
    // 列信息
    columns() {
      return [
        {
          label: "备件需求编号",
          prop: "demandCode",
          tableVisible: true,
          width: 150,
        },
        {
          label: "备件需求名称",
          prop: "demandName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "需求类型",
          prop: "demandType",
          tableVisible: true,
          formType: "select",
          options: this.dict.type.require_type,
          width: 150,
        },
        {
          label: "需求数量",
          prop: "demandNum",
          tableVisible: true,
        },
        {
          label: "申报人员",
          prop: "createBy",

          tableVisible: true,
        },

        {
          label: "申报单位",
          prop: "applyDept",
          tableVisible: true,
          width: 200,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "申报日期",
          prop: "createTime",
          tableVisible: true,
          formType: "date",
        },
        {
          label: "审批状态",
          prop: "apvStatus",
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.wf_process_status,
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
      listDept().then((response) => {
        this.deptOptions = response.data;
        this.getList(this.queryParams);
      });
    },

    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      if (this.searchValue && this.searchValue.length > 0) {
        this.searchValue.forEach((item) => {
          queryParams[item.prop] = item.value;
        });
      }
      getAttachmentList(queryParams).then((response) => {
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