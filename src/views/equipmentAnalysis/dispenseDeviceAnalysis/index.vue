<template>
  <Wrapper>
    <EquipmentAnalysisSearch />
    <Analysis />
    <div class="figure">
      <div style="width: 30%">
        <div class="figure-top">设备采购需求分析</div>
        <Bar3
          class="figure-one"
          :data="{
            stateList: [
              {
                年度采购: 300,
              },
              {
                临时采购: 120,
              },
            ],
            total: 420,
          }"
        ></Bar3>
      </div>

      <div style="width: 69.5%">
        <div class="figure-top">主要设备需求可调剂分析</div>

        <Two
          class="figure-one"
          :data="{
            xData: [
              '按液压支架',
              '刮板输送机',
              '转载机',
              '破碎机',
              '采煤机',
              '掘进机',
              '其他',
            ],
            series1: [1, 2, 4, 23, 21, 22, 24],
            color1: 'rgba(50, 142, 255, 1)',
            series2: [12, 22, 14, 23, 24, 24, 28],
            color2: 'rgba(249, 153, 2, 1)',
          }"
        ></Two>
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
import Two from "../echarts/two";
import ContTable from "@/components/ContTable/index";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
import { getLocationTree } from "@/api/Location";
import Bar3 from "@/components/HomeEchart/Bar3";
export default {
  components: {
    EquipmentAnalysisSearch,
    Wrapper,
    Analysis,
    Two,
    ContTable,
    Bar3,
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
          label: "技术参数",
          prop: "item5",
          tableVisible: true,
        },
        {
          label: "需求日期",
          prop: "item6",
        },
        {
          label: "需求数量",
          prop: "item7",
        },
        {
          label: "需求组织",
          prop: "item8",
          formType: "selectTree",
          options: this.deptOptions1,
          width: 180,
        },
        {
          label: "入库数量",
          prop: "item9",
        },
        {
          label: "购置计划编号",
          prop: "item10",
        },
        {
          label: "行号",
          prop: "item11",
        },
        {
          label: "购置计划名称",
          prop: "item12",
        },
        {
          label: "计划类型",
          prop: "item13",
        },
        {
          label: "可调剂设备数量",
          prop: "item14",
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
          item5: "3000",
          item6: "2024-1-16",
          item7: 3,
          item8: 261,
          item9: "0",
          item10: "NC1150205020124050001",
          item11: "1",
          item12: "年度计划2024-1",
          item13: "年度采购",
          item14: "6",
        },
        {
          item1: "EQ0006763",
          item2: "采煤机",
          item3: "",
          item4: 3,
          item5: "3000",
          item6: "2024-1-16",
          item7: 3,
          item8: 261,
          item9: "1",
          item10: "NC1150205020124050001",
          item11: "2",
          item12: "年度计划2024-1",
          item13: "临时采购",
          item14: "2",
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
    padding: 20px 0 0 20px;
  }
  .figure-one {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>
