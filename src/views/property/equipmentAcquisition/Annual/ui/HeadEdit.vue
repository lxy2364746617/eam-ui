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
      ><span>计划信息</span>
    </p>
    <el-row :gutter="24">
      <el-form
        ref="elForm"
        :model="formData"
        class="form"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="5">
          <el-form-item label="计划名称" prop="purchasePlanName">
            <el-input
              v-if="isEdit"
              v-model="formData.purchasePlanName"
              placeholder="请输入"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
            <span v-else-if="!isEdit">{{ formData2.purchasePlanName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="计划类型" prop="purchasePlanType">
            <el-select
              v-if="isEdit"
              v-model="formData.purchasePlanType"
              placeholder="请选择"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in purchasePlanTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
            <span v-else-if="!isEdit">{{
              formData2.purchasePlanType == 1 ? "年度采购" : "临时采购"
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="年度" prop="annual">
            <el-date-picker
              v-if="isEdit"
              v-model="formData.annual"
              format="yyyy"
              value-format="yyyy"
              :style="{ width: '100%' }"
              placeholder="请选择年份"
              clearable
            ></el-date-picker>

            <span v-else-if="!isEdit">{{ formData2.annual }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="开竣工时间" prop="time">
            <el-date-picker
              v-if="isEdit"
              type="daterange"
              v-model="formData.time"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              clearable
              :picker-options="{
                disabledDate(time) {
                  return (
                    time.getTime() > Date.now() + 2 * 30 * 24 * 60 * 60 * 1000
                  );
                },
              }"
            >
            </el-date-picker>
            <span v-else-if="!isEdit"
              >{{ formData2.time[0] }}~{{ formData2.time[1] }}</span
            >
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["formData", "isEdit"],
  data() {
    return {
      formData2: { ...this.formData },
      rules: {
        purchasePlanName: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        purchasePlanType: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        annual: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "开竣工时间不能为空",
            trigger: "change",
          },
        ],
      },
      purchasePlanTypeOptions: [
        {
          label: "年度采购",
          value: 1,
        },
      ],
    };
  },
  computed: {},
  watch: {
    // formData: {
    //   handler(newFormData, oldFormData) {
    //     this.$emit("formData2", newFormData);
    //   },
    //   deep: true, // 深层监听
    // },
  },

  created() {},
  mounted() {},
  methods: {
    submitForm(review) {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          this.$emit("submitForm", this.formData, review);
        } else {
          return false;
        }
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
  height: 170px;
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
    height: 140px;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0 60px;
  }
}
.bgc {
  background: url("../../../../../assets/images/backdrop.png") no-repeat;
  background-size: 100% 100%;
}
</style>
