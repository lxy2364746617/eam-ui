<template>
  <div>
    <jm-table
      :tableData="equipmentList"
      @getList="getList"
      :total="total"
      ref="jmtable"
      :handleWidth="230"
      :columns="columns"
      :showOperate="false"
      :showSearch="false"
      :isRadio="true"
    >
      <template slot="headerLeft"> </template>
    </jm-table>
  </div>
</template>

<script>
import JmTable from "@/components/JmTable";
import { getStockInOutList } from "@/api/sparePart/spareInAndOut";
export default {
  dicts: ["spare_parts_unit", "spare_in_type", "spare_out_type"],
  components: {
    JmTable,
  },
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
    spareValue: {
      default: () => {},
      type: Object,
    },
  },
  watch: {},
  computed: {
    columns() {
      return [
        {
          label: "出入库编号",
          prop: "inOutCode",
          span: 22,
          required: true,
          width: 200,
        },
        {
          label: "操作类型",
          prop: "operationType",
          span: 22,
          required: true,
          formType: "select",
          options: this.dict.type.spare_out_type.concat(
            this.dict.type.spare_in_type
          ),
        },

        { label: "数量", prop: "quantity", span: 22 },
        {
          label: "单位",
          prop: "unit",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
        },
        { label: "供应商", prop: "supplierName", span: 22, width: 150 },
        { label: "存储位置", prop: "locationName", span: 22, width: 150 },
        { label: "关联请求", prop: "relatedRequestCode", span: 22, width: 150 },
        { label: "出入库原因", prop: "reason", span: 22, width: 150 },
        { label: "操作人员", prop: "operatorName", span: 22, width: 150 },
        {
          label: "操作时间",
          prop: "createTime",
          span: 22,
          width: 150,
          formType: "date",
        },
      ];
    },
  },
  data() {
    return {
      disabled1: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],

      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList(this.queryParams);
  },
  methods: {
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      queryParams.partCode = this.formData.partCode;
      getStockInOutList(queryParams).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.subtitle {
  background: #ebf4fc;
  line-height: 40px;
  & > .rightbutton {
    margin-right: 20px;
    float: right;
  }
}
</style>
