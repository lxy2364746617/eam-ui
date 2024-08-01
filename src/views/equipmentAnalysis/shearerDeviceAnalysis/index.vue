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
    <div
      style="
        width: 100%;
        height: 1086px;
        display: flex;
        align-items: start;
        justify-content: space-between;
      "
    >
      <ContTable
        :tableData="equipmentList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        :total="total"
        ref="jmtable"
        style="width: 55%"
        :isRadio="false"
        :handleWidth="230"
        :columns="columns"
        :showOperate="false"
        :rightToolbarShow="false"
      >
        <template slot="headerLeft">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-download"
              >开始分析</el-button
            >
            (请选择至多5条数据)
          </el-col>
        </template>
      </ContTable>
      <div
        style="
          width: 44.5%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: space-between;
        "
      >
        <div class="figure-top">对比结果展示</div>
        <div class="down">
          <div>
            <span
              class="figure-top"
              style="
                display: flex;
                align-items: start;
                justify-content: space-between;
              "
            >
              <span>过煤效益比超势分析</span>
              <div style="width: 73px">
                <el-select
                  v-model="order"
                  size="mini"
                  @change="handlerRadioChange"
                >
                  <el-option
                    v-for="item in orderArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >{{ item.label }}</el-option
                  >
                </el-select>
              </div></span
            >
            <ChartLine class="figure-line" :data="rowData"></ChartLine>
          </div>
            <div>
            <span
              class="figure-top"
              style="
                display: flex;
                align-items: start;
                justify-content: space-between;
              "
            >
              <span>过煤电耗比超势分析</span>
              <div style="width: 73px">
                <el-select
                  v-model="order"
                  size="mini"
                  @change="handlerRadioChange"
                >
                  <el-option
                    v-for="item in orderArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >{{ item.label }}</el-option
                  >
                </el-select>
              </div></span
            >
            <ChartLine class="figure-line" :data="rowData"></ChartLine>
          </div>
            <div>
            <span
              class="figure-top"
              style="
                display: flex;
                align-items: start;
                justify-content: space-between;
              "
            >
              <span>单位时长过煤量超势分析</span>
              <div style="width: 73px">
                <el-select
                  v-model="order"
                  size="mini"
                  @change="handlerRadioChange"
                >
                  <el-option
                    v-for="item in orderArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >{{ item.label }}</el-option
                  >
                </el-select>
              </div></span
            >
            <ChartLine class="figure-line" :data="rowData"></ChartLine>
          </div>
        </div>
      </div>
    </div>
  </Wrapper>
</template>
<script>
import EquipmentAnalysisSearch from "@/components/EquipmentAnalysisSearch";
import Wrapper from "@/components/wrapper";
import Analysis from "../analysis";
import One from "../echarts/one";
import ContTable from "@/components/ContTable/index5";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
import { getLocationTree } from "@/api/Location";
import ChartLine from "@/components/HomeEchart/ChartLine2";
export default {
  components: {
    EquipmentAnalysisSearch,
    Wrapper,
    Analysis,
    One,
    ContTable,
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
      rowData: {
        过煤电耗比: [
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2023-09",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2023-10",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2023-11",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2023-12",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-01",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-02",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-03",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 25,
            date: "2024-04",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-05",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-06",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-07",
          },
          {
            maintenanceType: "过煤电耗比",
            count: 0,
            date: "2024-08",
          },
        ],
      },
      order: 1,
      orderArr: [
        { label: "周", value: 1 },
        { label: "月", value: 2 },
        { label: "年", value: 3 },
      ],
    };
  },
  watch: {
    deptOptions1: {
      handler(val) {
        if (val.length) {
          this.getList();
        }
      },
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
          width: 150,
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
          label: "所属组织",
          prop: "item5",
          formType: "selectTree",
          options: this.deptOptions1,
          width: 180,
        },
        {
          label: "运行时长(h)",
          prop: "item6",
          tableVisible: true,
        },
        {
          label: "过煤量(h)",
          prop: "item7",
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
    },
    getList(queryParams) {
      //   this.loading = true;
      this.equipmentList = new Array(20).fill({
        item1: "EQ0006763",
        item2: "采煤机",
        item3: "XX100",
        item4: 3,
        item5: 261,
        item6: 55,
        item7: 3000,
      });

      this.total = 20;

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
  margin-bottom: 20px;
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

  .figure-one {
    height: calc(100% - 41px);
  }
}
.figure-top {
  color: #55566d;
  width: 100%;
  font-family: "PingFang SC";
  font-size: 16px;
  font-weight: 600;
  padding: 20px 20px 0 20px;
}
.down {
  margin-top: 18px;
  height: calc(100% - 58px);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-direction: column;
  > div {
    width: 100%;
    height: 33%;
    border-radius: 10px;
    border: 1.95px solid #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
  }
  .figure-line {
    height: calc(100% - 41px);
  }
}
</style>
