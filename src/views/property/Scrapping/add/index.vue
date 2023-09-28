<template>
  <Wrapper :title="title">
    <HeadEdit
      :isEdit="isEdit"
      :formData="formData"
      @formData2="receiveDataFromChild"
    ></HeadEdit>
    <TableRelevance
      ><template>
        <p class="icon">
          <span>报废明细</span>
        </p>
      </template></TableRelevance
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
import TableRelevance from "../ui/TableRelevance.vue";
import { getStore, removeStore } from "@/utils/property.js";
import { setProject } from "@/api/property/purchase";
export default {
  components: {
    Wrapper,
    HeadEdit,
    TableRelevance,
  },
  data() {
    return {
      message: "Hello from parent!",
      title: "",
      isEdit: true,
      // 头部表单
      formData: {
        purchasePlanName: null,
        purchasePlanType: 1,
        annual: "2023",
        time: [],
      },
    };
  },
  created() {},
  mounted() {
    this.title = this.$route.meta.title;
  },
  computed: {},
  methods: {
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    submit() {
      this.formData["startTime"] = this.formData.time[0];
      this.formData["endTime"] = this.formData.time[1];
      this.formData["purchasePlanType"] = 1;
      this.formData["purchasePlanNo"] = 1;
      delete this.formData.time;
      this.formData["addList"] = getStore("addList");
      if (getStore("updateList") && getStore("updateList").length > 0) {
        this.formData["updateList"] = getStore("updateList");
      }
      if (getStore("delList") && getStore("delList").length > 0) {
        this.formData["delList"] = getStore("delList");
      }
      setProject(this.formData).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
        }
        removeStore("addList");
        removeStore("delList");
        removeStore("updateList");
      });
    },
    receiveDataFromChild(data) {
      this.formData = data;
    },
  },
  watch: {},
  beforeDestroy() {
    removeStore("addList");
    removeStore("delList");
    removeStore("updateList");
  },
};
</script>
  <style lang="scss" scoped>
.icon {
  margin-bottom: 10px !important;
  > span {
    padding-left: 0 !important;
  }
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
  