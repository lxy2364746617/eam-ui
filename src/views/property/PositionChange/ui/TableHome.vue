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
          v-hasPermi="['property:position:add']"
          >新增</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="exportWarnLog"
          v-hasPermi="['property:position:add']"
          >下载</el-button
        >
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          v-hasPermi="['property:position:edit']"
          >详情</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 3 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          :loading="btnLoading"
          @click="goEdit(scope.row, 'edit')"
          v-hasPermi="['property:position:edit']"
          >编辑</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 3 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:position:remove']"
          >删除</el-button
        >

        <el-button
          v-if="scope.row.apvStatus === 3 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          @click="handleSet(scope.row)"
          v-hasPermi="['property:position:edit']"
          >提交</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 1 || scope.row.apvStatus === 2"
          size="mini"
          type="text"
          @click="handleSet(scope.row)"
          v-hasPermi="['property:position:edit']"
          >审批流</el-button
        >
      </template>
    </jm-table>
    <add-edit
      v-else
      :formTitle="title"
      :formData="formData"
      @back="back()"
    ></add-edit>
  </div>
</template>
<script>
import {
  getPositionChangeList,
  delId,
  download,
} from "@/api/property/positionchange.js";
import addEdit from "@/views/device/book/add";
import JmTable from "@/components/JmTable";
import { findByTemplateType } from "@/api/equipment/attribute";
import { listDept } from "@/api/system/dept";
import { saveAs } from "file-saver";
export default {
  components: {
    JmTable,
    addEdit,
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
        {
          label: "创建时间",
          prop: "createTime",
          tableVisible: true,
          formType: "date",
          width: 150,
        },
        { label: "变动单号", prop: "changeNo", tableVisible: true, width: 150 },
        { label: "设备数量", prop: "deviceNum", tableVisible: true },
        {
          label: "业务日期",
          prop: "busDate",
          tableVisible: true,
          formType: "date",
        },
        {
          label: "所属组织",
          prop: "affOrgId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
        },
        {
          label: "申请部门",
          prop: "applyDeptId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
        },
        {
          label: "申请部门负责人",
          prop: "applyPersonName",
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
    await this.getTreeSelect();
    await this.getList();
  },
  mounted() {},
  methods: {
    handleSet() {},

    exportWarnLog(data) {
      download({ ids: this.ids }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delId(row.changeNo).then(async (res) => {
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
      });
    },
    exportWarnLog(data) {
      download(data).then((res) => {
        // window.location.href = res.url;
        const { data, response } = res;
        let disposition = decodeURI(
          response.headers.get("content-disposition")
        );
        // 从响应头中获取文件名称
        let fileName = disposition.substring(
          disposition.indexOf("filename=") + 9,
          disposition.length
        );

        let url = window.URL.createObjectURL(new Blob([data]));

        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click(); //执行下载
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
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
      fileData["purchasePlanType"] = 1;
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
      getPositionChangeList(form).then((response) => {
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
      this.$router.push("/property/positionChangeAdd");
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/positionChangeDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/positionChangeEdit",
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
