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
          plain
          icon="el-icon-plus"
          size="mini"
          :loading="btnLoading"
          @click="handleAdd"
          v-hasPermi="['equipment:book:add']"
          >新增</el-button
        >
        <el-button type="primary" plain icon="el-icon-download" size="mini"
          >下载</el-button
        >
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          v-if="scope.row.apvStatus === 4 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'edit')"
          v-hasPermi="['equipment:book:edit']"
          >编辑</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 4 || scope.row.apvStatus === 1"
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
          icon="el-icon-view"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          v-hasPermi="['equipment:book:edit']"
          >详情</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 4 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >提交</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >审批流程</el-button
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
import { getPositionChangeList } from "@/api/property/positionchange.js";
import addEdit from "@/views/device/book/add";
import JmTable from "@/components/JmTable";
import { findByTemplateType } from "@/api/equipment/attribute";
export default {
  components: {
    JmTable,
    addEdit,
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
        },
        { label: "变动单号", prop: "neckNo", tableVisible: true },
        { label: "设备数量", prop: "deviceNum", tableVisible: true },
        {
          label: "业务日期",
          prop: "neckDate",
          tableVisible: true,
          formType: "date",
        },
        {
          label: "所属组织",
          prop: "affDeptId",
          tableVisible: true,
          formType: "select",
        },
        {
          label: "申请部门",
          prop: "applyDeptId",
          tableVisible: true,
          formType: "select",
        },
        {
          label: "申请部门负责人",
          prop: "applyDeptPerson",
          tableVisible: true,
        },
        {
          label: "审批状态",
          prop: "applyDeptId",
          tableVisible: true,
          formType: "select",
          options: [
            {
              label: "审批中",
              value: "1",
            },
            {
              label: "审批通过",
              value: "2",
            },
            {
              label: "审批驳回",
              value: "3",
            },
            {
              label: "待提交",
              value: "4",
            },
          ],
        },
      ];
    },
  },
  watch: {},
  async created() {
    // data赋值
    this.columns.forEach((b) => {
      if (b.prop == "apvStatus")
        this.$set(b, "options", [
          {
            value: 1,
            label: "待审批",
          },
          {
            value: 2,
            label: "审批中",
          },
          {
            value: 3,
            label: "审批通过",
          },
          {
            value: 4,
            label: "审批驳回",
          },
        ]);
    });
    await this.getList();
  },
  mounted() {},
  methods: {
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
        console.log("response====>", response);
        this.dataList = response.rows;
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
        path: "/property/positionChangeAdd",
        query: {
          item: { ...row, isEdit: false },
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
      //     console.log("========================", 123213123123);
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
