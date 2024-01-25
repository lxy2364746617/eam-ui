
<template>
  <Wrapper :title="wrapperTitle">
    <div class="header">
      <el-row :gutter="12">
        <el-col :span="19">
          <!-- <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>  -->
          <span style="font-size: 14px"> {{ formTitle }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 10px">
        <el-col :span="5">
          <img
            v-if="mainImage.indexOf('null') == -1"
            :src="mainImage"
            alt=""
            srcset=""
            style="width: 50%; vertical-align: top; height: 100px"
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
              
            "
          />
        </el-col>
        <el-col
          :span="19"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          <carry-form
            class="mr20"
            :columns="columns2"
            :formData="form"
            :showButton="false"
            :labelWidth="'100px'"
            :disabled="true"
            ref="jmform1"
          >
          </carry-form>
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
import Wrapper from "@/components/wrapper";
import { goExecutorSubmit, goExecutorDetail } from "@/api/work/schedule";
import { findAll, getGroup } from "@/api/system/group";
export default {
  components: { Wrapper, CarryForm },
  dicts: ["em_is_special", "em_device_state", "em_device_check"],
  data() {
    return {
      wrapperTitle: "",
      formData: {},
      disabled: false,
      showButton: true,
      groupMembers: [],
      groupOptions: [],
    };
  },
  async created() {
    this.carryValue = JSON.parse(localStorage.getItem("carryValue"));
    this.fileShow = this.carryValue.i;
    this.disabled = !this.carryValue.i;
    this.formTitle = this.carryValue.t;
    this.form = this.carryValue.val;
    this.routerForm = this.carryValue.l;
    this.formData = this.carryValue.l;
    this.formData["workOrderCode"] = this.formData.orderCode;
    delete this.formData.orderCode;

    // await this.getDetails(this.queryParams);
    findAll({ groupType: this.formData.orderType }).then((res) => {
      res.data.forEach((item) => {
        item.label = item.groupName;
        item.value = item.id;
      });
      this.groupOptions = res.data;

      if (!this.carryValue.i) {
        goExecutorDetail({
          workOrderCode: this.formData.workOrderCode,
          deviceCode: this.form.deviceCode,
        }).then((res) => {
          // this.formData = Object.assign(this.formData, res.data);
          this.formData = { ...this.formData, ...res.data };
          this.$set(this.formData, "checkUnit", Number(res.data.checkUnit));

          this.$set(this.formData, "checkResult", String(res.data.checkResult));
        });
      } else {
        if (this.formData.groupId) {
          this.$set(this.formData, "checkUnit", this.formData.groupId);
          // this.form.unit = this.formData.groupId;
          this.formData.executor = this.formData.executor;
        }
      }
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
          formType: "datetime",
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
        // { span: 24, formType: "inspectContent" },
        {
          span: 24,
          formType: "expenseInspect",
        },
        // ! 关联附件

        {
          prop: "contacts2",
          span: 24,
          formType: "document",
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
  watch: {
    "formData.checkUnit": {
      handler(val) {
        if (val) {
          this.changeGroupId(val, 2);
        }
      },
      deep: true,
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
        this.$set(this.formData, "checkUnitHead", response.data.leaderName);
        this.$set(this.formData, "director", response.data.leaderId);

        // this.formData.director = response.data.leaderId;

        this.$set(
          this.formData,
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
    handleCancel() {
      this.formData = { supplierName: "" };

      this.$refs.titleform.clearValidate();
      //   this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      //   this.$router.go(-1); //跳回上页
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

      formdata["sysFileResources"] = formdata.addFileList;
      delete formdata.addFileList;
      goExecutorSubmit(formdata).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.msg);
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
::v-deep .el-upload-list {
  display: none;
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
}
</style>
