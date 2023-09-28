<template>
  <div :class="[!isEdit ? 'card bgc' : 'card']">
    <el-row :gutter="24">
      <el-form
        ref="elForm"
        :model="formData"
        class="form"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-form-item label="领用单号" prop="neckNo">
          <el-input
            v-if="isEdit"
            v-model="formData.neckNo"
            placeholder="自动生成"
            disabled
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
          <span v-else-if="!isEdit">{{ formData2.neckNo }}</span>
        </el-form-item>
        <el-form-item label="业务日期" prop="neckDate">
          <el-date-picker
            v-if="isEdit"
            v-model="formData.neckDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: '100%' }"
            placeholder="请选择日期"
            clearable
          ></el-date-picker>
          <span v-else-if="!isEdit">{{ formData2.neckDate }}</span>
        </el-form-item>
        <el-form-item label="所属组织" prop="affDeptId">
          <el-cascader
            v-if="isEdit"
            v-model="formData.affDeptId"
            :options="deptOptions"
            :props="{ expandTrigger: 'click' }"
            @change="handleChange1"
          ></el-cascader>
          <span v-else-if="!isEdit">{{ formData2.affDeptName }}</span>
        </el-form-item>
        <el-form-item label="调出部门" prop="outDeptId">
          <el-cascader
            v-if="isEdit"
            v-model="formData.outDeptId"
            :options="deptOptions"
            :props="{ expandTrigger: 'click' }"
            @change="handleChange2"
          ></el-cascader>

          <span v-else-if="!isEdit">{{ formData2.outDeptId }}</span>
        </el-form-item>
        <el-form-item
          label="调出部门负责人"
          prop="outDeptPerson"
          label-width="120px"
        >
          <el-input v-if="isEdit" v-model="formData.outDeptPerson"></el-input>

          <span v-else-if="!isEdit">{{ formData2.outDeptPerson }}</span>
        </el-form-item>
        <el-form-item label="申请部门" prop="applyDeptId">
          <el-cascader
            v-if="isEdit"
            v-model="formData.applyDeptId"
            :options="deptOptions"
            :props="{ expandTrigger: 'click' }"
            @change="handleChange3"
          ></el-cascader>

          <span v-else-if="!isEdit">{{ formData2.applyDeptName }}</span>
        </el-form-item>
        <el-form-item
          label="申请部门负责人"
          prop="applyDeptPerson"
          label-width="130px"
        >
          <el-input v-if="isEdit" v-model="formData.applyDeptPerson"></el-input>

          <span v-else-if="!isEdit">{{ formData2.applyDeptPerson }}</span>
        </el-form-item>
        <el-form-item label="参考信息" prop="referenceInformation">
          <el-input
            v-if="isEdit"
            v-model="formData.referenceInformation"
            placeholder="请输入参考信息"
            clearable
            :style="{ width: '600px' }"
          >
          </el-input>

          <span v-else-if="!isEdit">{{ formData2.referenceInformation }}</span>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { listDept } from "@/api/system/dept";
import { convertToTargetFormat } from "@/utils/property.js";
export default {
  components: {},
  props: ["formData", "isEdit"],
  data() {
    return {
      deptOptions: null,
      formData2: { ...this.formData },
      rules: {
        neckDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
        affDeptId: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
        applyDeptId: [
          {
            required: true,
            message: "请输入选择申请部门",
            trigger: "change",
          },
        ],
        applyDeptPerson: [
          {
            required: true,
            message: "请输入申请部门负责人",
            trigger: "change",
          },
        ],
      },
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

  async created() {
    await this.getTreeSelect();
  },
  mounted() {},
  methods: {
    handleChange(e) {},
    handleChange1(e) {
      this.formData.affDeptId = e[0];
    },
    handleChange2(e) {
      this.formData.outDeptId = e[0];
    },
    handleChange3(e) {
      this.formData.applyDeptId = e[0];
    },
    async getTreeSelect() {
      // equipmentTree().then((response) => {

      // });
      listDept().then(async (response) => {
        this.deptOptions = await convertToTargetFormat(response.data);
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
  height: 220px;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  background: #f7fbff;
  padding: px 15px;

  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
    padding-bottom: 25px;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .form {
    width: 100%;
    height: 220px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 30px 60px;
  }
}
.bgc {
  background: url("../../../../assets/images/backdrop.png") no-repeat;
  background-size: 100% 100%;
}
</style>
