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
              <el-col :span="18">工单来源</el-col>
              <el-col :span="6"
                ><span
                  style="color: #3eb13a; display: flex; justify-content: end"
                  v-html="findName(dict.type.order_source, item.orderSource)"
                ></span
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="19">已执行/设备数量：</el-col>
              <el-col :span="5" style="display: flex; justify-content: end"
                ><span
                  >{{ item.deviceExecuteNum }}/{{
                    item.deviceNum
                  }}&nbsp;&nbsp;</span
                ></el-col
              >
            </el-row>
            <el-row>
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
import {
  getCalendarMonth,
  getOrderDetailDay,
  getWorkOrderCount,
} from "@/api/work/schedule";

export default {
  components: { FullCalendar, dayGridPlugin, interactionPlugin, Wrapper },
  dicts: ["system_group_type", "order_source"],
  data() {
    return {
      title: "",
      newElement: null,
      dataValue: null,
      calendarOptions: {
        //   timeGridPlugin  可显示每日时间段
        height: 700,
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: "prev today next",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGrid",
          // right: 'agendaWeek,dayGridWeek,dayGrid'
        },

        buttonText: {
          // 设置按钮
          today: "今天",
          month: "月",
          week: "周",
          dayGrid: "天",
        },
        // allDaySlot: false,
        editable: false, // 在日历上是否可拖拽
        selectable: false, // 在日历上是否可以拉长
        navLinks: false, // 点击日期跳转到当天
        slotDuration: "24:00:00", //一格时间槽代表多长时间，默认00:30:00（30分钟）
        // displayEventEnd: true,//所有视图显示结束时间
        initialView: "dayGridMonth", // 设置默认显示月，可选周、日
        dateClick: this.handleDateClick,
        eventMouseEnter: this.handleEventMouseEnter,
        eventMouseLeave: this.handleEventMouseLeave,
        // eventsSet: this.handleEvents,
        select: this.handleDateSelect,

        // timezone
        // 设置日程
        events: [],
        eventColor: "#f08f00", // 修改日程背景色
        locale: "zh-cn", // 设置语言
        weekNumberCalculation: "ISO", // 周数

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
            text: "PREV",
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
    };
  },
  watch: {
    dateTitle: {
      handler(val) {
        if (val) {
          getCalendarMonth({ date: this.dateTitle }).then((res) => {
            if (res.code === 200) {
              this.dataList = res.data.map((item, index) => ({
                id: item.orderCode,
                title: item.orderName,
                beginDate: item.planExecuteDate,
                endDate: item.planExecuteDate,
                status: this.getColor(),
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
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let formattedDate = `${year}-${month < 10 ? "0" + month : month}`;
    console.log(formattedDate);
    getCalendarMonth({ date: formattedDate }).then((res) => {
      if (res.code === 200) {
        this.dataList = res.data.map((item, index) => ({
          id: item.orderCode,
          title: item.orderName,
          beginDate: item.planExecuteDate,
          endDate: item.planExecuteDate,
          status: this.getColor(),
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
    this.newElement = document.createElement("div");
    this.newElement.classList.add("new-event");
    this.newElement.style = `
          position: absolute;
          left: 50%;
          top: -100px;
          transform: translateX(-50%);
          background-color: #f7fbff;
          width: 192px;
          height: 91.85px;
          border-radius: 6px;
          font-size: 14px;
          padding: 10px 8px;
          z-index: 200;
        `;
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.calendarApi = this.$refs.fullCalendar.getApi();
    document.querySelector(".fc-scroller-liquid-absolute").style.overflow = "";
    document.querySelector(".fc-scroller-harness").style.overflow = "";
  },
  computed: {
    getImageStyle() {
      return (index) => ({
        background: `url(${this.getImageByIndex(index)}) no-repeat`,
      });
    },
  },
  methods: {
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
      // ! 左侧
      // getCalendarMonth({ date: data.slice(0, 7) }).then((res) => {
      //   if (res.code === 200) {
      //     this.dataList = res.data.map((item, index) => ({
      //       id: item.orderCode,
      //       title: item.orderName,
      //       beginDate: item.planExecuteDate,
      //       endDate: item.planExecuteDate,
      //       status: this.getColor(),
      //       maintenanceType: item.maintenanceType,
      //     }));
      //     this.getReservationList(this.dataList);
      //   }
      // });
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
      // console.log(arg, "点击了日期");
    },
    // handleEventClick(calEvent) {
    //   console.log(calEvent, "事件2");
    //   this.dialogVisible = true; // 显示dialog弹窗
    //   let id = calEvent.event.id; // 获取当前点击日程的ID
    // },
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
  height: 802px;
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
.fc-event-main {
  position: relative !important;
  z-index: 1 !important;
}
.fc-daygrid-event {
  position: relative !important;
  z-index: 1 !important; /* 创建一个透视视图 */
}
::v-deep .fc {
  .fc-scroller-harness {
    overflow: visible;
  }
}

.fullRight {
  width: 379px;
  height: 900px;
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
      height: 230px;
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
