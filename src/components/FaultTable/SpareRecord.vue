<template>
  <div class="app-container2">
    <div class="title">
      备件记录
      <el-button
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        v-if="!disabled"
        >新增备件</el-button
      >
    </div>

    <div>
      <JmTableNoPaging
        :tableData="standardList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        ref="jmtable"
        :isRadio="isChoose"
        :handleWidth="230"
        :columns="columns"
        :showSearch="false"
        :isShow="disabled"
        :rightToolbarShow="false"
        :showOperate="!disabled"
      >
        <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope)"
            v-hasPermi="['work:quest:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
            v-hasPermi="['work:quest:remove']"
            >删除</el-button
          >
        </template></JmTableNoPaging
      >
    </div>

    <!-- 添加设备 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="30%"
      :append-to-body="true"
      :wrapperClosable="false"
      :before-close="close"
    >
      <TitleForm
        :columns="columns2"
        :formData="form"
        @submitForm="submitForm"
        ref="titleform"
        :disabled="disabled"
      >
        <template #footer>
          <div class="container-box2">
            <el-button @click="saveHandle" type="primary">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>
  </div>
</template>
<script>
import JmTableNoPaging from "@/components/JmTableNoPaging";
import { listDept } from "@/api/system/dept";
import request from "@/utils/request";

export default {
  components: { JmTableNoPaging },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: () => {},
      type: Object,
    },
  },
  data() {
    return {
      standardList: [],
      loading: false,
      btnLoading: false,
      form: {},
      drawer: false,

      deptOptions: null,
      formParams: {
        prtOrg: "Y",
      },
      isChoose: false,
      flag: {
        isSub: "提交",
        index: null,
      },
    };
  },
  watch: {
    standardList: {
      handler(val) {
        this.$emit("spareRecord", val);
      },
      deep: true,
      immediate: true,
    },
    "formData.itemId": {
      handler(val) {
        if (val) {
          if (this.deptOptions) {
            this.standardList = this.formData.attachmentDTOList;
          }
        } else {
          this.standardList = [];
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.getDeptTree();
    if (this.deptOptions) {
      this.standardList = this.formData.attachmentDTOList;
    }
    if (this.formData.orderCode && this.disabled) {
      request({
        url: "/wom/repair/getWomAttachmentList",
        method: "get",
        params: { orderCode: this.formData.orderCode },
      }).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
        }
      });
    }
  },
  mounted() {},
  computed: {
    columns() {
      return [
        { label: "备件编码", prop: "attachmentCode", required: true, span: 22 },
        { label: "备件名称", prop: "attachmentName", required: true, span: 22 },
        { label: "备件类别", prop: "attachmentType", span: 22 },
        { label: "规格型号", prop: "specs", span: 22 },
        { label: "供应商名称", prop: "supplierName", span: 22 },
        { label: "使用部位", prop: "location", required: true, span: 22 },
        {
          label: "更换数量",
          prop: "replaceNum",
          required: true,
          span: 22,
          formType: "number",
        },
        {
          label: "单位",
          prop: "unit",
          required: true,
          span: 22,
          formType: "selectTree",
          options: this.deptOptions,
        },
        { label: "原件编码", prop: "scriptCode", required: true, span: 22 },
        {
          label: "更换时间",
          prop: "createTime",
          required: true,
          span: 22,
          formType: "date",
        },
      ];
    },
    columns2() {
      return [
        { label: "备件编码", prop: "attachmentCode", required: true, span: 22 },
        { label: "备件名称", prop: "attachmentName", required: true, span: 22 },
        { label: "备件类别", prop: "attachmentType", span: 22 },
        { label: "规格型号", prop: "specs", span: 22 },
        { label: "供应商名称", prop: "supplierName", span: 22 },
        { label: "使用部位", prop: "location", required: true, span: 22 },
        {
          label: "更换数量",
          prop: "replaceNum",
          required: true,
          span: 22,
          formType: "number",
        },
        {
          label: "单位",
          prop: "unit",
          required: true,
          span: 22,
          formType: "selectTree",
          options: this.deptOptions,
        },
        { label: "原件编码", prop: "scriptCode", required: true, span: 22 },
        {
          label: "更换时间",
          prop: "createTime",
          required: true,
          span: 22,
          formType: "date",
        },
      ];
    },
  },
  methods: {
    getList(id) {},
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    handleCancel() {
      this.close();
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    close() {
      this.$refs.titleform.resetFields();

      this.drawer = false;
    },
    submitForm(formVal) {
      if (this.flag.isSub === "新增") {
        let newValue = JSON.parse(JSON.stringify(formVal));
        this.standardList = this.standardList.concat([newValue]);
        this.close();
      } else if (this.flag.isSub === "编辑") {
        let newValue = JSON.parse(JSON.stringify(formVal));
        this.$set(this.standardList, this.flag.index, newValue);
        this.close();
      }
    },
    handleSelectionChange(value) {},
    handleAdd() {
      this.flag.isSub = "新增";
      this.flag.index = null;
      this.form = {};
      this.drawer = true;
    },
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.flag = { isSub: "编辑", index: scope.index };
      this.form = JSON.parse(JSON.stringify(scope.row));
      this.drawer = true;
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          that.standardList.splice(scope.$index, 1);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang='scss' scoped>
.app-container2 {
  position: relative;
  display: flex;
  flex-direction: column;

  .container-box1 {
    max-height: 550px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  // .table {
  //   max-height: 550px;
  //   overflow-y: scroll;
  //   margin-bottom: 20px;
  // }
}
.container-box2 {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .el-select {
    width: 100%;
  }

  .el-tabs__nav-scroll {
    width: 50% !important;
    margin: 0 auto !important;
  }

  .el-tabs__nav-wrap {
    padding-top: 10px;
  }

  .el-tabs__nav-wrap::after {
    top: 0;
  }
}

.title {
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  background: rgba(0, 116, 217, 0.08);
  justify-content: space-between;
}
</style>
