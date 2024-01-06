<template>
  <div>
    <div class="title">
      巡点检路线
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
    <jm-table
      :tableData.sync="plineList"
      ref="jmtable1"
      :columns="formData.orderCode ? columnData : columns1"
      :showSearch="false"
      @switchchange="handleStatusChange"
      :rightToolbarShow="false"
      style="margin-top: 20px"
    >
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="showLine(scope.row)"
          v-hasPermi="['maintain:pline:remove']"
          >查看</el-button
        >
        <el-button
          v-if="!disabled"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope)"
          v-hasPermi="['maintain:pline:remove']"
          >删除</el-button
        >
      </template>
    </jm-table>

    <!-- 添加巡点检路线 -->
    <el-drawer
      title="巡点检路线"
      :visible.sync="plineForm.choosedrawer"
      direction="rtl"
      size="40%"
      :wrapperClosable="false"
    >
      <pline
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="plineForm.choosedrawer = false"
        :formData="plineForm"
        v-if="plineForm.choosedrawer"
      ></pline>
    </el-drawer>
    <el-drawer
      title="关联巡点检项"
      :visible.sync="deviceForm.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <el-table
        v-loading="deviceForm.loading"
        :data="deviceList"
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
              v-html="
                findName(dict.type.em_device_state, scope.row.deviceStatus)
              "
            ></span>
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
      </el-table>
    </el-drawer>
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
import { getPplan } from "@/api/maintain/pplan";
import {
  larchivesList,
  findByDeviceIdAndItemType,
  listPline,
} from "@/api/maintain/pline";
import { listResource, addResource, delResource } from "@/api/system/resource";
import JmTable from "@/components/JmTable";
import pline from "@/views/maintain/pplan/pline";
import { getWomLine } from "@/api/work/schedule";
export default {
  name: "Template",
  dicts: ["mro_s_check_status", "mro_is_photo", "em_device_state"],
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
  components: { JmTable, pline },
  computed: {
    columns1() {
      return [
        { label: "巡点检路线编码", prop: "lineCode", class: true },
        { label: "巡点检路线名称", prop: "lineName", class: true },
        { label: "巡点检设备数量", prop: "deviceNum" },
        { label: "日常巡点检", prop: "sCheckNum" },
        {
          label: "是否拍照",
          prop: "photoFlag",
          formType: "switch",
          options: this.dict.type.mro_is_photo,
          span: 24,
        },
      ];
    },
    columns2() {
      return [
        { label: "文件名", prop: "originalFileName", class: true },
        { label: "创建时间", prop: "createTime", formType: "date" },
        { label: "创建人", prop: "createBy" },
        { label: "文件大小", prop: "fileSize" },
      ];
    },
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
  },
  data() {
    return {
      columnData: [
        { label: "巡点检路线编码", prop: "lineCode", class: true },
        { label: "巡点检路线名称", prop: "lineName", class: true },
        { label: "巡点检设备数量", prop: "deviceNum" },
        { label: "日常巡点检", prop: "sCheckNum" },
      ],
      // 遮罩层
      planId: "",
      loading: true,
      btnLoading: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: undefined,
      },
      // 表单参数
      form: {
        planId: null,
        planCode: null,
        planName: null,
        planStatus: "0",
        itemType: null,
        planCycle: null,
        planCycleType: null,
        planBeginTime: null,
        planEndTime: null,
        thisExecuteTime: null,
        nextExecuteTime: null,
        groupId: null,
        executor: null,
        director: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 弹出层标题
      title: "关键点检测",
      //线路数组
      choosedrawer: false,
      plineList: [],
      selectArr: [],
      plineForm: {
        choosedrawer: false,
        disIds: [],
      },
      //设备弹窗
      deviceForm: {
        choosedrawer: false,
        loading: false,
      },
      deviceList: [],
      // 关联点检测项目
      lineList: [],
      drawer: false,
      title: "",
      //文档
      fileList: [],
      filedrawer: false,
      fileType: [".xlsx"],
      fileResourceList: [],
      // 表单校验
      rules: {
        planName: [
          {
            required: true,
            message: "巡点检计划名称不能为空",
            trigger: "blur",
          },
        ],
        lineStatus: [
          { required: true, message: "计划状态不能为空", trigger: "blur" },
        ],
        itemType: [
          { required: true, message: "巡点检类型不能为空", trigger: "blur" },
        ],
        planCycle: [
          { required: true, message: "巡点检周期不能为空", trigger: "blur" },
        ],
        planCycleType: [
          {
            required: true,
            message: "巡点检周期类别不能为空",
            trigger: "blur",
          },
        ],
        planBeginTime: [
          { required: true, message: "计划开始时间不能为空", trigger: "blur" },
        ],
        planEndTime: [
          { required: true, message: "计划结束时间不能为空", trigger: "blur" },
        ],
        thisExecuteTime: [
          { required: true, message: "本次执行日期不能为空", trigger: "blur" },
        ],
        nextExecuteTime: [
          { required: true, message: "下次执行日期不能为空", trigger: "blur" },
        ],
        groupId: [
          { required: true, message: "巡点检班组不能为空", trigger: "blur" },
        ],
        executor: [
          {
            required: true,
            message: "巡点检执行人日期不能为空",
            trigger: "blur",
          },
        ],
        director: [
          { required: true, message: "巡点检负责人不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    plineList: {
      handler(val) {
        if (val) {
          this.$emit("lineDTOList", val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.disabled = this.$route.query.d == "true";
    // if (this.$route.query.l) {
    //   this.planId = this.$route.query.l;
    //   this.getDetails(this.$route.query.l);
    // } else {
    //   this.planId = "";
    //   this.loading = false;
    // }
    if (this.formData.orderCode) {
      getWomLine({ orderCode: this.formData.orderCode }).then((res) => {
        let data1 = res.data;
        // this.lineList = res.data;
        listPline().then((res) => {
          const filteredData = res.rows.filter((item) => {
            return data1.some((data) => data.lineCode === item.lineCode);
          });
          this.plineList = filteredData;
        });
      });
    }
  },
  methods: {
    submitRadio2(row) {
      let row1 = row.map((item) => {
        item.photoFlag = "Y";
        return item;
      });
      this.plineList = this.plineList.concat(row1);
      this.$set(this.plineForm, "choosedrawer", false);
    },
    /** 查询设备平台_表单模板列表 */
    getDetails(queryParams) {
      this.loading = true;
      getPplan(queryParams)
        .then((response) => {
          let { mroPatrolPlanLineList, fileResourceList, ...other } =
            response.data;
          this.form = other;
          this.plineList = mroPatrolPlanLineList || [];
          this.fileResourceList = fileResourceList || [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      let lineIds = this.plineList.map((item) => item.lineId) || [];
      this.$set(this.plineForm, "disIds", lineIds);
      this.$set(this.plineForm, "choosedrawer", true);
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          that.plineList.splice(scope.$index, 1);
        })
        .catch(() => {});
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
    goback() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },

    handleSelectionChange(selection) {
      this.selectArr = selection;
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
    //巡点检路线列表修改拍照状态
    handleStatusChange(event, prop, row) {
      this.plineList.forEach((item, index) => {
        if (item.lineId == row.lineId) {
          item.photoFlag = row.photoFlag;
        }
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
    //查看线路下的设备
    showLine(row) {
      this.$set(this.deviceForm, "loading", true);
      this.$set(this.deviceForm, "choosedrawer", true);
      larchivesList({ lineId: row.lineId })
        .then((res) => {
          this.deviceList = res.data || [];
          this.$set(this.deviceForm, "loading", false);
        })
        .catch(() => {
          this.$set(this.deviceForm, "loading", false);
        });
    },
    //上传文件
    AddFile() {
      this.fileList = [];
      this.filedrawer = true;
    },
    uploadChange2(val) {
      this.fileResourceList = this.fileResourceList.concat(val);
      this.fileList = [];
      this.filedrawer = false;
    },
    /** 删除按钮操作 */
    handleDelete2(row) {
      var name = row.originalFileName;
      let that = this;
      this.$modal
        .confirm('是否确认删除名称为"' + name + '"的数据项？')

        .then(() => {
          that.fileResourceList.forEach((element, index) => {
            if (element.name == row.name) {
              that.fileResourceList.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
    downloadFile(row) {
      this.download(
        "common/download",
        {
          fileName: row.fileName,
        },
        row.originalFileName
      );
    },
    handlePreview(row) {
      window.open(process.env.VUE_APP_BASE_API + row.fileName);
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep {
  .el-select,
  .el-date-editor {
    width: 100%;
  }

  .el-tabs__nav-scroll {
    width: 50% !important;
    margin: 0 auto !important;
  }

  .el-tabs__nav-wrap {
    padding-top: 10px;
  }

  .el-tabs__nav-wrap::after {
    top: 0;
  }
}

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
  align-items: center;padding: 0 18px;
}

.viewSpan {
  color: #007bfe;
  cursor: pointer;
  text-decoration: underline;
}
</style>
          