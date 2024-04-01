<template>
  <Wrapper :title="title">
    <el-row :gutter="20" v-show="!addEdit && !deviceIndexVisible">
      <!--部门数据-->
      <!-- <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree 
          :treeData="categoryOptions" 
          @handleNodeClick="handleNodeClick" 
          style="position: fixed;top: 121px;height: calc(100vh - 141px);">
        </jm-user-tree>
      </el-col> -->
      <div>
        <el-popover
          placement="bottom"
          title=""
          style="position: fixed; z-index: 1009; top: 65px; right: 10px"
          trigger="click"
          content=""
        >
          <el-button
            type="primary"
            size="small"
            slot="reference"
            style="
              border-radius: 10px;
              width: 42px;
              height: 36px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 20px;
            "
            ><svg
              data-v-199549f2=""
              width="22"
              height="22"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                data-v-199549f2=""
                d="M16.9053 10.1252H24.0479C24.8213 10.1252 25.2081 9.72383 25.2081 8.9211V6.20235C25.2081 5.39961 24.8213 4.99532 24.0479 4.99532H16.9053C16.1319 4.99532 15.7452 5.39668 15.7452 6.20235V8.9211C15.7452 9.72383 16.1319 10.1252 16.9053 10.1252ZM18.3995 17.8156C18.6163 18.0412 18.9122 18.1701 19.2198 18.1701H24.0538C24.6954 18.1701 25.2139 17.6311 25.2139 16.9631V14.2648C25.2198 13.9426 25.0997 13.6291 24.8799 13.4006C24.6631 13.1691 24.3643 13.0402 24.0508 13.0402H19.2168C18.9063 13.0402 18.6075 13.1691 18.3877 13.4006C18.168 13.632 18.0508 13.9426 18.0538 14.2648V14.8537H8.20708V10.1457H10.7559C11.0723 10.1516 11.3741 10.0227 11.5967 9.79122C11.8194 9.55977 11.9424 9.24629 11.9366 8.91817V6.19942C11.9366 5.87715 11.8106 5.56661 11.5909 5.34102C11.3682 5.1125 11.0665 4.98946 10.7559 4.99532H5.16021C4.85259 4.99532 4.55669 5.12422 4.3399 5.34981C4.1231 5.5754 4.00005 5.88301 4.00005 6.20235V8.9211C3.99712 9.24336 4.11431 9.55684 4.33404 9.78536C4.55084 10.0168 4.84966 10.1457 5.16314 10.1457H6.72173V23.6486C6.72173 23.8537 6.80083 24.05 6.93853 24.1936C7.07916 24.34 7.26958 24.4221 7.46587 24.4221H18.0626V25.008C18.0626 25.3273 18.1856 25.635 18.4024 25.8606C18.6192 26.0861 18.9151 26.2121 19.2227 26.2121H24.0567C24.6983 26.2121 25.2169 25.6731 25.2169 25.008V22.2893C25.2169 21.9699 25.0938 21.6623 24.877 21.4367C24.6602 21.2111 24.3643 21.0852 24.0567 21.0852H19.2227C18.9151 21.0852 18.6192 21.2111 18.4024 21.4367C18.1856 21.6623 18.0626 21.9699 18.0626 22.2893V22.8781H8.20708V16.3772H18.0596V16.9631C18.0596 17.2854 18.1827 17.59 18.3995 17.8156Z"
                fill="#565C6B"
              ></path>
              <path
                data-v-199549f2=""
                d="M16.9053 10.1252H24.0479C24.8213 10.1252 25.2081 9.72383 25.2081 8.9211V6.20235C25.2081 5.39961 24.8213 4.99532 24.0479 4.99532H16.9053C16.1319 4.99532 15.7452 5.39668 15.7452 6.20235V8.9211C15.7452 9.72383 16.1319 10.1252 16.9053 10.1252ZM18.3995 17.8156C18.6163 18.0412 18.9122 18.1701 19.2198 18.1701H24.0538C24.6954 18.1701 25.2139 17.6311 25.2139 16.9631V14.2648C25.2198 13.9426 25.0997 13.6291 24.8799 13.4006C24.6631 13.1691 24.3643 13.0402 24.0508 13.0402H19.2168C18.9063 13.0402 18.6075 13.1691 18.3877 13.4006C18.168 13.632 18.0508 13.9426 18.0538 14.2648V14.8537H8.20708V10.1457H10.7559C11.0723 10.1516 11.3741 10.0227 11.5967 9.79122C11.8194 9.55977 11.9424 9.24629 11.9366 8.91817V6.19942C11.9366 5.87715 11.8106 5.56661 11.5909 5.34102C11.3682 5.1125 11.0665 4.98946 10.7559 4.99532H5.16021C4.85259 4.99532 4.55669 5.12422 4.3399 5.34981C4.1231 5.5754 4.00005 5.88301 4.00005 6.20235V8.9211C3.99712 9.24336 4.11431 9.55684 4.33404 9.78536C4.55084 10.0168 4.84966 10.1457 5.16314 10.1457H6.72173V23.6486C6.72173 23.8537 6.80083 24.05 6.93853 24.1936C7.07916 24.34 7.26958 24.4221 7.46587 24.4221H18.0626V25.008C18.0626 25.3273 18.1856 25.635 18.4024 25.8606C18.6192 26.0861 18.9151 26.2121 19.2227 26.2121H24.0567C24.6983 26.2121 25.2169 25.6731 25.2169 25.008V22.2893C25.2169 21.9699 25.0938 21.6623 24.877 21.4367C24.6602 21.2111 24.3643 21.0852 24.0567 21.0852H19.2227C18.9151 21.0852 18.6192 21.2111 18.4024 21.4367C18.1856 21.6623 18.0626 21.9699 18.0626 22.2893V22.8781H8.20708V16.3772H18.0596V16.9631C18.0596 17.2854 18.1827 17.59 18.3995 17.8156Z"
                fill="white"
              ></path></svg
          ></el-button>
          <jm-user-tree
            :treeData="categoryOptions"
            @handleNodeClick="handleNodeClick"
            style="height: calc(100vh - 141px)"
          >
          </jm-user-tree>
        </el-popover>
      </div>
      <!--用户数据-->
      <el-col :span="24" :xs="24" v-show="!addDetails">
        <dir class="header">
          <div class="chart">
            <dir class="tag">可调剂设备子公司分布</dir>
            <BarChart v-if="flag" :data="chartData.subComp"></BarChart>
          </div>
          <div class="chart">
            <dir class="tag">可调剂设备状态分布</dir>
            <BarChartBar
              v-if="flag"
              :data="chartData.deviceStatus"
            ></BarChartBar>
          </div>
          <div class="chart">
            <div class="tag">可调剂设备重要等级</div>
            <BarChartBar
              v-if="flag"
              :data="chartData.deviceLevel"
            ></BarChartBar>
          </div>
        </dir>
        <ContTable
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="isChoose"
          :handleWidth="120"
          :columns="columns"
        >
          <template slot="headerLeft" v-if="!isChoose">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['property:prescription:download']"
                >下载</el-button
              >
            </el-col>
          </template>
        </ContTable>
      </el-col>
    </el-row>
  </Wrapper>
