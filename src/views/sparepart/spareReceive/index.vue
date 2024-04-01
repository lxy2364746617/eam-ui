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
            v-hasPermi="['sparepart:receive:add']"
            @click="handleControls(null, 'add')"
            >领用</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload"
            size="mini"
            :loading="btnLoading"
            @click="AddFile"
            >导入</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="btnLoading"
            v-hasPermi="['sparepart:receive:download']"
            @click="handleControls(null, 'download')"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          v-hasPermi="['sparepart:receive:view']"
          @click="handleControls(scope.row, 'view')"
          >详情</el-button
        >
        <el-button
          v-if="
            scope.row.approvalStatus == 'uncommitted' ||
            scope.row.approvalStatus == 'reject' ||
            scope.row.approvalStatus == 'canceled'
          "
          size="mini"
          type="text"
          :loading="btnLoading"
          v-hasPermi="['sparepart:receive:edit']"
          @click="handleControls(scope.row, 'edit')"
          >编辑</el-button
        >
        <el-button
          v-if="
            scope.row.approvalStatus == 'uncommitted' ||
            scope.row.approvalStatus == 'reject' ||
            scope.row.approvalStatus == 'canceled'
          "
          size="mini"
          type="text"
          v-hasPermi="['sparepart:receive:delete']"
          @click="handleControls(scope.row, 'delete')"
          >删除</el-button
        >
        <el-button
          v-if="
            scope.row.approvalStatus == 'uncommitted' ||
            scope.row.approvalStatus == 'reject' ||
            scope.row.approvalStatus == 'canceled'
          "
          size="mini"
          type="text"
          v-hasPermi="['sparepart:receive:submit']"
          @click="handleControls(null, 'submit')"
          >提交</el-button
        >
        <el-button
          v-if="
            scope.row.approvalStatus == 'running' ||
            scope.row.approvalStatus == 'completed'
          "
          size="mini"
          type="text"
          v-hasPermi="['sparepart:receive:review']"
          @click="handleGoView(scope.row)"
          >审批流</el-button
        >
      </template>
    </ContTable>
    <!-- 上传文件 -->
    <!-- <el-drawer
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
    </el-drawer> -->

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
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import ContTable from "@/components/ContTable";
import {
  getAttachmentList,
  delAttachment,
  exportManagementList,
} from "@/api/sparePart/spareReceive";
import { listDept } from "@/api/system/dept";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
export default {
  components: { Wrapper, ContTable, subprocess },
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
      // 文件上传
      filedrawer: false,
      fileType: [".xlsx"],
      fileList: [],
      radioRow: {},
      tableData: [],
      subtitle: "",
      subopen: false,
      ids: [],
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
          label: "备件领用单号",
          prop: "receiptCode",
          tableVisible: true,
          width: 150,
        },
        {
          label: "备件领用单名称",
          prop: "receiptName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "领用人员",
          prop: "recruiterName",
          tableVisible: true,
          width: 150,
        },
        {
          label: "领用日期",
          prop: "receiptDate",
          formType: "date",
          tableVisible: true,
        },
        {
          label: "请求日期",
          prop: "createTime",
          formType: "date",
          tableVisible: true,
          width: 180,
        },

        { label: "备注", prop: "remark", tableVisible: true, width: 200 },
        {
          label: "审批状态",
          prop: "approvalStatus",
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
          defaultObject[column.prop] = null;
        }
      });

      return defaultObject;
    },
    // ! 提交
    sub(val, userIds) {
      definitionStart2(val.id, this.radioRow.receiptCode, "spare_receive", {
        path: "/sparepart/spareReceiveControls",
        nextUserIds: userIds,
      }).then((res) => {
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
        category: "spare_receive",
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
        category: "spare_receive",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    // !操作
    handleControls(row, act) {
      if (act === "add") {
        // ! 新增
        this.$router.push({
          path: "/sparepart/spareReceiveControls",
          query: {
            formData: null,
            isShowCard: 0,
          },
        });
        return;
      } else if (act === "view") {
        // ! 详情
        this.$router.push({
          path: "/sparepart/spareReceiveControls",
          query: { formData: row, isShowCard: 1 },
        });
        return;
      } else if (act === "edit") {
        // ! 编辑
        this.$router.push({
          path: "/sparepart/spareReceiveControls",
          query: { formData: row, isShowCard: 0, d: true },
        });
        return;
      } else if (act === "delete") {
        // ! 删除

        this.$modal
          .confirm(
            '是否确认删除备件领用单号为"' + row.receiptCode + '"的数据项？'
          )
          .then(() => {
            // return delParts(ids);
            return delAttachment(row);
          })
          .then(() => {
            this.getList(this.queryParams);
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
        return;
      } else if (act === "download") {
        exportManagementList({
          ids: this.ids.length > 0 ? this.ids : null,
          ...this.convertToDefaultObject(this.columns),
        }).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          saveAs(blob, `spareReceive_${new Date().getTime()}`);
        });
      } else if (act === "submit") {
        // ! 提交审批流
        this.handleSubmit();
      } else {
        // ! 其他
        return;
      }
    },
    async getTreeSelect() {
      await listDept().then((response) => {
        this.deptOptions = response.data;
        this.getList(this.queryParams);
      });
    },
    // //上传文件
    // AddFile() {
    //   this.filedrawer = true;
    // },
    // uploadChange2() {
    //   this.$message.success("文件上传成功！");
    //   this.filedrawer = false;
    // },
    handleGoView(row) {
      this.$router.push({
        path: "/flowable/task/finished/detail/index",
        query: {
          procInsId: row.processInstanceId,
          deployId: row.deployId,
          taskId: row.taskId,
          readonly: true,
        },
      });
    },
    async getList(queryParams) {
      this.loading = true;
      getAttachmentList(queryParams).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.radioRow = selection[0];
    },
  },
};
</script>
<style lang='scss' scoped>
.table {
  margin-top: 20px;
}
</style>
