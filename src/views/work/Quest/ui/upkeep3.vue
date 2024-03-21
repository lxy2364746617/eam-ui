
<template>
  <Wrapper :title="wrapperTitle">
    <div class="header">
      <el-row :gutter="12">
        <el-col :span="19">
          <!-- <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>  -->
          <div style="display: flex; align-items: center">
            <svg-icon
              :icon-class="'bookmark-fill'"
              class-name="icon"
              style="height: 25px; width: 16px; margin-right: 6px"
            />
            <span style="font-size: 14px"> {{ formTitle }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 10px">
        <el-col :span="5">
          <img
            v-if="formData.fileResource"
            :src="mainImage"
            alt=""
            srcset=""
            style="vertical-align: top; height: 100px"
          />
          <img
            v-else
            class="noImg"
            style="width: 120px; vertical-align: top; height: 100px; border: 0"
          />
          <img
            v-if="qrCode.indexOf('null') == -1"
            class="qrcodeimg"
            :src="qrCode"
            alt=""
            srcset=""
            style="
              width: 100px;
              vertical-align: top;
              height: 100px;
              margin-left: 10px;
            "
          />
        </el-col>
        <el-col
          :span="19"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          <jm-form
            class="mr20"
            :columns="columns2"
            :formData="form"
            :showButton="false"
            :labelWidth="'100px'"
            :disabled="true"
            ref="jmform1"
          >
          </jm-form>
        </el-col>
      </el-row>
    </div>
    <carry-form
      v-if="columns.length"
      class="mr20"
      :columns="columns"
      :formData="formData"
      ref="titleform"
      :disabled="disabled"
      @submitForm="submitForm"
      :showButton="showButton"
      :labelWidth="'140px'"
    >
      <template #footer>
        <div class="container-box2" v-if="!disabled">
          <el-button @click="saveHandle" type="primary">执行</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </template>
    </carry-form>
  </Wrapper>
</template>
<script>
import CarryForm from "@/components/CarryForm";
import JmForm from "@/components/JmForm";
import Wrapper from "@/components/wrapper";
import {
  goExecutorSubmit,
  goExecutorDetail,
  addCheckExpense,
} from "@/api/work/schedule";
import { findAll, getGroup } from "@/api/system/group";
import { listUser } from "@/api/system/user";
import { listSupplier } from "@/api/system/supplier";
import { removeStore } from "@/utils/property.js";
export default {
  components: { Wrapper, CarryForm, JmForm },
  dicts: ["em_is_special", "em_device_state", "em_device_check"],
  data() {
    return {
      wrapperTitle: "",
      formData: {},
      disabled: false,
      showButton: true,
      groupMembers: [],
      groupOptions: [],
      checkCosts: [],
      userList: [],
      formTitle: null,
    };
  },

  async created() {
    this.carryValue = JSON.parse(localStorage.getItem("carryValue"));
    this.fileShow = this.carryValue.i;
    this.disabled = !this.carryValue.i;
    this.formTitle = this.carryValue.t;
    this.form = this.carryValue.val;
    this.routerForm = this.carryValue.l;
    this.formData["workOrderCode"] = this.carryValue.l.orderCode;
    this.formData["orderCode"] = this.carryValue.l.orderCode;
    this.formData["deviceCode"] = this.form.deviceCode;
    this.getUserList();
    goExecutorDetail({
      workOrderCode: this.formData.workOrderCode,
      deviceCode: this.form.deviceCode,
    }).then((res) => {
      this.formData = {
        ...this.formData,
        ...res.data,
        checkResult: "" + res.data.checkResult,
        checkUnit: res.data.checkUnit
          ? Number(res.data.checkUnit)
          : this.carryValue.l.groupId,
        recorder: res.data.recorder ?? this.$store.state.user.standing.nickName,
        recordTime: res.data.recordTime ?? new Date(),
      };
      this.checkCosts = res.data.checkCosts;
    });
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  computed: {
    columns2() {
      return [
        { label: "设备名称", prop: "deviceName", span: 12 },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "select",
          options: this.dict.type.em_device_state,
          span: 12,
        },
        { label: "设备编码", prop: "deviceCode", span: 12 },
        {
          label: "是否特种设备",
          prop: "isSpecial",
          formType: "select",
          options: this.dict.type.em_is_special,
          span: 12,
        },
      ];
    },
    columns() {
      return [
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
          options: this.userList,
          required: true,
          formDisabled: true,
        },
        {
          label: "检测单位负责人",
          span: 8,
          prop: "checkUnitHead",
          required: true,
          formDisabled: true,
        },

        {
          label: "联系方式",
          span: 8,
          prop: "headPhonenum",
          required: true,
          formDisabled: true,
        },
        {
          label: "执行时间",
          span: 8,
          prop: "executionTime",
          formType: "datetime",
          required: true,
        },
        {
          label: "记录时间",
          span: 8,
          prop: "recordTime",
          formType: "datetime",
          required: true,
          formDisabled: true,
        },
        {
          label: "记录人",
          span: 8,
          prop: "recorder",
          required: true,
          formDisabled: true,
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
        // { span: 24, formType: "inspectContent" },
        {
          span: 24,
          formType: "expenseInspect",
        },
        // ! 关联附件

        {
          prop: "contacts2",
          span: 24,
          formType: "appraisalReport",
        },
      ];
    },
    mainImage() {
      return process.env.VUE_APP_BASE_API + this.form.devicePic;
    },
    qrCode() {
      return process.env.VUE_APP_BASE_API + this.form.qrCode;
    },
  },
  watch: {},
  methods: {
    findName(options, value, label) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i][label];
        }
      }
      return name || value;
    },
    getUserList() {
      listSupplier({ pageNum: 1, pageSize: 10000 }).then((res) => {
        this.userList = res.rows.map((item) => {
          return {
            value: item.id,
            label: item.supplierName,
            phone: item.phone,
            contacts: item.contacts,
          };
        });
        this.$set(this.formData, "checkUnit", this.carryValue.l.groupId);
        this.$set(
          this.formData,
          "checkUnitHead",
          this.findName(this.userList, this.formData.checkUnit, "contacts")
        );
        this.$set(
          this.formData,
          "headPhonenum",
          this.findName(this.userList, this.formData.checkUnit, "phone")
        );
      });
    },
    dateDiffInHours(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);

      return Number(
        Math.round(Math.abs((firstDate - secondDate) / oneDay)) * 24
      );
    },

    getList() {},
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    handleCancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (JSON.stringify(node.children) == "[]") {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      // ! 成功了才会走这
      formdata.recordTime = this.parseTime(
        new Date(),
        "{y}-{m}-{d} {h}:{m}:{s}"
      );
      formdata["sysFileResources"] = formdata.addFileList;
      delete formdata.addFileList;
      let newCheckCosts = formdata.checkCosts.map((item) => ({
        ...item,
        workOrderCode: formdata.workOrderCode,
        deviceCode: this.form.deviceCode,
      }));
      Promise.all([
        goExecutorSubmit(formdata),
        addCheckExpense({ checkCosts: newCheckCosts }),
      ]).then((res) => {
        if (res[0].code === 200 && res[1].code === 200) {
          this.$message.success("执行成功！");
          this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
          this.$router.go(-1); //跳回上页
        }
      });
      // this.formData = { supplierName: "" };
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
  },
  beforeRouteLeave(to, from, next) {
    // 保存上一个路由信息
    this.$store.dispatch("tagsView/delView", from); // 关闭当前页
    // this.$router.go(-1);
    removeStore("carryValue");
    next();
  },
};
</script>
<style lang='scss' scoped>
.header {
  background-color: #ecf1fa;
  margin-bottom: 20px;
}
.title {
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
  padding-left: 10px;
}
.medium {
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-dialog {
  width: 30%;
}
.submit {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
::v-deep .el-radio__label {
  padding-left: 5px;
  padding-right: 10px;
}
::v-deep .el-radio {
  margin-right: 0;
}

.controls {
  color: #1f77fc;
  padding-left: 6px;
  cursor: pointer;
}
.img-list {
  width: 100%;
  height: 60%;
  padding: 5px 20px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0; /* 隐藏滚动条 */
  }

  ::-webkit-scrollbar-thumb {
    background: transparent; /* 点击后滚动条的颜色 */
  }
  .card {
    min-height: 450px;

    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    img {
      margin-top: 10px;
    }
  }
}
.img-submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-box2 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.noImg {
  background: url("../../../../assets/images/noImg.png") no-repeat;
}
::v-deep .el-table th.el-table__cell {
  background-color: #f9f9f9;
}
// 滚动条样式
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 12px;
  opacity: 0.5;
}
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
