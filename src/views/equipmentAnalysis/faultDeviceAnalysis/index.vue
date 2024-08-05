<template>
  <Wrapper>
    <EquipmentAnalysisSearch />
    <Analysis />
    <div class="figure">
      <div>
        <div class="figure-top">故障类别分布</div>
        <Three
          class="figure-one"
          :data="{
            xData: [
              '电器故障',
              '配件故障',
              '机械故障',
              '控制系统故障',
              '动力系统故障',
              '安全系统故障',
            ],
            name: '%',
            series: [5, 6, 10, 12, 13, 14],
            color: 'rgba(255, 191, 120, 1)',
          }"
        ></Three>
      </div>
      <div>
        <div class="figure-top">故障次数分布</div>
        <Bar4
          class="figure-one"
          :data="{
            stateList: [
              {
                电气故障: 17,
              },
              {
                配件故障: 27,
              },
              {
                机械故障: 14,
              },
              {
                控制系统故障: 20,
              },
              { 动力系统故障: 5 },
              { 安全系统故障: 12 },
            ],
            label: '故障次数',
            total: 95,
          }"
        ></Bar4>
      </div>
      <div>
        <div class="figure-top">维修时长分布</div>

        <Bar4
          class="figure-one"
          :data="{
            stateList: [
              {
                电气故障: 17,
              },
              {
                配件故障: 27,
              },
              {
                机械故障: 14,
              },
              {
                控制系统故障: 20,
              },
              { 动力系统故障: 5 },
              { 安全系统故障: 12 },
            ],
            label: '维修时长',
            total: 95,
          }"
        ></Bar4>
      </div>
      <div>
        <div class="figure-top">停机时长分布</div>

        <Bar4
          class="figure-one"
          :data="{
            stateList: [
              {
                电气故障: 17,
              },
              {
                配件故障: 27,
              },
              {
                机械故障: 14,
              },
              {
                控制系统故障: 20,
              },
              { 动力系统故障: 5 },
              { 安全系统故障: 12 },
            ],
            label: '停机时长',
            total: 95,
          }"
        ></Bar4>
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
    this.getList();
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "故障代码",
          prop: "item1",
          tableVisible: true,
        },
        {
          label: "故障名称",
          prop: "item2",
          tableVisible: true,
        },
        {
          label: "故障次数",
          prop: "item3",
          tableVisible: true,
        },
        {
          label: "维修时长(h)",
          prop: "item4",
          tableVisible: true,
        },
        {
          label: "停机时长(h)",
          prop: "item5",
          tableVisible: true,
        },
        {
          label: "故障次数比例",
          prop: "item6",
          tableVisible: true,
        },
        {
          label: "维修时长比例",
          prop: "item7",
          tableVisible: true,
        },
        {
          label: "停机时长比例",
          prop: "item8",
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
    generateRandomString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    },
    generateRandomNumber(length) {
      const firstCharacter = "123456789"; // 只包含1-9
      const otherCharacters = "0123456789"; // 包含0-9
      let result = "";

      // 生成第一个字符
      result += firstCharacter.charAt(
        Math.floor(Math.random() * firstCharacter.length)
      );

      // 生成剩余的字符
      for (let i = 1; i < length; i++) {
        // 从1开始循环
        result += otherCharacters.charAt(
          Math.floor(Math.random() * otherCharacters.length)
        );
      }

      return result;
    },
    getList(queryParams) {
      //   this.loading = true;
      this.equipmentList = [
        {
          item1: "GZ001",
          item2: "主机温度故障",
          item3: "机械故障",
          item4: 305,
          item5: 310,
          item6: "13.7%",
          item7: "12.1%",
          item8: "15.6%",
        },
        {
          item1: "GZ002",
          item2: "转子不平衡",
          item3: "机械故障",
          item4: 100,
          item5: 120,
          item6: "12.7%",
          item7: "15.1%",
          item8: "11.6%",
        },
        {
          item1: "GZ003",
          item2: "压力异常",
          item3: "电器故障",
          item4: 24,
          item5: 30,
          item6: "11.7%",
          item7: "5.1%",
          item8: "7.6%",
        },
        {
          item1: "GZ004",
          item2: "压力异常",
          item3: "电器故障",
          item4: 50,
          item5: 55,
          item6: "14.7%",
          item7: "9.1%",
          item8: "8.6%",
        },
        {
          item1: "GZ005",
          item2: "主机温度故障",
          item3: "机械故障",
          item4: 40,
          item5: 52,
          item6: "11%",
          item7: "6.1%",
          item8: "7.6%",
        },
        {
          item1: "GZ006",
          item2: "主机温度故障",
          item3: "机械故障",
          item4: 66,
          item5: 71,
          item6: "12%",
          item7: "11%",
          item8: "10%",
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
