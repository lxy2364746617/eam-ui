<template>
  <div class="pageStyle">
    <el-card
      class="box-card1"
      shadow="never"
      v-hasPermi="['kdb:faultCase:indexInfo']"
    >
      <div class="header">
        <div class="chart_month">
          <p class="title">月添加案例</p>
          <p class="value_text">
            <span>{{ monthNum }}</span
            >例
          </p>
          <el-divider></el-divider>
          <p class="title">年添加案例</p>
          <p class="value_text">
            <span>{{ yearNum }}</span
            >例
          </p>
        </div>
        <div class="chart">
          <div class="tag">故障分类案例统计</div>
          <div ref="chart" style="width: 100%; height: 90%"></div>
        </div>
        <div class="chart">
          <div class="tag">故障等级案例统计</div>
          <div ref="chart1" style="width: 100%; height: 90%"></div>
        </div>
        <div class="chart">
          <div class="tag">故障名称<i class="clearfix_new">Top5</i></div>
          <div class="content_body">
            <div
              v-for="(item, index) in jszlData.list"
              :key="index"
              class="textItem"
            >
              <span class="title">故障{{ index + 1 }}</span>
              <p>{{ item.name }}</p>
              <span class="clickNo" :style="{ color: item.color }"
                >NO.{{ index + 1 }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <jm-table
        :tableData="templateList"
        v-hasPermi="['kdb:faultCase:list']"
        @getList="getList"
        @linkClick="linkClick"
        :total="total"
        :handleWidth="150"
        :columns="tablecolumns"
        ref="jmTable"
      >
        <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, 'edit')"
            v-hasPermi="['kdb:faultCase:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['kdb:faultCase:remove']"
            >删除</el-button
          >
        </template>
      </jm-table>
    </el-card>
  </div>
</template>

<script>
import {
  faultCaseList,
  faultCaseListDel,
  faultCaseInfo,
  faultCaseType,
  faultCaseLevel,
} from "@/api/knowledge";
import { getWorkOrderSchedule, getWomFaultInfo2 } from "@/api/work/schedule";

