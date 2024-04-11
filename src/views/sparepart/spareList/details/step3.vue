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
import { getReplaceRecord } from "@/api/sparePart/sparePartList";
import { equipmentTree } from "@/api/equipment/category";
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
        { label: "设备编码", prop: "deviceCode", width: 200 },
        { label: "设备名称", prop: "deviceName", width: 200 },
        {
          label: "设备类别",
          prop: "deviceType",
          formType: "selectTree",
          options: this.categoryOptions,
          width: 240,
        },
        {
          label: "工单编码",
          prop: "orderCode",
          tableVisible: true,
          width: 200,
        },
        {
          label: "工单名称",
          prop: "orderName",
          tableVisible: true,
          width: 200,
        },
        { label: "使用部位", prop: "location", required: true, span: 22 },
        { label: "更换数量", prop: "sl" },
        {
          label: "单位",
          prop: "unit",
          formType: "select",
          options: this.dict.type.spare_parts_unit,
        },
        { label: "更换时间", prop: "sj", formType: "date", width: 150 },
      ];
    },
  },
  data() {
    return {
      categoryOptions: [],
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
    this.getTree();
  },
  methods: {
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    /** 查询设备档案下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.getList(this.queryParams);
        this.loops(this.categoryOptions);
      });
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      queryParams.partCode = this.formData.partCode;
      getReplaceRecord(queryParams).then((response) => {
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
