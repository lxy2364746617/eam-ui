<template>
  <div class="box">
    <jm-table
      :tableData="dataList"
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :loading="btnLoading"
          @click="handleAdd"
          v-hasPermi="['property:scrapping:add']"
          >新增</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-upload2"
          @click="handlerImport"
          >导入</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="exportWarnLog"
          v-hasPermi="['property:scrapping:add']"
          >下载</el-button
        >
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          v-hasPermi="['property:scrapping:edit']"
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
          v-hasPermi="['property:scrapping:edit']"
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
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:scrapping:remove']"
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
          v-hasPermi="['property:scrapping:edit']"
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
          v-hasPermi="['property:scrapping:edit']"
          >审批流</el-button
        >
        <el-button
          v-if="scope.row.apvStatus == 'completed'"
          size="mini"
          type="text"
          icon="el-icon-printer"
          @click="handlePrint(scope.row)"
          v-hasPermi="['property:scrapping:print']"
          >打印单据</el-button
        >
      </template>
    </jm-table>
    <add-edit
      v-else
      :formTitle="title"
      :formData="formData"
      @back="back()"
    ></add-edit>

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
      :downloadTemplateUrl="'/property/scrapped/importTemplate'"
      ref="fileImport"
      :isUpdate="false"
      :importUrl="'/property/scrapped/importPlan'"
    ></file-import>
  </div>
</template>
<script>
import { getScrappedList, delId, download } from "@/api/property/scrapping.js";
import addEdit from "@/views/device/book/add";
import JmTable from "@/components/JmTable";
import { findByTemplateType } from "@/api/equipment/attribute";
import { listDept } from "@/api/system/dept";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
import fileImport from "@/components/FileImport";
export default {
  components: {
    JmTable,
    addEdit,
    subprocess,
    fileImport,
  },
  dicts: ["wf_process_status", "em_scrap_way"],
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
      tableData: [],
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      dataList: [],
      isChoose: false,
      // 遮罩层
      loading: true,
      addEdit: false,
      total: 0,
      search: {},
      // 弹出层标题
      title: "",

      // 表单参数
      form: {},

      radioRow: {},
      deptOptions: [],
    };
  },
  computed: {
    columns() {
      return [
        { label: "报废编号", prop: "scrapNo", tableVisible: true, width: 150 },
        { label: "业务名称", prop: "busName", tableVisible: true },
        {
          label: "报废方式",
          prop: "scrapType",
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.em_scrap_way,
        },
        { label: "报废数量", prop: "scrapNum", tableVisible: true },
        {
          label: "报废单位",
          prop: "scrapUnitId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 180,
        },
        {
          label: "报废人",
          prop: "scrapPerson",
          tableVisible: true,
          width: 120,
        },
        {
          label: "报废日期",
          prop: "scrapDate",
          tableVisible: true,
          formType: "date",
        },
        {
          label: "审批状态",
          prop: "apvStatus",
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.wf_process_status,
        },
        {
          label: "备注",
          prop: "remark",
          tableVisible: true,
        },
      ];
    },
  },
  watch: {},
  async created() {
    await this.getTreeSelect();
    // data赋值
  },
  mounted() {},
  methods: {
    // 打印单据
    handlePrint(row) {
      // 打印单据跳转
      // /device/back/printDocument
      this.$router.push({
        path: "/property/print",
        query: {
          title: "设备领用/打印单据",
          routeMethod: "post",
          id: row.id,
          scrapForm: row,
          flag: "BF",
          titleHeader: row.scrapUnit + "领用单",
          thead: [
            "设备编码",
            "设备名称",
            "规格型号",
            "设备类别",
            "功能位置",
            "设备状态",
          ],
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
    sub(val) {
      definitionStart2(
        val.id,
        this.radioRow.scrapNo,
        "device_scrapped",
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
        category: "device_scrapped",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    /* 提交按钮 */
    handleSubmit(row) {
      this.subopen = true;
      this.subtitle = "提交";
      let data = {
        pageNum: 1,
        pageSize: 10,
        category: "device_scrapped",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },

    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delId(row.scrapNo).then(async (res) => {
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
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
        this.getList();
      });
    },
    exportWarnLog(data) {
      download({ ids: this.ids }).then((res) => {
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
      getScrappedList(form).then((response) => {
        this.dataList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    back() {
      this.addEdit = false;
      this.addDetails = false;
      this.getList(this.queryParams);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.$router.push("/property/ScrappingAdd");
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/scrappingDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/scrappingEdit",
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
    handelImport() {
      // /** 新增按钮操作 */
      // this.btnLoading = true;
      // // this.addEdit = true;
      // // 获取扩展数据
      // findByTemplateType({ templateType: "K" })
      //   .then((response) => {
      //     this.formData = this.$options.data().formData;
      //     this.setFormLabel(response.data);
      //     // 扩展数据
      //     this.formData.emArchivesExtendAtt = {
      //       componentContent: response.data,
      //       fieldValue: {},
      //     };
      //     this.addEdit = true;
      //     this.title = "新增设备";
      //     this.btnLoading = false;
      //   })
      //   .catch((err) => {
      //     this.btnLoading = false;
      //   });
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
