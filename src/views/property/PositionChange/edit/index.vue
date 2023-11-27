<template>
  <Wrapper :title="title">
    <HeadEdit
      :isEdit="isEdit"
      :formData="formData"
      @formData2="receiveDataFromChild"
    ></HeadEdit>
    <TableProject :isShow="false" :rowId="formData.changeNo"
      ></TableProject
    >

    <div class="submit">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary">保存并提交审批</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import HeadEdit from "../ui/HeadEdit.vue";
import TableProject from "../ui/TableProject.vue";
import TableRelevance from "../ui/TableRelevance.vue";
import { getStore, removeStore } from "@/utils/property.js";
import { updateProject } from "@/api/property/backspace";
export default {
  components: {
    Wrapper,
    HeadEdit,
    TableProject,
    TableRelevance,
  },
  data() {
    return {
      message: "Hello from parent!",
      title: "",
      isEdit: true,
      // 头部表单
      formData: {},
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
    submit() {
      if (!this.formData.id) return;

      delete this.formData.time;
      if (getStore("addList") && getStore("addList").length > 0) {
        this.formData["addList"] = getStore("addList");
      } else {
        // this.formData["addList"] = [];
      }
      if (getStore("updateList") && getStore("updateList").length > 0) {
        this.formData["updateList"] = getStore("updateList");
      }
      if (getStore("delList") && getStore("delList").length > 0) {
        this.formData["delList"] = getStore("delList");
      }

      this.formData.affOrgId = this.formData.affOrgId
        ? this.formData.affOrgId[this.formData.affOrgId.length - 1]
        : null;
      this.formData.applyDeptId = this.formData.applyDeptId
        ? this.formData.applyDeptId[this.formData.applyDeptId.length - 1]
        : null;
      this.formData["applyPersonId"] = this.$store.state.user.standing.userId;
      delete this.formData["createTime"];
      updateProject(this.formData).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
        }
        this.clear();
        this.cancel();
      });
    },
    receiveDataFromChild(data) {
      this.formData = data;
    },
  },
  watch: {},
  beforeDestroy() {
    this.clear();
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
