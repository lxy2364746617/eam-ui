<template>
  <div class="app-container2">
    <div>
      <TitleForm
        class="mr20"
        :columns="columns"
        :formData="form"
        ref="titleform"
        :disabled="disabled"
        :showButton="false"
        :labelWidth="'140px'"
      >
      </TitleForm>
    </div>
    <!-- 添加供应商对话框 -->
    <el-drawer
      title="选择供应商"
      :visible.sync="drawersupplier"
      size="60%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <supplier
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></supplier>
    </el-drawer>
  </div>
</template>
<script>
import { listDept } from "@/api/system/dept";
import { findAll, getGroup } from "@/api/system/group";
import supplier from "@/views/sparepart/supplier";

export default {
  components: { supplier },
  dicts: ["em_device_result", "em_device_check"],
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
      form: { director: "", unit: null },
      groupMembers: [],
      groupOptions: [],
      drawersupplier: false,
    };
  },
  watch: {
    form: {
      handler(val) {
        this.$emit("maintenanceContent", val);
      },
      deep: true,
      immediate: true,
    },
    "form.groupId": {
      handler(val) {
        if (val) {
          this.changeGroupId(val, 2);
        }
      },
      deep: true,
    },
  },
  async created() {
    findAll({ groupType: this.formData.maintenanceType }).then((res) => {
      this.groupOptions = res.data.map((item) => ({
        label: item.groupName,
        value: item.id,
      }));
      if (this.formData.groupId) {
        // this.$set(this.form, "unit", this.formData.groupId);
        this.$set(this.form, "groupId", this.formData.groupId);
        this.$set(this.form, "executor", this.formData.executor);
      }
    });
    if (this.formData.orderCode && this.disabled) {
      request({
        url: "/wom/repair/getWomRepairInfoOut",
        method: "get",
        params: { orderCode: this.formData.orderCode },
      }).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
        }
      });
    }
  },
  mounted() {},
  computed: {
    columns() {
      return [
        // ! 维修内容记录 委外
        {
          label: "维修内容记录",
          span: 24,
          subTitle: true,
        },
        {
          label: "委外维修单位",
          span: 8,
          prop: "unit",
          required: true,
          clickFn: () => {
            this.drawersupplier = true;
          },
        },
        {
          label: "委外单位负责人",
          span: 8,
          prop: "director",
          required: true,
          formDisabled: true,
        },
        {
          label: "联系方式",
          span: 8,
          prop: "phonenumber",
          required: true,
          formDisabled: true,
        },
        {
          label: "执行班组",
          span: 8,
          prop: "groupId",
          formType: "select",
          options: this.groupOptions,
          required: true,
          formDisabled: true,
        },
        {
          label: "执行负责人人",
          span: 8,
          prop: "executor",
          required: true,
          formType: "select",
          options: this.groupMembers,
          formDisabled: true,
        },
        { label: "", formType: "blank" },
        {
          label: "设备状态鉴定结果",
          span: 8,
          prop: "identityResult",
          formType: "select",
          options: this.dict.type.em_device_result,
          required: true,
        },
        {
          span: 4,
          prop: "identityFile",
          btnText: "点击上传鉴定报告",
          formType: "fileBtn",
        },
        { label: "", formType: "blank", height: 55 },
        {
          label: "设备状态验收结果",
          span: 8,
          prop: "acceptResult",
          formType: "select",
          options: this.dict.type.em_device_check,
          required: true,
        },
        {
          span: 4,
          prop: "acceptFile",
          btnText: "点击上传验收报告",
          formType: "fileBtn2",
        },
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
    closesupplier() {
      this.drawersupplier = false;
    },
    submitRadio(row) {
      this.$set(this.form, "unit", row.supplierName);
      this.$set(this.form, "director", row.contacts);
      this.$set(this.form, "phonenumber", row.phone);
      this.closesupplier();
    },
    dateDiffInHours(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);

      return Number(
        Math.round(Math.abs((firstDate - secondDate) / oneDay)) * 24
      );
    },
    //选择班组
    changeGroupId(val, flag) {
      if (!val) val = 1;
      getGroup(val).then((response) => {
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
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  background: rgba(0, 116, 217, 0.08);
  justify-content: space-between;
}
</style>
