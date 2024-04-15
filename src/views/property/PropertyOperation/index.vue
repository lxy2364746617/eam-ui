
<template>
  <div>
    <div :class="[isShowCard ? 'card bgc' : 'card']">
      <p class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M18.9309 8.90141C18.9309 8.96015 18.9437 9.01889 18.9437 9.07891V17.5066C18.9776 17.8413 18.8788 18.1758 18.6687 18.4384C18.4586 18.7011 18.1539 18.8708 17.82 18.9113H2.20317C1.87159 18.8678 1.57004 18.6967 1.36259 18.4344C1.15514 18.1722 1.05816 17.8393 1.09224 17.5066V8.9908C1.09224 8.79032 1.04116 8.79798 1.01562 8.82863C1.03957 8.79676 1.06092 8.76303 1.07947 8.72775H18.9565C18.9627 8.74039 18.9714 8.75167 18.982 8.76095C18.9565 8.74435 18.9309 8.75584 18.9309 8.90141ZM13.2103 12.5585H11.2949V10.6431C11.2949 10.4738 11.2276 10.3115 11.1079 10.1918C10.9881 10.072 10.8257 10.0048 10.6564 10.0048C10.4871 10.0048 10.3247 10.072 10.205 10.1918C10.0853 10.3115 10.018 10.4738 10.018 10.6431V12.5585H8.10258C7.93326 12.5586 7.7709 12.6258 7.65118 12.7456C7.53147 12.8653 7.46422 13.0277 7.46422 13.197C7.46422 13.3663 7.53147 13.5287 7.65118 13.6484C7.7709 13.7682 7.93326 13.8354 8.10258 13.8355H10.018V15.7509C10.018 15.9202 10.0853 16.0825 10.205 16.2023C10.3247 16.322 10.4871 16.3892 10.6564 16.3892C10.8257 16.3892 10.9881 16.322 11.1079 16.2023C11.2276 16.0825 11.2949 15.9202 11.2949 15.7509V13.8355H13.2103C13.3796 13.8354 13.542 13.7682 13.6617 13.6484C13.7814 13.5287 13.8486 13.3663 13.8486 13.197C13.8486 13.0277 13.7814 12.8653 13.6617 12.7456C13.542 12.6258 13.3796 12.5586 13.2103 12.5585ZM2.3564 4.89697H17.6795L18.9565 7.45082H1.07947L2.3564 4.89697ZM4.59102 1.7736C4.70069 1.57809 4.85736 1.41301 5.04688 1.29328C5.23639 1.17356 5.45276 1.10296 5.67641 1.08789H14.3468C14.5725 1.10123 14.7914 1.17099 14.9832 1.29078C15.1751 1.41058 15.3338 1.57658 15.4449 1.7736L16.4026 3.62004H3.63333L4.59102 1.7736Z"
            fill="#007BFE"
          /></svg
        ><span>{{ infoTitle }}</span>
      </p>
      <TitleForm
        v-if="!isShowCard"
        class="mr20"
        :columns="columnsInfo"
        :formData="form"
        @submitForm="submitForm2"
        :showButton="false"
        ref="titleForm"
        :labelWidth="'130px'"
      ></TitleForm>
      <el-row class="details" v-else>
        <el-col v-for="item in columnsInfo" :key="item.prop" :span="item.span">
          {{ item.label }}:
          {{
            item.formType == "selectTree"
              ? findTreeName(deptOptions, listValue[item.prop])
              : item.formType == "select"
              ? findName(item.options, listValue[item.prop])
              : item.formType == "dateRange"
              ? listValue.startTime + "~" + listValue.endTime
              : listValue[item.prop]
          }}
        </el-col>
      </el-row>
    </div>
    <br />

    <!-- 中间 -->
    <p class="icon" v-if="detailTitle">
      <span style="padding-left: 13px"></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M19 3.99996H14.82C14.6152 3.4154 14.2339 2.90892 13.7287 2.55058C13.2235 2.19224 12.6194 1.99976 12 1.99976C11.3806 1.99976 10.7765 2.19224 10.2713 2.55058C9.76612 2.90892 9.38476 3.4154 9.18 3.99996H5C4.47005 4.00154 3.96227 4.21276 3.58753 4.58749C3.2128 4.96222 3.00158 5.47001 3 5.99996V20C3.00158 20.5299 3.2128 21.0377 3.58753 21.4124C3.96227 21.7872 4.47005 21.9984 5 22H19C19.5299 21.9984 20.0377 21.7872 20.4125 21.4124C20.7872 21.0377 20.9984 20.5299 21 20V5.99996C20.9984 5.47001 20.7872 4.96222 20.4125 4.58749C20.0377 4.21276 19.5299 4.00154 19 3.99996ZM12 3.99996C12.1978 3.99996 12.3911 4.05861 12.5556 4.16849C12.72 4.27837 12.8482 4.43455 12.9239 4.61727C12.9996 4.8 13.0194 5.00107 12.9808 5.19505C12.9422 5.38903 12.847 5.56721 12.7071 5.70706C12.5673 5.84692 12.3891 5.94216 12.1951 5.98074C12.0011 6.01933 11.8 5.99953 11.6173 5.92384C11.4346 5.84815 11.2784 5.71998 11.1685 5.55553C11.0586 5.39108 11 5.19774 11 4.99996C11.0008 4.73499 11.1064 4.48109 11.2938 4.29373C11.4811 4.10636 11.735 4.00075 12 3.99996ZM10 8.99996L12.79 11.794L15.31 9.27396L14 7.99996H18V12L16.724 10.689L12.792 14.624L10 11.83L7.414 14.414L6 13L10 8.99996ZM19 19H5V17H19V19Z"
          fill="#007BFE"
        /></svg
      ><span>{{ detailTitle }}</span>
    </p>
    <ContTable
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :handleWidth="150"
      class="mb20"
      :columns="columns"
      :isScroll="true"
    >
      <template slot="headerLeft">
        <slot name="headerLeft"></slot>
      </template>
      <template #right_end>
        <slot name="right_end"></slot>
      </template>
      <template v-slot:end_handle="scope" v-if="!isShowCard">
        <slot name="end_handle" :row="scope.row" :index="scope.index"></slot>
      </template>
    </ContTable>

    <!-- 关联附件 -->
    <p class="icon" v-if="attachmentsTitle">
      <span style="padding-left: 13px"></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M9.74138 9.25001C10.2991 8.68422 10.2966 7.7845 9.74138 7.22933C9.18722 6.67514 8.28902 6.67213 7.72071 7.22933L3.1732 11.7748C1.77944 13.1807 1.78299 15.4363 3.1732 16.8265C4.56394 18.2173 6.8195 18.2208 8.22488 16.8265L16.8127 8.23862C18.207 6.84437 18.207 4.5812 16.8127 3.18693C15.4189 1.79317 13.1553 1.79265 11.7611 3.18693L11.5095 3.44055C11.0912 3.85882 10.4122 3.85882 9.99397 3.44055C9.5762 3.02275 9.57568 2.34432 9.99397 1.92502L10.2455 1.6714C12.4865 -0.558407 16.1009 -0.555862 18.3282 1.6714C20.5555 3.89871 20.559 7.51222 18.3282 9.75415L9.73986 18.3415C7.50652 20.5577 3.89761 20.5526 1.67235 18.3274C-0.552379 16.1026 -0.55796 12.4932 1.65873 10.2603L6.20521 5.71378C7.60756 4.31953 9.86564 4.32256 11.2569 5.71378C12.6481 7.10502 12.6511 9.36314 11.2569 10.7655L6.96298 15.0595C6.54472 15.4777 5.86578 15.4777 5.44749 15.0595C5.02922 14.6412 5.02922 13.9622 5.44749 13.544L9.74138 9.25001Z"
          fill="#007BFE"
        /></svg
      ><span>{{ attachmentsTitle }}</span>
    </p>

    <ContTable
      v-if="attachmentsTitle"
      :tableData="fileResourceList2"
      @getList="getListRelevance"
      :total="0"
      ref="jmtable"
      :handleWidth="100"
      :columns="documentColumns"
    >
      <template slot="headerLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="margin-left: 5px"
          @click="AddFile"
          v-hasPermi="['property:detail:add']"
          v-if="!isShowCard"
          >上传</el-button
        >
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="downloadFile(scope.row)"
          v-hasPermi="['property:detail:download']"
          >下载</el-button
        >
        <el-button
          size="mini"
          type="text"
          v-if="!isShowCard"
          icon="el-icon-delete"
          @click="handleDelete2(scope.row)"
          v-hasPermi="['property:detail:remove']"
          >删除</el-button
        >
        <el-button
          size="mini"
          v-if="fileType.includes(scope.row.fileType)"
          type="text"
          icon="el-icon-view"
          @click="handlePreview(scope.row)"
          v-hasPermi="['property:detail:view']"
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
import { listDept } from "@/api/system/dept";
import ContTable from "@/components/ContTable";
import request from "@/utils/request";
import { getAssociatedPlan } from "@/api/property/receive";
export default {
  components: { ContTable },
  props: {
    formData: { default: () => {}, type: Object },
    isShowCard: { default: false, type: Boolean },
    infoTitle: { default: "", type: String },
    detailTitle: { default: "", type: String },
    attachmentsTitle: { default: "", type: String },
    columns: { default: () => [], type: Array },
    columnsInfo: { default: () => [], type: Array },
    equipmentList: { default: null, type: Array },
    getList: { default: () => {}, type: Function },
    total: { default: 0, type: Number },
    handleSelectionChange: { default: () => {}, type: Function },
    busId: { default: "", type: String },
    busString: { default: "", type: String },
  },
  data() {
    return {
      deptOptions: null,
      userList: [],
      userList2: [],
      review: null,
      //文档
      fileList: [],
      filedrawer: false,
      fileType: ["png", "jpg", "bmp", "jpeg", "pdf", "gif"],
      fileResourceList: [],
      fileResourceList2: [],
      delFileList: [],
    };
  },
  async created() {
    await this.getTreeSelect();
  },
  mounted() {},
  watch: {
    fileResourceList: {
      handler(val) {
        this.fileResourceList2 = JSON.parse(JSON.stringify(val));
        this.$emit(
          "addFileList",
          val.filter((item) => !item.id)
        );
      },
      immediate: true,
      deep: true,
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
    busId: {
      handler(val) {
        if (this.attachmentsTitle && val) {
          getAssociatedPlan({
            [this.busString]: val ? val : 1,
            pageNum: 1,
            pageSize: 1000,
          }).then((res) => {
            this.fileResourceList = res.data;
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    listValue() {
      return this.formData;
    },
    form() {
      return this.formData;
    },
    documentColumns() {
      return [
        { label: "文件名", prop: "originalFileName", class: true },
        { label: "创建日期", prop: "createTime", formType: "date" },
        { label: "创建人", prop: "createBy" },
        { label: "文件大小", prop: "fileSize" },
      ];
    },
  },
  methods: {
    getListRelevance(queryParams) {
      delete queryParams.pageSize;
      delete queryParams.pageNum;
      let search = JSON.parse(JSON.stringify(queryParams));
      let matches = this.fileResourceList.filter((item) => {
        for (let key in search) {
          if (!String(item[key]).includes(search[key])) {
            if (search[key] == "") continue;
            return false;
          }
        }
        return true;
      });
      this.fileResourceList2 = matches;
    },
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
                that.delFileList.push(row.id);
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
      this.fileList = [];
      this.filedrawer = true;
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
    findTreeName(options, value) {
      if (!options || !value) return null;
      for (let item of options) {
        if (item.id === value) return item.label;
        if (item.children && item.children.length > 0) {
          let result = this.findTreeName(item.children, value);
          if (result !== null) return result;
        }
      }
      return null;
    },
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    submitForm2(obj) {
      this.$emit("submitForm", obj, this.review);
    },
    submitForm(review) {
      this.review = review;
      this.$refs.titleForm.submitForm();
    },
    async getTreeSelect() {
      await listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.card {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  background: #f7fbff;
  padding: 14px 15px;

  .form,
  .details {
    width: 100%;
    padding: 0 60px;
  }
}
.icon {
  span {
    padding-left: 10px;
  }

  padding: 0;
  margin: 0;
  padding-bottom: 15px;
  display: flex;
  justify-content: start;
  align-items: center;
}
::v-deep .el-col {
  height: 60px;
}
.bgc {
  background: url("../../../assets/images/backdrop.png") no-repeat;
  background-size: 100% 100%;
  .form {
    padding-top: 25px;
    align-items: center;
  }
}
</style>
