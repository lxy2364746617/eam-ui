<template>
  <Wrapper>
    <EquipmentAnalysisSearch />
    <Analysis />
    <div class="figure">
      <div>
        <div class="figure-top">故障率TOP10设备</div>
        <One
          class="figure-one"
          :data="{
            xData: [
              '回柱绞车\nJH-14',
              '电动机\nYX 4002-6P 280KW 6KV',
              '耐磨多级离心泵\nMD280-65x7',
              '电动机\nYX 4002-6P 280KW 6KV',
              '架线式电机车\n2K10-9-550P',
              '提升泵\n150WA180-22-18.5',
              '低压开关柜\nKY-HRKGS-Z-1',
              '多参数测定仪\nCD5',
              '交流电焊机\nBXL-500 380V',
              '电容补偿柜\nCKJ',
            ],
            name: '%',
            series: [5, 6, 10, 12, 13, 14, 16, 18, 19, 20],
            color: 'rgba(255, 191, 120, 1)',
          }"
        ></One>
      </div>
      <div>
        <div class="figure-top">故障次数TOP10设备</div>
        <One
          class="figure-one"
          :data="{
            xData: [
              '回柱绞车\nJH-14',
              '电动机\nYX 4002-6P 280KW 6KV',
              '耐磨多级离心泵\nMD280-65x7',
              '电动机\nYX 4002-6P 280KW 6KV',
              '架线式电机车\n2K10-9-550P',
              '提升泵\n150WA180-22-18.5',
              '低压开关柜\nKY-HRKGS-Z-1',
              '多参数测定仪\nCD5',
              '交流电焊机\nBXL-500 380V',
              '电容补偿柜\nCKJ',
            ],
            name: '次',
            series: [1, 3, 4, 5, 7, 7, 10, 12, 15, 20],
            color: 'rgba(249, 153, 2, 1)',
          }"
        ></One>
      </div>
      <div>
        <div class="figure-top">维修时长TOP10设备</div>

        <One
          class="figure-one"
          :data="{
            xData: [
              '回柱绞车\nJH-14',
              '电动机\nYX 4002-6P 280KW 6KV',
              '耐磨多级离心泵\nMD280-65x7',
              '电动机\nYX 4002-6P 280KW 6KV',
              '架线式电机车\n2K10-9-550P',
              '提升泵\n150WA180-22-18.5',
              '低压开关柜\nKY-HRKGS-Z-1',
              '多参数测定仪\nCD5',
              '交流电焊机\nBXL-500 380V',
              '电容补偿柜\nCKJ',
            ],
            name: 'h',
            series: [1, 2, 4, 5, 7, 24, 28, 30, 40, 45],
            color: '#FF8B66',
          }"
        ></One>
      </div>
      <div>
        <div class="figure-top">停机时长TOP10设备</div>

        <One
          class="figure-one"
          :data="{
            xData: [
              '回柱绞车\nJH-14',
              '电动机\nYX 4002-6P 280KW 6KV',
              '耐磨多级离心泵\nMD280-65x7',
              '电动机\nYX 4002-6P 280KW 6KV',
              '架线式电机车\n2K10-9-550P',
              '提升泵\n150WA180-22-18.5',
              '低压开关柜\nKY-HRKGS-Z-1',
              '多参数测定仪\nCD5',
              '交流电焊机\nBXL-500 380V',
              '电容补偿柜\nCKJ',
            ],
            name: 'h',
            series: [1, 2, 4, 23, 24, 24, 28, 30, 40, 45],
            color: 'rgba(217, 217, 217, 1)',
          }"
        ></One>
      </div>
    </div>
    <ContTable
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="false"
      :handleWidth="230"
      :columns="columns"
      :showOperate="false"
      :rightToolbarShow="false"
    >
      <template slot="headerLeft">
        <!-- <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini"
            >导出</el-button
          >
        </el-col> -->
      </template>
    </ContTable>
  </Wrapper>
</template>
<script>
import EquipmentAnalysisSearch from "@/components/EquipmentAnalysisSearch";
import Wrapper from "@/components/wrapper";
import Analysis from "../analysis";
import One from "../echarts/one";
import ContTable from "@/components/ContTable/index";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
import { getLocationTree } from "@/api/Location";
export default {
  components: {
    EquipmentAnalysisSearch,
    Wrapper,
    Analysis,
    One,
    ContTable,
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
    };
  },
  created() {
    this.getTreeSelect();
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "设备编码",
          prop: "item1",
          tableVisible: true,
        },
        {
          label: "设备名称",
          prop: "item2",
          tableVisible: true,
        },
        {
          label: "规格型号",
          prop: "item3",
          tableVisible: true,
          width: 200,
        },
        {
          label: "设备类别",
          prop: "item4",
          tableVisible: true,
          formType: "selectTree",
          options: this.categoryOptions,
          width: 230,
        },
        {
          label: "功能位置",
          prop: "item5",
          tableVisible: true,
          options: this.locationOptions,
          formType: "selectTree",
          width: 230,
        },
        {
          label: "所属组织",
          prop: "item6",
          formType: "selectTree",
          options: this.deptOptions1,
          width: 180,
        },
        {
          label: "当前使用组织",
          prop: "item7",
          formType: "selectTree",
          options: this.deptOptions1,
          tableVisible: true,
          width: 180,
        },
        {
          label: "设备故障率",
          prop: "item8",
          tableVisible: true,
        },
        {
          label: "故障次数",
          prop: "item9",
          tableVisible: true,
        },
        {
          label: "故障时长(h)",
          prop: "item10",
          tableVisible: true,
        },
        {
          label: "设备停机率",
          prop: "item11",
          tableVisible: true,
        },
        {
          label: "停机次数",
          prop: "item12",
          tableVisible: true,
        },
        {
          label: "停机时长(h)",
          prop: "item13",
          tableVisible: true,
        },
        {
          label: "维修时长(h)",
          prop: "item15",
          tableVisible: true,
        },
        {
          label: "响应时长(h)",
          prop: "item16",
          tableVisible: true,
        },
        {
          label: "设备完好率",
          prop: "item17",
          tableVisible: true,
        },
        {
          label: "设备开机率",
          prop: "item18",
          tableVisible: true,
        },
        {
          label: "故障次数比例",
          prop: "item19",
          tableVisible: true,
        },
        {
          label: "停机时长比例",
          prop: "item20",
          tableVisible: true,
        },
        {
          label: "维修时长比例",
          prop: "item21",
          tableVisible: true,
        },
      ];
    },
  },
  methods: {
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
          item1: "EQ0006763",
          item2: "采煤机",
          item3: "",
          item4: 3,
          item5: "36962e8506a84fb89d2a2b565d0b2267",
          item6: 261,
          item7: 261,
          item8: "6",
          item9: "8.5",
          item10: "23.5%",
          item11: "7",
          item12: "11",
          item13: "3",
          item14: "13",
          item15: "87.4%",
          item16: "76.9%",
          item17: "5.6%",
          item18: "7.3%",
          item19: "12.1%",
          item20: "100%",
          item21: "10%",
        },
      ];

      this.total = this.equipmentList ? this.equipmentList.length : 0;

      this.loading = false;
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
    width: 24.5%;
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

    font-family: "PingFang SC";
    font-size: 16px;
    font-weight: 600;
    padding: 20px 0 0 20px;
  }
  .figure-one {
    height: calc(100% - 41px);
  }
}
</style>
