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
            v-hasPermi="['property:receive:add']"
            >新增</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          v-hasPermi="['property:receive:edit']"
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
          @click="goEdit(scope.row, 'edit')"
          v-hasPermi="['property:receive:edit']"
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
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:receive:remove']"
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
          @click="handleSubmit(scope.row)"
          v-hasPermi="['property:receive:edit']"
          >提交</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus == 'completed' ||
            scope.row.apvStatus == 'running'
          "
          size="mini"
          type="text"
          @click="handleFlowRecord(scope.row)"
          v-hasPermi="['property:receive:edit']"
          >审批流</el-button
        >
        <!-- <el-button
          size="mini"
          type="text"
          @click="handlePrint(scope.row)"
          v-hasPermi="['property:receive:print']"
          >打印单据</el-button
        > -->
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
  </div>
</template>
<script>
import { getPurchaseList, delProject } from "@/api/property/receive";
import addEdit from "@/views/device/book/add";
import JmTable from "@/components/JmTable";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
export default {
  components: {
    JmTable,
    addEdit,
    subprocess,
  },
  dicts: ["apv_status"],
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
      equipmentList: null,
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
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "创建时间",
          prop: "createTime",
          tableVisible: true,
          width: 200,
        },
        { label: "领用单号", prop: "neckNo", tableVisible: true, width: 200 },
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
          width: 120,
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
    // data赋值
    await this.getList();
  },
  mounted() {},
  methods: {
    sub(val) {
      definitionStart2(val.id, this.radioRow.neckNo, "device_neck", {}).then(
        (res) => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.subopen = false;
            this.getList();
          }
        }
      );
    },
    getTableData(val) {
      let data = {
        pageNum: val.page,
        pageSize: val.limit,
        category: "device_neck",
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
        category: "device_neck",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    handlePrint(row) {
      // 打印单据跳转
      this.$router.push({
        path: "/property/print",
        query: {
          title: "设备领用/打印单据",
          routeMethod: "post",
          routeUrl: "/property/neck/printDocument",
          id: row.id,
          thead: ["名称", "型号", "单位", "数量", "安装地点", "备注"],
        },
      });
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

    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delProject(row.id).then(async (res) => {
          if ((res.code = 200)) {
            await this.getList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    exportWarnLog(data) {
      download(this.ids).then((res) => {
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
      queryParams = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading = true;
      getPurchaseList(queryParams).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.$router.push("/property/receiveAdd");
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/receiveDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/receiveEdit",
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
