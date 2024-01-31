<template>
  <Wrapper :title="title">
    <HeadEdit
      :isEdit="isEdit"
      :formData="formData"
      @submitForm="submitValue"
      ref="headEdit"
    ></HeadEdit>
    <TableProject :isShow="false" :rowId="formData.changeNo"></TableProject>

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
import { getStore, removeStore } from "@/utils/property.js";
import { updateProject } from "@/api/property/positionchange";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
export default {
  components: {
    Wrapper,
    HeadEdit,
    TableProject,
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
        this.formData.changeNo,
        "position_change",
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
        category: "position_change",
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
        category: "position_change",
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