</template>

<script>
import { findByTemplateType } from "@/api/equipment/attribute";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getDispensingChart } from "@/api/property/prescription";

import {
  listBASE,
  getBASE,
  delBASE,
  addBASE,
  updateBASE,
  countBASE,
  exportBASE,
  copyBASE,
} from "@/api/equipment/BASE";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";

import ContTable from "@/components/ContTable";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Wrapper from "@/components/wrapper";
import BarChart from "./ui/BarChart.vue";
import BarChartBar from "./ui/BarChartBar.vue";
import { getLocationTree } from "@/api/Location";
export default {
  name: "devicebook",
  dicts: [
    "em_device_state",
    "em_device_att",
    "wf_process_status",
    "em_device_level",
  ],
  components: {
    Treeselect,
    JmUserTree,
    ContTable,
    Wrapper,
    BarChart,
    BarChartBar,
  },
  props: {
    isChoose: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "设备编码", prop: "deviceCode", width: 200 },
        { label: "设备名称", prop: "deviceName", width: 200 },
        { label: "规格型号", prop: "specs", width: 200 },
        {
          label: "设备类别",
          prop: "categoryId",
          formType: "selectTree",
          options: this.categoryOptions,
          width: 280,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
        },
        { label: "财务资产编码", prop: "propertyCode", width: 200 },
        {
          label: "功能位置",
          prop: "location",
          options: this.locationOptions,
          formType: "selectTree",
          width: 230,
        },
        {
          label: "重要等级",
          prop: "level",
          formType: "select",
          options: this.dict.type.em_device_level,
        }, //(A、B、C)
        // { label:"所属子公司", prop:"",  },
        {
          label: "所属组织",
          prop: "affDeptId",
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
        },
        // {
        //   label: "当前使用组织",
        //   prop: "currDeptId",
        //   formType: "selectTree",
        //   options: this.deptOptions,
        //   width: 150,
        // },
        // { label: "入账日期", prop: "makerAoTime", formType: "date" },
        // {
        //   label: "设备属性",
        //   prop: "deviceAtt",
        //   formType: "select",
        //   options: this.dict.type.em_device_att,
        // }, //(1 设备、2 部件)
        // { label: "上级设备", prop: "parentDeviceName" }, //(0 父级)
        // {
        //   label: "审批状态",
        //   prop: "apvStatus",
        //   formType: "selectTag",
        //   options: this.dict.type.wf_process_status,
        // }, //wf_process_status
      ];
    },
  },
  data() {
    return {
      btnLoading: false,
      formData: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: null,
      countData: {},
      chartData: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      categoryOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      addEdit: false,
      addDetails: false,
      valueMap: {},
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      radioRow: {},
      // 用户导入参数

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: undefined,
      },
      deviceIndexVisible: false,
      flag: false,
      locationOptions: [],
      exportIds: [],
    };
  },
  created() {
    this.getTree();
    this.getTreeSelect();
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.fileImport.upload.open = true;
    },
    /** 查询设备档案下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
      getLocationTree().then((res) => {
        this.locationOptions = this.getTreeName(res.data);
      });
    },
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
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },

    submitRadio() {
      this.$emit("submitRadio", this.radioRow);
    },
    submitRadio2(row) {
      this.addItem.copyInputName = row.deviceName;
      this.addItem.copyInputId = row.deviceId;
      this.addItem.choosedrawer = false;
    },
    back() {
      this.addEdit = false;
      this.addDetails = false;
      this.getList(this.queryParams);
    },
    handleOpen() {
      this.addItem.addDrawer = true;
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      var data = {
        categoryId: this.queryParams.categoryId,
        ...queryParams,
      };
      this.getCount(data);
      listBASE(data).then((response) => {
        response.rows.forEach((b) => {
          Object.assign(
            b,
            b.archivesOther ? b.archivesOther : {},
            b.emArchivesExtendAtt
              ? JSON.parse(b.emArchivesExtendAtt.fieldValue)
              : {},
            b.emArchivesIndex ? JSON.parse(b.emArchivesIndex.fieldValue) : {},
            b.emArchivesSpecial
              ? JSON.parse(b.emArchivesSpecial.fieldValue)
              : {}
          );
          if (b.emArchivesExtendAtt) {
            b.emArchivesExtendAtt.fieldValue = JSON.parse(
              b.emArchivesExtendAtt.fieldValue
            );
          }
          if (b.emArchivesIndex) {
            b.emArchivesIndex.fieldValue = JSON.parse(
              b.emArchivesIndex.fieldValue
            );
          }
          if (b.emArchivesSpecial) {
            b.emArchivesSpecial.fieldValue = JSON.parse(
              b.emArchivesSpecial.fieldValue
            );
          }
        });
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询统计 */
    getCount(queryParams) {
      countBASE(queryParams).then((response) => {
        this.countData = response.data;
      });
    },
    /** 查询统计图 */
    getChart(queryParams) {
      this.flag = false;
      getDispensingChart(queryParams).then((response) => {
        this.chartData = response.data;
        this.flag = true;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.addDetails = false;
      this.queryParams.categoryId = data.parentId == 0 ? "" : data.id; // 如果是最外层，传空
      this.getCount({ categoryId: this.queryParams.categoryId });
      this.getChart({ categoryId: this.queryParams.categoryId });
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.exportIds = selection.map((item) => item.deviceId).join(",");
    },

    getTreeParent(id) {
      const path = [];
      let current = this.valueMap[id];
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path;
    },
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal
        .confirm('是否确认删除用户编号为"' + deviceIds + '"的数据项？')
        .then(function () {
          return delBASE(deviceIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // ! 提供下载列表字段
    convertToDefaultObject(columns) {
      const defaultObject = {};

      columns.forEach((column) => {
        if (column.prop) {
          defaultObject[column.prop] = null;
        }
      });

      return defaultObject;
    },
    handleExport() {
      var obj = {
        categoryId: this.queryParams.categoryId,
        exportIds: this.exportIds,
      };
      this.download(
        "equipment/base/export",
        {
          ...obj,
        },
        `device_${new Date().getTime()}.xlsx`
      );
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {},
        `user_template_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 337px;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 15px;
  background-color: #f7fbff;
  .chart {
    width: 460px;
    height: 270px;
    position: relative;
    // background-color: #fff;
    &::before {
      content: "";
      display: block;
      width: 103.5%;
      height: 10%;
      background: url("../../../assets/images/chart-down.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: -7px;
      bottom: -8%;
      z-index: 2;
    }
    .tag {
      width: 100%;
      height: 38px;
      background: linear-gradient(0deg, #e7f3ff 0%, #e7f3ff 100%),
        url(<path-to-image>), lightgray 0px 0px / 97.436% 100% no-repeat;
      margin: 0;
      padding: 0;
      color: #55566d;
      display: flex;
      justify-content: start;
      align-items: center;
      &::before {
        content: "";
        width: 30px;
        height: 38px;
        margin-left: 10px;
        display: flex;
        background: url("../../../assets/images/tag.png");
      }
    }
  }
}
</style>