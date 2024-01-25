<template>
  <Wrapper :title="title">
    <HeadEdit
      :isEdit="isEdit"
      :formData="formData"
      @submitForm="submitValue"
      ref="headEdit"
    ></HeadEdit>
    <TableProject :isShow="false" :rowId="formData.backNo"
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
          ><span>设备回退明细</span>
        </p></template
      ></TableProject
    >
    <TableRelevance :isShow="false" :title="'关联附件'" :busNo="formData.backNo"
      ><template>
        <p class="icon">
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
          ><span>设备回退附件</span>
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
      this.$refs.headEdit.submitForm();
    },
    submitValue(val) {
      if (getStore("addList") && getStore("addList").length > 0) {
        val["addList"] = getStore("addList");
      } else {
        val["addList"] = [];
      }
      if (getStore("updateList") && getStore("updateList").length > 0) {
        val["updateList"] = getStore("updateList");
      }
      if (getStore("delList") && getStore("delList").length > 0) {
        val["delList"] = getStore("delList");
      }
      if (getStore("addFileList") && getStore("addFileList").length > 0) {
        val["addFileList"] = getStore("addFileList");
      } else {
        val["addFileList"] = [];
      }
      if (getStore("delFileList") && getStore("delFileList").length > 0) {
        val["delFileList"] = getStore("delFileList");
      } else {
        val["delFileList"] = [];
      }

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
    },
    receiveDataFromChild(data) {
      this.formData = data;
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
