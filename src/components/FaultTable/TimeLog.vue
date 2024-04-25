<template>
  <div class="app-container2">
    <div class="title">
      <i class="el-icon-caret-right"
        ><span class="icon-text">人员与工时记录</span></i
      >
      <el-button
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        v-if="!disabled"
        >新增人员</el-button
      >
    </div>

    <div>
      <ContTable
        :tableData="standardList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        ref="jmtable"
        :isRadio="isChoose"
        :handleWidth="230"
        :columns="columns"
        :showSearch="false"
        :isShow="disabled"
        :showOperate="!disabled"
        :rightToolbarShow="false"
      >
        <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
            >删除</el-button
          >
        </template></ContTable
      >
    </div>

    <!-- 添加人员与工时 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :title="flag.isSub"
      size="30%"
      :wrapperClosable="false"
    >
      <!-- <TitleForm
        ref="rulesForm"
        :model="form"
        :rules="rules"
        label-width="110px"
        size="small"
        style="margin: 10px auto"
      >
        <el-row :gutter="10" style="padding: 0 20px">
          <el-col :span="24">
            <el-form-item label="维修人员姓名" prop="realName">
              <el-input
                @click.native="openSb"
                v-model="form.realName"
                placeholder="请输入维修人员姓名"
              >
                <i slot="suffix" class="el-input__icon el-icon-search"></i
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入用户名"
                disabled
              /> </el-form-item></el-col
          ><el-col :span="24">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入联系方式"
              /> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                size="small"
                type="date"
                clearable
                style="width: 100%"
                placeholder="选择时间"
              >
              </el-date-picker> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                size="small"
                type="date"
                clearable
                style="width: 100%"
                placeholder="选择时间"
              >
              </el-date-picker> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item label="工时" prop="workHours">
              <el-input-number
                v-model="form.workHours"
                :min="1"
                placeholder="请输入"
                :step="1"
                style="width: 100%"
                controls-position="right"
              ></el-input-number> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item label="维修内容" prop="repairInfo">
              <el-input
                type="textarea"
                v-model="form.repairInfo"
                placeholder="请输入"
                :rows="5"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveHandle">立即创建</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </TitleForm> -->
      <TitleForm
        :columns="columns2"
        :formData="form"
        @submitForm="submitForm"
        ref="titleform"
      >
        <template #footer>
          <div class="container-box2">
            <el-button type="primary" @click="saveHandle">立即创建</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>

    <!-- 分派人员 -->
    <el-drawer
      size="65%"
      class="drawer"
      title="选择执行人员"
      :visible.sync="isDrawer"
    >
      <ContTable2
        class="mr20 ml20"
        :tableData="equipmentList2"
        @getList="getList2"
        @handleSelectionChange="handleSelectionChange2"
        :total="total2"
        ref="jmtable"
        :isRadio="true"
        :handleWidth="230"
        :columns="columns3"
        :isEdit="false"
        :showOperate="false"
        :rightToolbarShow="false"
        :showSearch="false"
      >
      </ContTable2>

      <div class="submit">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="drawerClose">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import ContTable from "@/components/ContTable/index3";
