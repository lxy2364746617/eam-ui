
<template>
  <div>
    <div class="title">人员配置</div>
    <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto">
      <el-col :span="7">
        <el-form-item label="执行班组" prop="groupId" :required="!disabled">
          <el-select
            v-model="formData.groupId"
            @change="changeGroupId"
            clearable
            :disabled="disabled"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="执行人" prop="executor">
          <el-select v-model="formData.executor" clearable :disabled="disabled">
            <el-option
              v-for="item in groupMembers"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            >
            </el-option>
          </el-select> </el-form-item
      ></el-col>
      <el-col :span="7">
        <el-form-item label="负责人" prop="directorName" :required="!disabled">
          <el-input
            v-model="formData.directorName"
            placeholder="请输入巡点检负责人"
            :disabled="true"
          /> </el-form-item
      ></el-col>
    </el-row>
  </div>
</template>
<script>
import { getGroup, findAll } from "@/api/system/group";
export default {
  components: {},
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

  created() {
    // let newGroupType;
    // if (this.formData.maintenanceType == "设备维修") newGroupType = "SBWX";
    // if (this.formData.maintenanceType == "定期检验") newGroupType = "DQJY";
    // if (this.formData.maintenanceType == "巡点检类型") newGroupType = "XDJ";
    findAll({ groupType: this.formData.maintenanceType }).then((res) => {
      this.groupOptions = res.data.filter(
        (item) =>
          item.groupType === this.formData.orderType && item.groupStatue == 0
      );
      if (this.formData.groupId) {
        this.changeGroupId(this.formData.groupId, 2);
      }
    });
  },
  watch: {
    "formData.orderType": {
      handler(val) {
        findAll({ groupType: this.formData.maintenanceType }).then((res) => {
          this.groupOptions = res.data.filter(
            (item) =>
              item.groupType === this.formData.orderType &&
              item.groupStatue == 0
          );
          if (this.formData.groupId) {
            this.changeGroupId(this.formData.groupId, 2);
          }
        });
      },
    },
  },
  data() {
    return {
      //班组选项
      groupOptions: [],
      groupMembers: [],
    };
  },

  mounted() {},
  computed: {},
  methods: {
    //选择班组
    changeGroupId(val, flag) {
      if (!val) val = 1;
      getGroup(val).then((response) => {
        this.formData.directorName = response.data.leaderName;
        this.formData.director = response.data.leaderId;
        this.groupMembers = response.data.sysUserGroupList;
      });
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
