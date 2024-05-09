<template>
  <div>
    <div class="title">
      保养设备

      <div v-if="!disabled">
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="handleAdd"
          style="margin-left: auto"
          >添加</el-button
        >
        <el-button type="text" icon="el-icon-delete" @click="allDelete"
          >批量删除</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="deviceForm.loading"
      :data="plineList"
      @selection-change="handleSelectionChange"
      ref="queryTable2"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="设备编码"
        align="center"
        prop="deviceCode"
        min-width="150"
      />
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="规格型号"
        align="center"
        prop="specs"
        min-width="150"
      />
      <el-table-column
        label="设备类别"
        align="center"
        prop="categoryName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="功能位置"
        align="center"
        prop="location"
        min-width="150"
        ><template slot-scope="scope">
          {{ findTreeName(locationOptions, scope.row.location) }}
        </template></el-table-column
      >
      <el-table-column
        label="所属子公司"
        align="center"
        prop="subCompanyName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="所属组织"
        align="center"
        prop="affDeptName"
        min-width="150"
      />
      <el-table-column label="设备状态" align="center" prop="deviceStatus">
        <template slot-scope="scope">
          <span
            v-html="findName(dict.type.em_device_state, scope.row.deviceStatus)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否拍照"
        align="center"
        prop="photoFlag"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.photoFlag">
            <el-radio
              v-for="item in dict.type.em_is_photo"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}</el-radio
            >
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formData.orderType === 'RCBY'"
        label="日常保养"
        align="center"
        prop="dayNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('RCBY', scope.row.deviceCode, scope.row.dayNum)"
            >浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="formData.orderType === 'YJBY'"
        label="一级保养"
        align="center"
        prop="oNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('YJBY', scope.row.deviceCode, scope.row.oNum)"
            >浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="formData.orderType === 'EJBY'"
        label="二级保养"
        align="center"
        prop="tNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('EJBY', scope.row.deviceCode, scope.row.tNum)"
          >
            浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="formData.orderType === 'CGRH'"
        label="常规润滑"
        align="center"
        prop="cNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('CGRH', scope.row.deviceCode, scope.row.cNum)"
          >
            浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="!disabled"
        label="操作"
        align="center"
        fixed="right"
        prop="fullNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span class="viewSpan" @click="handleDelete(scope.row)"
            >{{ scope.row.fullNum }} 删除</span
          >
          &nbsp;
          <span
            class="viewSpan"
            @click="
              itemFun(
                formData.orderType,
                scope.row.deviceId,
                scope.row.deviceCode,
                scope.row.fullNum
              )
            "
            >{{ scope.row.fullNum }} 调整项目</span
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加设备 -->
    <el-drawer
      :visible.sync="plineForm.choosedrawer"
      direction="rtl"
      title="选择设备"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="plineForm.choosedrawer = false"
        :formData="plineForm"
        v-if="plineForm.choosedrawer"
      >
      </parentdevice>
    </el-drawer>

    <!-- 点检 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      size="60%"
      :wrapperClosable="false"
    >
      <jm-table
        style="padding: 0 20px 20px"
        :tableData="lineList"
        ref="jmtable"
        :rightToolbarShow="false"
        :showSearch="false"
        :columns="columns"
      >
      </jm-table>
    </el-drawer>

    <!-- 调整项目 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer2"
      direction="rtl"
      size="70%"
      :wrapperClosable="false"
    >
      <el-row class-name="transfer-item" style="padding: 20px">
        <el-col :span="24">
          <div class="title">设备{{ title }}项目列表</div>
          <JmTable
            border
            ref="selectionLeft"
            :columns="columns2"
            :tableData="leftData"
            @getList="getList"
            @handleSelectionChange="handleSelectLAll"
            :showSearch="false"
            :rightToolbarShow="false"
            :showOperate="false"
          >
          </JmTable>
        </el-col>
        <el-col :xs="20" :sm="6" :md="4" :lg="4" class="transfer-switch">
          <el-button
            size="large"
            type="primary"
            icon="md-skip-forward"
            class="btn"
            :disabled="!selectionLeft.length"
            @click="increase"
            >添加</el-button
          >
          <el-button
            size="large"
            type="info"
            icon="ios-skip-backward-outline"
            class="btn"
            :disabled="!selectionRight.length"
            @click="decrease"
            >取消添加</el-button
          >
        </el-col>
        <el-col :span="24">
          <div class="title">已选择{{ title }}项目列表</div>
          <JmTable
            border
            ref="selectionRight"
            :columns="columns2"
            :tableData="rigthData"
            @handleSelectionChange="handleSelectRAll"
            :showSearch="false"
            :rightToolbarShow="false"
            :showOperate="false"
          >
          </JmTable>
        </el-col>
        <el-col class="footer">
          <el-button type="primary" @click="handlerSubmit">确定</el-button
          ><el-button @click="drawer2 = false">取消</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
