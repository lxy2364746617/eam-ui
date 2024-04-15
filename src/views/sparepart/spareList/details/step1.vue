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
import { getStockInOutCondition } from "@/api/sparePart/sparePartList";
import { getLocationTree } from "@/api/Location";
export default {
  dicts: ["spare_parts_unit"],
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
          label: "供应商编码",
          prop: "supplierCode",
          width: 150,
        },
        {
          label: "供应商名称",
          prop: "supplierName",
          width: 150,
        },
        {
          label: "存储位置",
          prop: "locationCode",
          width: 230,
          options: this.locationOptions,
          formType: "selectTree",
        },
        {
          label: "库存数量",
          prop: "inventory",
          width: 150,
        },
        {
          label: "单位",
          prop: "unit",
          formType: "select",
          options: this.dict.type.spare_parts_unit,
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
      locationOptions: [],
    };
  },
  created() {
    this.getTreeSelect();
  },
  methods: {
    getTreeSelect() {
      getLocationTree().then(async (res) => {
        this.locationOptions = await this.getTree(res.data);
        this.getList(this.formData.id);
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
      getStockInOutCondition(this.formData.partCode).then((response) => {
        this.equipmentList = response.data.filter(
          (item) => item.inventory !== 0
        );
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
