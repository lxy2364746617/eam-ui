<template>
  <Wrapper>
    <EquipmentAnalysisSearch />
    <Analysis />
    <div class="figure">
      <div>
        <div class="figure-top">
          <span>月度故障趋势</span>
          <div style="width: 150px">
            <el-select v-model="order" size="mini" @change="handlerRadioChange">
              <el-option
                v-for="item in orderArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-option
              >
            </el-select>
          </div>
        </div>
        <ChartLine class="figure-one" :data="rowData" />
      </div>
    </div>
    <JmTable
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="true"
      :handleWidth="230"
      :columns="columns"
      :showOperate="false"
      :rightToolbarShow="false"
      :isIndex="false"
      :showSearch="false"
    >
      <template slot="headerLeft">
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini"
            >导出</el-button
          >
        </el-col> -->
      </template>
    </JmTable>
  </Wrapper>
</template>
<script>
import EquipmentAnalysisSearch from "@/components/EquipmentAnalysisSearch";
import Wrapper from "@/components/wrapper";
import Analysis from "../analysis";
import One from "../echarts/one";
import JmTable from "@/components/JmTable/index";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
import { getLocationTree } from "@/api/Location";
import ChartLine from "@/components/HomeEchart/ChartLine.vue";
export default {
  components: {
    EquipmentAnalysisSearch,
    Wrapper,
    Analysis,
    One,
    JmTable,
    ChartLine,
  },
  data() {
    return {
      equipmentList: [],
      total: 0,
      loading: true,
      activeName: "0",
      deptOptions1: [],
      locationOptions: [],
      categoryOptions: [],
      orderArr: [],
      order: "",
      rowData: {
        故障次数: [
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2023-09",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2023-10",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2023-11",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2023-12",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-01",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-02",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-03",
          },
          {
            maintenanceType: "故障次数",
            count: 25,
            date: "2024-04",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-05",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-06",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-07",
          },
          {
            maintenanceType: "故障次数",
            count: 0,
            date: "2024-08",
          },
        ],
        "故障时长(h)": [
          { maintenanceType: "故障时长(h)", count: 0, date: "2023-09" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2023-10" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2023-11" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2023-12" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-01" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-02" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-03" },
          { maintenanceType: "故障时长(h)", count: 10, date: "2024-04" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-05" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-06" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-07" },
          { maintenanceType: "故障时长(h)", count: 0, date: "2024-08" },
        ],
        "停机时长(h)": [
          { maintenanceType: "停机时长(h)", count: 0, date: "2023-09" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2023-10" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2023-11" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2023-12" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2024-01" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2024-02" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2024-03" },
          { maintenanceType: "停机时长(h)", count: 33, date: "2024-04" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2024-05" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2024-06" },
          { maintenanceType: "停机时长(h)", count: 3, date: "2024-07" },
          { maintenanceType: "停机时长(h)", count: 0, date: "2024-08" },
        ],
        设备故障率: [
          { maintenanceType: "设备故障率", count: 0, date: "2023-09" },
          { maintenanceType: "设备故障率", count: 0, date: "2023-10" },
          { maintenanceType: "设备故障率", count: 0, date: "2023-11" },
          { maintenanceType: "设备故障率", count: 0, date: "2023-12" },
          { maintenanceType: "设备故障率", count: 0, date: "2024-01" },
          { maintenanceType: "设备故障率", count: 0, date: "2024-02" },
          { maintenanceType: "设备故障率", count: 0, date: "2024-03" },
          { maintenanceType: "设备故障率", count: 40, date: "2024-04" },
          { maintenanceType: "设备故障率", count: 1, date: "2024-05" },
          { maintenanceType: "设备故障率", count: 1, date: "2024-06" },
          { maintenanceType: "设备故障率", count: 0, date: "2024-07" },
          { maintenanceType: "设备故障率", count: 0, date: "2024-08" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "指标",
          prop: "label",
          tableVisible: true,
        },
        {
          label: "一月",
          prop: "item2",
          tableVisible: true,
        },
        {
          label: "二月",
          prop: "item3",
          tableVisible: true,
        },
        {
          label: "三月",
          prop: "item4",
          tableVisible: true,
        },
        {
          label: "四月",
          prop: "item5",
          tableVisible: true,
        },
        {
          label: "五月",
          prop: "item6",
          tableVisible: true,
        },
        {
          label: "六月",
          prop: "item7",
          tableVisible: true,
        },
        {
          label: "七月",
          prop: "item8",
          tableVisible: true,
        },
        {
          label: "八月",
          prop: "item9",
          tableVisible: true,
        },
        {
          label: "九月",
          prop: "item10",
          tableVisible: true,
        },
        {
          label: "十月",
          prop: "item11",
          tableVisible: true,
        },
        {
          label: "十一月",
          prop: "item12",
          tableVisible: true,
        },
        {
          label: "十二月",
          prop: "item13",
          tableVisible: true,
        },
        {
          label: "总计",
          prop: "item14",
          tableVisible: true,
        },
      ];
    },
  },
  methods: {
    handlerRadioChange() {},
    getTreeSelect() {
      equipmentTreeNoTemplate().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
      });
      getPrtOrgTreeByDeptId().then((response) => {
        this.deptOptions1 = response.data;
      });
      getLocationTree().then((res) => {
        this.locationOptions = this.getTreeName(res.data);
        this.getList();
      });
    },
    getList(queryParams) {
      //   this.loading = true;
      this.equipmentList = [
        {
          label: "故障次数",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "停机次数",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "故障时长(h)",

          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "停机时长(h)",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "响应时长(h)",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "维修时长(h)",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "设备故障率",
          item2: "4.5%",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "设备完好率",
          item2: "95.5%",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "设备停机率",
          item2: "3%",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "设备开机率",
          item2: "97%",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
        {
          label: "转单次数",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: "",
          item11: "",
          item12: "",
          item13: "",
          item14: "-",
        },
      ];

      this.total = 0;

      this.loading = false;
      this.orderArr = this.equipmentList.map((item) => ({
        label: item.label,
        value: item.label,
      }));
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
    handleSelectionChange() {},
  },
};
</script>
<style lang='scss' scoped>
.figure {
  height: 380px;
  display: flex;
  justify-content: space-between;
  > div {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 1.95px solid #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
  }
  .figure-top {
    color: #55566d;
    width: 100%;
    font-family: "PingFang SC";
    font-size: 16px;
    font-weight: 600;
    padding: 20px 20px 0 20px;
    display: flex;
    justify-content: space-between;
  }
  .figure-one {
    height: calc(100% - 41px);
  }
}
</style>
