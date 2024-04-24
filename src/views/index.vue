<template>
  <div class="home">
    <wc-waterfall :gap="10" :cols="3">
      <div class="border" style="height: 300px; width: 630px; padding: 0">
        <div class="user">
          <div>
            <div style="display: flex; justify-content: space-between">
              <div>
                <div>
                  <div>{{ $store.state.user.standing.nickName }}，你好！</div>
                  <span>今天是元气满满的一天！</span>
                </div>
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <div class="user-avatar">
                    <img :src="avatar" />
                  </div>
                  <div class="user-bottom">
                    <div>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$store.state.user.standing.nickName"
                        placement="top-start"
                      >
                        <b class="user-name">{{
                          $store.state.user.standing.nickName
                        }}</b>
                      </el-tooltip>

                      <span>{{
                        $store.state.user.standing.dept
                          ? $store.state.user.standing.dept.deptName
                          : ""
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  :style="{
                    backgroundImage: `url(${img})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundSize: '100% 100%',
                    width: '238px',
                    height: '240px',
                    transform: 'translateY(-50px)',
                  }"
                ></div>
                <div class="user-bottom2">
                  <ul>
                    <li>
                      <p>{{ orderCount ? orderCount : "0" }}</p>
                      <span>工单代办</span>
                    </li>
                    <li>
                      <p>{{ todoCount ? todoCount : "0" }}</p>
                      <span>流程代办</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border" style="height: 300px">
        <div class="border-title">
          <span>设备状态</span>
        </div>
        <div style="height: 100%; width: 85%">
          <Bar v-if="flag" :data="{ ...chartData, title: '设备' }"></Bar>
        </div>
      </div>
      <div class="border" style="height: 300px; width: 617px">
        <div class="border-title">常用功能导航</div>
        <div class="use">
          <ul v-if="commonNavigation.length > 0">
            <li
              v-for="item in commonNavigation"
              :key="item.name"
              @click="
                () => {
                  $router.push({ name: item.name });
                }
              "
            >
              <div
                :style="{
                  backgroundImage: `url(${useIcon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  width: '87px',
                  height: '68px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                }"
              >
                <svg-icon
                  style="
                    color: #226efc;
                    font-size: 18px;
                    transform: translateY(-9px);
                  "
                  :icon-class="item.icon"
                />
              </div>
              <span style="font-size: 14px">{{ item.title }}</span>
            </li>
          </ul>
          <div class="no-information" v-else>
            <div
              :style="{
                backgroundImage: `url(${not})`,
                width: '82px',
                height: '82px',
              }"
            ></div>
            <span>暂无常用功能导航</span>
          </div>
        </div>
      </div>
      <div class="border" style="height: 655px; width: 617px">
        <div class="border-title">
          <span>我的工单代办</span>
          <!-- <span>我的代办</span> -->
          <!-- <div>
            <el-radio-group v-model="radio" size="mini">
              <el-radio-button
                v-for="item in radioArr"
                :key="item"
                :label="item"
              ></el-radio-button>
            </el-radio-group>
          </div> -->
        </div>
        <div class="charge">
          <!-- <ContTable
            v-for="(item, index) in radioArr"
            v-show="radio === item"
            :key="item"
            :tableData="
              getTableDataBy('equipmentList' + (index + 1), item, radio)
            "
            @getList="getTableDataBy('getList' + (index + 1))"
            :total="getTableDataBy('total' + (index + 1))"
            ref="contTable"
            :handleWidth="100"
            :columns="getTableDataBy('columns' + (index + 1))"
            :showOperate="false"
            :showSearch="false"
            :rightToolbarShow="false"
            @linkClick="linkClick"
          >
          </ContTable> -->
          <ContTable
            :tableData="getTableDataBy('equipmentList' + 1)"
            @getList="getList1"
            :total="getTableDataBy('total' + 1)"
            ref="contTable"
            :handleWidth="100"
            :columns="getTableDataBy('columns' + 1)"
            :showOperate="false"
            :showSearch="false"
            :rightToolbarShow="false"
            @linkClick="linkClick"
          >
          </ContTable>
        </div>
      </div>
      <div class="border" style="height: 655px">
        <div class="border-title">
          <span>工单总览</span>
          <div>
            <el-radio-group
              v-model="order"
              size="mini"
              @change="handlerRadioChange"
            >
              <el-radio-button
                v-for="item in orderArr"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </div>
        </div>
        <div class="work-order">
          <div style="height: 48%; width: 85%; margin-bottom: 20px">
            <Bar2
              v-if="flagOrder2"
              :data="{ ...womStatusCount, title: '工单' }"
            ></Bar2>
          </div>

          <div style="height: 48%; width: 100%">
            <ChartLine v-if="flagOrder1" :data="womTypeList" />
          </div>
        </div>
      </div>
      <div class="border" style="height: 655px; width: 617px">
        <div class="border-title">
          <span>我的流程代办</span>
        </div>
        <div class="charge">
          <ContTable
            :tableData="getTableDataBy('equipmentList' + 2)"
            @getList="getList2"
            :total="getTableDataBy('total' + 2)"
            ref="contTable"
            :handleWidth="100"
            :columns="getTableDataBy('columns' + 2)"
            :showOperate="false"
            :showSearch="false"
            :rightToolbarShow="false"
            @linkClick="linkClick"
          >
          </ContTable>
        </div>
      </div>

      <div class="border" style="height: 315px; width: 617px">
        <div class="border-title">
          <span>系统公告</span>
        </div>
        <ul class="system" v-if="noticeList">
          <li
            v-for="item in noticeList"
            :key="item.createTime"
            @click="handleView(item)"
          >
            <el-tooltip :content="item.noticeTitle" placement="top">
              <span
                style="font-family: 'DINPro-Medium'"
                class="single-line-ellipsis"
                >{{ item.noticeTitle }}</span
              >
            </el-tooltip>
            <el-tooltip :content="item.createTime" placement="top">
              <span class="single-line-data">{{ item.createTime }}</span>
            </el-tooltip>
          </li>
        </ul>
        <div class="no-information" v-else>
          <div
            :style="{
              backgroundImage: `url(${not})`,
              width: '82px',
              height: '82px',
            }"
          ></div>
          <span>暂无公告</span>
        </div>
      </div>
      <div class="border" style="height: 315px; width: 530px">
        <div class="border-title">知识管理</div>
        <div class="knowledge">
          <ul class="knowledge-left">
            <li
              v-for="(item, index) in [
                {
                  label: '故障案例库累积',
                  value: kdbStatics.kdbFaultCasesCount,
                },
                { label: '技术资料库累积', value: kdbStatics.kdbTechDataCount },
                { label: '运维文档库累积', value: kdbStatics.kdbMaintainCount },
                { label: '规章制度库累积', value: kdbStatics.kdbRuleCount },
              ]"
              :key="item.label"
              :style="getImageStyle(index)"
            >
              <p>{{ item.value }}<span>条</span></p>
              <span>{{ item.label }}</span>
            </li>
          </ul>
          <ul class="knowledge-right">
            <li>
              <p>日增加</p>
              <p>
                <span>{{ kdbStatics.dayCount }}</span
                >条
              </p>
            </li>
            <li>
              <p>月增加</p>
              <p>
                <span>{{ kdbStatics.monthCount }}</span
                >条
              </p>
            </li>
            <li>
              <p>年增加</p>
              <p>
                <span>{{ kdbStatics.yearCount }}</span
                >条
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="border" style="height: 315px; width: 513px">
        <div class="border-title">
          <span>预警通知</span>
        </div>
        <div class="forewarning" v-if="forewarning">
          <ul>
            <li>
              <div
                :style="{
                  backgroundImage: `url(${dotIcon})`,
                }"
                class="dot"
              ></div>
              <div class="forewarning-container">
                <span>2024 / 01 / 11 15:33:06</span>
                <ul>
                  <li>
                    <span>EQ000046-1 <i>#掘进机预警通知</i></span>
                  </li>
                  <li>功能位置：{{ "101工作面" }}</li>
                  <li>报警等级：{{ "警告" }}</li>
                  <li>报警名称：{{ "电机定子异常故障" }}</li>
                  <li>故障现象：</li>
                  <li>{{ "1.电机壳横向振动幅值大;" }}</li>
                  <li>{{ "2.振动波形出现明显拍波现象;" }}</li>
                  <li>
                    {{
                      "3.振动频率为电源频率的2倍，不产生极通过频率边带振动频率为电源频率的2倍，不产生极通过频率边带振动频率为电源频率的2倍，不产生极通过频率边带;"
                    }}
                  </li>
                  <li>{{ "4.切断电源，振动立即消失。" }}</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div class="no-information" v-else>
          <div
            :style="{
              backgroundImage: `url(${not})`,
              width: '82px',
              height: '82px',
            }"
          ></div>
          <span>暂无预警</span>
        </div>
      </div>
    </wc-waterfall>
    <el-drawer
      :visible="showDetail"
      :before-close="
        () => {
          showDetail = false;
        }
      "
      size="70%"
    >
      <notice-detail v-if="showDetail" :id="selectNoticeId"> </notice-detail>
    </el-drawer>
  </div>
