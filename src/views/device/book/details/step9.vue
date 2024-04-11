<template>
  <div>
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="运维履历">
        <el-form v-model="searchForm">
          <el-form-item label="运维类型：">
            <el-checkbox style="margin-right:25px" v-model="selectAll" @change="selectAllCheckboxes">全部</el-checkbox>
            <el-checkbox-group v-model="searchForm.maintenanceList" style="display:inline" @change="selectCheckbox">
              <el-checkbox v-for="item in typeArr" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form>
        <div style="width:140px;position:absolute;right:10px;top:10px">
          <div :class="['btn', isTimeLine? 'isactive':'']" @click="isTimeLine=true">时间轴</div>
          <div :class="['btn', isTimeLine?'' :'isactive']" @click="isTimeLine=false">列表</div>
        </div>
        <ul v-if="isTimeLine">
          <li v-for="(item,index ) in tableData" :key="index">
            <div class="linetime" v-if="item.orderStatus=='已完成'&&( item.maintenanceType=='XDJ'||item.maintenanceType=='BYJX')">
              <div class="linetime_detail">
                <p>{{findName(typeArr,item.maintenanceType) }}</p>
                <el-divider></el-divider>
                <div>
                  <p>
                    工单状态:
                    <span style="margin-right:10px"></span>
                    <el-tag :type="item.orderStatus=='待执行'?'warning':'success'">{{item.orderStatus}}</el-tag>
                  </p>
                  <p>
                    工单类型:
                    <span style="margin-right:10px"></span>
                    {{findName(dict.type[item.maintenanceType],item.orderType)}}
                  </p>
                </div>
                <div style="width:200px">
                  <div style="display:inline-block;width:50%">
                    <p>
                      任务项:
                      <span style="margin-right:10px"></span>
                      {{item.itemNum}}
                    </p>
                    <p>
                      完成项:
                      <span style="margin-right:10px"></span>
                      {{item.itemExecuteNum}}
                    </p>
                  </div>
                  <div style="display:inline-block">
                    <el-progress :percentage="getNum(item.itemNum,item.itemExecuteNum)" :text-color="getNum(item.itemNum,item.itemExecuteNum)==100?'#52C41A':'#1F77FC'" :color="getNum(item.itemNum,item.itemExecuteNum)==100?'#52C41A':'#1F77FC'"></el-progress>
                  </div>
                </div>
                <div>
                  <div style="width:200px">
                    <div style="display:inline-block;width:50%">
                      <p>
                        异常项:
                        <span style="margin-right:24px"></span>
                        {{item.errorNum}}
                      </p>
                      <p>
                        异常处理:
                        <span style="margin-right:10px"></span>
                        {{item.errorDealNum}}
                      </p>
                    </div>
                    <div style="display:inline-block;">
                      <el-progress :percentage="getNum(item.errorNum,item.errorDealNum)" :text-color="getNum(item.errorNum,item.errorDealNum)==100?'#52C41A':'#1F77FC'" :color="getNum(item.errorNum,item.errorDealNum)==100?'#52C41A':'#1F77FC'"></el-progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="linetime" v-if="item.orderType=='DQJY'">
              <div class="linetime_detail">
                <p>{{findName(typeArr,item.maintenanceType) }}</p>
                <el-divider></el-divider>
                <div>
                  <p>
                    工单状态:
                    <span style="margin-right:10px"></span>
                    <el-tag :type="item.orderStatus=='待执行'?'warning':'success'">{{item.orderStatus}}</el-tag>
                  </p>
                  <p>
                    工单类型:
                    <span style="margin-right:10px"></span>
                    {{findName(dict.type[item.maintenanceType],item.orderType)}}
                  </p>
                </div>
                <div style="width:200px">
                  <p>
                    检测结果:
                    <span style="margin-right:10px"></span>
                    {{item.faultInfoDTO}}
                  </p>
                </div>
                <div>
                  <div style="width:200px">
                    <p>
                      检测单位:
                      <span style="margin-right:10px"></span>
                      {{item.groupId}}
                    </p>
                    <p>
                      报告上传:
                      <span style="margin-right:10px"></span>
                      {{item.specialFlag}}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="linetime" v-if="item.orderStatus=='待执行'&&(item.maintenanceType=='XDJ'||item.maintenanceType=='BYJX')">
              <div class="linetime_detail">
                <p>{{findName(typeArr,item.maintenanceType) }}</p>
                <el-divider></el-divider>
                <div>
                  <p>
                    工单状态:
                    <span style="margin-right:10px"></span>
                    <el-tag :type="item.orderStatus=='待执行'?'warning':'success'">{{item.orderStatus}}</el-tag>
                  </p>
                  <p>
                    工单类型:
                    <span style="margin-right:10px"></span>
                    {{findName(dict.type[item.maintenanceType],item.orderType)}}
                  </p>
                </div>
                <div style="width:200px">
                  <div style="display:inline-block;width:50%">
                    <p>
                      检测结果:
                      <span style="margin-right:10px"></span>
                      {{item.faultInfoDTO}}
                    </p>
                  </div>
                </div>
                <div>
                  <div style="width:200px">
                    <div style="display:inline-block;width:50%">
                      <p>
                        检测单位:
                        <span style="margin-right:24px"></span>
                        {{item.errorNum}}
                      </p>
                      <p>
                        报告上传:
                        <span style="margin-right:10px"></span>
                        {{item.specialFlag}}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="linetime" v-if="item.orderType=='SBWX'">
              <div class="linetime_detail">
                <p>{{findName(typeArr,item.maintenanceType) }}</p>
                <el-divider></el-divider>
                <div>
                  <p>
                    工单状态:
                    <span style="margin-right:10px"></span>
                    <el-tag :type="item.orderStatus=='待执行'?'warning':'success'"></el-tag>
                    {{item.orderStatus}}
                  </p>
                  <p>
                    工单类型:
                    <span style="margin-right:10px"></span>
                    {{findName(dict.type[item.maintenanceType],item.orderType)}}
                  </p>
                </div>
                <div style="width:200px">
                  <p>
                    维修人:
                    <span style="margin-right:10px"></span>
                    {{item.executor}}
                  </p>
                  <p>
                    维修类型:
                    <span style="margin-right:10px"></span>
                    {{findName(typeArr,item.maintenanceType) }}
                  </p>
                  <p>
                    完成时间:
                    <span style="margin-right:10px"></span>
                    {{item.endTime}}
                  </p>
                </div>
              </div>
            </div>
            <p style="text-align: center;">
              {{item.startTime.substring(0,10).replace(/-/g,'/')}}
              <br />
              {{item.startTime.substring(11,19)}}
            </p>
          </li>
        </ul>
        <el-table v-if="!isTimeLine" ref="table" :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="orderType" label="工单类型"></el-table-column>
          <el-table-column prop="orderCode" label="工单编号"></el-table-column>
          <el-table-column prop="orderName" label="工单名称"></el-table-column>
          <el-table-column prop="orderStatus" label="工单状态"></el-table-column>
          <el-table-column prop="itemNum" label="任务项"></el-table-column>
          <el-table-column prop="itemExecuteNum" label="完成项"></el-table-column>
          <el-table-column prop="errorNum" label="异常项"></el-table-column>
          <el-table-column prop="errorDealNum" label="异常处理"></el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="duration" label="执行时长"></el-table-column>
          <el-table-column prop="executor" label="执行人"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="运维计划">
        <el-form v-model="searchForm">
          <el-form-item label="运维类型：">
            <el-checkbox style="margin-right:25px" v-model="selectAll2" @change="selectAllCheckboxes2">全部</el-checkbox>
            <el-checkbox-group v-model="searchForm2.type" style="display:inline-block" @change="selectCheckbox2">
              <el-checkbox v-for="item in typeArr2" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form>
        <div style="width:140px;position:absolute;right:10px;top:10px">
          <div :class="['btn', isTimeLine2? 'isactive':'']" @click="isTimeLine2=true">日历</div>
          <div :class="['btn', isTimeLine2?'' :'isactive']" @click="isTimeLine2=false">列表</div>
        </div>
        <el-row :gutter="10" v-if="isTimeLine2">
          <el-col :span="16">
            <full-calendar ref="fullCalendar" :options="calendarOptions"></full-calendar>
          </el-col>
          <el-col :span="8">
            <el-card style="margin-top:64px;height:636px">
              <div class="statistics">
                <div class="statistics_title">运维计划统计</div>
                <div>
                  <div class="statistics_circle" style="border:5px solid #52C41A">{{statisticsData.patrol?statisticsData.patrol:0}}</div>
                  巡点检计划：{{statisticsData.patrol?statisticsData.patrol:0}}次
                </div>
                <div>
                  <div class="statistics_circle" style="border:5px solid #F77408">{{statisticsData.keep?statisticsData.keep:0}}</div>
                  保养检修计划：{{statisticsData.keep?statisticsData.keep:0}}次
                </div>
                <div>
                  <div class="statistics_circle" style="border:5px solid #6802B6">{{statisticsData.regular?statisticsData.regular:0}}</div>
                  定期检验计划：{{statisticsData.regular?statisticsData.regular:0}}次
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-table v-if="!isTimeLine2" ref="table" :data="tableData2" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="planCode" label="计划编号"></el-table-column>
          <el-table-column prop="planName" label="计划名称"></el-table-column>
          <el-table-column prop="ilk" label="计划类型">
            <template slot-scope="scope">{{findName(dict.type.maintain_ilk,scope.row.ilk)}}</template>
          </el-table-column>
          <el-table-column prop="planCycleType" label="计划类别"></el-table-column>
          <el-table-column prop="planBeginTime" label="计划开始时间"></el-table-column>
          <el-table-column prop="planCycle" label="计划周期"></el-table-column>
          <el-table-column prop="name" label="提前生成工单周期"></el-table-column>
          <el-table-column prop="planStatus" label="状态">
            <template slot-scope="scope">{{findName(dict.type.common_status,scope.row.planStatus)}}</template>
          </el-table-column>
        </el-table>
        <pagination v-show="total2>0" :total="total2" :page.sync="searchForm2.pageNum" :limit.sync="searchForm2.pageSize" @pagination="getList2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import { list, statistics, getMaintenanceList } from "@/api/equipment/parts";
