<template>
  <Wrapper>
    <ContTable
      class="table"
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="false"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleControls(null, 'add')"
            v-hasPermi="['property:purchase:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            :loading="btnLoading"
            @click="handleImport"
            v-hasPermi="['property:purchase:export']"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="btnLoading"
            @click="handleControls(null, 'download')"
            v-hasPermi="['property:purchase:download']"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleControls(scope.row, 'view')"
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
          :loading="btnLoading"
          @click="handleControls(scope.row, 'edit')"
          v-hasPermi="['property:purchase:edit']"
          >编辑</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus == 'uncommitted' ||
            scope.row.apvStatus == 'reject' ||
            scope.row.apvStatus == 'canceled'
          "
          size="mini"
          type="text"
          @click="handleControls(scope.row, 'delete')"
          v-hasPermi="['property:purchase:delete']"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleControls(null, 'submit')"
          v-hasPermi="['property:purchase:submit']"
          v-if="
            scope.row.apvStatus == 'uncommitted' ||
            scope.row.apvStatus == 'reject' ||
            scope.row.apvStatus == 'canceled'
          "
          >提交</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleSet(scope.row)"
          v-if="
            scope.row.apvStatus == 'completed' ||
            scope.row.apvStatus == 'running'
          "
          v-hasPermi="['property:purchase:review']"
          >审批流</el-button
        >
      </template>
    </ContTable>
    <!-- 上传文件 -->
    <el-drawer
      title="选择文件"
      :visible.sync="filedrawer"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false"
    >
      <file-upload
        :drag="true"
        @uploadChange="uploadChange2"
        :listType="'picture-card'"
        style="padding: 0 20px"
      >
      </file-upload>
    </el-drawer>

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
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import ContTable from "@/components/ContTable";
import { getPurchaseList, download, delId } from "@/api/property/purchase";
import { listDept } from "@/api/system/dept";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
import fileImport from "@/components/FileImport";
export default {
  components: { Wrapper, ContTable, subprocess, fileImport },
  dicts: ["wf_process_status"],
  data() {
    return {
      equipmentList: [],
      total: 0,
      loading: true,
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      deptOptions: [],
      ids: [],
      // 文件上传
      filedrawer: false,
      fileType: [".xlsx"],
      fileList: [],
      radioRow: {},
      tableData: [],
      subtitle: "",
      subopen: false,
    };
  },
  async created() {
    await this.getTreeSelect();
  },
  mounted() {},
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
  methods: {
    // ! 提供下载列表字段
    convertToDefaultObject(columns) {
      const defaultObject = {};

      columns.forEach((column) => {
        if (column.prop) {
          defaultObject[column.prop] = "";
        }
      });

      return defaultObject;
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
          this.getList(this.queryParams);
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
    // ! 操作
    handleControls(row, act) {
      if (act === "add") {
        // ! 新增
        this.$router.push({
          path: "/property/purchase/annualControls",
          query: {
            formData: null,
            isShowCard: 0,
          },
        });
        return;
      } else if (act === "view") {
        // ! 详情
        this.$router.push({
          path: "/property/purchase/annualControls",
          query: { formData: row, isShowCard: 1 },
        });
        return;
      } else if (act === "edit") {
        // ! 编辑
        this.$router.push({
          path: "/property/purchase/annualControls",
          query: { formData: row, isShowCard: 0, d: true },
        });
        return;
      } else if (act === "delete") {
        // ! 删除

        this.$modal
          .confirm(
            '是否确认删除购置年度计划单号为"' +
              row.purchasePlanNo +
              '"的数据项？'
          )
          .then(() => {
            // return delParts(ids);
            return delId(row.id);
          })
          .then(() => {
            this.getList(this.queryParams);
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
        return;
      } else if (act === "download") {
        download({
          ids: this.ids.length > 0 ? this.ids : null,
          ...this.convertToDefaultObject(this.columns),
        }).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          saveAs(blob, `purchase_${new Date().getTime()}`);
        });
      } else if (act === "submit") {
        // ! 提交审批流
        this.handleSubmit();
      } else {
        // ! 其他
        return;
      }
    },
    // 下载
    handleDownload() {},
    async getTreeSelect() {
      await listDept().then(async (response) => {
        this.deptOptions = response.data;
        await this.getList(this.queryParams);
      });
    },
    // ! 上传文件
    AddFile() {
      this.filedrawer = true;
    },
    uploadChange2() {
      this.$message.success("文件上传成功！");
      this.filedrawer = false;
    },
    handleSet(row) {
      this.$router.push({
        path: "/flowable/task/finished/detail/index",
        query: {
          procInsId: row.processInstanceId,
          deployId: row.deployId,
          taskId: row.taskId,
        },
      });
    },
    async getList(queryParams) {
      queryParams["purchasePlanType"] = 1;
      this.loading = true;
      getPurchaseList(queryParams).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.radioRow = selection[0];
    },
    handleImport() {
      this.$refs.fileImport.upload.open = true;
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.getList();
    },
  },
};
</script>
<style lang='scss' scoped>
.table {
  margin-top: 20px;
}
</style>
