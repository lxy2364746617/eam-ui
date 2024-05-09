<template>
  <Wrapper :title="title">
    <div class="box">
      <!-- 左侧 -->
      <div class="fullLeft">
        <!-- 左侧头部 -->
        <div class="statistics">
          <li v-for="(item, index) in orderCount" :key="item.maintenanceType">
            <div class="image" :style="getImageStyle(index)">
              <span>{{ item.count }}</span
              >,单
            </div>
            <div>{{ item.maintenanceType }}/{{ item.count }}单</div>
          </li>
        </div>

        <!-- 日历 -->
        <full-calendar
          ref="fullCalendar"
          style="height: 100%"
          :options="calendarOptions"
        ></full-calendar>
      </div>
      <!-- 右侧 -->
      <div class="fullRight">
        <!-- 日立的时间选择 -->
        <el-date-picker
          class="data"
          v-model="dataValue"
          type="date"
          placeholder="选择日期"
          @change="handelGoDate"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <div class="header">
          <span>{{ dataValue }}</span>
          <span>工单明细</span>
        </div>
        <div class="bottom" v-if="!flag">
          <li v-for="item in detailList" :key="item.orderCode">
            <el-row>
              <el-col :span="19" style="margin-top: 10px">{{
                item.orderName
              }}</el-col>
              <el-col
                :span="5"
                class="icon"
                :style="{
                  color:
                    (item.orderStatus == '执行中' && '#3596FE') ||
                    (item.orderStatus == '已完成' && '#10AE08') ||
                    (item.orderStatus == '已关闭' && 'red'),
                }"
                ><span>·</span> {{ item.orderStatus }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="20" style="margin-top: 6px">
                <div>工单编码：{{ item.orderCode }}</div>
                <div>
                  工单类型：<span
                    v-html="
                      findName(dict.type.system_group_type, item.orderType)
                    "
                  ></span>
                </div>
              </el-col>
              <el-col :span="4">
                <img
                  src="../../../assets/images/overdue.png"
                  v-if="item.expected == 1"
                  alt=""
                />
                <img src="../../../assets/images/overdue2.png" v-else alt="" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">工单来源</el-col>
              <el-col :span="8"
                ><span
                  style="color: #3eb13a; display: flex; justify-content: end"
                  v-html="findName(dict.type.order_source, item.orderSource)"
                ></span
              ></el-col>
            </el-row>
            <el-row
              v-if="item.maintenanceType !== 'SBWX' && item.orderObj !== '2'"
            >
              <el-col :span="19">已执行/设备数量：</el-col>
              <el-col :span="5" style="display: flex; justify-content: end"
                ><span
                  >{{ item.deviceExecuteNum }}/{{
                    item.deviceNum
                  }}&nbsp;&nbsp;</span
                ></el-col
              >
            </el-row>
            <div v-else>
              <el-row>
                <el-col :span="19">设备名称：</el-col>
                <el-col :span="5" style="display: flex; justify-content: end"
                  ><span>{{ item.orderName }}&nbsp;&nbsp;</span></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="19">设备编码：</el-col>
                <el-col :span="5" style="display: flex; justify-content: end"
                  ><span>{{ item.deviceCode }}&nbsp;&nbsp;</span></el-col
                >
              </el-row>
            </div>
            <el-row
              v-if="
                item.maintenanceType === 'XDJ' ||
                item.maintenanceType === 'BYJX'
              "
            >
              <el-col :span="19">已执行/项目数量：</el-col>
              <el-col :span="5" style="display: flex; justify-content: end"
                ><span
                  >{{ item.itemExecuteNum }}/{{
                    item.itemNum
                  }}&nbsp;&nbsp;</span
                ></el-col
              >
            </el-row>
          </li>
        </div>
        <div class="bottom-none" v-if="detailList.length == 0">
          {{ !dataValue ? "请选择日期" : "暂无明细" }}
        </div>
      </div>
    </div>
  </Wrapper>
</template>
<script>
// 引入日历组件
import image1 from "@/assets/images/statistics1.png";
import image2 from "@/assets/images/statistics2.png";
import image3 from "@/assets/images/statistics3.png";
import image4 from "@/assets/images/statistics4.png";
import FullCalendar, { removeElement } from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Wrapper from "@/components/wrapper";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import { listUser } from "@/api/system/user";
import { orderTemplate } from "@/api/work/template";
import {
  getCalendarMonth,
  getOrderDetailDay,
  getWorkOrderCount,
  getWorkOrderSchedule,
} from "@/api/work/schedule";

export default {
  components: { FullCalendar, dayGridPlugin, interactionPlugin, Wrapper },
  dicts: ["system_group_type", "order_source"],
  data() {
    return {
      title: "",
      newElement: null,
      dataValue: null,
      tooltipInstance: null,
      calendarOptions: {
        //   timeGridPlugin  可显示每日时间段
        height: 1000,
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: "prev today next",
          center: "title",
          // right: "dayGridMonth,dayGridWeek,dayGrid",
          right: "dayGridMonth,dayGridWeek",
        },

        buttonText: {
          // 设置按钮
          month: "月",
          week: "周",
        },
        // allDaySlot: false,
        editable: false, // 在日历上是否可拖拽
        selectable: false, // 在日历上是否可以拉长
        navLinks: false, // 点击日期跳转到当天
        // displayEventEnd: true,//所有视图显示结束时间
        initialView: "dayGridMonth", // 设置默认显示月，可选周、日
        dateClick: this.handleDateClick,
        eventMouseEnter: (info) => {
          if (this.tooltipInstance) {
            this.tooltipInstance.destroy();
            this.tooltipInstance = null;
          }
          let that = this;
          this.tooltipInstance = tippy(info.el, {
            content:
              "<div style='position:relative;width:200px'>" +
              "<p style='margin-bottom:4px;color:#0084FF;font-weight: 600;'>" +
              info.event.title +
              "</p>" +
              "<p style='margin-top:4px;color:#0084FF;font-weight: 600;'>" +
              info.event.id +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>工单类型:" +
              this.findTreeName(
                this.orderOptions,
                info.event._def.extendedProps.orderType
              ) +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>工单状态:" +
              info.event._def.extendedProps.orderStatus +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>执行人员:" +
              this.findTreeName(
                this.userList,
                info.event._def.extendedProps.executor
              ) +
              "</p>" +
              "</div>",
            theme: "light",
            placement: "right",
            allowHTML: true,
          });
        },
        eventClick: this.handleEventClick,
        // timezone
        // 设置日程
        events: [],
        eventColor: "#f08f00", // 修改日程背景色
        locale: "zh-cn", // 设置语言

        customButtons: {
          prev: {
            // this overrides the prev button
            text: "PREV",
            click: () => {
              this.prev();
            },
          },
          next: {
            // this overrides the next button
            text: "NEXT",
            click: () => {
              this.next();
            },
          },
          today: {
            text: "今天",
            click: () => {
              this.today();
            },
          },
        },
      },
      dataList: [],
      dateTitle: "",
      detailList: [],
      flag: false,
      orderCount: [],
      userList: [],
      orderOptions: [],
      // 进度
      workActiveList: [
        { orderStatus: "待派工" },
        { orderStatus: "待执行" },
        { orderStatus: "执行中" },
        { orderStatus: "待验收" },
        { orderStatus: "已完成" },
        { orderStatus: "已关闭" },
      ],
      orderColor: {
        RCDJ: "#ACD6E4",
        JMDJ: "#C1E5F4",
        ZZDJ: "#C1DDF4",
        RCBY: "#B6E4D0",
        YJBY: "#BCE4B6",
        EJBY: "#D3E4B6",
        CGRH: "#E4E2B6",
        DQJY: "#E4D2B6",
        DZWX: "#FBC4C4",
        JDBWX: "#FBDBC4",
        WWWX: "#FBECC4",
      },
    };
  },
  watch: {
    dateTitle: {
      handler(val) {
        if (val) {
          getCalendarMonth({ date: this.dateTitle }).then((res) => {
            if (res.code === 200) {
              this.dataList = res.data.map((item, index) => ({
                ...item,
                id: item.orderCode,
                title: item.orderName,
                beginDate: item.planExecuteDate,
                endDate: item.planExecuteDate,
                status: this.orderColor[item.orderType],
                maintenanceType: item.maintenanceType,
              }));
              this.getReservationList(this.dataList);
            }
          });
          getWorkOrderCount({ date: this.dateTitle }).then((res) => {
            if (res.code === 200) {
              this.orderCount = res.data;
            }
          });
        }
      },
    },
  },
  created() {
    this.getOrderTree();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let formattedDate = `${year}-${month < 10 ? "0" + month : month}`;
    getCalendarMonth({ date: formattedDate }).then((res) => {
      if (res.code === 200) {
        this.dataList = res.data.map((item, index) => ({
          ...item,
          id: item.orderCode,
          title: item.orderName,
          beginDate: item.planExecuteDate,
          endDate: item.planExecuteDate,
          status: this.orderColor[item.orderType],
          maintenanceType: item.maintenanceType,
        }));
        this.getReservationList(this.dataList);
      }
    });
    getWorkOrderCount({ date: formattedDate }).then((res) => {
      if (res.code === 200) {
        this.orderCount = res.data;
      }
    });
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.calendarApi = this.$refs.fullCalendar.getApi();
    // document.querySelector(".fc-scroller-liquid-absolute").style.overflow = "";
    // document.querySelector(".fc-scroller-harness").style.overflow = "";
  },
  computed: {
    getImageStyle() {
      return (index) => ({
        background: `url(${this.getImageByIndex(index)}) no-repeat`,
      });
    },
  },
  methods: {
    findTreeName(options, value) {
      var name = "";
      function Name(name) {
        this.name = name;
      }
      var name1 = new Name("");
      this.forfn(options, value, name1);
      return name1.name;
    },
    forfn(options, value, name1) {
      function changeName(n1, x) {
        n1.name = x;
      }
      for (let i = 0; i < options.length; i++) {
        if (options[i].id == value) {
          changeName(name1, options[i].label);
        }
        if (options[i].children) {
          this.forfn(options[i].children, value, name1);
        }
      }
    },
    getOrderTree() {
      listUser({ pageNum: 1, pageSize: 10000 }).then((res) => {
        this.userList = res.rows.map((item) => {
          return {
            id: item.userId,
            label: item.nickName,
          };
        });
      });
      orderTemplate().then((response) => {
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
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    getColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    getImageByIndex(index) {
      switch (index) {
        case 0:
          return image1;
        case 1:
          return image2;
        case 2:
          return image3;
        case 3:
          return image4;
        default:
          return image1;
      }
    },
    handelGoDate(data) {
      if (!data) {
        this.detailList = [];
        return;
      }
      this.calendarApi.gotoDate(data);
      // ! 明细
      this.flag = true;
      getOrderDetailDay({ date: data }).then((res) => {
        if (res.code === 200) {
          this.detailList = res.data;
          if (this.detailList.length > 0) {
            this.flag = false;
          }
        }
      });
    },
    handleEventMouseEnter(val) {
      this.newElement.innerHTML = `
        <div class="title" style=" padding-bottom: 10px;">${val.event.title}</div>
        <div class="encoding">${val.event.id}</div>
        <div class="planType">计划类型：${val.event.textColor}</div>
    `;
      val.el.appendChild(this.newElement);
      // 定义一个名为`handleMouseMove`的函数来处理mousemove事件
    },
    handleEventMouseLeave(val) {
      removeElement(this.newElement);
    },
    getReservationList(arrayData) {
      let newArr = [];
      this.subList = arrayData;
      arrayData.forEach((item) => {
        newArr.push({
          ...item,
          start: this.dealWithTime(item.beginDate),
          end: this.addDate(this.dealWithTime(item.endDate), 1),
          color: item.status,
          id: item.id,
          // title: `${this.getTitle(item.beginDate, item.endDate)} ${item.title}`,
          title: `${item.title}`,
          textColor: item.maintenanceType,
        });
      });
      this.calendarOptions.events = newArr;
    }, // 日期加1天
    addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var mon =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      let endD = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      return `${d.getFullYear()}-${mon}-${endD}`;
    },
    // 获取会议事件title
    getTitle(date1, date2) {
      let start = date1.substring(11, 16);
      let end = date2.substring(11, 16);
      return `${start}~${end}`;
    },

    prev() {
      this.calendarApi.prev();
      if (this.calendarApi.currentData.viewTitle.length <= 8) {
        this.dateTitle = this.calendarApi.currentData.viewTitle
          .replace("年", "-")
          .replace("月", "");
      }
    },
    // 切换下一个按钮事件
    next() {
      this.calendarApi.next();
      if (this.calendarApi.currentData.viewTitle.length <= 8) {
        this.dateTitle = this.calendarApi.currentData.viewTitle
          .replace("年", "-")
          .replace("月", "");
      }
    },
    // 点击今天按钮
    today(e) {
      this.calendarApi.today();
      if (this.calendarApi.currentData.viewTitle.length <= 8) {
        this.dateTitle = this.calendarApi.currentData.viewTitle
          .replace("年", "-")
          .replace("月", "");
      }
    },
    handleDateClick: function (arg) {
      // ! 这里添加时间
      this.dataValue = arg.dateStr;
      if (!arg.dateStr) {
        this.detailList = [];
        return;
      }
      this.calendarApi.gotoDate(arg.dateStr);
      // ! 明细
      this.flag = true;
      getOrderDetailDay({ date: arg.dateStr }).then((res) => {
        if (res.code === 200) {
          this.detailList = res.data;
          if (this.detailList.length > 0) {
            this.flag = false;
          }
        }
      });
    },
    handleEventClick(calEvent) {
      console.log("========================", calEvent);
      this.goDetails(
        JSON.parse(JSON.stringify(calEvent.event._def.extendedProps))
      );
    },
    goDetails(row) {
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
    },
    getShowTime(beginDate, endDate) {
      this.form.startDate = this.dealWithTime(beginDate);
      this.form.startTime = this.getHoursMin(beginDate);
      this.form.endDate = this.dealWithTime(endDate);
      this.form.endTime = this.getHoursMin(endDate);
    },
    // 获取时分时间
    getHoursMin(value) {
      return value.substring(11, 16);
    },
    // 处理会议时间格式
    dealWithTime(date) {
      let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)[0];
      return newDate;
    },
    handleEvents(events) {
      console.log(events, "事件3");
    },
  },
};
</script>
<style lang='scss' scoped>
.icon {
  width: 87px;
  height: 38px;
  text-align: center;
  line-height: 34px;
  border-radius: 30px;
  border: 1px solid #e8ebf0;
  color: #ffb64f;
  background: #fff;
  font-size: 12px;
  span {
    font-weight: 700;
  }
}
.box {
  display: flex;
}
.el-row {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  &:nth-of-type(2) {
    margin-bottom: 15px;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
}

.fullLeft {
  position: relative;
  width: 80%;
  height: auto;
  padding-right: 10px;
  .data {
    position: absolute;
  }
  .statistics {
    width: 100%;
    height: 180px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e9eaef;
    li {
      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .image {
        width: 92px;
        height: 92px;
        text-align: center;
        line-height: 88px;
        font-size: 12px;

        span {
          font-size: 20px;
        }
      }
    }
  }
}

::v-deep .fc-scroller-liquid-absolute {
  overflow: visible !important;
}
.fc-event-main {
  position: relative !important;
  z-index: 1 !important;
}
.fc-daygrid-event {
  position: relative !important;
  z-index: 1 !important;
}
::v-deep .fc {
  .fc-scroller-harness {
    overflow: visible;
  }
}

.fullRight {
  width: 379px;
  height: 1200px;
  overflow: auto;
  padding: 10px;
  border: 1px solid #2c96f6;
  border-radius: 10px;
  color: #555555;
  &::-webkit-scrollbar {
    display: none;
  }
  .header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bottom {
    li {
      overflow: hidden;
      padding: 15px 10px;
      margin-bottom: 12px;
      list-style: none;
      width: 99%;
      border: 1px solid #2c96f6;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .bottom-none {
    width: 100%;
    height: 80%;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
