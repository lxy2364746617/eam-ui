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
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-upload2"
            @click="handlerImport"
            v-hasPermi="['property:purchase:export']"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="exportWarnLog"
            v-hasPermi="['property:purchase:download']"
            >下载</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
              <el-button
                type="primary"

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
          icon="el-icon-view"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          v-hasPermi="['property:purchase:view']"
          >详情</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus == 'uncommitted' ||
            scope.row.apvStatus == 'reject' ||
            scope.row.apvStatus == 'canceled'
          "
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="goEdit(scope.row, 'edit')"
          v-hasPermi="['property:purchase:edit']"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:purchase:remove']"
          >删除</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus == 'uncommitted' ||
            scope.row.apvStatus == 'reject' ||
            scope.row.apvStatus == 'canceled'
          "
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSubmit(scope.row)"
          v-hasPermi="['property:purchase:submit']"
          >提交</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus == 'completed' ||
            scope.row.apvStatus == 'running'
          "
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="handleFlowRecord(scope.row)"
          v-hasPermi="['property:purchase:review']"
          >审批流</el-button
        >
      </template>
    </jm-table>

    <!-- 提交 -->
    <el-dialog
      :title="subtitle"
      :visible.sync="subopen"
      width="60%"
      append-to-body
    >
      <subprocess
        :tableData="tableData"
        @submit="sub"
        @getTableData="getTableData"
      ></subprocess>
    </el-dialog>

    <!-- 导入 -->
    <file-import
      @handleFileSuccess="handleFileSuccess"
      :downloadTemplateUrl="'/property/purchase/plan/importTemplate'"
      ref="fileImport"
      :isUpdate="false"
      :importUrl="'/property/purchase/plan/importPlan'"
    ></file-import>
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
import { findByTemplateType } from "@/api/equipment/attribute";
import { saveAs } from "file-saver";
import { getToken } from "@/utils/auth";
import { listDept } from "@/api/system/dept";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
import fileImport from "@/components/FileImport";
export default {
  components: {
    JmTable,
    subprocess,
    fileImport,
  },
  dicts: ["wf_process_status"],
  props: {
    // isChoose: {
    //     default: false,
    //     type: Boolean,
    // },
  },
  data() {
    return {
      subtitle: "",
      subopen: false,
      btnLoading: false,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传文件服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      // 查询参数
      queryParams: {
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
      tableData: [],
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
        {
          label: "购置计划名称",
          prop: "purchasePlanName",
          tableVisible: true,
          width: 200,
        },
        {
          label: "购置计划类型",
          prop: "purchasePlanType",
          formType: "select",
          options: [
            {
              value: 1,
              label: "年度采购",
            },
            // {
            //   value: 2,
            //   label: "临时计划",
            // },
          ],
          tableVisible: true,
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
          options: this.dict.type.wf_process_status,
        },
      ];
    },
  },
  watch: {},
  async created() {
    await this.getDeptTree();
  },
  mounted() {},
  methods: {
    // 跳转流程详情
    handleFlowRecord(row) {
      this.$router.push({
        path: "/flowable/task/finished/detail/index",
        query: {
          procInsId: row.processInstanceId,
          deployId: row.deployId,
          taskId: row.taskId,
        },
      });
    },
    // ! 导入
    /** 导入按钮操作 */
    handlerImport() {
      this.$refs.fileImport.upload.open = true;
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.getList();
    },
    // ! 提交
    sub(val) {
      definitionStart2(
        val.id,
        this.radioRow.purchasePlanNo,
        "purchase_plan",
        {}
      ).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.subopen = false;
          this.getList();
        }
      });
    },
    getTableData(val) {
      let data = {
        pageNum: val.page,
        pageSize: val.limit,
        category: "purchase_plan",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    handleSubmit(row) {
      this.subopen = true;
      this.subtitle = "提交";
      let data = {
        pageNum: 1,
        pageSize: 10,
        category: "purchase_plan",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    handleSet() {},
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
        this.getList();
      });
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
    exportWarnLog(data) {
      download({ ids: this.ids, purchasePlanType: 1 }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
    // 导入

    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    handleUploadSuccess(res, file) {},
    handleUploadError() {
      this.$message.error("图片插入失败");
    },
    async getList(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading = true;
      form["purchasePlanType"] = 1;
      getPurchaseList(form).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
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
      this.$router.push("/property/purchase/annualAdd");
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/purchase/annualDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/purchase/annualEdit",
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
    handelImport() {},
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  padding-bottom: 20px;
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
