
<template>
  <div>
    <div class="title">人员配置</div>
    <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto">
      <el-col :span="8">
        <el-form-item label="保养班组" prop="groupId" :required="!disabled">
          <el-select
            v-model="formData.groupId"
            @change="changeGroupId"
            :disabled="disabled"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            >
            </el-option>
          </el-select> </el-form-item
      ></el-col>
      <el-col :span="8">
        <el-form-item label="主要执行人" prop="executor">
          <el-select v-model="formData.executor" :disabled="disabled">
            <el-option
              v-for="item in groupMembers"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            >
            </el-option>
          </el-select> </el-form-item
      ></el-col>
      <el-col :span="8">
        <el-form-item
          label="保养负责人"
          prop="directorName"
          :required="!disabled"
        >
          <el-input
            v-model="formData.directorName"
            placeholder="请输入巡点检负责人"
            :disabled="true"
          /> </el-form-item
      ></el-col>
      <el-col :span="8">
        <el-form-item label="其他执行人" prop="otherExecutor">
          <el-input
            v-model="formData.otherExecutor"
            placeholder="请选择其他执行人"
            @click.native="openSb"
            :disabled="disabled"
          /> </el-form-item
      ></el-col>
    </el-row>

    <!-- 添加领用数据 -->
    <el-drawer
      title="选择其他执行人"
      :visible.sync="choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <SelectExecutor
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="choosedrawer = false"
        :choosedrawer="choosedrawer"
        :formData="formData"
      >
      </SelectExecutor>
    </el-drawer>
  </div>
</template>
<script>
import SelectExecutor from "./SelectExecutor.vue";
import { getGroup, findAll } from "@/api/system/group";
import { getOrderExecutor } from "@/api/work/schedule";
export default {
  components: { SelectExecutor },
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  created() {
    findAll({ groupType: this.formData.orderType }).then((res) => {
      this.groupOptions = res.data;
      if (this.formData.groupId) {
        this.changeGroupId(this.formData.groupId, 2);
      }
    });
    if (this.formData.orderCode) {
      getOrderExecutor({ workOrderCode: this.formData.orderCode }).then(
        (res) => {
          if (res.code == 200) {
            this.formData.otherExecutor = res.data
              .filter((item) => item.type == 2)
              .map((item) => {
                return item.nickName;
              })
              .join("、");
          }
        }
      );
    }
  },
  watch: {
    "formData.orderType": {
      handler(val) {
        findAll({ groupType: val }).then((res) => {
          this.groupOptions = res.data;
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
      // 选择其他执行人开关
      choosedrawer: false,
    };
  },
  watch: {
    "formData.executor": {
      handler(val) {
        if (val) {
          this.formData.otherExecutor = "";
          this.formData.maintainExecutors = [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  computed: {},
  methods: {
    submitRadio2(row) {
      row.forEach((item) => {
        item["executor"] = this.formData.executor;
        item["type"] = 2;
      });
      if (
        this.formData["maintainExecutors"] &&
        this.formData["maintainExecutors"].length > 0
      ) {
        this.formData["maintainExecutors"] =
          this.formData["maintainExecutors"].concat(row);
      } else {
        this.formData["maintainExecutors"] = row;
      }
      this.formData.otherExecutor = this.formData["maintainExecutors"]
        .map((item) => item.nickName)
        .join("、");
      this.choosedrawer = false;
    },
    openSb() {
      if (!this.formData.executor) {
        this.$message.error("请选择主要执行人！");
        return;
      }
      this.choosedrawer = true;
    },
    //选择班组
    changeGroupId(val) {
      let obj = {};
      obj = this.groupOptions.find((item) => {
        return item.id == val;
      });
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
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 18px;
  background: rgba(0, 116, 217, 0.08);
  justify-content: space-between;
}
</style>
