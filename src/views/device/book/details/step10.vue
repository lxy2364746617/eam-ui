<template>
  <div>
    <el-form v-model="searchForm">
      <el-form-item label="周转类型：">
        <el-checkbox style="margin-right:25px" v-model="selectAll" @change="selectAllCheckboxes">全部</el-checkbox>
        <el-checkbox-group v-model="searchForm.busTypeList" style="display:inline" @change="selectCheckbox">
          <el-checkbox v-for="item in zzType" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="日期范围：">
        <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="width:140px;position:absolute;right:0;top:0;z-index:1">
      <div :class="['btn', isTimeLine? 'isactive':'']" @click="isTimeLine=true">时间轴</div>
      <div :class="['btn', isTimeLine?'' :'isactive']" @click="isTimeLine=false">列表</div>
    </div>
    <ul v-if="isTimeLine">
      <li v-for="(item,index ) in tableData" :key="index">
        <div class="linetime" v-if="item.busType=='设备入库'">
          <div class="linetime_detail">
            <p style="margin-bottom:15px">{{item.busType}}</p>
            <p>
              <span style="margin-right:10px">所属组织:</span>
              <span>{{findTreeName(deptOptions,item.affDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">功能位置:</span>
              <span>{{item.location}}</span>
            </p>
            <p>
              <span style="margin-right:10px">设备状态:</span>
              <span>{{findTreeName(dict.type.em_device_state,item.deviceStatus)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">使用组织:</span>
              <span>{{findTreeName(deptOptions,item.affDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">使用部门:</span>
              <span>{{findTreeName(deptOptions,item.affDept)}}</span>
            </p>
          </div>
        </div>
        <div class="linetime" v-if="item.busType=='设备领用'||item.busType=='设备回退'">
          <div class="linetime_detail">
            <p style="margin-bottom:15px">{{item.busType}}</p>
            <p>
              <span style="margin-right:10px">所属组织:</span>
              <span>{{findTreeName(deptOptions,item.affDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">调出部门:</span>
              <span>{{findTreeName(deptOptions,item.outDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">申请部门:</span>
              <span>{{findTreeName(deptOptions,item.applyDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标功能位置:</span>
              <span>{{item.targetLocation}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标设备状态:</span>
              <span>{{item.targetDeviceStatus}}</span>
            </p>
          </div>
        </div>
        <div class="linetime" v-if="item.busType=='设备移交'">
          <div class="linetime_detail">
            <p style="margin-bottom:15px">{{item.busType}}</p>
            <p>
              <span style="margin-right:10px">所属组织:</span>
              <span>{{findTreeName(deptOptions,item.affDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">调出部门:</span>
              <span>{{findTreeName(deptOptions,item.outDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">调入部门:</span>
              <span>{{findTreeName(deptOptions,item.inDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标功能位置:</span>
              <span>{{item.targetLocation}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标设备状态:</span>
              <span>{{item.targetDeviceStatus}}</span>
            </p>
            <div :class="['linetime_status',item.apvStatus]">
              <div class="triangle"></div>
              {{findName(dict.type.wf_process_status,item.apvStatus)}}
            </div>
          </div>
        </div>
        <div class="linetime" v-if="item.busType=='位置状态变动'">
          <div class="linetime_detail">
            <p style="margin-bottom:15px">{{item.busType}}</p>
            <p>
              <span style="margin-right:10px">当前功能位置:</span>
              <span>{{item.location}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标功能位置:</span>
              <span>{{item.targetLocation}}</span>
            </p>
            <p>
              <span style="margin-right:10px">当前设备状态:</span>
              <span>{{findTreeName(dict.type.em_device_state,item.deviceStatus)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标设备状态:</span>
              <span>{{item.targetDeviceStatus}}</span>
            </p>
            <p>
              <span style="margin-right:10px">当前使用组织:</span>
              <span>{{item.org}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标使用组织:</span>
              <span>{{item.targetOrg}}</span>
            </p>
            <p>
              <span style="margin-right:10px">当前使用部门:</span>
              <span>{{item.affDept}}</span>
            </p>
            <p>
              <span style="margin-right:10px">目标使用部门:</span>
              <span>{{item.targetDept}}</span>
            </p>
          </div>
        </div>
        <div class="linetime" v-if="item.busType=='设备报废'">
          <div class="linetime_detail">
            <p style="margin-bottom:15px">{{item.busType}}</p>
            <p>
              <span style="margin-right:10px">所属组织:</span>
              <span>{{findTreeName(deptOptions,item.affDept)}}</span>
            </p>
            <p>
              <span style="margin-right:10px">功能位置:</span>
              <span>{{item.location}}</span>
            </p>
          </div>
        </div>

        <p style="text-align: center;">
          {{item.createTime.substring(0,10).replace(/-/g,'/')}}
          <br />
          {{item.createTime.substring(11,19)}}
        </p>
      </li>
    </ul>

    <el-table v-if="!isTimeLine" ref="table" :data="tableData" style="width: 100%;">
      <!--       <el-table-column type="selection" width="55"></el-table-column>
      -->
      <el-table-column prop="busCode" label="业务单号"></el-table-column>
      <el-table-column prop="createTime" label="业务日期"></el-table-column>
      <el-table-column prop="applyDept" label="申请部门">
        <template slot-scope="scope">{{findTreeName(deptOptions,scope.row.applyDept)}}</template>
      </el-table-column>
      <el-table-column prop="inDept" label="调入部门">
        <template slot-scope="scope">{{findTreeName(deptOptions,scope.row.inDept)}}</template>
      </el-table-column>
      <el-table-column prop="outDept" label="调出部门">
        <template slot-scope="scope">{{findTreeName(deptOptions,scope.row.outDept)}}</template>
      </el-table-column>
      <el-table-column prop="affDept" label="所属组织">
        <template slot-scope="scope">{{findTreeName(deptOptions,scope.row.affDept)}}</template>
      </el-table-column>
      <el-table-column prop="apvStatus" label="单据状态">
        <template slot-scope="scope">{{findName(dict.type.wf_process_status,scope.row.apvStatus)}}</template>
      </el-table-column>
      <el-table-column prop="busType" label="业务类型"></el-table-column>
    </el-table>
    <pagination v-if="!isTimeLine" v-show="total>0" :total="total" :page.sync="searchForm.pageNum" :limit.sync="searchForm.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getDeviceResume } from "@/api/equipment/parts";
import { listDept } from "@/api/system/dept";
import {getPrtOrgTreeByDeptId} from '@/api/equipment/BASE'
export default {
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
  },
  dicts: ["wf_process_status", "wf_process_status", "em_device_state"],
  data() {
    return {
      time: "",
      tableData: [],
      deptOptions: [],
      total: 0,
      isTimeLine: true,
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        busTypeList: ['device_warehousing','device_neck','device_back','device_transfer','em_position_change','device_scrapped'],
        deviceId: this.formData.deviceId,
        deviceCode: this.formData.deviceCode,
        startTime: "2023-02-11",
        endTime: "2024-02-11",
      },
      selectAll: true,
      zzType: [
        { label: "设备入库", value: "device_warehousing" },
        { label: "设备领用", value: "device_neck" },
        { label: "设备回退", value: "device_back" },
        { label: "设备移交", value: "device_transfer" },
        { label: "位置状态变动", value: "em_position_change" },
        { label: "设备报废", value: "device_scrapped" },
      ],
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
    this.getTreeSelect();
    //this.getList();
  },
  methods: {
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value || options[i].id == value) {
          name = options[i].label;
        }
        if (options[i].children) {
          this.findName(options[i].children, value);
        }
      }
      return name || value;
    },
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
    getTreeSelect() {
      this.deptOptions = [];
      getPrtOrgTreeByDeptId().then((response) => {
        this.$set(this, "deptOptions", response.data);
        this.$forceUpdate();
      });
    },
    getList() {
      getDeviceResume(this.searchForm).then((res) => {
        this.tableData = res.rows;
      });
    },
    selectAllCheckboxes(val) {
      if (val) {
        this.searchForm.busTypeList = this.zzType.map((item) => item.value);
      } else {
        this.searchForm.busTypeList = ["device_warehousing"];
      }
      this.getList();
    },
    selectCheckbox(val) {
      if (val.length == 6) {
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
  },
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  float: left;
}
.linetime {
  border-bottom: 4px solid #d9d9d9;
  padding: 20px;
  position: relative;
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
.linetime_detail {
  position: relative;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  box-shadow: 0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
  p {
    margin: 3px;
    padding: 0;
  }
  div {
    margin: 5px 0;
  }
}
.linetime_status {
  width: 65px;
  height: 20px;
  position: absolute;
  right: 0;
  bottom: 7px;
  padding-left: 10px;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  .triangle {
    width: 0;
    height: 0;
    border-left: 10px solid #fff;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    left: 0;
    top: -5px;
  }
}
.uncommitted,
.running {
  background: rgba(31, 119, 252, 0.25);
  color: #1f77fc;
}
.terminated,
.reject,
.canceled {
  background: rgba(234, 0, 0, 0.25);
  color: #ea0000;
}
.completed {
  background: rgba(16, 174, 8, 0.25);
  color: #10ae08;
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
.btn {
  width: 50%;
  display: inline-block;
  text-align: center;
  background: rgb(229, 229, 229);
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
</style>