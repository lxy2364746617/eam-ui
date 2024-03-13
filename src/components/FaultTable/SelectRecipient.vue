<template>
  <div class="app-container" style="padding-top: 0">
    <el-row :gutter="24">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <jm-table
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="isChoose"
          :handleWidth="230"
          :columns="columns"
          :showOperate="false"
        >
        </jm-table>
      </el-col>
    </el-row>
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
  </div>
</template>

<script>
import { getPurchaseList } from "@/api/property/receive";
import JmTable from "@/components/JmTable";

export default {
  name: "devicebook1",
  dicts: ["wf_process_status"],
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
        {
          label: "创建日期",
          prop: "createTime",
          tableVisible: true,
          width: 150,
          formType: "date",
        },
        { label: "领用单号", prop: "neckNo", tableVisible: true, width: 150 },
        { label: "设备数量", prop: "deviceNum", tableVisible: true },
        { label: "业务日期", prop: "neckDate", tableVisible: true },
        {
          label: "所属组织",
          prop: "affDeptName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "申请部门",
          prop: "applyDeptName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "申请部门负责人",
          prop: "applyDeptPerson",
          tableVisible: true,
        },
        {
          label: "审批状态",
          prop: "apvStatus",
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.wf_process_status,
        },
      ];
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      checkBoxRows: [],
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
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      radioRow: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      var data = {
        categoryId: this.queryParams.categoryId,
        ...queryParams,
      };
      getPurchaseList(data).then((response) => {
        // 不展示自身
        if (this.formData) {
          response.rows.forEach((b, i) => {
            if (b.deviceId == this.formData.deviceId) {
              response.rows.splice(i, 1);
            }
          });
          this.equipmentList = response.rows.filter((item) => {
            if (this.formData.disIds.includes(item.deviceId)) {
              return false;
            } else {
              return true;
            }
          });
        } else {
          this.equipmentList = response.rows;
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.checkBoxRows = selection;
    },
    setFormLabel(arr) {
      arr.forEach((b) => {
        b.label = b.fieldName;
        b.prop = b.fieldCode;
        b.required = b.required == "0" ? true : false;
      });
    },
  },
};
</script>