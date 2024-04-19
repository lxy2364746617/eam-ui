<template>
  <div>
    <div class="subtitle">
      <i v-if="isTask" class="el-icon-caret-right"
        ><span class="icon-text">鉴定材料</span></i
      >
      <el-button
        style="opacity: 0"
        type="text"
        icon="el-icon-plus"
        class="add-btn-file"
        @click="AddFile"
        v-show="false"
        >上传</el-button
      >
    </div>

    <ContTable
      :tableData.sync="fileResourceList2"
      ref="jmtable2"
      :columns="columns"
      :showSearch="false"
      :rightToolbarShow="false"
    >
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="downloadFile(scope.row)"
          >下载</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete2(scope.row)"
          v-if="!disabled"
          >删除</el-button
        >
        <el-button
          size="mini"
          v-if="fileType.includes(scope.row.fileType)"
          type="text"
          icon="el-icon-document-add"
          @click="handlePreview(scope.row)"
          >预览</el-button
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
  </div>
</template>
<script>
import ContTable from "@/components/ContTable/index3";
import { getRelevanceInfo } from "@/api/work/schedule";

export default {
  components: {
    ContTable,
  },

  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: {},
      type: Object,
    },
    isTask: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      //文档
      fileList: [],
      filedrawer: false,
      fileType: ["png", "jpg", "bmp", "jpeg", "pdf", "gif"],
      fileResourceList: [],
      fileResourceList2: [],
      delFileList: [],
    };
  },
  watch: {
    fileResourceList: {
      handler(val) {
        this.$emit("fileResourceList", val);
        this.fileResourceList2 = val;
      },
      deep: true,
      immediate: true,
    },
    delFileList: {
      handler(val) {
        if (val.length > 0) {
          this.$emit("delFileList", val);
        }
      },
      deep: true,
      immediate: true,
    },
    "formData.sysFileResources": {
      handler(val) {
        this.fileResourceList2 = val;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // if (this.formData.orderCode) {
    //   getRelevanceInfo({ busId: this.formData.orderCode }).then((res) => {
    //     this.fileResourceList = res.rows;
    //   });
    // }
    if (this.formData.sysFileResources) {
      this.fileResourceList = this.formData.sysFileResources;
    }
  },
  mounted() {},
  computed: {
    columns() {
      return [
        { label: "文件名", prop: "originalFileName", class: true },
        { label: "创建日期", prop: "createTime", formType: "date" },
        { label: "创建人", prop: "createBy" },
        { label: "文件大小", prop: "fileSize" },
      ];
    },
  },
  methods: {
    handlePreview(row) {
      window.open(process.env.VUE_APP_BASE_API + row.fileName);
    },
    /** 删除按钮操作 */
    handleDelete2(row) {
      var name = row.originalFileName;
      let that = this;
      this.$modal
        .confirm('是否确认删除名称为"' + name + '"的数据项？')

        .then(() => {
          if (row.id) {
            that.fileResourceList.forEach((item, index) => {
              if (item.id == row.id) {
                that.delFileList.push(row);
                that.fileResourceList.splice(index, 1);
              }
            });
          } else {
            that.fileResourceList.forEach((item, index) => {
              if (item.url == row.url) {
                that.fileResourceList.splice(index, 1);
              }
            });
          }
        })
        .catch(() => {});
    },
    //上传文件
    AddFile() {
      this.$nextTick(() => {
        this.fileList = [];
        this.filedrawer = true;
      });
    },
    uploadChange2(val) {
      val.forEach((item, index) => {
        item["createBy"] = this.$store.state.user.standing.nickName;
      });
      this.fileResourceList = this.fileResourceList.concat(val);
      this.fileList = [];
      this.filedrawer = false;
    },
    downloadFile(row) {
      this.$download.resource(row.fileName);
    },
  },
};
</script>
<style lang='scss' scoped>
.subtitle {
  //   border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  background-color: #ebf4fc;
  border-left: 5px solid #1f77fc;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 36px;
  color: #555;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-right: 20px;
  i {
    margin-right: 10px;
    color: #1f77fc;
    .icon-text {
      color: #555;
      font-weight: 700;
      padding-left: 5px;
    }
  }
}
.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 30px;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-right: 18px;
  padding-left: 18px;
  // border-left: 5px solid #1f77fc;
  i {
    margin-right: 10px;
    color: #1f77fc;
    .icon-text {
      color: #555;
      font-weight: 700;
      padding-left: 5px;
    }
  }
}
</style>
