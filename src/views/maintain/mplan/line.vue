<template>
  <div class="app-container" style="padding-top: 0">
    <jm-table
      :tableData="itemList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :columns="columns"
      :isRadio="isChoose"
    >
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleView(scope.row)"
          >浏览</el-button
        >
      </template>
    </jm-table>
    <div style="width: 100%; height: 68px"></div>
    <div
      style="
        position: absolute;
        bottom: 0px;
        width: 100%;
        background-color: #fff;
        text-align: center;
        padding: 20px;
        border-top: 1px solid #ddd;
      "
    >
      <el-button size="mini" @click="close">取消</el-button>
      <el-button
        size="mini"
        @click="submitRadio"
        type="primary"
        :disabled="multiple"
        >确定</el-button
      >
    </div>
    <el-dialog
      :visible="lineView"
      :before-close="
        () => {
          lineView = false;
        }
      "
      :close-on-click-modal="false"
      width="900px"
      append-to-body
    >
      <div class="title">保养路线名称</div>
      <el-form
        ref="form"
        :model="form"
        label-width="90px"
        size="small"
        style="margin: 10px auto"
      >
        <el-row :gutter="10" style="padding: 0 20px">
          <el-col :span="8">
            <el-form-item label="路线编码" prop="lineCode">
              <el-input
                v-model="form.lineCode"
                placeholder="请输入路线编码"
                disabled
              /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="路线名称" prop="lineName">
              <el-input
                v-model="form.lineName"
                placeholder="请输入路线名称"
                disabled
              /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="lineStatus">
              <el-select
                v-model="form.lineStatus"
                placeholder="请选择状态"
                disabled
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div class="title">设备列表</div>
      <el-table
        :data="mlineList"
        ref="queryTable"
        row-key="deviceCode"
        :header-cell-style="{ 'background-color': '#e7f3ff' }"
      >
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column
          label="设备编码"
          align="center"
          prop="deviceCode"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="active">{{ scope.row.deviceCode }}</span>
          </template>
        </el-table-column>
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
        >
          <template slot-scope="scope">
            {{ findTreeName(locationOptions, scope.row.location) }}
          </template>
        </el-table-column>
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
        <el-table-column
          label="日常保养"
          align="center"
          prop="dayNum"
          min-width="150"
        ></el-table-column>
        <el-table-column
          label="一级保养"
          align="center"
          prop="oNum"
          min-width="150"
        ></el-table-column>
        <el-table-column
          label="二级保养"
          align="center"
          prop="tNum"
          min-width="150"
        ></el-table-column>
        <el-table-column
          label="常规润滑"
          align="center"
          prop="cNum"
          min-width="150"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { lineList } from "@/api/maintain/mplan";
import { getMline, larchivesList } from "@/api/maintain/mline";
import JmTable from "@/components/JmTable";
import { getLocationTree } from "@/api/Location";
export default {
  name: "pointItem",
  dicts: ["mro_item_method", "mro_item_type", "sys_normal_disable"],
  components: { JmTable },
  props: {
    isChoose: {
      default: true,
      type: Boolean,
    },
    formData: {
      default: () => {},
      type: Object,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "保养路线编码", prop: "lineCode", class: true },
        { label: "保养路线名称", prop: "lineName" },
        {
          label: "启用状态",
          prop: "lineStatus",
          formType: "select",
          options: this.dict.type.sys_normal_disable,
          span: 24,
          formVisible: false,
        },
      ];
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      checkBoxRows: [],
      radioRow: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      itemList: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lineCode: null,
        lineName: null,
        lineStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      lineView: false,
      form: {},
      mlineList: [],
      locationOptions: [],
    };
  },
  created() {
    getLocationTree().then((res) => {
      this.locationOptions = this.getTreeName(res.data);
    });
    this.getList(this.queryParams);
  },
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
    handleView(row) {
      this.loading = false;
      getMline(row.lineId)
        .then((response) => {
          this.form = response.data;
          larchivesList({ lineId: this.form.lineId }).then((res) => {
            this.mlineList = res.data || [];

            this.lineView = true;
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    close() {
      this.$emit("close");
    },
    submitRadio() {
      if (this.isChoose) {
        // 单选
        this.$emit("submitRadio", this.radioRow);
      } else {
        // 多选
        this.$emit("submitRadio", this.checkBoxRows);
      }
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      queryParams.exportIds =
        this.formData.disIds && this.formData.disIds.join(",");
      queryParams.lineStatus = this.formData?.lineStatus;
      lineList(queryParams).then((response) => {
        this.itemList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.itemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.checkBoxRows = selection;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog:not(.is-fullscreen) {
  margin: 15vh auto !important;
  max-height: 70vh;
  overflow-y: auto;
}
::v-deep .el-dialog__wrapper {
  position: fixed;
  left: 200px !important;
}
.title {
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 18px;
  background: rgba(0, 116, 217, 0.08);
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>