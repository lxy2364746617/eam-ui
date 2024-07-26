<template>
  <div class="app-container">
    <jm-table :key="key" :tableData="equipmentList" @getList="getList" :total="total" ref="jmtable" :isRadio="true" :handleWidth="230" :columns="columns">
      <template #end_handle="scope" >
        <el-button size="mini" type="text" icon="el-icon-view"  @click="handleUpdate(scope.row,'view')" >
        详情</el-button>
      </template>
    </jm-table>
  </div>
</template>

<script>
import JmTable from "@/components/JmTable";
import { batchList } from "@/api/flowable/process";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { getLocationTree } from "@/api/Location";
export default {
  dicts: [
    "em_device_state",
    "em_device_att",
    "wf_process_status",
    "em_device_level",
    "process_category",
  ],
  components: {
    JmTable,
  },
  props:{
    batchId:{
      default:'',
      type:String
    }
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "设备编码", prop: "deviceCode" },
        { label: "设备名称", prop: "deviceName" },
        { label: "规格型号", prop: "specs" },
        {
          label: "设备类别",
          prop: "categoryId",
          formType: "selectTree",
          options: this.categoryOptions,
          width: 280,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.statesArr,
        },
        { label: "财务资产编码", prop: "propertyCode" },
        { label: "自选设备编码", prop: "freeDeviceCode" },
        {
          label: "功能位置",
          prop: "location",
          options: this.locationOptions,
          formType: "selectTree",
          width: 230,
        },
        {
          label: "重要等级",
          prop: "level",
          formType: "select",
          options: this.dict.type.em_device_level,
        }, //(A、B、C)
        { label: "所属子公司", prop: "subCompanyName" },
        {
          label: "所属组织",
          prop: "affDeptId",
          formType: "selectTree",
          options: this.deptOptions1,
          width: 180,
        },
        {
          label: "当前使用组织",
          prop: "currDeptId",
          formType: "selectTree",
          options: this.deptOptions1,
          width: 180,
        },
        {
          label: "入账日期",
          prop: "makerAoTime",
          formType: "daterange",
          width: 200,
        },
        {
          label: "设备属性",
          prop: "deviceAtt",
          formType: "select",
          options: this.dict.type.em_device_att,
        }, //(1 设备、2 部件)
        { label: "上级设备", prop: "parentDeviceName" }, //(0 父级)
        {
          label: "审批状态",
          prop: "processStatus",
          formType: "selectTag",
          options: this.dict.type.wf_process_status,
        },
      ];
    },
  },
  data() {
    return {
      equipmentList: [],
      total: 0,
      key: 0,
      deptOptions1: [],
      categoryOptions: [],
      locationOptions: [],
      valueMap: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  watch: {
    "dict.type.em_device_state": {
      handler(val) {
        this.statesArr =
          val &&
          JSON.parse(JSON.stringify(val)).filter((item) => {
            return item.label != "已报废";
          });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getTree();
    this.getTreeSelect();
    this.getList();
  },
  methods: {
    getList(queryParams={}) {
      console.log(queryParams)
      if(this.batchId) {queryParams.deviceCode = this.batchId}
      batchList({...this.$route.query,pageSize:10,pageNum:1,...queryParams} ).then((res) => {
        this.equipmentList = res.rows;
        this.total = res.total
        this.key++;
      }).catch(
        res=>{
          this.equipmentList =[]
        }
      );
    },
    getTree() {
      equipmentTreeNoTemplate().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
        this.key++;
      });
      getLocationTree().then((res) => {
        this.locationOptions = this.getTreeName(res.data);
        this.key++;
      });
    },
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
    getTreeName(arr) {
      arr.forEach((item) => {
        item.value = item.deptId;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTreeName(item.children);
        }
      });
      return arr;
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      getPrtOrgTreeByDeptId().then((response) => {
        this.deptOptions1 = response.data;
        this.key++;
      });
    },
    handleUpdate(row){
      this.$router.push({ path: '/device/book/details?i=' + row.deviceId + '&t=' + row.deviceName+'&isReadonly=true'})
    }
  },
};
</script>

<style>
</style>