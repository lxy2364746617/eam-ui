<template>
  <div class="home">
    <div class="top">
      <div>
        <span style="padding-bottom: 8px"
          >你好 {{ $store.state.user.standing.nickName }}，</span
        >
        <div class="time">
          <span>{{ greetingTime }}</span>
          <!-- <div class="robot"></div> -->
          <search id="header-search" class="right-menu-item" />
        </div>
      </div>
      <div style="display: flex">
        <div class="todo">
          <div>
            <img src="../assets/images/shouye/gongdan.png" alt="" />
            <div>
              <span>{{ orderCount ? orderCount : "0" }}</span
              ><span class="til2">工单待办数量</span>
            </div>
          </div>
          <div>
            <img src="../assets/images/shouye/gongdan.png" alt="" />
            <div>
              <span>{{ todoCount ? todoCount : "0" }}</span
              ><span class="til2">流程待办数量</span>
            </div>
          </div>
        </div>
        <el-button
          @click="handlerHref"
          type="primary"
          icon="el-icon-data-line"
          style="
            padding: 16px 20px;
            font-size: 16px;
            background-color: rgba(20, 95, 240, 1);
            border-radius: 10px;
          "
          >设备在线诊断</el-button
        >
      </div>
    </div>
    <div class="one">
      <div
        style="width: 16%"
        v-for="item in womInfoCount"
        :key="item.maintenanceType"
      >
        <span class="one-title">
          <i
            :style="{
              display: 'inline-block',
              backgroundImage: `url(${getBackgroundImageURL(
                womInfoName[item.maintenanceType].split(',')[1]
              )})`,
              width: '32px',
              height: '32px',
              backgroundSize: 'cover',
            }"
          ></i
          >{{ womInfoName[item.maintenanceType].split(",")[0] }}</span
        >
        <div class="one-down">
          <span class="one-num">{{ item.count }}</span>
          <span
            :style="{
              display: 'inline-block',
              backgroundImage: `url(${getBackgroundImageURL(
                'column' + item.sort
              )})`,
              width: '75px',
              height: '45px',
              backgroundSize: 'cover',
            }"
          ></span>
        </div>
      </div>
      <div style="width: 22%">
        <span class="one-title">
          <i
            :style="{
              display: 'inline-block',
              backgroundImage: `url(${oneIcon5})`,
              width: '32px',
              height: '32px',
              backgroundSize: 'cover',
            }"
          ></i
          >知识管理</span
        >
        <div class="knowledge-down">
          <span
            v-for="(item, index) in [
              {
                label: '故障案例库累积',
                value: kdbStatics.kdbFaultCasesCount,
              },
              { label: '技术资料库累积', value: kdbStatics.kdbTechDataCount },
              { label: '运维文档库累积', value: kdbStatics.kdbMaintainCount },
              { label: '规章制度库累积', value: kdbStatics.kdbRuleCount },
            ]"
            :key="index"
          >
            <p class="one-num">{{ item.value }}</p>
            <span
              style="
                font-size: 10px;
                font-family: 'PingFang SC';
                letter-spacing: -0.1px;
              "
              >{{ item.label }}</span
            >
          </span>
          <span> </span>
        </div>
      </div>
      <div class="one-right" style="width: 12%">
        <div>
          <span class="one-right-one" style="color: rgba(46, 139, 255, 1)"
            >日增加</span
          >
          <span class="one-right-two">{{ kdbStatics.dayCount }}</span>
        </div>
        <div>
          <span class="one-right-one" style="color: #ff7e54">月增加</span>
          <span class="one-right-two">{{ kdbStatics.monthCount }}</span>
        </div>
        <div>
          <span class="one-right-one" style="color: rgba(0, 159, 150, 1)"
            >年增加</span
          >
          <span class="one-right-two">{{ kdbStatics.yearCount }}</span>
        </div>
      </div>
    </div>
    <div class="two">
      <div class="work-order">
        <div class="work-left">
          <div class="border-title">
            <span>工单趋势</span>
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
            </div>
          </div>
          <div class="work-content">
            <div style="width: 100%; height: 100%">
              <ChartLine v-if="flagOrder1" :data="womTypeList" />
            </div>
            <!-- <div style="width: 30%; height: 100%">
              <Bar2
                v-if="flagOrder2"
                :data="{ ...womStatusCount, title: '工单' }"
              ></Bar2>
            </div> -->
          </div>
        </div>
        <div class="work-right">
          <div class="border-title">
            <span>工单总览</span>
          </div>
          <div class="work-content">
            <Bar2
              v-if="flagOrder2"
              :data="{ ...womStatusCount, title: '工单' }"
            ></Bar2>
            <!-- <Bar v-if="flag" :data="{ ...chartData, title: '设备' }"></Bar> -->
          </div>
        </div>
      </div>
    </div>
    <div class="newTree">
      <div>
        <div class="border-title"><span class="hot">常用功能导航</span></div>
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
                  width: '40px',
                  height: '40px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                }"
              >
                <svg-icon
                  style="color: #226efc; font-size: 22px"
                  :icon-class="getIconClass(item.icon)"
                />
              </div>
              <el-tooltip :content="item.title"
                ><span
                  style="font-size: 15pxp; padding-top: 8px; font-weight: 600"
                >
                  {{ item.title }}
                </span></el-tooltip
              >
            </li>
          </ul>
          <div class="no-information" v-else>
            <div
              :style="{
                backgroundImage: `url(${not})`,
                width: '178px',
                height: '143px',
                backgroundSize: 'cover',
              }"
            ></div>
            <span>暂无常用功能导航</span>
          </div>
        </div>
      </div>

      <div>
        <div class="work-title" style="margin-bottom: 4px">设备状态</div>
        <Bar v-if="flag" :data="{ ...chartData, title: '设备' }"></Bar>
      </div>
      <div>
        <div class="over">
          <div class="work-title" style="margin-bottom: 4px">报警日历</div>
          <div class="work-charge">
            <el-tooltip effect="dark" content="上个月" placement="top">
              <span class="time-left" @click="dateCut(1)"><</span>
            </el-tooltip>
            <el-tooltip effect="dark" content="下个月" placement="top">
              <span class="time-right" @click="dateCut(2)">></span>
            </el-tooltip>

            <el-calendar
              style="width: 100%; height: 100%"
              v-model="calendarValue"
            >
              <template slot="dateCell" slot-scope="{ date, data }">
                <el-tooltip
                  effect="dark"
                  content="1"
                  placement="top"
                  v-if="
                    errorList.includes(data.day) || wranList.includes(data.day)
                  "
                >
                  <template slot="content">
                    <div>
                      <span
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 8px;
                          background: red;
                          border-radius: 50%;
                          margin-right: 4px;
                        "
                      ></span
                      ><span
                        >警告：{{
                          errorList.filter((item) => data.day == item).length
                        }}</span
                      >
                    </div>
                    <div>
                      <span
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 8px;
                          background: orange;
                          border-radius: 50%;
                          margin-right: 4px;
                        "
                      ></span
                      ><span
                        >注意：{{
                          wranList.filter((item) => data.day == item).length
                        }}</span
                      >
                    </div>
                  </template>

                  <div class="is-point">
                    <span>{{ Number(data.day.split("-")[2]) }}</span>
                    <i
                      class="point-error"
                      v-if="errorList.includes(data.day)"
                    />
                    <i class="point-warn" v-if="wranList.includes(data.day)" />
                  </div>
                </el-tooltip>
                <div v-else class="is-point">
                  <span>{{ Number(data.day.split("-")[2]) }}</span>
                  <i class="point-error" v-if="errorList.includes(data.day)" />
                  <i class="point-warn" v-if="wranList.includes(data.day)" />
                </div>
              </template>
            </el-calendar>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="three">
      <div class="work-order2" style="width: 75.5%; height: 100%">
        <div style="width: 49%; height: 100%">
          <div class="work-title">我的工单待办</div>
          <div class="charge">
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
        <div style="width: 49%; height: 100%; margin-left: 1%">
          <div class="work-title">我的流程待办</div>
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
      </div>
      <div class="three-content" style="width: 24%; height: 100%">
        <div style="over">
          <div class="work-title">报警日历</div>
          <div class="work-charge">
            <el-tooltip effect="dark" content="上个月" placement="top">
              <span class="time-left" @click="dateCut(1)"><</span>
            </el-tooltip>
            <el-tooltip effect="dark" content="下个月" placement="top">
              <span class="time-right" @click="dateCut(2)">></span>
            </el-tooltip>

            <el-calendar
              style="width: 100%; height: 100%"
              v-model="calendarValue"
            >
              <template slot="dateCell" slot-scope="{ date, data }">
                <el-tooltip
                  effect="dark"
                  content="1"
                  placement="top"
                  v-if="
                    errorList.includes(data.day) || wranList.includes(data.day)
                  "
                >
                  <template slot="content">
                    <div>
                      <span
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 8px;
                          background: red;
                          border-radius: 50%;
                          margin-right: 4px;
                        "
                      ></span
                      ><span
                        >警告：{{
                          errorList.filter((item) => data.day == item).length
                        }}</span
                      >
                    </div>
                    <div>
                      <span
                        style="
                          display: inline-block;
                          width: 8px;
                          height: 8px;
                          background: orange;
                          border-radius: 50%;
                          margin-right: 4px;
                        "
                      ></span
                      ><span
                        >注意：{{
                          wranList.filter((item) => data.day == item).length
                        }}</span
                      >
                    </div>
                  </template>

                  <div class="is-point">
                    <span>{{ Number(data.day.split("-")[2]) }}</span>
                    <i
                      class="point-error"
                      v-if="errorList.includes(data.day)"
                    />
                    <i class="point-warn" v-if="wranList.includes(data.day)" />
                  </div>
                </el-tooltip>
                <div v-else class="is-point">
                  <span>{{ Number(data.day.split("-")[2]) }}</span>
                  <i class="point-error" v-if="errorList.includes(data.day)" />
                  <i class="point-warn" v-if="wranList.includes(data.day)" />
                </div>
              </template>
            </el-calendar>
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="four">
      <div style="width: 38%">
        <div class="border-title">
          <span>系统公告</span>
        </div>
        <ul class="system" v-if="noticeList.length > 0">
          <li
            v-for="item in noticeList"
            :key="item.createTime"
            @click="handleView(item)"
          >
            <span class="system-left">
              <el-tooltip :content="item.noticeTitle" placement="top">
                <span class="single-line-ellipsis">{{ item.noticeTitle }}</span>
              </el-tooltip>
              <el-tooltip :content="item.noticeIntro" placement="top">
                <span class="single-line-ellipsis2">{{
                  item.noticeIntro
                }}</span>
              </el-tooltip>
            </span>

            <el-tooltip :content="item.createTime" placement="top">
              <span class="single-line-data">{{ item.createTime }}</span>
            </el-tooltip>
          </li>
        </ul>
        <div class="no-information" v-else>
          <div
            :style="{
              backgroundImage: `url(${not})`,
              width: '178px',
              height: '143px',
              backgroundSize: 'cover',
            }"
          ></div>
          <span>暂无公告</span>
        </div>
      </div>
      <div style="width: 23%">
        <div class="border-title"><span class="hot">常用功能导航</span></div>
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
                  width: '45px',
                  height: '45px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                }"
              >
                <svg-icon
                  style="color: #226efc; font-size: 24px"
                  :icon-class="item.icon"
                />
              </div>
              <el-tooltip :content="item.title"
                ><span style="font-size: 16pxp; padding-top: 12px">
                  {{ item.title }}
                </span></el-tooltip
              >
            </li>
          </ul>
          <div class="no-information" v-else>
            <div
              :style="{
                backgroundImage: `url(${not})`,
                width: '178px',
                height: '143px',
                backgroundSize: 'cover',
              }"
            ></div>
            <span>暂无常用功能导航</span>
          </div>
        </div>
      </div>
      <div style="width: 38%">
        <div class="border-title">
          <span class="new">预警通知</span>
        </div>

        <div class="no-information">
          <div
            :style="{
              backgroundImage: `url(${not})`,
              width: '178px',
              height: '143px',
              backgroundSize: 'cover',
            }"
          ></div>
          <span>暂无预警</span>
        </div>
      </div>
    </div> -->

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
  getWomInfoCount,
} from "@/api/home/index.js";
import Bar from "@/components/HomeEchart/Bar.vue";
import Bar2 from "@/components/HomeEchart/Bar2.vue";
import ChartLine from "@/components/HomeEchart/ChartLine.vue";
import Search from "@/components/HeaderSearch/index2.vue";
export default {
  name: "index",
  components: { ContTable, Bar, ChartLine, noticeDetail, Bar2, Search },
  dicts: ["process_category", "wf_process_status"],
  data() {
    return {
      // 版本号
      version: "3.4.0",
      dialogVisible: false,
      process: process.env.VUE_APP_BASE_API,
      not: require("@/assets/images/shouye/notData.png"),

      oneIcon5: require("@/assets/images/shouye/oneIcon5.png"),

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
      order: 3,
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
      scale: null,
      calendarValue: new Date(),
      errorList: ["2024-07-09", "2024-07-16", "2024-08-01"],
      wranList: ["2024-07-10", "2024-07-17", "2024-08-02"],
      womInfoCount: [
        { maintenanceType: "XDJ", count: 0, sort: 1 },
        { maintenanceType: "BYWX", count: 0, sort: 2 },
        { maintenanceType: "SBWX", count: 0, sort: 3 },
        { maintenanceType: "DQJY", count: 0, sort: 4 },
      ],
      womInfo: ["XDJ", "BYWX", "SBWX", "DQJY"],
      womInfoName: {
        XDJ: "巡点检工单,oneIcon1",
        BYWX: "保养检修工单,oneIcon2",
        SBWX: "维修工单,oneIcon3",
        DQJY: "定检工单,oneIcon4",
      },
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
    greetingTime() {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        return "早上好";
      } else if (currentHour >= 12 && currentHour < 14) {
        return "中午好";
      } else if (currentHour >= 14 && currentHour < 18) {
        return "下午好";
      } else {
        return "晚上好";
      }
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
        },
        {
          label: "发起部门",
          prop: "startDeptName",
          tableVisible: true,
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
    this.getWomInfoCountAll();
  },
  mounted() {},
  methods: {
    getIconClass(icon) {
      return icon !== "#" ? icon : "xxxx2";
    },
    handlerHref() {
      window.location.href = "http://172.22.175.172/login";
    },
    dateCut(type) {
      // type：1 月份左侧按钮，2 月份右侧按钮，3 年份左侧按钮，4 年份右侧按钮，5 回到今天
      if (type === 1) {
        this.calendarValue =
          new Date(this.calendarValue).getMonth() > 0
            ? new Date(this.calendarValue).getFullYear() +
              "-" +
              new Date(this.calendarValue).getMonth() +
              "-01"
            : new Date(this.calendarValue).getFullYear() - 1 + "-12" + "-01";
      } else if (type === 2) {
        this.calendarValue =
          new Date(this.calendarValue).getMonth() < 11
            ? new Date(this.calendarValue).getFullYear() +
              "-" +
              (Number(new Date(this.calendarValue).getMonth()) + 2) +
              "-01"
            : new Date(this.calendarValue).getFullYear() + 1 + "-01" + "-01";
      } else if (type === 3) {
        this.calendarValue =
          new Date(this.calendarValue).getFullYear() -
          1 +
          "-" +
          (Number(new Date(this.calendarValue).getMonth()) + 1) +
          "-01";
      } else if (type === 4) {
        this.calendarValue =
          new Date(this.calendarValue).getFullYear() +
          1 +
          "-" +
          (Number(new Date(this.calendarValue).getMonth()) + 1) +
          "-01";
      } else if (type === 5) {
        this.calendarValue = this.getDate(new Date()).fullDate;
      }
    },
    getBackgroundImageURL(item) {
      return require(`@/assets/images/shouye/${item}.png`);
    },
    getWomInfoCountAll() {
      getWomInfoCount().then((res) => {
        if (res.code === 200) {
          let defaultObj;
          let foundItem;
          this.womInfoCount = this.womInfo
            .map((item) => {
              defaultObj = {
                maintenanceType: item,
                count: 0,
              };
              foundItem = res.data.find(
                (maintenanceTypeObj) =>
                  maintenanceTypeObj.maintenanceType === item
              );

              return foundItem ? foundItem : defaultObj;
            })
            .sort((a, b) => a.count - b.count)
            .map((item, index) => ({ ...item, sort: index + 1 }))
            .sort((a, b) => {
              const aIndex = this.womInfo.indexOf(a.maintenanceType);
              const bIndex = this.womInfo.indexOf(b.maintenanceType);
              return aIndex - bIndex;
            }); // 根据 sortOrder 顺序排序
        }
      });
    },
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
      getWomStatusCount({ type: 3 }).then((res) => {
        if (res.code === 200) {
          this.womStatusCount = res.data;
          this.flagOrder2 = true;
        }
      });
      getWomTypeList({ type: 3 }).then((res) => {
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
        this.equipmentList1 = response.data.records
          .concat(response.data.records)
          .concat(response.data.records)
          .concat(response.data.records)
          .concat(response.data.records)
          .concat(response.data.records);
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
<style lang='scss' scoped>
.home {
  padding: 5px 10px 0px 10px;
  height: calc(100vh - 111px);
  overflow-y: auto;
  background-color: #f4f4f6;
  font-family: "PingFang";
  > div {
    border-radius: 10px;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 8px;
    padding: 20px;
  }
  .newTree {
    height: 282px;
    background-color: transparent;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: start;
    > div {
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 33%;
      height: 100%;
      background-color: #fff;
      border-radius: 10px;
      padding: 10px 20px;
    }
  }
  .top {
    height: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(212, 219, 249, 0.5);
    .todo {
      display: flex;
      transform: translateY(16px);

      > div {
        display: flex;
        margin-right: 40px;
        img {
          width: 2.3rem;
          height: 43px;
          margin-right: 10px;
        }
        > div {
          display: flex;
          flex-direction: column;
          span {
            font-size: 20px;
            color: #495055;
            font-family: "DINPro-Medium";
            font-weight: 600;
          }
          .til2 {
            color: #74788b;
            font-size: 12px;
            font-weight: 600;
          }
        }
      }
    }
    .time {
      display: flex;
      justify-content: start;
      align-items: center;

      font-size: 26px;
      font-weight: 600;
    }
  }
  .one {
    height: 115px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    background-color: transparent;
    .one-right {
      background-color: transparent;
      padding: 0;
      div {
        background-color: #fff;
        border-radius: 10px;
        height: 30%;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .one-right-one {
          font-weight: 600;
          font-size: 10px;
        }
        .one-right-two {
          margin-top: 5px;
          font-size: 26px;
          font-weight: 500;
          font-family: "DINPro-Medium";
          line-height: 1;
        }
      }
    }
    .one-title {
      display: flex;
      justify-content: start;
      align-items: center;
      font-weight: 600;
      font-size: 12px;
      i {
        margin-right: 8px;
      }
    }
    .one-down {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .knowledge-down {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        font-weight: 600;
        font-size: 12px;
        color: rgba(180, 180, 180, 1);
      }
    }
    .one-num {
      color: #000;
      font-size: 26px;
      font-weight: 500;
      margin: 0;
      font-family: "DINPro-Medium";
    }
    > div {
      padding: 10px 15px;
      height: 100%;
      background-color: #fff;
      border-radius: 10px;
      background-image: url("../assets/images/shouye/ripple.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
  }
  .two {
    height: 310px;
    padding-bottom: 0;
    width: 100%;
    background-color: transparent;
    padding: 0;
    .work-order {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // div {

      //   height: 100%;
      // }
      .work-left {
        width: 75.5%;
        background-color: #fff;
        border-radius: 10px;
        height: 100%;
        padding: 20px;
        padding-bottom: 0;
        padding-top: 10px;
        .work-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: calc(100% - 40px);
        }
      }
      .work-right {
        width: 24%;
        background-color: #fff;
        border-radius: 10px;
        height: 100%;
        padding: 10px 0 0 0;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .work-content {
          height: calc(100% - 22px);
        }
        .border-title {
          padding-left: 20px;
          padding-bottom: 0;
        }
      }
    }
  }
  .three {
    height: 365px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    padding: 0;
    .work-order2 {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }
    .three-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }
    .work-charge {
      transform: translateY(-100px);
      position: relative;
      height: calc(100% - 30px);
      overflow-y: auto;
      .time-left {
        display: inline-block;
        text-align: center;
        line-height: 24px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        position: absolute;
        top: 10px;
        left: 14px;
        &:hover {
          border-radius: 50%;
          background-color: #eff6ff;
        }
      }
      .time-right {
        display: inline-block;
        text-align: center;
        line-height: 24px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 14px;
        &:hover {
          border-radius: 50%;
          background-color: #eff6ff;
        }
      }
    }
  }
  .four {
    height: 345px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    padding: 0;
    > div {
      height: 100%;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }
  }
}

.robot {
  width: 40px;
  height: 40px;
  background-image: url("../assets/images/shouye/robot.png");
  background-repeat: no-repeat;
  background-size: cover;
  vertical-align: middle;
  transform: translateY(1px);
  padding-left: 5px;
}
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
  transform: translateY(1.5px);

  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
.work-title {
  font-weight: 600;
  margin-bottom: 10px;
}
.border-title {
  padding-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // overflow: hidden;
  font-weight: 600;
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
    width: 178px;
    height: 143px;
    background-image: url("../assets/images/shouye/notData.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.charge {
  height: 100%;
  overflow-y: auto;
}
.work-charge {
  // transform: translateY(-100px);
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding-top: 2px;
  .time-left {
    display: inline-block;
    text-align: center;
    line-height: 24px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    top: 0px;
    left: 14px;
    &:hover {
      border-radius: 50%;
      background-color: #eff6ff;
    }
  }
  .time-right {
    display: inline-block;
    text-align: center;
    line-height: 24px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 14px;
    &:hover {
      border-radius: 50%;
      background-color: #eff6ff;
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
.use {
  width: 100%;
  height: calc(100% - 30px);
  // padding: 5px;
  overflow-y: auto;

  ul {
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    li {
      cursor: pointer;
      width: 23%;
      height: 46%;
      border: 1px solid #e7e9f0;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
      }
      span {
        display: block;
        width: 98%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
.system {
  height: calc(100% - 30px);
  overflow: auto;
  color: #55556b;
  padding: 0;
  margin: 0;
  li {
    height: 54px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    cursor: pointer;
  }
  .system-left {
    width: 64%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .single-line-ellipsis,
  .single-line-ellipsis2 {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }
  .single-line-ellipsis2 {
    padding-top: 3px;
    color: #55566d;
    font-weight: 400;
    font-size: 14px;
  }
  .single-line-data {
    width: 25%;
    color: #55566d;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
}
.over {
  height: 100%;
}
::v-deep .el-calendar {
  .el-calendar__header {
    font-size: 16px;
    font-weight: 700;
    color: #0f0f0f;
    line-height: 22px;
    border-bottom: 0;
  }
  .el-calendar__body {
    padding: 0px 0px 10px;
    thead {
      th {
        color: #9aa0b1;
        font-weight: 600;
        font-size: 14px;
        padding: 0;
        padding-bottom: 5px;
      }
    }
    .el-calendar-table__row {
      td {
        font-family: "DINPro-Medium";
        border: 0;
        height: unset;
        border-radius: 50%;
        font-size: 12px;
      }
      .el-calendar-day {
        height: 30px;
        line-height: 30px;
        padding: 0;
        span {
          height: 20px;
          line-height: 20px;
          width: 20px;
          text-align: center;
          border-radius: 50%;
          display: inline-block;
        }
        &:hover {
          background-color: unset;
          span {
            background-color: #eff6ff;
            color: #0f0f0f;
          }
        }
      }
      .is-selected {
        background-color: unset;
        .el-calendar-day {
          span {
            background-color: #eff6ff;
            color: #0f0f0f;
          }
        }
      }
    }
  }
  .is-point {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    .point-error {
      margin-top: 1px;
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #f94b6d;
      border-radius: 50%;
    }
    .point-warn {
      margin-top: 1px;
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #efa04a;
      border-radius: 50%;
    }
  }
}

// 隐藏组件自带切换月份按钮
::v-deep.el-calendar .el-calendar__button-group {
  display: none;
}
::v-deep .el-calendar .el-calendar__header .el-calendar__title {
  text-align: center;
  width: 100%;
}
::v-deep .el-calendar__header {
  padding: 0 20px;
  padding-bottom: 15px;
}
</style>
