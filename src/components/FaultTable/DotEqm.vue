<template>
  <div>
    <div class="title">
      巡点检设备
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
      ></el-table-column>
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
          <span
            v-if="disabled"
            v-html="findName(dict.type.em_is_photo, scope.row.photoFlag)"
          ></span>
          <el-radio-group v-else v-model="scope.row.photoFlag">
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
        v-if="formData.orderType === 'RCDJ'"
        label="日常点检"
        align="center"
        prop="dayNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('RCDJ', scope.row.deviceId, scope.row.dayNum)"
            >{{ scope.row.dayNum }} 浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="formData.orderType === 'JMDJ'"
        label="精密点检"
        align="center"
        prop="preNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('JMDJ', scope.row.deviceId, scope.row.preNum)"
            >{{ scope.row.preNum }} 浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="formData.orderType === 'ZZDJ'"
        label="专职点检"
        align="center"
        prop="fullNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            class="viewSpan"
            @click="viewFun('ZZDJ', scope.row.deviceId, scope.row.fullNum)"
            >{{ scope.row.fullNum }} 浏览</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="!disabled"
        label="操作"
        align="center"
        prop="fullNum"
        min-width="150"
      >
        <template slot-scope="scope">
          <span class="viewSpan" @click="handleDelete(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加设备 -->
    <el-drawer
      title="选择上级设备"
      :visible.sync="plineForm.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <SelectParentDeviceDialog
        v-if="plineForm.choosedrawer"
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="plineForm.choosedrawer = false"
      ></SelectParentDeviceDialog>
    </el-drawer>

    <!-- 点检 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      size="60%"
      :wrapperClosable="false"
    >
      <jm-table :tableData="lineList" ref="jmtable" :columns="columns">
      </jm-table>
    </el-drawer>
  </div>
</template>
<script>
import JmTable from "@/components/JmTable";
import SelectParentDeviceDialog from "./SelectParentDeviceDialog";
import pline from "./ui/pline";
import { getWomDevice } from "@/api/work/schedule";
import {
  findByDeviceIdAndItemType,
  findByDeviceId,
} from "@/api/maintain/pline";
export default {
  components: {
    JmTable,
    pline,
    SelectParentDeviceDialog,
  },
  dicts: ["mro_s_check_status", "em_is_photo", "em_device_state"],
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
        { label: "巡点检项目编码", prop: "itemCode" },
        { label: "部件", prop: "partsName" },
        { label: "巡点检内容", prop: "itemContent" },
        { label: "巡点检点数", prop: "checkNum" },
        {
          label: "巡点检状态",
          prop: "checkStatus",
          formType: "select",
          options: this.dict.type.mro_s_check_status,
          span: 24,
        },
        { label: "巡点检标准", prop: "checkStandard" },
        { label: "巡点检方法", prop: "itemMethod" },
        { label: "巡点检结果类型", prop: "checkResType" },
        { label: "巡点检结果设置", prop: "checkResult" },
        { label: "定量值", prop: "quotaValue" },
        { label: "定量上限", prop: "quotaUpper" },
        { label: "定量下限", prop: "quotaLower" },
        { label: "定量单位", prop: "quotaUnit" },
      ];
    },
    columns2() {
      return [
        {
          label: "姓名",
          prop: "name",
          tableVisible: true,
        },
        {
          label: "年龄",
          prop: "age",
          tableVisible: true,
        },
        {
          label: "地址",
          prop: "address",
          tableVisible: true,
        },
      ];
    },
  },
  watch: {
    plineList: {
      handler(val) {
        if (val) {
          localStorage.setItem("addList", JSON.stringify(val));
          this.$emit("XDJSB", val);
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
  },
  mounted() {},
  methods: {
    handleDelete(row) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          let index = that.plineList.indexOf(row);
          that.plineList.splice(index, 1);
        })
        .catch(() => {});
    },
    itemFun() {
      this.title = "日常保养项";
      this.leftData = [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
          id: 1,
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
          id: 2,
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
          id: 3,
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
          id: 4,
        },
      ];
      this.drawer2 = true;
    },
    viewFun(itemType, deviceId, num) {
      if (num == 0) {
        this.$modal.msgSuccess("浏览量为0");
      } else {
        switch (itemType) {
          case "RCDJ":
            this.title = "日常点检项";
            break;
          case "JMDJ":
            this.title = "精密点检项";
            break;
          case "ZZDJ":
            this.title = "专职点检项";
            break;
          default:
            break;
        }
        let data = {
          itemType,
          deviceId,
        };
        findByDeviceIdAndItemType(data).then((res) => {
          this.lineList = res.data;
          this.drawer = true;
        });
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
          return item;
        });
        this.plineList = this.plineList.concat(row1);
      });
      // this.plineList = this.plineList.concat(row1);
      this.$set(this.plineForm, "choosedrawer", false);
    },

    /** 新增按钮操作 */
    handleAdd() {
      let lineIds = this.plineList.map((item) => item.deviceCode) || [];
      this.$set(this.plineForm, "disIds", lineIds);
      this.$set(this.plineForm, "choosedrawer", true);
    },
    handleSelectionChange(selection) {
      this.selectArr = selection;
    },
    allDelete() {
      var that = this;
      if (this.selectArr.length == 0) {
        this.$modal.msgSuccess("请至少选择一项");
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
      const ids = this.selectionLeft.map((mp) => mp.id);
      const filterRData = this.leftData.filter(
        (el) => !ids.some((e) => e === el.id)
      );
      this.leftData = [...filterRData];
      this.rigthData = [...this.rigthData, ...this.selectionLeft];
      this.selectionLeft.length = 0;
    },

    // 取消
    decrease() {
      const ids = this.selectionRight.map((mp) => mp.id);
      const filterRData = this.rigthData.filter(
        (el) => !ids.some((e) => e === el.id)
      );
      this.rigthData = [...filterRData];
      this.leftData = this.leftData.concat(this.selectionRight);
      this.selectionRight.length = 0;
    },
  },
};
</script>
<style lang='scss' scoped>
// ! title
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
</style>