import JmTable from "@/components/JmTable";
import SelectParentDeviceDialog from "./SelectParentDeviceDialog";
import pline from "./ui/pline";
import {
  findByDeviceIdAndItemType,
  findByDeviceId,
} from "@/api/maintain/mline";
import { getWomDevice } from "@/api/work/schedule";
import { getLocationTree } from "@/api/Location";
import parentdevice from "@/views/device/book/device";
export default {
  components: {
    JmTable,
    pline,
    SelectParentDeviceDialog,
    parentdevice,
  },
  dicts: [
    "mro_s_check_status",
    "em_is_photo",
    "em_device_state",
    "mro_m_cycle_type",
  ],
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: {},
      type: Object,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "部件", prop: "partsName" },
        { label: "保养项编码", prop: "itemCode" },
        { label: "保养项名称", prop: "itemName" },
        { label: "保养部位", prop: "itemArea" },
        { label: "保养内容", prop: "itemContent" },
        { label: "保养标准", prop: "checkStandard" },
        { label: "点数", prop: "checkNum" },
        { label: "周期", prop: "checkCycle" },
        {
          label: "保养周期类别",
          prop: "checkCycleType",
          formType: "selectTag",
          options: this.dict.type.mro_m_cycle_type,
          span: 24,
        },
        { label: "保养工具", prop: "itemTool" },
      ];
    },
    columns2() {
      return [
        { label: "部件", prop: "partsName" },
        { label: "保养项编码", prop: "itemCode", width: 150 },
        { label: "保养项名称", prop: "itemName" },
        { label: "保养部位", prop: "itemArea" },
        { label: "保养内容", prop: "itemContent", width: 300 },
        { label: "保养标准", prop: "checkStandard" },
        { label: "点数", prop: "checkNum" },
        { label: "周期", prop: "checkCycle" },
        {
          label: "保养周期类别",
          prop: "checkCycleType",
          formType: "selectTag",
          options: this.dict.type.mro_m_cycle_type,
          span: 24,
        },
        { label: "保养工具", prop: "itemTool", width: 200 },
      ];
    },
  },
  watch: {
    plineList: {
      handler(val) {
        if (val) {
          localStorage.setItem("addList", JSON.stringify(val));
          this.$emit("deviceDTOListMaintenance", val);
        }
      },
      deep: true,
      immediate: true,
    },
    maintainItems: {
      handler(val) {
        if (val) {
          this.$emit("MaintenanceEqmMaintainItems", val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      // 弹出层标题
      title: "关键点检测",
      //线路数组
      choosedrawer: false,
      plineList: [],
      selectArr: [],
      plineForm: {
        choosedrawer: false,
        disIds: [],
      }, // 关联点检测项目
      lineList: [],
      drawer: false,
      deviceForm: {
        choosedrawer: false,
        loading: false,
      },
      deviceList: [],
      // 调整项目
      drawer2: false,
      transferData: [],
      rigthData: [],
      leftData: [],
      selectionLeft: [],
      selectionRight: [],
      // ! 当前设备Code
      currentCode: "",
      maintainItems: [],
      locationOptions: [],
    };
  },
  created() {
    if (this.formData.orderCode) {
      getWomDevice({ orderCode: this.formData.orderCode, lineCode: "" }).then(
        (res) => {
          this.plineList = res.data;
        }
      );
    }
    getLocationTree().then((res) => {
      this.locationOptions = this.getTreeName(res.data);
    });
  },
  mounted() {},
  methods: {
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
    handlerSubmit() {
      this.rigthData.forEach((item) => {
        item["itemType"] = this.formData.checkCycleType;
        item["deviceCode"] = this.currentCode;
        item["currentCodeLineId"] = this.currentCodeLineId;
        item["itemCodeDeviceCodeId"] =
          item.deviceCode + item.itemCode + item.itemId +item.checkId;
        if (
          !this.maintainItems.some(
            (v) => v.itemCodeDeviceCodeId === item["itemCodeDeviceCodeId"]
          )
        )
          this.maintainItems.push(item);
      });

      // ! 上
      if (this.leftData.length) {
        this.leftData.forEach((v) => {
          this.maintainItems = this.maintainItems.filter(
            (t) => t.itemCodeDeviceCodeId !== v.itemCodeDeviceCodeId
          );
        });
      }
      this.drawer2 = false;
      this.rigthData = [];
      this.leftData = [];
    },
    handleDelete(row) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then((res) => {
          let index = that.plineList.indexOf(row);
          this.maintainItems = this.maintainItems.filter(
            (item) => item.deviceCode !== row.deviceCode
          );
          that.plineList.splice(index, 1);
        })
        .catch(() => {});
    },
    itemFun(itemType, deviceId, deviceCode, num) {
      this.currentCode = deviceCode;
      this.rigthData = [];
      this.rigthData = this.maintainItems.filter(
        (item) => item.deviceCode == deviceCode
      );

      this.getList(itemType, deviceId);

      switch (itemType) {
        case "RCBY":
          this.title = "日常保养";
          break;
        case "YJBY":
          this.title = "一级保养";
          break;
        case "EJBY":
          this.title = "二级保养";
          break;
        case "CGRH":
          this.title = "常规润滑";
          break;
        default:
          break;
      }

      this.drawer2 = true;
    },
    getList(itemType, deviceId) {
      findByDeviceIdAndItemType({ itemType, deviceId }).then((res) => {
        let data2 = res.data;

        this.leftData = data2.filter(
          (item) => !this.rigthData.some((data) => data.itemId === item.itemId)
        );
      });
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
    viewFun(itemType, deviceCode, num) {
      this.lineList = this.maintainItems.filter(
        (item) => item.deviceCode == deviceCode
      );
      if (this.lineList.length == 0) {
        this.$modal.msgWarning("浏览量为0");
      } else {
        switch (itemType) {
          case "RCBY":
            this.title = "日常保养";
            break;
          case "YJBY":
            this.title = "一级保养";
            break;
          case "EJBY":
            this.title = "二级保养";
            break;
          case "CGRH":
            this.title = "常规润滑";
            break;
          default:
            break;
        }
        this.drawer = true;
        // findByDeviceIdAndItemType(data).then((res) => {
        //   this.lineList = res.data;
        //   this.drawer = true;
        // });
      }
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
    submitRadio2(row) {
      let deviceIds = row.map((item) => item.deviceId);
      let formData = new FormData();
      formData.append("deviceIds", deviceIds.toString());

      findByDeviceId(formData).then((res) => {
        let row1 = JSON.parse(JSON.stringify(res.data)).map((item) => {
          item.photoFlag = "1";
          // item.location = this.findTreeName(
          //   this.locationOptions,
          //   item.location
          // );
          return item;
        });
        this.plineList = this.plineList.concat(row1);
      });
      // this.plineList = this.plineList.concat(row1);
      this.$set(this.plineForm, "choosedrawer", false);
    },
    //巡点检路线列表修改拍照状态
    handleStatusChange(event, prop, row) {
      this.plineList.forEach((item, index) => {
        if (item.lineId == row.lineId) {
          item.photoFlag = row.photoFlag;
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      let lineIds = this.plineList.map((item) => item.deviceId) || [];
      this.$set(this.plineForm, "disIds", lineIds);
      this.$set(this.plineForm, "choosedrawer", true);
    },
    handleSelectionChange(selection) {
      this.selectArr = selection;
    },
    allDelete() {
      var that = this;
      if (this.selectArr.length == 0) {
        this.$modal.msgWarning("请至少选择一项");
      } else {
        this.$modal
          .confirm("是否确认删除？")
          .then(function () {
            that.selectArr.forEach((element) => {
              let index = that.plineList.indexOf(element);
              that.plineList.splice(index, 1);
            });
          })
          .catch(() => {});
      }
    },
    // 调整项目
    // 左边表格全选/取消
    handleSelectLAll(selection) {
      this.selectionLeft = [...selection];
    },

    // 右边表格全选/取消
    handleSelectRAll(selection) {
      this.selectionRight = [...selection];
    },

    // 左边表格多选
    handleSelectL(selection, row) {
      this.selectionLeft = [...selection];
    },

    // 右边表格多选
    handleSelectR(selection, row) {
      this.selectionRight = [...selection];
    },

    // 添加
    increase() {
      const ids = this.selectionLeft.map((mp) => mp.itemId);
      const filterRData = this.leftData.filter(
        (el) => !ids.some((e) => e === el.itemId)
      );
      this.leftData = [...filterRData];
      this.rigthData = [...this.rigthData, ...this.selectionLeft];
      this.selectionLeft.length = 0;
    },

    // 取消
    decrease() {
      const ids = this.selectionRight.map((mp) => mp.itemId);
      const filterRData = this.rigthData.filter(
        (el) => !ids.some((e) => e === el.itemId)
      );
      this.rigthData = [...filterRData];
      this.leftData = this.leftData.concat(this.selectionRight);
      this.selectionRight.length = 0;
    },
  },
};
</script>
<style lang='scss' scoped>
.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 30px;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 18px;
}
.viewSpan {
  color: #007bfe;
  cursor: pointer;
  text-decoration: underline;
}
.transfer-switch {
  margin: 20px 0;
  overflow: hidden;
  display: flex;
  width: 200px;
  .btn {
    margin-right: 15px;
  }
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
