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
        <el-col :span="8">
          <el-form-item label="移交单编号" prop="purchasePlanName">
            <el-input
              v-if="isEdit"
              v-model="formData.purchasePlanName"
              placeholder="自动生成"
              disabled
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
            <span v-else-if="!isEdit">{{ formData2.purchasePlanName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务日期" prop="purchasePlanType">
            <el-date-picker
              v-if="isEdit"
              clearable
              type="date"
              v-model="formData.time"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :style="{ width: '100%' }"
              placeholder="请选择"
            >
            </el-date-picker>
            <span v-else-if="!isEdit"
              >{{ formData2.time[0] }}~{{ formData2.time[1] }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属组织" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调出部门" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调出部门负责人" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调入部门" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调入部门负责人" prop="annual">
            <el-select :style="{ width: '100%' }"></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="参考信息" prop="annual">
            <el-input
              :style="{ width: '100%' }"
              placeholder="请输入信息"
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