</template>

<script>
import ContTable from "@/components/ContTable/index4";
import "wc-waterfall";
import { getWorkOrderToDoList } from "@/api/home/index";
import { mapGetters } from "vuex";
import { orderTemplate } from "@/api/work/template";
import { findAll } from "@/api/system/group";
import { listUser } from "@/api/system/user";
import noticeDetail from "@/views/system/notice/details.vue";
import {
  getDeviceStatusCount,
  getMenuList,
  getWomStatusCount,
  getWomTypeList,
  getKdbStatics,
  getFlowTodo,
  getTodoCount,
  getNoticeList,
} from "@/api/home/index.js";
import Bar from "@/components/HomeEchart/Bar.vue";
import Bar2 from "@/components/HomeEchart/Bar2.vue";
import ChartLine from "@/components/HomeEchart/ChartLine.vue";

export default {
  name: "index",
  components: { ContTable, Bar, ChartLine, noticeDetail, Bar2 },
  dicts: ["process_category", "wf_process_status"],
  data() {
    return {
      // 版本号
      version: "3.4.0",
      dialogVisible: false,
      process: process.env.VUE_APP_BASE_API,
      not: require("@/assets/images/shouye/notData.png"),
      img: require("@/assets/images/shouye/info.png"),
      baseImgs: {
        0: require("@/assets/images/shouye/base1.png"),
        1: require("@/assets/images/shouye/base2.png"),
        2: require("@/assets/images/shouye/base3.png"),
        3: require("@/assets/images/shouye/base4.png"),
      },
      useIcon: require("@/assets/images/shouye/useIcon.png"),
      dotIcon: require("@/assets/images/shouye/dot.png"),
      // 遮罩层
      noticeLoading: true,
      loading1: true,
      loading2: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total1: 0,
      total2: 0,
      noticeTotal: 0,
      // 表格数据
      equipmentList1: null,
      equipmentList2: null,
      noticeList: null,
      queryParams1: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10000,
      },
      orderOptions: [],
      userList: [],
      typeAll: [],
      radio: "工单",
      order: 1,
      radioArr: ["工单", "流程"],
      orderArr: [
        { label: "周", value: 1 },
        { label: "月", value: 2 },
        { label: "年", value: 3 },
      ],
      // echarts
      myChart: null,
      jszlData: {
        list: [],
      },
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
      forewarning: null,
      chartData: null,
      flag: false,
      flagOrder1: false,
      flagOrder2: false,
      womStatusCount: null,
      womTypeList: null,
      kdbStatics: {
        kdbFaultCasesCount: 0, //故障总数
        kdbTechDataCount: 32, //技术总数
        kdbMaintainCount: 22,
        kdbRuleCount: 2,
        dayCount: 223,
        monthCount: 223,
        yearCount: 223,
      },
      commonNavigation: [],
      todoCount: null,
      orderCount: null,
      showDetail: false,
      selectNoticeId: "",
    };
  },
  computed: {
    ...mapGetters(["avatar"]),
    columns1() {
      return [
        {
          label: "工单编码",
          prop: "orderCode",
          tableVisible: true,
          type: "link",
        },
        {
          label: "工单名称",
          prop: "orderName",
          tableVisible: true,
        },
        {
          label: "工单类型",
          prop: "orderType",
          tableVisible: true,
          formType: "selectTree",
          options: this.orderOptions,
        },
        {
          label: "工单状态",
          prop: "orderStatus",
          tableVisible: true,
        },
        {
          label: "计划执行日期",
          prop: "planExecuteDate",
          tableVisible: true,
          formType: "date",
        },
        // {
        //   label: "执行班组",
        //   prop: "groupId",
        //   formType: "selectTree",
        //   options: this.typeAll,
        //   tableVisible: true,
        // },
        // {
        //   label: "执行人员",
        //   prop: "executor",
        //   formType: "selectTree",
        //   options: this.userList,
        //   tableVisible: true,
        // },
        // {
        //   label: "请求人员",
        //   prop: "createBy",
        //   tableVisible: true,
        // },
        // {
        //   label: "请求时间",
        //   prop: "createTime",
        //   formType: "date",
        //   width: 150,
        // },
      ];
    },

    columns2() {
      return [
        {
          label: "业务编码",
          prop: "businessCode",
          tableVisible: true,
          type: "link",
        },
        {
          label: "业务名称",
          prop: "category",
          tableVisible: true,
          formType: "select",
          options: this.dict.type.process_category,
        },
        {
          label: "发起时间",
          prop: "createTime",
          tableVisible: true,
          formType: "date",
        },
        {
          label: "发起人员",
          prop: "startUserName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "发起部门",
          prop: "startDeptName",
          tableVisible: true,
          width: 150,
        },
      ];
    },
    getImageStyle() {
      return (index) => ({
        backgroundImage: `url(${this.baseImgs[index]})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      });
    },
    routers() {
      return this.$store.state.permission.topbarRouters;
    },
  },
  created() {
    // this.getUserList();
    this.getOrderTree();
    this.getTypeList();
    this.getNoticeList();
    this.getInfoAll();
    this.getChart(this.queryParams);
  },
  methods: {
    handleView(row) {
      this.selectNoticeId = row.noticeId;
      this.showDetail = true;
    },
    handlerRadioChange(value) {
      this.flagOrder1 = false;
      this.flagOrder2 = false;
      getWomTypeList({ type: value }).then((res) => {
        if (res.code === 200) {
          this.womTypeList = res.data;
          this.flagOrder1 = true;
        } else {
          this.womTypeList = null;
          this.flagOrder1 = true;
        }
      });
      getWomStatusCount({ type: value }).then((res) => {
        if (res.code === 200) {
          this.womStatusCount = res.data;
          this.flagOrder2 = true;
        }
      });
    },
    linkClick(row, item) {
      // console.log(row,item)
      if (item.label == "业务编码") {
        this.$router.push({
          path: "/flowable/task/todo/detail/index",
          query: {
            procInsId: row.procInsId,
            executionId: row.executionId,
            deployId: row.deployId,
            taskId: row.taskId,
            taskName: row.taskName,
            startUser: row.startUserName + "-" + row.startDeptName,
            businessId: row.businessId,
          },
        });
      } else if (item.label == "工单编码") {
        this.$router.push({
          name: "Quest",
          query: {
            orderCode: row.orderCode,
          },
        });
      }
    },
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`;
    },
    /** 查询统计图 */
    getChart(queryParams) {
      this.flag = false;
      getDeviceStatusCount(queryParams).then((response) => {
        this.chartData = response.data;
        this.flag = true;
      });
    },
    // 获取表头所有信息
    getInfoAll() {
      getMenuList({ pageNum: 1, pageSize: 10 }).then((res) => {
        if (res.code === 200) {
          this.commonNavigation = res.rows;
        }
      });
      getWomStatusCount({ type: 1 }).then((res) => {
        if (res.code === 200) {
          this.womStatusCount = res.data;
          this.flagOrder2 = true;
        }
      });
      getWomTypeList({ type: 1 }).then((res) => {
        if (res.code === 200) {
          this.womTypeList = res.data;
          this.flagOrder1 = true;
        }
      });
      // getTodoCount().then((res) => {
      //   if (res.code === 200) {
      //     this.todoCount = res.data;
      //   }
      // });
      getKdbStatics().then((res) => {
        if (res.code === 200) {
          this.kdbStatics = res.data;
        }
      });
    },
    // ! 工单
    async getList2(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading2 = true;
      getFlowTodo(form).then((response) => {
        this.equipmentList2 = response.data.records.map((item) => ({
          ...item,
          ...item.procVars,
        }));
        this.total2 = response.data.total;
        this.loading2 = false;
        this.todoCount = response.data.total;
      });
    },
    getTableDataBy(value, flg, flg2) {
      return this[value];
    },

    getUserList() {
      listUser({ pageNum: 1, pageSize: 10000 }).then((res) => {
        this.userList = res.rows.map((item) => {
          return {
            id: item.userId,
            label: item.nickName,
          };
        });
      });
    },
    getTypeList() {
      findAll().then((res) => {
        this.typeAll = res.data.map((item) => {
          return {
            id: item.id,
            label: item.groupName,
          };
        });
        this.getList1();
        this.getList2();
      });
    },
    async getOrderTree() {
      await orderTemplate().then((response) => {
        this.orderOptions = response.data.map((item) => {
          const children = item.sysDictDatas.map((dict) => {
            return {
              id: dict.dictValue,
              label: dict.dictLabel,
            };
          });

          return {
            id: item.value,
            label: item.name,
            children,
          };
        });
      });
    },
    /** 查询用户列表 */
    async getList1(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.queryParams1 = form;
      this.loading1 = true;
      getWorkOrderToDoList(form).then((response) => {
        this.equipmentList1 = response.data.records;
        this.total1 = response.data.total;
        this.orderCount = response.data.total;
        this.loading1 = false;
      });
    },
    /** 查询公告列表 */
    getNoticeList(queryParams) {
      this.noticeLoading = true;
      getNoticeList(queryParams || this.queryParams).then((response) => {
        this.noticeList = response.data;
        this.noticeLoading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  padding: 5px 10px;
  height: calc(100vh - 111px);
  overflow-y: auto;
  color: #2c3e50;
  p {
    line-height: 0;
    margin: 0;
    padding: 0;
    line-height: 16px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
}
.user {
  height: 132px;
  background: #d9e5fd;
  font-size: 18px;
  color: #1f66f1;
  // padding: 25px;
  font-weight: 700;
  border-radius: 8px;
  > div {
    padding: 25px;
  }
  span {
    font-size: 16px;
    line-height: 42px;
  }
  .user-name {
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis; /* 显示省略号 */
    white-space: nowrap; /* 禁止文本换行 */
    text-align: center;
  }
  .user-avatar {
    width: 80px; /* 正方形的宽度 */
    height: 80px; /* 正方形的高度 */
    border-radius: 50%; /* 将边框半径设置为50%，这样宽高比为1:1的元素就会变成圆形 */
    background-color: #fff;
    transform: translateX(20px);
    border: 3px solid #fff;
    overflow: hidden;
    img {
      width: 74px;
      height: 74px;
    }
    margin-bottom: 20px;
  }
  .user-bottom {
    display: flex;
    justify-content: space-between;
    div {
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transform: translateX(20px);
      b {
        color: #495055;
        font-size: 18px;
      }
      span {
        color: #7d8092;
        font-size: 14px;
      }
    }
    ul {
      list-style: none;
      display: flex;
      height: 70px;
      width: 170px;
      justify-content: space-between;
      align-items: center;
      li {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 8px;
        span {
          color: #7d8092;
          font-size: 14px;
        }
      }
    }
  }
  .user-bottom2 {
    display: flex;
    justify-content: space-between;
    transform: translateY(-72px) translateX(40px);

    div {
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      b {
        color: #495055;
        font-size: 18px;
      }
      span {
        color: #7d8092;
        font-size: 14px;
      }
    }
    ul {
      list-style: none;
      display: flex;
      height: 70px;
      width: 170px;
      justify-content: space-between;
      align-items: center;
      li {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 8px;
        span {
          color: #7d8092;
          font-size: 14px;
        }
      }
    }
  }
}
.charge {
  height: calc(100% - 47px);
  overflow-y: auto;
}
.system {
  height: calc(100% - 30px);
  overflow: auto;
  font-family: "DINPro-Medium";
  padding-top: 8px !important;
  li {
    height: 30px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  .single-line-ellipsis {
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .single-line-data {
    font-weight: 400;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.work-order {
  height: calc(100% - 47px);
  width: 100%;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.knowledge {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  overflow-y: auto;
  .knowledge-left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 32px 23px 16px 23px;
    span {
      font-size: 10px;
      font-weight: 400;
    }
    li {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      width: 75px;
      height: 90px;
      margin-right: 10px;
    }
    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3),
    &:nth-of-type(4) {
      color: #0095ff;
      font-size: 22px;
      font-weight: 500;
    }
    & li:nth-of-type(2) {
      color: #4c9ca0;
    }
    & li:nth-of-type(3) {
      color: #d8663a;
    }
    & li:nth-of-type(4) {
      color: #ec848e;
    }
  }
  .knowledge-right {
    width: 50%;
    height: auto;
    overflow-y: auto;
    font-weight: 500;
    padding: 42px 23px 16px 23px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    li {
      width: 100%;
      height: 32px;
      overflow: hidden;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 12px;
      padding: 0 12px;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
}
.use {
  width: 100%;
  height: calc(100% - 30px);
  padding: 20px 24px 16px 34px;
  overflow-y: auto;

  ul {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    li {
      cursor: pointer;
      width: 100px;
      height: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 12px;
      margin-right: 10px;

      div {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
.forewarning {
  width: 100%;
  height: calc(100% - 30px);
  padding: 27px 0 27px 12px;
  overflow-y: auto;
  ul {
    border-left: 1px solid #ebebeb;
    width: 100%;
    li {
      width: 100%;
      height: auto;
      display: flex;
      margin-bottom: 10px;
      .dot {
        background-repeat: no-repeat;
        background-size: contain;
        width: 26px;
        height: 26px;
        transform: translateX(-13px) translateY(-13px);
      }
      .forewarning-container {
        width: 100%;
        transform: translateY(-9px) translateX(-9px);
        ul {
          margin-top: 10px;
          border: 1px solid #62b0ff;
          border-radius: 5px;
          padding: 18px 15px;
          li {
            color: #55556b;
            padding-bottom: 5px;
            margin-bottom: 0;
            font-size: 14px;
            &:nth-of-type(1) {
              height: 30px;
            }
            span {
              font-size: 16px;
              font-weight: 700;
              overflow: hidden;
              i {
                color: #ffb64f;
              }
            }
          }
        }
      }
    }
  }
}
.no-information {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 16px;
    font-weight: 400;
  }
}
.border-title {
  padding-bottom: 10px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  font-weight: 600;
}

.border {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 15px;
}
::v-deep .el-table__empty-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  color: #2c3e50;
  &::before {
    content: "";
    display: block;
    width: 82px;
    height: 82px;
    background-image: url("../assets/images/shouye/notData.png");
    background-repeat: no-repeat;
  }
}
/* font.css 或 font.scss */
</style>

