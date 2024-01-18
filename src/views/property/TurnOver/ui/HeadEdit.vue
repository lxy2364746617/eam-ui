<template>
  <div :class="[!isEdit ? 'card bgc' : 'card']">
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
      ><span>设备移交信息</span>
    </p>

    <TitleForm
      v-if="isEdit"
      class="mr20"
      :columns="columns"
      :formData="formData"
      @submitForm="submitForm2"
      :showButton="false"
      ref="jmform"
      :labelWidth="'130px'"
    ></TitleForm>
    <el-row class="details" v-else>
      <el-col v-for="item in columns" :key="item.prop" :span="item.span">
        {{ item.label }}:
        {{
          typeof formData[item.prop] == "number"
            ? findTreeName(deptOptions, formData[item.prop])
            : formData[item.prop]
        }}
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listDept } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
export default {
  components: {},
  props: ["formData", "isEdit"],
  data() {
    return {
      deptOptions: null,
      userList: [],
      userList2: [],
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "移交单编号",
          prop: "transferNo",
          span: 6,
          formDisabled: true,
        },
        {
          label: "业务日期",
          prop: "transferDate",
          span: 6,
          required: true,
          formType: "date",
        },
        {
          label: "所属组织",
          prop: "affDeptId",
          span: 8,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
          formDisabled: true,
        },
        {
          label: "调出部门",
          prop: "outDeptId",
          span: 6,
          formType: "selectTree",
          options: this.deptOptions,
          required: true,
        },
        {
          label: "调出部门负责人",
          prop: "outDeptPerson",
          span: 6,
          required: true,
          formType: "select",
          options: this.userList,
        },
        {
          label: "调入部门",
          prop: "inDeptId",
          span: 6,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "调入部门负责人",
          prop: "inDeptPerson",
          span: 6,
          required: true,
          formType: "select",
          options: this.userList2,
        },
        {
          label: "参考信息",
          prop: "referenceInformation",
          span: 24,
          required: true,
        },
      ];
    },
  },
  watch: {
    "formData.outDeptId": {
      handler(newFormData, oldFormData) {
        if (newFormData) {
          this.getList(newFormData);
        }
      },
    },
    "formData.inDeptId": {
      handler(newFormData, oldFormData) {
        if (newFormData) {
          this.getList2(newFormData);
        }
      },
    },
  },

  async created() {
    await this.getTreeSelect();
  },
  mounted() {},
  methods: {
    /** 查询用户列表 */
    getList(id) {
      if (!id) id = 100;
      this.loading = true;
      listUser({ deptId: id }).then((response) => {
        this.userList = response.rows.map((item) => ({
          label: item.nickName,
          value: item.nickName,
        }));
      });
    },
    /** 查询用户列表 */
    getList2(id) {
      if (!id) id = 100;
      this.loading = true;
      listUser({ deptId: id }).then((response) => {
        this.userList2 = response.rows.map((item) => ({
          label: item.nickName,
          value: item.nickName,
        }));
      });
    },
    submitForm() {
      this.$refs.jmform.submitForm();
    },
    submitForm2(obj) {
      this.$emit("submitForm", obj);
    },

    findTreeName(options, value) {
      for (let item of options) {
        if (item.id === value) return item.label;
        if (item.children && item.children.length > 0) {
          let result = this.findTreeName(item.children, value);
          if (result !== null) return result;
        }
      }
      return null;
    },
    async getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.card {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: 250px;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  background: #f7fbff;
  padding: 14px 15px;

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

  .form,
  .details {
    width: 100%;
    padding: 0 60px;
  }
}
::v-deep .el-col {
  height: 60px;
}
.bgc {
  background: url("../../../../assets/images/backdrop.png") no-repeat;
  background-size: 100% 100%;
  .form {
    padding-top: 25px;
    align-items: center;
  }
}
</style>
