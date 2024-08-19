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
            color: 'rgba(50, 142, 255, 1)',
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
  watch: {
    deptOptions1: {
      handler(val) {
        if (val.length) {
          this.getList();
        }
      },
      deep: true,
    },
    categoryOptions: {
      handler(val) {
        if (val.length) {
          this.getList();
        }
      },
      deep: true,
    },
    locationOptions: {
      handler(val) {
        if (val.length) {
          this.getList();
        }
      },
      deep: true,
    },
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
          label: "维修费用(元)",
          prop: "itemNew",
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
      });
    },
    getList(queryParams) {
      //   this.loading = true;
      this.equipmentList = [
        {
          item1: "EQ0006763",
          item2: "采煤机",
          item3: "XXH100",
          item4: 3,
          item5: "36962e8506a84fb89d2a2b565d0b2267",
          item6: 261,
          item7: 261,
          item8: "6",
          item9: "8.5",
          item10: "23",
          item11: "7",
          item12: "11",
          item13: "3",
          item14: "13",
          item15: "12",
          itemNew: "20031",
          item16: "31",
          item17: "87.4%",
          item18: "77.3%",
          item19: "12.1%",
          item20: "10%",
          item21: "10%",
        },
        {
          item1: "ZSBM-JM03010301G104000529",
          item2: "集合式电容器",
          item3: "YTXF12",
          item4: 443,
          item5: "0097d8ee0d4142838b54b34659508244",
          item6: 163,
          item7: 163,
          item8: "6",
          item9: "9",
          item10: "32",
          item11: "7",
          item12: "11",
          item13: "3",
          item14: "13",
          item15: "27.4",
          itemNew: "41231",
          item16: "46.9",
          item17: "56.6%",
          item18: "76.3%",
          item19: "12.1%",
          item20: "30%",
          item21: "10%",
        },
        {
          item1: "ZSBM-JM03010301G106000232",
          item2: "架线式电机车",
          item3: "HHQ132",
          item4: 69,
          item5: "0097d8ee0d4142838b54b34659508244",
          item6: 163,
          item7: 163,
          item8: "6",
          item9: "4",
          item10: "11",
          item11: "7",
          item12: "11",
          item13: "3",
          item14: "13",
          item15: "12",
          itemNew: "54721",
          item16: "21",
          item17: "55.6%",
          item18: "75.3%",
          item19: "12.1%",
          item20: "12%",
          item21: "10%",
        },
        {
          item1: "ZSBM-JM03010301G104001289",
          item2: "空气炮",
          item3: "ASD12",
          item4: 206,
          item5: "0097d8ee0d4142838b54b34659508244",
          item6: 163,
          item7: 163,
          item8: "3",
          item9: "2",
          item10: "23.5",
          item11: "2",
          item12: "4",
          item13: "2",
          item14: "13",
          item15: "41",
          itemNew: "57482",
          item16: "21",
          item17: "88%",
          item18: "89%",
          item19: "12.1%",
          item20: "12%",
          item21: "13%",
        },
        {
          item1: "ZSBM-JM03010301G106001668",
          item2: "交流弧焊机",
          item3: "XAS111",
          item4: 564,
          item5: "0097d8ee0d4142838b54b34659508244",
          item6: 163,
          item7: 163,
          item8: "6",
          item9: "8.5",
          item10: "12.5",
          item11: "10",
          item12: "8",
          item13: "2",
          item14: "13",
          item15: "7",
          itemNew: "49213",
          item16: "5",
          item17: "86.6%",
          item18: "92.3%",
          item19: "14.1%",
          item20: "11%",
          item21: "11%",
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
