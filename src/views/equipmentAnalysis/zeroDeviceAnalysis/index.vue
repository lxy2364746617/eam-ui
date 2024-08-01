<template>
  <Wrapper>
    <EquipmentAnalysisSearch />
    <Analysis />
    <div class="figure">
      <div style="width: 30%">
        <div class="figure-top">设备零整比分布</div>
        <Bar4
          class="figure-one"
          :data="{
            stateList: [
              {
                '0-20%': 33,
              },
              {
                '20-40%': 21,
              },
              { '30-40%': 12 },
              {
                '40-60%': 12,
              },
              {
                '60-80%': 12,
              },
              {
                '80-100%': 12,
              },
            ],
            total: 102,
            label: '总数量',
          }"
        ></Bar4>
      </div>

      <div style="width: 69.5%">
        <div class="figure-top">设备零整比TOP10</div>

        <Three
          class="figure-one"
          :data="{
            xData: [
              '按液压支架',
              '刮板输送机',
              '转载机',
              '破碎机',
              '采煤机',
              '掘进机',
              '回柱绞车',
              '耐磨多级离心泵',
              '电容补偿柜',
              '提升泵',
            ],
            series: [1, 2, 4, 23, 21, 22, 24, 21, 14, 14],
            color: 'rgba(50, 142, 255, 1)',
            name: '%',
          }"
        ></Three>
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
import Three from "../echarts/three";
import ContTable from "@/components/ContTable/index";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
import { getLocationTree } from "@/api/Location";
import Bar4 from "@/components/HomeEchart/Bar4";
export default {
  components: {
    EquipmentAnalysisSearch,
    Wrapper,
    Analysis,
    Three,
    ContTable,
    Bar4,
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
        { label: "设备零整比", prop: "item8" },
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
      let res = [
        "按液压支架",
        "刮板输送机",
        "转载机",
        "破碎机",
        "采煤机",
        "掘进机",
        "回柱绞车",
        "耐磨多级离心泵",
        "电容补偿柜",
        "提升泵",
      ].map((item) => ({
        item1: "EQ0006763",
        item2: item,
        item3: "XX100",
        item4: 3,
        item5: "36962e8506a84fb89d2a2b565d0b2267",
        item6: 261,
        item7: 261,
        item8: "32%",
      }));
      this.equipmentList = [1, 2, 4, 23, 21, 22, 24, 21, 14, 14].map(
        (item, index) => ({
          ...res[index],
          item8: item + "%",
        })
      );

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
