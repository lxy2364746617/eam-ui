<template>
  <div :class="[!isEdit ? 'card bgc' : 'card']">
    <jm-form
      class="mr20"
      :columns="columns"
      :formData="formData"
      :showButton="false"
      ref="jmform"
    ></jm-form>
  </div>
</template>
<script>
import JmForm from "@/components/JmForm";
import { listDept } from "@/api/system/dept";

export default {
  components: {
    JmForm,
  },
  props: {
    formData: {
      default: {},
      type: Object,
    },
    isEdit: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      scrapTypeOptions: [
        {
          label: "损坏",
          value: 1,
        },
        {
          label: "过期",
          value: 2,
        },
        {
          label: "丢失",
          value: 3,
        },
      ],
      deptOptions: [],
      formData2: { ...this.formData },
      rules: {
        purchasePlanName: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    columns() {
      return [
        { label: "业务名称", prop: "busName", span: 6, required: true },
        {
          label: "报废方式",
          prop: "scrapType",
          span: 6,
          required: true,
          formType: "select",
          options: this.scrapTypeOptions,
        },
        {
          label: "报废单位",
          prop: "scrapUnit",
          span: 6,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "报废日期",
          prop: "scrapDate",
          formType: "date",
          span: 6,
          required: true,
        },
        { label: "备注", prop: "remark", span: 24 },
      ];
    },
  },
  watch: {
    formData: {
      handler(newFormData, oldFormData) {
        this.$emit("formData2", newFormData);
      },
      deep: true, // 深层监听
    },
  },
  created() {
    this.getTreeSelect();
  },
  methods: {
    getTreeSelect() {
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
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .form {
    width: 100%;
    padding: 0 60px;
  }
}
.bgc {
  background-size: 100% 100%;
}
</style>