import JmTable from "@/components/JmTable1";
import * as echarts from "echarts";
export default {
  dicts: ["fault_grade"],
  name: "faults",
  components: {
    JmTable,
  },
  data() {
    return {
      workActiveList: [
        { orderStatus: "待派工" },
        { orderStatus: "待执行" },
        { orderStatus: "执行中" },
        { orderStatus: "待验收" },
        { orderStatus: "已完成" },
        { orderStatus: "已关闭" },
      ],
      // 月添加案例数
      monthNum: "0",
      // 年添加案例数
      yearNum: "0",
      // 表单头部

      // 表格数据
      templateList: [],
      // 总条数
      total: 0,
      // 遮罩层
      loading: true,
      jszlData: {
        list: [],
      },
      myChart: null,
      myChart1: null,
      option: {
        color: ["#06DEFF", "#0094FF", "#007E96", "#FFA000"],
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          top: "center",
          right: "3%",
        },
        series: [
          {
            left: "15%",
            center: ["30%", "50%"],
            name: "",
            type: "pie",
            radius: ["40%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              // position: 'center',
              formatter(param) {
                // correct the percentage
                return param.percent + "%";
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              { value: 1048, name: "Search" },
              { value: 735, name: "Direct" },
              { value: 535, name: "Engine" },
            ],
          },
        ],
      },
      option1: {
        color: ["#06DEFF", "#0094FF", "#007E96", "#FFA000"],
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          top: "center",
          right: "3%",
        },
        series: [
          {
            left: "15%",
            center: ["30%", "50%"],
            name: "",
            type: "pie",
            radius: ["40%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              // position: 'center',
              formatter(param) {
                // correct the percentage
                return param.percent + "%";
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              { value: 1048, name: "Search" },
              { value: 735, name: "Direct" },
              { value: 535, name: "Engine" },
            ],
          },
        ],
      },
      // 进度
    };
  },
  computed: {
    tablecolumns() {
      return [
        { label: "案例编码", prop: "caseNo", type: "link" },
        { label: "故障代码", prop: "code" },
        { label: "故障名称", prop: "faultName" },
        { label: "故障分类", prop: "type", formType: "select", options: [] },
        { label: "故障设备编码", prop: "deviceCode", type: "link" },
        { label: "设备名称", prop: "deviceName" },
        /* { label: "故障部件(KV)", prop: "location" }, */
        {
          label: "故障等级",
          prop: "faultGrade",
          formType: "select",
          options: this.dict.type.fault_grade,
        },
        { label: "工单编码", prop: "orderCode", type: "link" },
        { label: "故障描述", prop: "faultInfo" },
        { label: "故障原因", prop: "faultReason" },
        { label: "维修措施", prop: "repairInfo" },
        { label: "预防对策", prop: "prevention" },
        { label: "补充说明", prop: "footNote" },
        {
          label: "添加日期",
          prop: "createTime",
          formType: "daterange",
          dateKey: ["beginCreateTime", "endCreateTime"],
          width: 200,
        },
        { label: "添加人", prop: "createBy" },
        {
          label: "更新时间",
          prop: "updateTime",
          formType: "daterange",
          dateKey: ["beginUpdateTime", "endUpdateTime"],
          width: 200,
        },
        { label: "更新人", prop: "updateBy" },
      ];
    },
  },
  created() {
    this.getFaultsType();
  },
  mounted() {
    this.getRouteData();
    this.initChart();
    this.getInfoAll();
  },
  methods: {
    // 获取路由参数
    getRouteData() {
      let routeData = this.$route.query?.data
        ? JSON.parse(this.$route.query.data)
        : null;
      if (routeData) {
        let params = {
          ...routeData,
        };
        this.getList(params);
      } else {
        this.getList();
      }
    },
    initChart() {
      this.myChart = echarts.init(this.$refs.chart);
      this.myChart1 = echarts.init(this.$refs.chart1);
    },
    // 获取表头所有信息
    getInfoAll() {
      faultCaseInfo().then((res) => {
        // console.log(res)
        this.monthNum = res.data.monthAdd;
        this.yearNum = res.data.yearAdd;
        this.option.series[0].data = res.data.faultStatics;
        this.option1.series[0].data = res.data.levelStatics;
        this.jszlData.list = res.data.top5Statics;
        if (this.jszlData.list) {
          let colorArr = ["#FC297D", "#FFB64F", "#007BFE"];
          this.jszlData.list.forEach((item, idx) => {
            if (colorArr[idx]) {
              item.color = colorArr[idx];
            }
          });
        }
        // 渲染图表
        this.myChart.setOption(this.option);
        this.myChart1.setOption(this.option1);
      });
    },
    // 获取故障类型
    getFaultsType() {
      faultCaseType().then((res) => {
        // console.log(res,'故障类型')
        if (res.data) {
          res.data.forEach((item) => {
            item.label = item.dictLabel;
            item.value = item.dictValue;
          });
        }
        this.tablecolumns.forEach((item) => {
          if (item.prop == "type") {
            item.options = res.data;
          }
        });
      });
    },
    // 获取故障等级
    getFaultsLevel() {
      faultCaseLevel().then((res) => {
        this.tablecolumns.forEach((item) => {
          if (item.prop == "level") {
            item.options = res.data;
          }
        });
      });
    },
    // 获取表单数据
    getList(queryParams) {
      this.loading = true;
      faultCaseList(queryParams).then((response) => {
        // console.log(response)
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.ids = selection.map(item => item.largeId)
      // this.single = selection.length !== 1
      // this.multiple = !selection.length
    },
    switchchange(val, prop, row) {
      this.submitForm(row);
    },
    // 点击编辑
    handleUpdate(row) {
      this.$router.push({
        name: "faults_details",
        query: {
          orderCode: row.orderCode,
          deviceCode: row.deviceCode,
          id: row.id,
          caseNo: row.caseNo,
        },
      });
    },
    // 点击删除
    handleDelete(row) {
      // console.log(row)
      this.$confirm("是否确定删除故障名为" + row.faultName + "的数据？").then(
        (res) => {
          faultCaseListDel({ id: row.id }).then((res) => {
            this.getList();
            this.$message({
              message: "操作成功！",
              type: "success",
            });
          });
        }
      );
    },
    async linkClick(row, item) {
      const res = await getWomFaultInfo2({
        deviceCode: row.deviceCode,
        orderCode: row.orderCode,
      });
      console.log("row", row, "item", item, "res", res);
      if (res.code === 200) {
        row["orderName"] = res.data.orderName;
        row["groupId"] = res.data.groupId;
      }
      if (item.label == "故障设备编码") {
        this.$router.push({ name: "bookDetails", query: { i: row.deviceId } });
      } else if (item.label == "工单编码") {
        getWorkOrderSchedule({ orderCode: row.orderCode }).then((res) => {
          row["workActive"] = 0;

          if (
            row.orderType !== "DZWX" &&
            row.orderType !== "JDBWX" &&
            row.orderType !== "WWWX"
          ) {
            this.workActiveList.splice(3, 1);
          }
          this.workActiveList.forEach((item, index) => {
            const matchedItem = res.data.find(
              (val) => val.orderStatus === item.orderStatus
            );

            if (matchedItem) {
              row["workActive"] = index + 1;
              Object.assign(item, matchedItem);
            }
          });

          row["workOrderSchedule"] = this.workActiveList;
          switch (row.orderType + row.orderObj) {
            // ! 巡点捡
            case "RCDJ1":
            case "ZZDJ1":
            case "JMDJ1":
              this.$router.push({
                path: "/work/questAdd7",
                query: { item: row, disabled: true },
              });
              break;
            case "RCDJ2":
            case "ZZDJ2":
            case "JMDJ2":
              this.$router.push({
                path: "/work/questAdd5",
                query: { item: row, disabled: true },
              });
              break;
            // ! 设备维修
            case "DZWX2":
            case "JDBWX2":
              this.$router.push({
                path: "/work/questAdd2",
                query: { item: row, disabled: true },
              });
              console.log("JDBWX2", row);
              break;
            case "WWWX2":
              this.$router.push({
                path: "/work/questAdd3",
                query: { item: row, disabled: true },
              });
              break;
            case "DZWX3":
            case "WWWX3":
            case "JDBWX3":
              this.$router.push({
                path: "/work/questAdd",
                query: { item: row, disabled: true },
              });
              console.log("JDBWX3", row);
              break;
            // ! 定期检验
            case "DQJY2":
              this.$router.push({
                path: "/work/questAdd8",
                query: { item: row, disabled: true },
              });
              break;
            // ! 保养
            case "RCBY1":
            case "YJBY1":
            case "EJBY1":
            case "CGRH1":
              this.$router.push({
                path: "/work/questAdd6",
                query: { item: row, disabled: true },
              });
              break;
            case "RCBY2":
            case "YJBY2":
            case "EJBY2":
            case "CGRH2":
              this.$router.push({
                path: "/work/questAdd4",
                query: { item: row, disabled: true },
              });
              break;
            default:
              break;
          }
        });
        // this.$router.push({path: "/work/questAdd2",query: { item: row, disabled: true },});
      } else if (item.label == "案例编码") {
        this.$router.push({
          name: "faults_details",
          query: {
            orderCode: row.orderCode,
            deviceCode: row.deviceCode,
            id: row.id,
            caseNo: row.caseNo,
          },
        });
      }
    },
  },
  beforeDestroy() {
    if (!this.chart) return;

    this.chart.dispose();

    this.chart = null;
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 337px;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 15px;
  background-color: #f7fbff;
  .chart_month {
    width: 10%;
    min-width: 120px;
    height: 270px;
    background-color: #fff;
    margin: 0 20px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    p {
      margin: 0;
    }
    .title {
      width: 100%;
      display: block;
      text-align: center;
    }
    .value_text {
      width: 100%;
      display: block;
      text-align: center;
      font-weight: bold;
      span {
        font-size: 35px;
        margin-right: 5px;
      }
    }
  }
  .chart {
    width: 30%;
    height: 270px;
    position: relative;
    background-color: #fff;
    margin-right: 20px;
    &::before {
      content: "";
      display: block;
      width: 103.5%;
      height: 10%;
      background: url("../../../assets/images/chart-down.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: -7px;
      bottom: -8%;
      z-index: 2;
    }
    .tag {
      width: 100%;
      height: 38px;
      background: linear-gradient(0deg, #e7f3ff 0%, #e7f3ff 100%),
        url(<path-to-image>), lightgray 0px 0px / 97.436% 100% no-repeat;
      margin: 0;
      padding: 0;
      color: #55566d;
      display: flex;
      justify-content: start;
      align-items: center;
      &::before {
        content: "";
        width: 30px;
        height: 38px;
        margin-left: 10px;
        display: flex;
        background: url("../../../assets/images/tag.png");
      }
      .clearfix_new {
        color: #ff2828;
      }
    }
  }
}

.content_body {
  padding: 10px 15px;
  height: 200px;
  overflow-y: auto;
  .textItem {
    display: flex;
    line-height: 35px;
    justify-content: space-between;
    .title {
      width: 130px;
      margin: 0;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
    .clickNo {
      width: 100px;
      text-align: right;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
    p {
      padding: 0;
      margin: 0;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
  }
}
</style>
