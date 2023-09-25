<template>
  <div class="box">
    <jm-table
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
            >下载</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['equipment:book:remove']"
              >删除</el-button>
            </el-col> -->
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, 'view')"
          v-hasPermi="['equipment:book:edit']"
          >详情</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, 'edit')"
          v-hasPermi="['equipment:book:edit']"
          >修改</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['equipment:book:remove']"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >提交</el-button
        >
      </template>
    </jm-table>
  </div>
</template>
<script>
import { getPurchaseList } from "@/api/property/purchase";
import Search from "@/components/HeaderSearch";
import JmTable from "@/components/JmTable";
export default {
  components: {
    JmTable,
  },
  props: {
    // isChoose: {
    //     default: false,
    //     type: Boolean,
    // },
  },
  data() {
    return {
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      equipmentList: null,
      isChoose: false,
      // 遮罩层
      loading: true,

      total: 0,
      search: {
        annual: "",
        apvStatus: "",
        createBy: "",
        createTime: "",
        declarationDate: "",
        declarationDeptId: "",
        declarationPerson: "",
        ids: [0],
        purchasePlanName: "",
        purchasePlanNo: "",
        purchasePlanType: "",
        remark: "",
        updateBy: "",
        updateTime: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},

      radioRow: {},
    };
  },
  computed: {
    columns() {
      return [
        { label: "购置计划编号", prop: "purchasePlanNo", tableVisible: true },
        { label: "购置计划名称", prop: "purchasePlanName", tableVisible: true },
        { label: "购置计划类型", prop: "purchasePlanType", tableVisible: true },
        { label: "年度", prop: "annual", tableVisible: true },
        { label: "计划需求数量", prop: "planDemandNum", tableVisible: true },
        {
          label: "计划金额(万元)",
          prop: "planDemandMount",
          tableVisible: true,
        },
        {
          label: "开工时间",
          prop: "startTime",
          tableVisible: true,
          formType: "date",
        },
        {
          label: "竣工时间",
          prop: "endTime",
          tableVisible: true,
          formType: "date",
        },
        { label: "申报单位", prop: "declarationUnit", tableVisible: true },
        { label: "申报人", prop: "declarationPerson", tableVisible: true },
        { label: "申报日期", prop: "declarationDate", tableVisible: true },
        { label: "创建人", prop: "createBy", tableVisible: true },
        { label: "创建时间", prop: "createTime", tableVisible: true },
        {
          label: "审批状态",
          prop: "apvStatus",
          tableVisible: true,
          formType: "select",
          options: [1, 2, 3],
        },
      ];
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading = true;
      getPurchaseList(form).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.$router.push("/property/purchase/annualAdd");
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  padding: 14px 15px;

  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .controls {
    padding-top: 15px;
    width: 100%;
    height: auto;
    padding-bottom: 30px;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #e9eaef;
      background: linear-gradient(
        139deg,
        #62b0ff 44.05%,
        #007bfe 105.54%,
        #007bfe 118.67%,
        #007bfe 129.22%
      );
      padding: 0;
    }
  }

  .overflow-hidden {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
