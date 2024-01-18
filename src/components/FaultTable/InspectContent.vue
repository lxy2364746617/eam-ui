<template>
  <div class="app-container2">
    <div>
      <title-form
        class="mr20"
        :columns="columns"
        :formData="form"
        ref="titleform2"
        :disabled="disabled"
        :showButton="false"
        :labelWidth="'140px'"
      >
      </title-form>
    </div>
  </div>
</template>
<script>
import { listDept } from "@/api/system/dept";
import { findAll, getGroup } from "@/api/system/group";
import TitleForm from "@/components/TitleForm";

export default {
  components: {
    "title-form": TitleForm,
  },
  dicts: ["fault_type", "em_device_result", "em_device_check"],
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
  data() {
    return {
      form: {},
      groupMembers: [],
      groupOptions: [],
    };
  },
  watch: {
    form: {
      handler(val) {
        this.$emit("inspectContent", val);
      },
      deep: true,
      immediate: true,
    },
    "form.checkUnit": {
      handler(val) {
        if (val) {
          this.changeGroupId(val, 2);
        }
      },
      deep: true,
    },
  },
  async created() {
    findAll({ groupType: this.formData.orderType }).then((res) => {
      res.data.forEach((item) => {
        item.label = item.groupName;
        item.value = item.id;
      });
      this.groupOptions = res.data;
      if (this.formData.groupId) {
        this.$set(this.form, "checkUnit", this.formData.groupId);
        // this.form.unit = this.formData.groupId;
        this.form.executor = this.formData.executor;
      }
    });
  },
  mounted() {},
  computed: {
    columns() {
      return [
        // ! 批量维修记录
        {
          label: "检测内容记录",
          span: 24,
          subTitle: true,
        },
        {
          label: "检测单位",
          span: 8,
          prop: "checkUnit",
          formType: "select",
          options: this.groupOptions,
          required: true,
        },
        {
          label: "检测单位负责人",
          span: 8,
          prop: "checkUnitHead",
          required: true,
        },

        {
          label: "联系方式",
          span: 8,
          prop: "headPhonenum",
          required: true,
        },
        {
          label: "执行时间",
          span: 8,
          prop: "executionTime",
          formType: "date",
          required: true,
        },
        {
          label: "记录时间",
          span: 8,
          prop: "recordTime",
          formType: "date",
          required: true,
        },
        {
          label: "记录人",
          span: 8,
          prop: "recorder",
          required: true,
        },
        {
          label: "设备检验结果",
          span: 8,
          prop: "checkResult",
          formType: "select",
          options: this.dict.type.em_device_check,
          required: true,
        },
        {
          span: 4,
          prop: "sysFileResources",
          btnText: "点击上传鉴定报告",
          formType: "fileBtn",
        },
        { label: "", formType: "blank", height: 55 },

        {
          span: 24,
          prop: "remark",
          formType: "textarea",
          label: "备注",
          rows: 4,
        },

        // ! 结束
      ];
    },
  },
  methods: {
    dateDiffInHours(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);

      return Math.round(Math.abs((firstDate - secondDate) / oneDay)) * 24;
    },
    //选择班组
    changeGroupId(val, flag) {
      if (!val) val = 1;
      getGroup(val).then((response) => {
        this.$set(this.form, "checkUnitHead", response.data.leaderName);

        this.form.director = response.data.leaderId;
        this.$set(
          this.form,
          "headPhonenum",
          response.data.sysUserGroupList[0].phonenumber
        );

        response.data.sysUserGroupList.forEach((item) => {
          item.label = item.nickName;
          item.value = item.userId;
        });

        this.groupMembers = response.data.sysUserGroupList;
      });
    },
    getList() {},
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.app-container2 {
  position: relative;
  display: flex;
  flex-direction: column;

  .container-box1 {
    max-height: 550px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  // .table {
  //   max-height: 550px;
  //   overflow-y: scroll;
  //   margin-bottom: 20px;
  // }
}
.container-box2 {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .el-select {
    width: 100%;
  }

  .el-tabs__nav-scroll {
    width: 50% !important;
    margin: 0 auto !important;
  }

  .el-tabs__nav-wrap {
    padding-top: 10px;
  }

  .el-tabs__nav-wrap::after {
    top: 0;
  }
}

.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 30px;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;padding: 0 18px;
}
</style>