import ContTable2 from "@/components/ContTable";
import { listDept } from "@/api/system/dept";
import { getExecutorList } from "@/api/work/schedule";
import request from "@/utils/request";
export default {
  components: { ContTable, ContTable2 },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      // 选择人员
      isDrawer: false,
      equipmentList2: [],
      radioRow2: [],
      ids2: [],
      //
      total2: 0,
      standardList: [],
      loading: false,
      btnLoading: false,
      form: {
        realName: "",
        userName: "",
        phone: "",
        startTime: "",
        endTime: "",
        workHours: 0,
        repairInf: "",
      },
      drawer: false,
      deptOptions: null,
      flag: {
        isSub: "",
        index: null,
      },
      isChoose: false,
      // 表单校验
      rules: {
        realName: [{ required: true, message: "请输入", trigger: "blur" }],
        userName: [{ required: true, message: "请输入", trigger: "blur" }],
        phone: [{ required: true, message: "请输入", trigger: "blur" }],
        startTime: [{ required: true, message: "请输入", trigger: "blur" }],
        endTime: [{ required: true, message: "请输入", trigger: "blur" }],
        workHours: [{ required: true, message: "请输入", trigger: "blur" }],
        repairInfo: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  watch: {
    standardList: {
      handler(val) {
        this.$emit("timeLog", val);
      },
      deep: true,
      immediate: true,
    },
    isDrawer: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.formData && this.formData.groupId) {
            this.getList2(this.formData.groupId);
          }
        } else {
          this.title = "";
        }
      },
      deep: true,
    },
    form: {
      handler(val) {
        if (!val) return;
        if (val.endTime && val.startTime) {
          this.form.workHours = this.dateDiffInHours(
            val.endTime,
            val.startTime
          );
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    await this.getDeptTree();
    if (this.formData.orderCode) {
      request({
        url: "/wom/repair/getWomRepairWorkHours",
        method: "get",
        params: { orderCode: this.formData.orderCode },
      }).then((res) => {
        if (res.code === 200) {
          this.standardList = res.data;
        }
      });
    }
  },
  mounted() {},
  computed: {
    columns() {
      return [
        { label: "维修人员", prop: "realName", required: true, width: 150 },
        { label: "用户名", prop: "userName", required: true },
        { label: "联系方式", prop: "phone", width: 150 },
        { label: "开始时间", prop: "startTime", span: 22, width: 200 },
        {
          label: "结束时间",
          prop: "endTime",
          required: true,
          span: 22,
          width: 200,
        },
        {
          label: "工时（h）",
          prop: "workHours",
          required: true,
          span: 22,
          formType: "number",
        },
        {
          label: "维修内容",
          prop: "repairInfo",
          required: true,
          span: 22,
          width: 200,
        },
      ];
    },
    columns2() {
      return [
        {
          label: "维修人员",
          prop: "realName",
          required: true,
          span: 22,
          clickFn: () => {
            this.openSb();
          },
        },
        {
          label: "用户名",
          prop: "userName",
          required: true,
          span: 22,
          formDisabled: true,
        },
        {
          label: "联系方式",
          prop: "phone",
          span: 22,
          formType: "intNumber",
          formDisabled: true,
        },
        {
          label: "开始时间",
          prop: "startTime",
          required: true,
          span: 22,
          formType: "datetime",
        },
        {
          label: "结束时间",
          prop: "endTime",
          required: true,
          span: 22,
          formType: "datetime",
        },
        {
          label: "工时（h）",
          prop: "workHours",
          required: true,
          span: 22,
          formType: "number",
        },
        {
          label: "维修内容",
          prop: "repairInfo",
          required: true,
          span: 22,
          formType: "textarea",
          rows: 5,
        },
      ];
    },
    columns3() {
      return [
        { label: "姓名", prop: "nickName", tableVisible: true },
        { label: "用户名", prop: "userName", tableVisible: true },
        { label: "岗位", prop: "postName", tableVisible: true },

        {
          label: "技能等级",
          prop: "level",
          tableVisible: true,
          formType: "rate",
          width: 200,
        }, //(A、B、C)
        {
          label: "本月待办任务数",
          prop: "pendingCount",

          tableVisible: true,
          width: 180,
        },

        {
          label: "本月已处理任务数",
          prop: "finishCount",
          tableVisible: true,
          width: 180,
        },
        {
          label: "班组",
          prop: "groupName",
          tableVisible: true,
        },
      ];
    },
  },
  methods: {
    dateDiffInHours(date1, date2) {
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);
      const oneMinute = 60 * 1000;

      return Number(
        (
          Math.round(Math.abs((firstDate - secondDate) / oneMinute)) / 60
        ).toFixed(1)
      );
    },
    drawerClose() {
      this.isDrawer = false;
    },
    openSb() {
      this.isDrawer = true;
    },
    save(row) {
      this.form.realName = this.radioRow2.userName;
      this.form.userName = this.radioRow2.nickName;
      this.form.phone = this.radioRow2.phonenumber;
      this.form.groupId = this.radioRow2.groupId;
      this.isDrawer = false;
    },
    async getList2(row) {
      this.loading2 = true;
      getExecutorList({ groupId: row }).then((response) => {
        this.equipmentList2 = response.data;
        this.total2 = response.total;
        this.loading2 = false;
      });
    },

    getList() {
      this.standardList = [];
    },
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    handleCancel() {
      this.close();
    },
    saveHandle() {
      // this.$refs.rulesForm.validate((valid, item) => {
      //   if (valid) {
      //     if (this.flag.isSub === "新增") {
      //       let newValue = JSON.parse(JSON.stringify(this.form));
      //       this.standardList = this.standardList.concat([newValue]);
      //       this.close();
      //     } else if (this.flag.isSub === "编辑") {
      //       let newValue = JSON.parse(JSON.stringify(this.form));
      //       this.$set(this.standardList, this.flag.index, newValue);
      //       this.close();
      //     }
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
      this.$refs.titleform.submitForm();
    },
    close() {
      this.$refs.titleform.resetFields();

      this.drawer = false;
    },
    submitForm(formVal) {
      if (this.flag.isSub === "新增") {
        let newValue = JSON.parse(JSON.stringify(formVal));
        this.standardList = this.standardList.concat([newValue]);
        this.close();
      } else if (this.flag.isSub === "编辑") {
        let newValue = JSON.parse(JSON.stringify(formVal));
        this.$set(this.standardList, this.flag.index, newValue);
        this.close();
      }
    },
    handleSelectionChange(value) {},
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.id);

      this.radioRow2 = selection[0];
    },
    handleAdd() {
      this.flag.isSub = "新增";

      this.drawer = true;
    },
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.flag = { isSub: "编辑", index: scope.index };
      this.form = JSON.parse(JSON.stringify(scope.row));
      this.drawer = true;
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          that.standardList.splice(scope.$index, 1);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang='scss' scoped>
.app-container2 {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .container-box1 {
    max-height: 550px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  // .table {
  //   max-height: 550px;
  //   overflow-y: scroll;
  //   margin-bottom: 20px;
  // }
  .container-box2 {
    flex-shrink: 0;
    background-color: #fff;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ddd;
    z-index: 2;
  }
}

::v-deep {
  .el-select {
    width: 100%;
  }

  .el-tabs__nav-scroll {
    width: 50% !important;
    margin: 0 auto !important;
  }

  .el-tabs__nav-wrap {
    padding-top: 10px;
  }

  .el-tabs__nav-wrap::after {
    top: 0;
  }
}

.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 36px;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-right: 18px;
  border-left: 5px solid #1f77fc;
  i {
    margin-right: 10px;
    color: #1f77fc;
    .icon-text {
      color: #555;
      font-weight: 700;
      padding-left: 5px;
    }
  }
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
}
</style>
