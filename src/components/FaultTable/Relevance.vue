<template>
  <div>
    <div class="title">
      关联文档
      <el-button
        type="text"
        icon="el-icon-plus"
        @click="AddFile"
        v-hasPermi="['equipment:book:add']"
        v-if="!disabled"
        >上传</el-button
      >
    </div>

    <ContTable
      :tableData.sync="fileResourceList"
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
          v-hasPermi="['equipment:book:edit']"
          >下载</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete2(scope.row)"
          v-hasPermi="['equipment:book:remove']"
          v-if="!disabled"
          >删除</el-button
        >
        <el-button
          size="mini"
          v-if="fileType.includes(scope.row.fileType)"
          type="text"
          icon="el-icon-document-add"
          @click="handlePreview(scope.row)"
          v-hasPermi="['equipment:book:edit']"
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
        :fileType="fileType"
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
  },
  watch: {
    fileResourceList: {
      handler(val) {
        this.$emit("fileResourceList", val);
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
  },
  created() {
    if (this.formData.orderCode) {
      getRelevanceInfo({ busId: this.formData.orderCode }).then((res) => {
        this.fileResourceList = res.rows;
      });
    }
    if (this.formData.sysFileResources) {
      this.fileResourceList = this.formData.sysFileResources;
    }
  },
  data() {
    return {
      //文档
      fileList: [],
      filedrawer: false,
      fileType: ["png", "jpg", "bmp", "jpeg", "pdf", "gif"],
      fileResourceList: [],
      delFileList: [],
    };
  },
  mounted() {},
  computed: {
    columns() {
      return [
        { label: "文件名", prop: "originalFileName", class: true },
        { label: "创建时间", prop: "createTime", formType: "date" },
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
            if (res.code === 200) {
              that.fileResourceList.forEach((item, index) => {
                if (item.url == row.url) {
                  that.fileResourceList.splice(index, 1);
                }
              });
            }
          }
        })
        .catch(() => {});
    },
    //上传文件
    AddFile() {
      this.fileList = [];
      this.filedrawer = true;
    },
    uploadChange2(val) {
      this.fileResourceList = this.fileResourceList.concat(val);
      this.fileList = [];
      this.filedrawer = false;
    },
    downloadFile(row) {
      this.download(
        "common/download",
        {
          fileName: row.fileName,
        },

        row.originalFileName
      );
    },
  },
};
</script>
<style lang='scss' scoped>
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
  padding: 0 18px;
}
</style>
