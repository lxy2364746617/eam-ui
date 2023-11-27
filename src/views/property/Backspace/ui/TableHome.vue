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
            v-hasPermi="['property:backspace:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-upload
            :before-upload="field101BeforeUpload"
            @click="handelImport"
            action=""
            v-hasPermi="['property:backspace:add']"
            ><el-button type="danger" size="mini"   icon="el-icon-upload"
              >导入</el-button
            ></el-upload
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
             
            icon="el-icon-download"
            size="mini"
            @click="exportWarnLog"
            v-hasPermi="['property:backspace:add']"
            >下载</el-button
          >
        </el-col> -->
        <!-- <el-col :span="1.5">
              <el-button
                type="danger"
                 
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['property:backspace:remove']"
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
          v-hasPermi="['property:backspace:edit']"
          >详情</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus === 4 ||
            scope.row.apvStatus === 1 ||
            scope.row.apvStatus === null
          "
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="goEdit(scope.row, 'edit')"
          v-hasPermi="['property:backspace:edit']"
          >编辑</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus === 4 ||
            scope.row.apvStatus === 1 ||
            scope.row.apvStatus === null
          "
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:backspace:remove']"
          >删除</el-button
        >
        <el-button
          v-if="
            scope.row.apvStatus === 4 ||
            scope.row.apvStatus === 1 ||
            scope.row.apvStatus === null
          "
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['property:backspace:edit']"
          >提交</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['property:backspace:edit']"
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
} from "@/api/property/backspace";
import JmTable from "@/components/JmTable";
import { findByTemplateType } from "@/api/equipment/attribute";
import { listDept } from "@/api/system/dept";
export default {
  components: {
    JmTable,
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
      field101fileList: [],
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
      // 部门树选项
      deptOptions: [],
    };
  },
  computed: {
    columns() {
      return [
        { label: "创建时间", prop: "createTime", tableVisible: true },
        { label: "回退单编号", prop: "backNo", tableVisible: true },
        { label: "设备数量", prop: "deviceNum", tableVisible: true },
        {
          label: "业务日期",
          prop: "createDate",
          tableVisible: true,
          formType: "data",
        },
        {
          label: "所属组织",
          prop: "affDeptId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "申请部门",
          prop: "applyDeptId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "申请部门负责人",
          prop: "applyDeptPerson",
          tableVisible: true,
        },
        {
          label: "调入部门",
          prop: "inDeptId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "调入部门负责人",
          prop: "inDeptPerson",
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
    await this.getTreeSelect();
    // data赋值

    await this.getList();
  },
  mounted() {},
  methods: {
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
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
      this.$router.push("/property/backspaceAdd");
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/backspaceDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/backspaceEdit",
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
