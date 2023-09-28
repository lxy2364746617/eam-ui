<template>
  <el-dialog title="选择上级设备" width="80%" :visible.sync="visible">
    <el-col :span="8">
      <!-- <parentdevice @submitRadio="submitRadio" @close="close"></parentdevice> -->
    </el-col>
    <el-col :span="16"></el-col>
  </el-dialog>
</template>

<script>
import parentdevice from "@/views/device/book/device";

export default {
  components: {
    parentdevice,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    submitRadio(row) {
      //   this.$set(this.formData,'parentId',row.deviceId)
      //   this.$set(this.formData,'parentDeviceName',row.deviceName)
      this.close();
    },
  },
};
</script>