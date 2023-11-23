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

    <JmTableNoPaging
      :tableData.sync="fileResourceList"
      ref="jmtable2"
      :columns="columns"
      :showSearch="false"
      style="margin-top: 20px"
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
          type="text"
          icon="el-icon-document-add"
          @click="handlePreview(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >预览</el-button
        >
      </template>
    </JmTableNoPaging>

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
import JmTableNoPaging from "@/components/JmTableNoPaging";
import { getRelevanceInfo } from "@/api/work/schedule";
export default {
  components: {
    JmTableNoPaging,
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
      fileType: [".xlsx"],
      fileResourceList: [],
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
        .then(function () {
          return delResource(id);
        })
        .then(() => {
          that.fileResourceList.forEach((element, index) => {
            if (element.name == row.name) {
              that.fileResourceList.splice(index, 1);
            }
          });
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
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 18px;
  background: rgba(0, 116, 217, 0.08);
  // font-weight: 700;
  justify-content: space-between;
}
</style>
