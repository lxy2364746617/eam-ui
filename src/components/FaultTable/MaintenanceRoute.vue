<template>
  <div>
    <div class="title">
      保养路线
      <div v-if="!disabled">
        <el-button
          type="text"
          icon="el-icon-edit"
          @click="handleAdd"
          style="margin-left: auto"
          >添加</el-button
        >
        <el-button type="text" icon="el-icon-delete" @click="allDelete"
          >批量删除</el-button
        >
      </div>
    </div>
    <jm-table
      :tableData.sync="lineList"
      ref="jmtable1"
      :columns="columns1"
      :showSearch="false"
      @switchchange="switchchange"
      style="margin-top: 20px"
      @handleSelectionChange="handleSelectionChange"
      :rightToolbarShow="false"
      :showOperate="!disabled"
    >
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="showLine(scope.row)"
          >查看</el-button
        >
        <el-button
          v-if="!disabled"
          size="mini"
          type="text"
          @click="handleDelete(scope)"
          >删除</el-button
        >
      </template>
    </jm-table>

    <!-- 添加巡点检路线 -->
    <el-drawer
      title="保养路线"
      :visible.sync="lineForm.choosedrawer"
      direction="rtl"
      size="50%"
      :wrapperClosable="false"
    >
      <mline
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="lineForm.choosedrawer = false"
        :formData="lineForm"
        v-if="lineForm.choosedrawer"
      ></mline>
    </el-drawer>

    <el-drawer
      title="关联保养检修项目 "
      :visible.sync="deviceForm.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <el-table
        v-loading="deviceForm.loading"
        :data="deviceList"
        ref="queryTable2"
        :isIndex="false"
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
              v-html="
                findName(dict.type.em_device_state, scope.row.deviceStatus)
              "
            ></span>
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
              @click="
                viewFun('RCBY', scope.row.deviceCode + lineId, scope.row.dayNum)
              "
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
              @click="
                viewFun('YJBY', scope.row.deviceCode + lineId, scope.row.oNum)
              "
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
              @click="
                viewFun('EJBY', scope.row.deviceCode + lineId, scope.row.tNum)
              "
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
              @click="
                viewFun('CGRH', scope.row.deviceCode + lineId, scope.row.cNum)
              "
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
            <span
              class="viewSpan"
              @click="
                itemFun(
                  formData.orderType,
                  scope.row.deviceId,
                  scope.row.deviceCode,
                  scope.row.fullNum,
                  scope.row.deviceCode + lineId
                )
              "
              >{{ scope.row.fullNum }} 调整项目</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <!-- 保养 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      size="60%"
      :wrapperClosable="false"
    >
      <jm-table :tableData="mlineList" ref="jmtable" :columns="columns2">
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
import MaintenancePline from "./ui/MaintenancePline";
import { larchivesList, findByDeviceIdAndItemType } from "@/api/maintain/mline";
import mline from "@/views/maintain/mplan/line";
import { getWomLine } from "@/api/work/schedule";
import { listMline } from "@/api/maintain/mline";
import { getLocationTree } from "@/api/Location";
export default {
  components: {
    JmTable,
    MaintenancePline,
    mline,
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
    columns1() {
      return [
        { label: "保养路线编码", prop: "lineCode", class: true },
        { label: "保养路线名称", prop: "lineName", class: true },
        { label: "保养设备数量", prop: "deviceNum" },
        { label: "保养项数量", prop: "sCheckNum" },
        {
          label: "是否拍照",
          prop: "photoFlag",
          formType: "switch",
          options: this.dict.type.em_is_photo,
          span: 18,
          width: 150,
        },
      ];
    },
    // 列信息
    columns() {
      return [
        { label: "保养路线编码", prop: "lineCode", class: true },
        { label: "保养路线名称", prop: "lineName", class: true },
        {
          label: "状态",
          prop: "checkStatus",
          // formType: "select",
          // options: this.dict.type.mro_s_check_status,
          span: 24,
        },
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
    lineList: {
      handler(val) {
        if (val) {
          // this.$emit("lineDTOListMaintenance", val);
          let arr = [];
          val.forEach((item) => {
            larchivesList({ lineId: item.lineId })
              .then((res) => {
                arr.push(
                  ...res.data.map((val) => ({
                    ...val,
                    lineCode: item.lineCode,
                    lineName: item.lineName,
                    photoFlag: item.photoFlag,
                  }))
                );
              })
              .catch(() => {});
          });

          this.womDevices = arr;
          console.log(this.womDevices);

          this.$emit("lineDTOListWomDevices", this.womDevices);
        }
      },
      deep: true,
      immediate: true,
    },
    maintainItems: {
      handler(val) {
        if (val) {
          this.$emit("lineDTOListMaintainItems", val);
        }
      },
      deep: true,
      immediate: true,
    },
    "formData.orderType": {
      handler(val) {
        if (val) {
          switch (val) {
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
        }
        this.plineList = this.plineList?.map((item) => ({
          ...item,
          sCheckNum: item.itemMap[val],
        }));
        this.maintainItems = [];
        this.lineForm.disIds = [];
      },
    },
  },
  data() {
    return {
      //线路数组
      choosedrawer: false,
      plineList: [],
      selectArr: [],
      // 关联点检测项目
      lineForm: {
        choosedrawer: false,
        disIds: [],
        lineStatus: 0,
      },
      lineList: [],
      drawer: false,
      title: "", //设备弹窗
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
      currentCodeLineId: "",
      maintainItems: [],
      mlineList: [],

      womDevices: [],
      locationOptions: [],
      lineId: "",
    };
  },
  created() {
    if (this.formData.orderCode) {
      getWomLine({ orderCode: this.formData.orderCode }).then((res) => {
        let data1 = res.data;
        // this.lineList = res.data;
        listMline().then((res) => {
          const filteredData = res.rows.filter((item) => {
            return data1.some((data) => data.lineCode === item.lineCode);
          });
          this.lineList = filteredData;
        });
      });
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
    handlerSubmit() {
      this.rigthData.forEach((item) => {
        item["itemType"] = this.formData.checkCycleType;
        item["deviceCode"] = this.currentCode;
        item["currentCodeLineId"] = this.currentCodeLineId;
        item["lineId"] = this.lineId;
        item["itemCodeLineId"] =
          item.deviceCode + item.itemCode + this.lineId + item.itemId +item.checkId;
        if (
          !this.maintainItems.some(
            (v) => v.itemCodeLineId === item["itemCodeLineId"]
          )
        )
          this.maintainItems.push(item);
      });

      // ! 上
      if (this.leftData.length) {
        this.leftData.forEach((v) => {
          this.maintainItems = this.maintainItems.filter(
            (t) => t.itemCodeLineId !== v.itemCodeLineId
          );
        });
      }
      this.lineList = this.lineList.map((item) => {
        return {
          ...item,
          sCheckNum: this.maintainItems.reduce(
            (v, t) => (item.lineId === t.lineId ? v + 1 : v),
            0
          ),
        };
      });
      this.drawer2 = false;
      this.rigthData = [];
      this.leftData = [];
    },
    handleDelete(row) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then((res) => {
          this.maintainItems = this.maintainItems.filter(
            (item) => item.lineId !== row.row.lineId
          );
          that.lineList.splice(row.index, 1);
        })
        .catch(() => {});
    },
    viewFun(itemType, deviceCode, num) {
      this.mlineList = this.maintainItems.filter(
        (item) => item.currentCodeLineId == deviceCode
      );
      if (this.mlineList.length == 0) {
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
    getList(itemType, deviceId) {
      findByDeviceIdAndItemType({ itemType, deviceId }).then((res) => {
        let data2 = res.data;

        this.leftData = data2.filter(
          (item) => !this.rigthData.some((data) => data.itemId === item.itemId)
        );
      });
    },
    itemFun(itemType, deviceId, deviceCode, num, currentCodeLineId) {
      this.currentCodeLineId = currentCodeLineId;
      this.currentCode = deviceCode;
      this.rigthData = [];
      this.rigthData = this.maintainItems.filter(
        (item) => item.currentCodeLineId == currentCodeLineId
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
      let row1 = row.map((item) => {
        item.photoFlag = "1";
        item.sCheckNum = 0;
        return item;
      });
      this.lineList = this.lineList.concat(row1);
      this.$set(this.lineForm, "choosedrawer", false);
    },

    handleSelectionChange(selection) {
      this.selectArr = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      let lineIds = this.lineList.map((item) => item.lineId) || [];
      this.$set(this.lineForm, "disIds", lineIds);
      this.$set(this.lineForm, "choosedrawer", true);
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
              let index = that.lineList.indexOf(element);
              that.lineList.splice(index, 1);
            });
          })
          .catch(() => {});
      }
    },
    //查看线路下的设备
    showLine(row) {
      this.$set(this.deviceForm, "loading", true);
      this.$set(this.deviceForm, "choosedrawer", true);
      this.lineId = row.lineId;
      larchivesList({ lineId: row.lineId })
        .then((res) => {
          this.deviceList = res.data || [];
          this.$set(this.deviceForm, "loading", false);
        })
        .catch(() => {
          this.$set(this.deviceForm, "loading", false);
        });
    },
    //线列表修改拍照状态
    switchchange(event, prop, row) {
      let arr = [];
      this.lineList.forEach((item, index) => {
        if (item.lineId == row.lineId) {
          item.photoFlag = row.photoFlag;
          larchivesList({ lineId: item.lineId })
            .then((res) => {
              arr.push(
                ...res.data.map((val) => ({
                  ...val,
                  lineCode: item.lineCode,
                  lineName: item.lineName,
                  photoFlag: item.photoFlag,
                }))
              );
            })
            .catch(() => {});
        }
      });
      this.womDevices = arr;

      this.$emit("lineDTOListWomDevices", this.womDevices);
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
