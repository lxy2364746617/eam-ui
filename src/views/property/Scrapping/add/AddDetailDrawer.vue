<template>
  <el-drawer
    title="新增明细"
    direction="rtl"
    size="40%"
    :visible.sync="visible"
  >
    <div class="drawer-wrapper">
      <div class="drawer-content">
        <el-form ref="form" :model="formData" label-width="110px">
          <el-form-item label="设备编码" prop="deviceCode" required>
            <el-input @focus="showSelectDialog" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName" required>
            <el-input disabled style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="sModel" required>
            <el-input disabled style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="设备类别" prop="deviceType" required>
            <el-input disabled style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="功能位置" prop="location" required>
            <el-select style="width: 100%"></el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="deviceStatus" required>
            <el-select style="width: 100%">
              <el-option
                v-for="item in equipStateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产类别" prop="propertyType" required>
            <el-select style="width: 100%">
              <el-option
                v-for="item in propertyTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="索引号" prop="indexNo" required>
            <el-input style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="price" required>
            <el-input-number
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="已提折旧" prop="depreciation" required>
            <el-input-number
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="损失金额" prop="lossAmount" required>
            <el-input-number
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="折旧年限" prop="depreciationLife" required>
            <el-input-number
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="已使用年限" prop="usedLife" required>
            <el-input-number
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="损失原因" prop="lossReason" required>
            <el-input style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="损失说明情况" prop="lossIdentity" required>
            <el-input
              type="textarea"
              show-word-limit
              :maxlength="200"
              style="width: 100%"
            ></el-input>
          </el-form-item>
          <el-form-item label="损失鉴定情况" prop="lossIdentity">
            <el-input
              type="textarea"
              show-word-limit
              :maxlength="200"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-footer">
        <el-button type="primary" @click="handleConfirm()">确定</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
    <!-- 选择上级设备Dialog -->
    <select-parent-device-dialog ref="spdDialog"></select-parent-device-dialog>
  </el-drawer>
</template>
  
<script>
import SelectParentDeviceDialog from "./SelectParentDeviceDialog.vue";
export default {
  components: {
    SelectParentDeviceDialog,
  },
  dicts: ["em_device_state", "em_property_type"],
  data() {
    return {
      visible: false,
      formData: {},
    };
  },
  computed: {
    equipStateOptions() {
      return this.dict.type.em_device_state;
    },
    propertyTypeOptions() {
      return this.dict.type.em_property_type;
    },
  },
  methods: {
    showSelectDialog() {
      console.log("1111");

      this.$refs.spdDialog.visible = true;
    },
    handleConfirm() {},
  },
};
</script>

<style lang="scss" scoped>
.drawer-wrapper {
  position: relative;
  .drawer-content {
    padding: 0 20px 50px;
    overflow-y: auto;
  }
  .drawer-footer {
    width: 40%;
    height: 50px;
    padding: 0 20px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    z-index: 10;
  }
}
</style>