export default {
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
  },
  components: { FullCalendar, dayGridPlugin, interactionPlugin },
  dicts: ["maintain_ilk", "common_status", "XDJ", "BYJX", "DQJY"],
  data() {
    return {
      time: "",
      isTimeLine: true,
      isTimeLine2: true,
      total: 0,
      total2: 0,
      searchForm: {
        maintenanceList: ["XDJ",'BYJX','DQJY','SBWX'],
        pageNum: 1,
        pageSize: 10,
        deviceCode: this.formData.deviceCode,
        startTime: "",
        endTime: "",
      },
      searchForm2: {
        type: ['patrol','keep','regular'],
        pageNum: 1,
        pageSize: 10,
        deviceId: this.formData.deviceId,
      },
      selectAll: true,
      selectAll2: true,
      typeArr: [
        { value: "XDJ", label: "巡点检" },
        { value: "BYJX", label: "保养检修" },
        { value: "DQJY", label: "定期检验" },
        { value: "SBWX", label: "设备修理" },
      ],
      typeArr2: [
        { value: "patrol", label: "巡点检" },
        { value: "keep", label: "保养检修" },
        { value: "regular", label: "定期检验" },
      ],
      customColors: [
        { color: "#f56c6c", percentage: 0 },
        { color: "#f56c6c", percentage: 99 },
        { color: "#52C41A", percentage: 100 },
      ],
      tableData: [],
      tableData2: [],
      statisticsData: {
        keep: 0,
        patrol: 0,
        regular: 0,
      },
      calendarOptions: {
        plugins: [timeGridPlugin,dayGridPlugin, interactionPlugin,],
        initialView: "dayGridMonth",
        locale: "zh",
        firstDay: 1,
        buttonText: {
          today: "今天",
          month: "月",
           week: "周",
          day: "日", 
          // list: "列表",
        },
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,timeGridDay",
        },
        weekNumberCalculation: "ISO",
        nowIndicator: false,
        height: 700,
        slotDuration:'00:30:00',
        allDaySlot:false,
        eventTimeFormat: {
          // 在每个事件上显示的时间的格式
          hour: "numeric", // numeric:2022,2-digit:22
          minute: "2-digit",
          meridiem: false,
          hour12: false, // 设置时间为24小时
        },
        customButtons: {
          next: {
            click: this.nextClick,
          },
          prev: {
            click: this.prevClick,
          },
        },
        events: [],
        eventMouseEnter: (info) => {
          let that = this;
          that.instance&&that.instance.destroy()
          that.instance = tippy(info.el, {
            content:
              "<div style='position:relative;width:200px'>" +
              (info.event._def.extendedProps.status == 0
                ? "<div style='width:60px;height:20px;position:absolute;right:5px;top:0;background:#E8FFEA;color:#00B42A;font-size:12px;border-radius: 2px;text-align:center;line-height:20px'><i class='el-icon-success'></i>已启用</div>"
                : "<div style='width:60px;height:20px;position:absolute;right:5px;top:0;background:rgba(234, 0, 0, 0.25);color:#EA0000;font-size:12px;border-radius: 2px;text-align:center;line-height:20px'><i class='el-icon-error'></i>已停用</div>") +
              "<p style='margin-bottom:4px'>" +
              info.event.title +
              "</p>" +
              "<p style='margin-top:4px'>" +
              info.event._def.extendedProps.code +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>计划类型:" +
              info.event._def.extendedProps.planLx +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>计划类别:" +
              that.findName(
                that.dict.type.maintain_ilk,
                info.event._def.extendedProps.planLb
              ) +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>计划周期:" +
              info.event._def.extendedProps.circle +
              "</p>" +
              "<p style='padding-left:20px;margin:4px'>计划开始时间:" +
              info.event.startStr +
              "</p>" +
              "</div>",
            theme: "light",
            placement: "right",
            allowHTML: true,
          });
        },
      },
      /* calendarOptions:{
         plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        initialView: "timeGridWeek",
        initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
      } */
    };
  },
  watch: {
    time(val) {
      this.searchForm.startTime = val ? val[0] : "";
      this.searchForm.endTime = val ? val[1] : "";
      this.getList();
    },
  },
  created() {
    this.getList();
    this.getList2();
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi();
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
    getNum(a, b) {
      let num = 0;
      if (a == 0) return (num = 100);
      else if (b == 0) return (num = 0);
      else return (num = Math.floor(a / b));
    },
    tabClick(e) {
      if (e.label == "运维计划") {
        setTimeout(() => {
          this.calendarApi.changeView("dayGridMonth");
        }, 0);
      }
    }, //
    getList() {
      getMaintenanceList(this.searchForm).then((res) => {
        this.tableData = res.data.records;
      });
    },
    getList2() {
      this.searchForm2.ilk = this.searchForm2.type
        ? this.searchForm2.type.join(",")
        : "";
      list(this.searchForm2).then((res) => {
        this.tableData2 = res.rows;
        let eventsArr = [];
        res.rows.forEach((item) => {
          let obj = {
            title: item.planName,
            start: item.planBeginTime,
            end: item.planEndTime,
            code: item.planCode,
            planLx: item.planCycleType,
            planLb: item.ilk,
            status: item.planStatus,
            circle: item.planCycle,
            backgroundColor:
              item.ilk == "patrol"
                ? "rgba(2, 182, 6, 0.7)"
                : item.ilk == "keep"
                ? "rgba(247, 116, 8, 0.75)"
                : "rgba(104, 2, 182, 0.6)",
          };
          eventsArr.push(obj);
        });
        this.calendarOptions.events = eventsArr;
      });
      statistics(this.searchForm2).then((res) => {
        this.statisticsData = res.data;
      });
    },
    selectAllCheckboxes(val) {
      if (val) {
        this.searchForm.maintenanceList = this.typeArr.map(
          (item) => item.value
        );
      } else {
        this.searchForm.maintenanceList = ["XDJ"];
      }
      this.getList();
    },
    selectAllCheckboxes2(val) {
      if (val) {
        this.searchForm2.type = this.typeArr2.map((item) => item.value);
      } else {
        this.searchForm2.type = [];
      }
      this.getList2();
    },
    selectCheckbox(val) {
      if (val.length == 4) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
      if (val.length == 0) {
        this.$message.error("请至少选择一个类型");
      } else {
        this.getList();
      }
    },
    selectCheckbox2(val) {
      if (val.length == 3) {
        this.selectAll2 = true;
      } else {
        this.selectAll2 = false;
      }
      this.getList2();
    },
    nextClick() {
      this.$refs.fullCalendar.getApi().next(); // 将日历向前移动一步（例如，一个月或一周）。
    },
    prevClick() {
      this.$refs.fullCalendar.getApi().prev(); // 将日历后退一步（例如，一个月或一周）。
    },
  },
};
</script>

