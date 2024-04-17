<template>
  <Wrapper :title="wrapperTitle">
    <div class="box">
      <el-button
        type="primary"
        size="small"
        style="position: absolute; right: 0; top: -2.5%"
        v-if="
          disabled &&
          this.formData.workOrderSchedule.find(
            (item) =>
              item.orderStatus == '已完成' &&
              item.createBy &&
              this.formData.workActive == 5
          )
        "
        @click="addFaultCase"
        >加入故障案例库</el-button
      >
      <div class="box-header" v-if="disabled">
        <div class="title">工单进度</div>
        <!-- 进度条 -->
        <el-steps
          :active="formData.workActive"
          align-center
          style="margin-top: 20px"
          finish-status="success"
        >
          <el-step
            v-for="item in formData.workOrderSchedule"
            :key="item.id"
            :title="item.orderStatus"
            icon="el-icon-loading"
          >
            <div slot="description">
              <span style="font-size: 14px">{{ item.createBy }}</span>
              <br />
              <span>{{ item.createTime }}</span>
            </div></el-step
          >
        </el-steps>
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
      >
        <template #footer>
          <div class="container-box2" v-if="!disabled">
            <el-button @click="saveHandle" type="primary">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </carry-form>
    </div>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import JmTable from "@/components/JmTable";
import CarryForm from "@/components/CarryForm";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { goWorkOrder, addFaultCase } from "@/api/work/schedule";
import { listFaultcode } from "@/api/monitor/faultcode";

export default {
  components: { Wrapper, JmTable, CarryForm, Treeselect },
  data() {
    return {
      wrapperTitle: "",
      formData: {},
      disabled: false,
      showButton: true,
    };
  },
  async created() {
    if (this.$route.query.item) {
      let row = JSON.parse(JSON.stringify(this.$route.query.item));
      // this.$route.query.item = null;
      this.formData = row;
      this.disabled = this.$route.query.disabled === "true" ? true : false;
    }
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  computed: {
    columns() {
      return [
        // 需填信息

        {
          prop: "contacts",
          span: 24,
          formType: "equipOne",
        },
        // ! 批量维修记录
        {
          span: 24,
          formType: "maintenanceRecord",
        },
        // ! 结束
        {
          span: 24,
          formType: "spareRecord",
        },
        {
          span: 24,
          formType: "timeLog",
        },
        {
          span: 24,
          formType: "expense",
        },
        // ! 关联附件

        {
          prop: "contacts2",
          span: 24,
          formType: "document",
        },
      ];
    },
  },
  watch: {},
  methods: {
    // ! 加入故障案例库
    addFaultCase() {
      addFaultCase({
        busId: this.formData?.orderCode,
        code: this.formData?.faultInfoDTO?.faultType.split(" ")[0],
        faultName: this.formData?.faultInfoDTO?.faultType.split(" ")[1],
        level: this.formData?.faultInfoDTO?.faultGrade,
        type: this.formData?.faultInfoDTO?.faultType.split(" ")[2],
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success("加入故障案例库成功！");
        }
      });
    },
    handleCancel() {
      this.formData = { supplierName: "" };

      this.$refs.titleform.clearValidate();
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
      goWorkOrder(formdata).then((res) => {
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
.box {
  background-color: #fff;
  margin-top: 20px;
  width: 100%;
  height: auto;
  position: relative;
}
.footer {
  padding-top: 20px;
}

.subtitle {
  //   border-bottom: 1px solid #ddd;
  background-color: #ebf4fc;
  ::v-deep .el-form-item__label {
    color: #1d2129;
    font-weight: bold;
    // width: 80px !important;
    text-align: left;
    padding-left: 10px;
  }
}
.container-box2 {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
.box-header {
  margin-bottom: 20px;
  .title {
    color: #55566d;
    font-weight: bold;
    height: 30px;
    text-align: left;
    font-size: 16px;
    padding-left: 20px;
    border-bottom: 1px solid #ececec;
  }
  ::v-deep .el-step__head.is-success {
    color: #0c7de0;
    border-color: #0c7de0;
  }

  ::v-deep .el-step__description.is-success {
    color: #adadad;
  }
  ::v-deep .el-step__icon-inner[class*="el-icon"]:not(.is-status),
  ::v-deep .el-step__icon {
    font-size: 16px;
    color: #0c7de0;
  }

  ::v-deep .el-step__title.is-process,
  ::v-deep .el-step__title.is-success,
  ::v-deep .el-step__title.is-wait {
    font-weight: 400;
    color: #0c7de0;
  }

  ::v-deep .el-step__line {
    background-color: #0c7de0;
  }
}
</style>
