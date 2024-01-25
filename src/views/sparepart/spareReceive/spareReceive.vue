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
import { getAttachmentList } from "@/api/sparePart/spareReceive";
export default {
  dicts: ["require_type"],
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
          label: "备件领用单号",
          prop: "receiptCode",
          tableVisible: true,
          width: 150,
        },
        {
          label: "备件领用单名称",
          prop: "receiptName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "领用人员",
          prop: "recruiterName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "领用日期",
          prop: "receiptDate",
          formType: "date",
          tableVisible: true,
        },
        {
          label: "请求时间",
          prop: "createTime",
          formType: "date",
          tableVisible: true,
        },

        { label: "备注", prop: "remark", tableVisible: true, width: 200 },
        { label: "审批状态", prop: "approvalStatus", tableVisible: true },
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