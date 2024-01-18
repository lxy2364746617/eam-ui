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
      v-if="!addEdit"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleAdd"
            v-hasPermi="['property:purchase:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-upload
            :before-upload="field101BeforeUpload"
            @click="handelImport"
            action=""
            v-hasPermi="['property:purchase:add']"
            ><el-button type="primary" size="mini" icon="el-icon-upload"
              >导入</el-button
            ></el-upload
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="exportWarnLog"
            v-hasPermi="['property:purchase:add']"
            >下载</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
              <el-button
                type="danger"
                
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['property:purchase:remove']"
              >删除</el-button>
            </el-col> -->
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          v-hasPermi="['property:purchase:edit']"
          >详情</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 3 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          :loading="btnLoading"
          @click="goEdit(scope.row, 'edit')"
          v-hasPermi="['property:purchase:edit']"
          >编辑</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 3 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:purchase:remove']"
          >删除</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 3 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          @click="handleSet(scope.row)"
          v-hasPermi="['property:purchase:edit']"
          >提交</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 1 || scope.row.apvStatus === 2"
          size="mini"
          type="text"
          @click="handleSet(scope.row)"
          v-hasPermi="['property:purchase:edit']"
          >审批流</el-button
        >
      </template>
    </jm-table>
  </div>
</template>
<script>
import {
  getPurchaseList,
  uploadInfo,
  download,
  delId,
} from "@/api/property/purchase";
import JmTable from "@/components/JmTable";
import { saveAs } from "file-saver";
import { listDept } from "@/api/system/dept";
export default {
  components: {
    JmTable,
  },
  dicts: ["em_device_state", "em_device_att", "apv_status", "em_device_level"],

  props: {},
  data() {
    return {
      field101fileList: [],
      btnLoading: false,
      // 查询参数
      queryParams: {
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
      equipmentList: null,
      isChoose: false,
      // 遮罩层
      loading: true,
      addEdit: false,
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
      // 弹出层标题
      title: "",
      formData: {},
      // 表单参数
      form: {},

      radioRow: {},
      deptOptions: null,
      formParams: {
        prtOrg: "Y",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "购置计划编号",
          prop: "purchasePlanNo",
          tableVisible: true,
          width: 150,
        },
        { label: "购置计划名称", prop: "purchasePlanName", tableVisible: true },
        {
          label: "购置计划类型",
          prop: "purchasePlanType",
          formType: "select",
          tableVisible: true,
          options: [
            // {
            //   value: 1,
            //   label: "年度计划",
            // },
            {
              value: 2,
              label: "临时计划",
            },
          ],
        },
        { label: "年度", prop: "annual", tableVisible: true },
        { label: "计划需求数量", prop: "planDemandNum", tableVisible: true },
        {
          label: "计划金额(万元)",
          prop: "planDemandMount",
          tableVisible: true,
          width: 120,
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
        {
          label: "申报单位",
          prop: "declarationDeptId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
        },
        {
          label: "申报人",
          prop: "declarationPerson",
          tableVisible: true,
          width: 120,
        },
        {
          label: "申报日期",
          prop: "declarationDate",
          formType: "date",
          tableVisible: true,
        },

        {
          label: "审批状态",
          prop: "apvStatus",
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.apv_status,
        },
      ];
    },
  },
  watch: {},
  async created() {
    await this.getDeptTree();
    // data赋值
    this.columns.forEach((b) => {});
    await this.getList();
  },
  mounted() {},
  methods: {
    handleSet() {},
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    handelImport() {},
    exportWarnLog(data) {
      download({ ids: this.ids, purchasePlanType: 2 }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
    // 导入
    field101BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      const fileData = new FormData();
      fileData.append("files", file);
      fileData["purchasePlanType"] = 2;
      uploadInfo(fileData);
      return false;
    },
    /** 查询用户列表 */
    async getList(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading = true;
      form["purchasePlanType"] = 2;
      getPurchaseList(form).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.$router.push("/property/purchase/temporarilyAdd");
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delId(row.id).then(async (res) => {
          if (res.code == 200) {
            await this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
      });
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/purchase/temporarilyDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/purchase/temporarilyEdit",
        query: {
          item: { ...row, isEdit: true },
        },
      });
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
