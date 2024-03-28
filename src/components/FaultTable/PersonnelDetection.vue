
<template>
  <div>
    <div class="title">人员配置</div>
    <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto">
      <el-col :span="7">
        <el-form-item
          label="检测单位"
          prop="supplierName"
          :required="!disabled"
        >
          <el-input
            v-model="formData.supplierName"
            placeholder="请输入"
            @click.native="
              () => {
                drawersupplier = true;
              }
            "
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检测负责人" prop="directorName">
          <el-input
            v-model="formData.directorName"
            placeholder="请输入负责人"
            :disabled="true"
          /> </el-form-item
      ></el-col>
      <el-col :span="9">
        <el-form-item label="内部负责人" prop="executor" :required="!disabled">
          <el-select v-model="formData.executor" :disabled="disabled">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option> </el-select></el-form-item
      ></el-col>
    </el-row>

    <!-- 添加供应商对话框 -->
    <el-drawer
      title="选择供应商"
      :visible.sync="drawersupplier"
      size="70%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <supplier
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></supplier>
    </el-drawer>
  </div>
</template>
<script>
import { getGroup, findAll } from "@/api/system/group";
import supplier from "@/views/sparepart/supplier";
import { listUser } from "@/api/system/user";
export default {
  components: { supplier },
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
    this.getUserList();
  },
  watch: {
    // "formData.orderType": {
    //   handler(val) {
    //     findAll({ groupType: val }).then((res) => {
    //       this.groupOptions = res.data;
    //       if (this.formData.groupId) {
    //         this.changeGroupId(this.formData.groupId, 2);
    //       }
    //     });
    //   },
    // },
  },
  data() {
    return {
      //班组选项
      groupOptions: [],
      groupMembers: [],
      drawersupplier: null,
      userList: [],
    };
  },

  mounted() {},
  computed: {},
  methods: {
    closesupplier() {
      this.drawersupplier = false;
    },
    submitRadio(row) {
      this.$set(this.formData, "supplierName", row.supplierName);
      this.$set(this.formData, "directorName", row.contacts);
      this.$set(this.formData, "groupId", row.id);
      this.closesupplier();
    },
    getUserList() {
      listUser({ pageNum: 1, pageSize: 10000 }).then((res) => {
        this.userList = res.rows.map((item) => {
          return {
            id: item.userId,
            label: item.nickName,
          };
        });
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
