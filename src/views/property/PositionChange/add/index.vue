<template>
  <Wrapper :title="title">
    <HeadEdit
      :isEdit="isEdit"
      :formData="formData"
      @submitForm="submitValue"
      ref="headEdit"
    ></HeadEdit>
    <TableProject :isShow="false"></TableProject>
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
// import TableRelevance from "../ui/TableRelevance.vue";
import { getStore, removeStore } from "@/utils/property.js";
import { setProject } from "@/api/property/positionchange";
export default {
  components: {
    Wrapper,
    HeadEdit,
    TableProject,
    // TableRelevance,
  },
  data() {
    return {
      message: "Hello from parent!",
      title: "",
      isEdit: true,
      // 头部表单
      formData: {
        applyPersonId: this.$store.state.user.standing.userId,
        applyPersonName: this.$store.state.user.standing.nickName,
        applyDeptId: this.$store.state.user.standing.deptId,
        affOrgId: this.$store.state.user.standing.deptId,
      },
    };
  },
  created() {},
  mounted() {
    this.title = this.$route.meta.title;
  },
  computed: {},
  methods: {
    clear() {
      removeStore("addList");
      removeStore("delList");
      removeStore("updateList");
      removeStore("equipmentList");
      removeStore("addFileList");
      removeStore("fileList");
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    submit() {
      this.$refs.headEdit.submitForm();
    },
    submitValue(val) {
      if (getStore("addList") && getStore("addList").length > 0) {
        val["addDetails"] = getStore("addList");
      } else {
        val["addDetails"] = [];
      }
      setProject(val).then((res) => {
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
  },
  watch: {},
  destroyed() {
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
