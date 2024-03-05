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
      >
      </TitleForm>
    </div>

    <!-- 选择故障类型 -->
    <el-drawer
      title="故障类型"
      :visible.sync="drawerFaultManage"
      size="70%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <faultManage
        @submitRadio="submitFaultManage"
        :isRadio="true"
        @close="closeFaultManage"
      ></faultManage>
    </el-drawer>
  </div>
</template>
<script>
import { listDept } from "@/api/system/dept";
import { findAll, getGroup } from "@/api/system/group";
import request from "@/utils/request";
import { getWomDevice, getWomFaultInfo2 } from "@/api/work/schedule";
import faultManage from "@/views/work/Request/ui/faultManage.vue";
export default {
  components: { faultManage },
  dicts: ["fault_grade"],
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
      form: {
        finishFlag: 1,
        attachmentFlag: 1,
        directorName: "",
        director: "",
      },
      groupMembers: [],
      groupOptions: [],
      drawerFaultManage: false,
    };
  },
  watch: {
    form: {
      handler(val) {
        this.$emit("maintenanceRecord", val);
        if (!val) return;
        if (val.endTime && val.startTime) {
          this.form.workHours = this.dateDiffInHours(
            val.endTime,
            val.startTime
          );
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    findAll({ groupType: this.formData.maintenanceType }).then((res) => {
      res.data.forEach((item) => {
        item.label = item.groupName;
        item.value = item.id;
      });
      this.groupOptions = res.data;
      if (this.formData.groupId) {
        this.changeGroupId(this.formData.groupId, 2);
        request({
          url: "/wom/repair/getWomRepairInfo",
          method: "get",
          params: { orderCode: this.formData.orderCode },
        }).then((res) => {
          if (res.code === 200) {
            this.form = { ...this.form, ...res.data };
            this.$set(this.form, "unit", Number(this.formData.groupId));
            this.$set(this.form, "executor", this.formData.executor);
          }
        });
      }
    });
    await getWomDevice({
      orderCode: this.formData.orderCode,
      lineCode: "",
    }).then((res) => {
      if (res.code == 200) {
        getWomFaultInfo2({
          deviceCode: res.data[0].deviceCode,
          orderCode: this.formData.orderCode,
        }).then((res) => {
          if (res.code == 200) {
            this.$set(this.form, "faultType", res.data.faultInfoDTO.faultType);
            this.$set(this.form, "faultInfo", res.data.faultInfoDTO.faultInfo);
            this.$set(
              this.form,
              "faultReason",
              res.data.faultInfoDTO.faultReason
            );
          }
        });
      }
    });
  },
  mounted() {},
  computed: {
    columns() {
      return [
        // ! 维修内容记录
        {
          label: "维修内容记录",
          span: 24,
          subTitle: true,
        },
        {
          label: "故障类型",
          span: 7,
          prop: "faultType",
          required: true,
          clickFn: () => {
            this.drawerFaultManage = true;
          },
        },
        {
          label: "维修单位",
          span: 6,
          prop: "unit",
          formType: "select",
          options: this.groupOptions,
          required: true,
          formDisabled: true,
        },
        {
          label: "执行人员",
          span: 6,
          prop: "executor",
          formType: "select",
          options: this.groupMembers,
          formDisabled: true,
        },

        {
          label: "",
          formType: "blank",
        },
        {
          label: "维修开始",
          span: 7,
          prop: "startTime",
          formType: "datetime",
          required: true,
        },
        {
          label: "维修结束",
          span: 6,
          prop: "endTime",
          formType: "datetime",
          required: true,
        },
        {
          label: "维修工时",
          span: 6,
          prop: "workHours",
          formType: "number",
        },
        {
          label: "故障详情",
          span: 24,
          prop: "faultInfo",
          formType: "textarea",
          rows: 4,
        },
        {
          label: "故障原因",
          span: 12,
          prop: "faultReason",
          formType: "textarea",
          required: true,
          rows: 4,
        },
        {
          label: "维修措施",
          span: 12,
          prop: "repairInfo",
          formType: "textarea",
          required: true,
          rows: 4,
        },
        {
          label: "是否维修完成",
          span: 12,
          prop: "finishFlag",
          formType: "radio",
          options: [
            { label: "是", value: 1 },
            { label: "否", value: 0 },
          ],
          required: true,
        },
        {
          label: "是否更换备件",
          span: 12,
          prop: "attachmentFlag",
          formType: "radio",
          options: [
            { label: "是", value: 1 },
            { label: "否", value: 0 },
          ],
          required: true,
        },
        {
          label: "附件",
          span: 12,
          prop: "annuex",
          btnText: "点击上传",
          formType: "file",
        },
        // ! 结束
      ];
    },
  },
  methods: {
    submitFaultManage(row) {
      this.$set(this.form, "faultType", row.faultCode + " " + row.faultName);
      this.closeFaultManage();
    },
    closeFaultManage() {
      this.drawerFaultManage = false;
    },
    dateDiffInHours(date1, date2) {
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);
      const oneMinute = 60 * 1000;

      return Number(
        (
          Math.round(Math.abs((firstDate - secondDate) / oneMinute)) / 60
        ).toFixed(1)
      );
    },
    //选择班组
    changeGroupId(val, flag) {
      if (!val) val = 1;
      getGroup(val).then((response) => {
        this.form.directorName = response.data.leaderName;
        this.form.director = response.data.leaderId;
        this.groupMembers = response.data?.sysUserGroupList
          ? response.data?.sysUserGroupList?.map((item) => ({
              label: item.nickName,
              value: item.userId,
            }))
          : [];
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
