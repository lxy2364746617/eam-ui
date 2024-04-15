<template>
  <div>
    <div class="title">设备信息</div>
    <el-form
      ref="form"
      :model="form"
      label-width="140px"
      :rules="rules"
      size="small"
      style="margin: 10px auto; width: 70%"
    >
      <el-row :gutter="10" style="padding: 0 40px">
        <el-col :span="12">
          <el-form-item
            label="设备名称"
            prop="deviceName"
            @click.native="openSb"
          >
            <el-input
              v-model="form.deviceName"
              :disabled="disabled"
              placeholder="请输入设备名称"
            >
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="设备编码" prop="deviceCode">
            <el-input
              v-model="form.deviceCode"
              placeholder="请输入设备编码"
              disabled
            /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="设备规格" prop="specs">
            <el-input
              v-model="form.specs"
              placeholder="请输入规格型号"
              disabled
            /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="设备类别" prop="categoryName">
            <el-input
              v-model="form.categoryName"
              placeholder="请输入设备类别"
              disabled
            /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="功能位置(工作面)" prop="locationName">
            <el-input
              v-model="form.locationName"
              placeholder="请输入功能位置"
              disabled
            /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="affDeptName">
            <el-input
              v-model="form.affDeptName"
              placeholder="请输入所属组织"
              disabled
            /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="当前使用组织" prop="currDeptName">
            <el-input
              v-model="form.currDeptName"
              placeholder="请输入当前使用组织"
              disabled
            /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="是否特种设备" prop="isSpecial">
            <el-radio
              disabled
              v-model="form.isSpecial"
              :label="dict.value"
              v-for="dict in dict.type.em_is_special"
              :key="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-form-item></el-col
        >

        <!-- <el-col :span="8"><el-form-item label="状态" prop="standardStatus">
                            <el-select v-model="form.standardStatus">
                                <el-option :label="dict.label" :value="dict.value"
                                    v-for="dict in dict.type.sys_normal_disable" :key="dict.value">
                                </el-option>
                            </el-select>
                        </el-form-item></el-col> -->
        <!-- <el-col :span="12"><el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" placeholder="请输入备注" disabled />
                        </el-form-item></el-col> -->
      </el-row>
    </el-form>

    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择设备"
      :visible.sync="form.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        :isChoose="true"
        @submitRadio="submitRadio2"
        @close="form.choosedrawer = false"
      >
      </parentdevice>
    </el-drawer>
  </div>
</template>
<script>
import parentdevice from "@/views/device/book/device";
import { getWomDevice } from "@/api/work/schedule";
export default {
  components: { parentdevice },
  dicts: ["sys_normal_disable", "em_is_special", "mro_m_cycle_type"],
  props: {
    formData: {
      default: {},
      type: Object,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      // 表单参数
      form: {
        choosedrawer: false,
        deviceName: "",
        deviceCode: "",
        categoryId: "",
        isSpecial: 1,
        specs: "",
        currDeptId: "",
        affDeptId: "",
        deviceStatus: "",
        remark: "",
        faultInfoDTO: {},
      },
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        deviceCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" },
        ],
        specs: [
          { required: true, message: "设备规格不能为空", trigger: "blur" },
        ],
        categoryName: [
          { required: true, message: "设备类别不能为空", trigger: "blur" },
        ],
        locationName: [
          {
            required: true,
            message: "功能位置(工作面)不能为空",
            trigger: "blur",
          },
        ],
        affDeptName: [
          { required: true, message: "所属组织不能为空", trigger: "blur" },
        ],
        currDeptName: [
          { required: true, message: "当前使用组织不能为空", trigger: "blur" },
        ],
        isSpecial: [
          { required: true, message: "是否特种设备不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    form: {
      handler(val) {
        if (val) {
          this.$emit("SBXX", val);
        }
      },
      deep: true,
    },
  },

  async created() {
    if (this.formData.orderCode) {
      await getWomDevice({
        orderCode: this.formData.orderCode,
        lineCode: "",
      }).then((res) => {
        if (res.code === 200) {
          this.form = { ...res.data[0] };
          this.$set(
            this.formData,
            "faultDate",
            res.data[0].faultInfoDTO.faultDate
          );
          this.$set(
            this.formData,
            "faultLocation",
            res.data[0].faultInfoDTO.faultLocation
          );
          this.$set(
            this.formData,
            "faultType",
            res.data[0].faultInfoDTO.faultType
          );
          this.$set(
            this.formData,
            "faultGrade",
            res.data[0].faultInfoDTO.faultGrade
          );
          this.$set(
            this.formData,
            "haltFlag",
            res.data[0].faultInfoDTO.haltFlag
          );
          this.$set(
            this.formData,
            "faultInfo",
            res.data[0].faultInfoDTO.faultInfo
          );
          this.$set(
            this.formData,
            "fileList",
            res.data[0].faultInfoDTO.fileList
          );
        }
      });
    }
    if (this.$route.query.item && this.$route.query.item.deviceDTOList) {
      this.form = this.$route.query.item.deviceDTOList;
    }
  },
  mounted() {},
  computed: {},
  methods: {
    // setFormData(data) {
    //   this.form = data;
    // },
    getMessage() {
      getEquip().then((res) => {});
    },
    openSb() {
      this.$set(this.form, "choosedrawer", true);
    },
    submitRadio2(row) {
      this.form = {
        ...row,
        deviceType: row.categoryId,
        // choosedrawer: false
      };
      this.$set(this.form, "choosedrawer", false);
    },
  },
};
</script>
<style lang='scss' scoped>
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
  align-items: center;
  padding: 0 18px;
}
</style>
