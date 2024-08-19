<template>
  <Wrapper>
    <EquipmentAnalysisSearch :formData="{ categoryId: 3 }" />
    <Analysis />
    <div class="figure">
      <div>
        <div class="figure-top">采煤机运行时长TOP6-10</div>
        <Three
          class="figure-one"
          :data="{
            xData: [
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),

              '采煤机\n' + generateRandomString(5),
            ],
            name: 'H',
            series: [
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
            ],
            color: 'rgba(255, 191, 120, 1)',
          }"
        ></Three>
      </div>
      <div>
        <div class="figure-top">采煤机过煤量TOP6-10</div>
        <Three
          class="figure-one"
          :data="{
            xData: [
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
            ],
            name: '',
            series: [
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
            ],
            color: 'rgba(249, 153, 2, 1)',
          }"
        ></Three>
      </div>
      <div>
        <div class="figure-top">采煤机用电量TOP6-10</div>

        <Three
          class="figure-one"
          :data="{
            xData: [
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
            ],
            name: 'KWh',
            series: [
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
            ],
            color: '#FF8B66',
          }"
        ></Three>
      </div>
      <div>
        <div class="figure-top">采煤机价格最高TOP6-10</div>

        <Three
          class="figure-one"
          :data="{
            xData: [
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
              '采煤机\n' + generateRandomString(5),
            ],
            name: 'W',
            series: [
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
              generateRandomNumber(3),
            ],
            color: 'rgba(50, 142, 255, 1)',
          }"
        ></Three>
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
              <span>过煤效益比趋势分析</span>
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
              <span>过煤电耗比趋势分析</span>
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
            <ChartLine class="figure-line" :data="rowData2"></ChartLine>
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
              <span>单位时长过煤量趋势分析</span>
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
            <ChartLine class="figure-line" :data="rowData3"></ChartLine>
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
import Three from "../echarts/three";
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
    Three,
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
        过煤效益比: [
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2023-09",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2023-10",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2023-11",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2023-12",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-01",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-02",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-03",
          },
          {
            maintenanceType: "过煤效益比",
            count: 25,
            date: "2024-04",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-05",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-06",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-07",
          },
          {
            maintenanceType: "过煤效益比",
            count: 0,
            date: "2024-08",
          },
        ],
      },
      rowData2: {
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
      rowData3: {
        单位时长过煤量: [
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2023-09",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2023-10",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2023-11",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2023-12",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2024-01",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2024-02",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2024-03",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 25,
            date: "2024-04",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2024-05",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2024-06",
          },
          {
            maintenanceType: "单位时长过煤量",
            count: 0,
            date: "2024-07",
          },
          {
            maintenanceType: "单位时长过煤量",
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
      this.equipmentList = new Array(20).fill(1).map((item) => ({
        item1: this.generateRandomString(6),
        item2: "采煤机" + this.generateRandomString(3),
        item3: this.generateRandomString(5),
        item4: 3,
        item5: 261,
        item6: this.generateRandomNumber(2),
        item7: this.generateRandomNumber(4),
      }));

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
