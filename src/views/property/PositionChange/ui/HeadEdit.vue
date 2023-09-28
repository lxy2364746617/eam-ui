<template>
  <div :class="[!isEdit ? 'card bgc' : 'card']">
    <el-form
      ref="elForm"
      :model="formData"
      class="form"
      :rules="rules"
      size="medium"
      label-width="140px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="变动单号" prop="annual">
            <el-input
              disabled
              placeholder="自动生成"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报废日期" prop="purchasePlanType">
            <el-date-picker
              v-if="isEdit"
              type="date"
              v-model="formData.time"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              clearable
            >
            </el-date-picker>
            <span v-else-if="!isEdit"
              >{{ formData2.time[0] }}~{{ formData2.time[1] }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属组织" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请部门" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请部门负责人" prop="annual">
            <el-select
              disabled
              placeholder="自动生成"
              :style="{ width: '100%' }"
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="参考信息" prop="annual">
            <el-input
              placeholder="请输入信息"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
          label: "年度购置",
          value: 1,
        },
      ],
    };
  },
  computed: {},
  watch: {
    formData: {
      handler(newFormData, oldFormData) {
        this.$emit("formData2", newFormData);
      },
      deep: true, // 深层监听
    },
  },

  created() {},
  mounted() {},
  methods: {},
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
