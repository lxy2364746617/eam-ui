<template>
  <Wrapper :title="title">
    <HeadEdit
      :isEdit="isEdit"
      :formData="formData"
      @submitForm="submitValue"
      ref="headEdit"
    ></HeadEdit>
    <TableProject :isShow="false" :rowId="formData.scrapNo"
      ><template
        ><p class="icon">
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
          ><span>报废明细</span>
        </p></template
      ></TableProject
    >
    <div class="submit">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary" @click="submitReview">保存并提交审批</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
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
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import HeadEdit from "../ui/HeadEdit.vue";
import TableProject from "../ui/TableProject.vue";
import TableRelevance from "../ui/TableRelevance.vue";
import { getStore, removeStore } from "@/utils/property.js";
import { updateProject } from "@/api/property/scrapping";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
export default {
  components: {
    Wrapper,
    HeadEdit,
    TableProject,
    TableRelevance,
    subprocess,
  },
  data() {
    return {
      message: "Hello from parent!",
      title: "",
      isEdit: true,
      // 头部表单
      formData: {},
      // 审批流
      reviewCode: "",
      subtitle: "",
      subopen: false,
      tableData: [],
    };
  },
  created() {
    this.title = this.$route.meta.title;
    const routeValue = this.$route.query.item;
    if (routeValue) {
      this.formData = routeValue;
      this.formData.scrapType = String(routeValue.scrapType);
      this.isEdit = routeValue.isEdit;
    }
  },
  mounted() {},
  computed: {},
  methods: {
    clear() {
      removeStore("addList");
      removeStore("delList");
      removeStore("updateList");
      removeStore("equipmentList");
      removeStore("addFileList");
      removeStore("delFileList");
      removeStore("fileList");
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    submitValue(val, review) {
      if (getStore("addList") && getStore("addList").length > 0) {
        val["addDetails"] = getStore("addList");
      } else {
        // val["addDetails"] = [];
      }
      if (getStore("updateList") && getStore("updateList").length > 0) {
        val["updateDetails"] = getStore("updateList");
      } else {
        // val["updateDetails"] = [];
      }
      if (getStore("delList") && getStore("delList").length > 0) {
        val["delDetails"] = getStore("delList").map((item) => item.id);
      } else {
        // val["delDetails"] = [];
      }
      if (review) {
        updateProject(val).then((res) => {
          if (res.code === 200) {
            this.handleSubmit();
          }
        });
      } else {
        updateProject(val).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
          }
          this.clear();
          this.cancel();
        });
      }
    },
    // ! 提交
    sub(val) {
      definitionStart2(
        val.id,
        this.formData.scrapNo,
        "device_scrapped",
        {}
      ).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.subopen = false;
          this.clear();
          this.cancel();
        }
      });
    },
    getTableData(val) {
      let data = {
        pageNum: val.page,
        pageSize: val.limit,
        category: "device_scrapped",
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
        category: "device_scrapped",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    submit() {
      this.$refs.headEdit.submitForm();
    },
    submitReview() {
      this.$refs.headEdit.submitForm("review");
    },
  },
  watch: {},
  destroyed() {
    this.clear();
  },
  beforeRouteLeave(to, from, next) {
    // 保存上一个路由信息
    this.$store.dispatch("tagsView/delView", from); // 关闭当前页
    // this.$router.go(-1);
    next();
  },
};
</script>
<style lang="scss" scoped>
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