<style lang='scss' scoped>
li {
  list-style: none;
  float: left;
}
.linetime {
  border-bottom: 4px solid #d9d9d9;
  padding: 20px;
  position: relative;
}
.linetime_detail {
  
  font-size: 14px;
  padding: 10px;
  box-shadow: 0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
  p {
    margin: 0;
    padding: 0;
  }
  div {
    margin: 5px 0;
  }
}
.linetime::before {
  content: "";
  width: 20px;
  height: 20px;
  background: white;
  border: 4px solid #1890ff;
  border-radius: 50%;
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
}
.el-card {
  padding-left: 10px;
}
.el-divider--horizontal {
  margin: 5px 0;
}
::v-deep .el-progress,
::v-deep .el-progress-bar {
  width: 90px !important;
}
.statistics {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 450px;
  .statistics_circle {
    width: 80px;
    height: 80px;
    display: inline-block;
    border-radius: 50%;
    text-align: center;
    line-height: 80px;
    margin-right: 30px;
  }
}
::v-deep .el-calendar__header {
  display: none !important;
}
::v-deep .el-calendar__body {
  border: 1px solid #d9d9d9 !important;
}
.btn {
  width: 50%;
  display: inline-block;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  color: #4e5969;
  border-radius: 2px;
  line-height: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
}
.isactive {
  background: #1f77fc;
  color: #fff;
}
::v-deep .fc .fc-button {
  background: #1f77fc !important;
  border: 1px solid #fff;
}
::v-deep .fc-button-active {
  background: #0256ff !important;
  border: 1px solid #fff !important;
}
::v-deep .fc .fc-button.fc-button-active:focus {
  box-shadow: 0 0 0 0.2rem rgb(31, 119, 252) !important;
}
::v-deep .el-tag {
  border: 1px solid !important;
  font-weight: 600;
}
::v-deep .custom-progress{
  .el-progress_text{
    color: inherit !important;
  }
}
</style>