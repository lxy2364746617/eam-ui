<template>
  <div class="box">
    <slot></slot>

    <jm-table
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5" v-if="!isShow">
          <el-upload
            multiple
            :action="uploadFileUrl"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            v-hasPermi="['property:purchase:add']"
            name="file"
            :show-file-list="false"
            :headers="headers"
            ref="upload"
            ><el-button type="primary" size="mini" icon="el-icon-upload"
              >导入</el-button
            ></el-upload
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          :loading="btnLoading"
          @click="handleImport(scope.row, 'view')"
          v-hasPermi="['property:purchase:edit']"
          >下载</el-button
        >

        <el-button
          v-if="!isShow"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:purchase:remove']"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handlePreview(scope.row)"
          v-hasPermi="['property:purchase:edit']"
          >预览</el-button
        >
      </template>
    </jm-table>
  </div>
</template>
<script>
import { getAssociatedPlan } from "@/api/property/purchase";
import { downloadGet } from "@/utils/request";
import JmTable from "@/components/JmTable";
import { getToken } from "@/utils/auth";
import {
  setStore,
  getStore,
  delList,
  formatDateFromTimestamp,
} from "@/utils/property.js";
import { saveAs } from "file-saver";
import Search from "@/components/HeaderSearch";
export default {
  components: {
    JmTable,
  },
  props: { isShow: false, type: Boolean, busNo: "", type: String },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传文件服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      isChoose: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      addEdit: false,
      addDetails: false,
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      radioRow: {},
    };
  },
  computed: {
    columns() {
      return [
        { label: "文件名", prop: "originalFileName", tableVisible: true },
        {
          label: "上传时间",
          prop: "createTime",
          formType: "datetime",
          tableVisible: true,
        },
        { label: "上传人员", prop: "createBy", tableVisible: true },
        {
          label: "文件大小",
          prop: "fileSize",

          tableVisible: true,
        }, //(1 设备、2 部件)
      ];
    },
  },
  watch: {},
  async created() {
    await this.getList();
  },
  mounted() {},
  methods: {
    handleImport(row) {
      downloadGet(
        "/common/download?fileName=" + row.originalFileName,
        {},
        row.originalFileName
      );
    },
    handlePreview(row) {
      window.open(process.env.VUE_APP_BASE_API + row.fileName);
    },
    importHandler() {
      download(this.ids).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
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
    async handleUploadSuccess(res, file) {
      if (res.code === 200) {
        res["createImport"] = Date.now();
        let msg = {
          fileName: res.fileName,
          originalFileName: res.originalFileName,
          newFileName: res.newFileName,
          fileSize: res.fileSize,
          fileType: file.raw.type,
          createImport: res.createImport,
          createBy: this.$store.state.user.name,
          createTime: await formatDateFromTimestamp(res.createImport),
        };
        if (getStore("addFileList") && getStore("addFileList").length > 0) {
          setStore("addFileList", getStore("addFileList").concat(msg));
        } else {
          setStore("addFileList", [msg]);
        }

        await this.getList();
        this.$message.success("文件上传成功！");
      }
    },

    handleUploadError() {
      this.$message.error("文件上传失败！");
    },

    /** 查询用户列表 */
    async getList(
      queryParams = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading = true;
      if (this.busNo) queryParams["busNo"] = this.busNo;
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      delete search.busNo;

      getAssociatedPlan(queryParams).then((response) => {
        let res = response;
        if (!res.data) res.data = [];
        if (getStore("fileList")) setStore("fileList", []);
        if (getStore("addFileList") && getStore("addFileList").length > 0) {
          setStore("fileList", res.data.concat(getStore("addFileList")));
        } else {
          setStore("fileList", res.data);
          this.loading = false;
        }
        if (getStore("delFileList") && getStore("delFileList").length > 0) {
          setStore(
            "fileList",
            delList(getStore("fileList"), getStore("delFileList"))
          );
        }
        let matches = getStore("fileList").filter((item) => {
          for (let key in search) {
            if (item[key] !== search[key]) {
              if (search[key] == "") return true;
              return false;
            }
          }
          return true;
        });
        this.equipmentList = matches;
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (!row.id) {
          setStore(
            "fileList",
            this.equipmentList.filter(
              (item) => item.newFileName !== row.newFileName
            )
          );
          setStore(
            "addFileList",
            getStore("addFileList").filter(
              (item) => item.newFileName !== row.newFileName
            )
          );
        } else {
          if (getStore("delFileList") && getStore("delFileList").length > 0) {
            setStore("delFileList", [
              ...getStore("delFileList").concat(
                this.equipmentList.filter((item) => item.id == row.id)
              ),
            ]);
          } else {
            setStore(
              "delFileList",
              this.equipmentList.filter((item) => item.id == row.id)
            );
          }
        }
        setStore(
          "fileList",
          this.equipmentList.filter((item) => item.id != row.id)
        );

        this.getList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
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
    padding-bottom: 10px;
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
