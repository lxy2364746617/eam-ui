<template>
  <Wrapper>
    <SparePartsOperation
      :formData="formData"
      @submitForm="spareSubmitForm"
      infoTitle="需求信息"
      :columnsInfo="columnsInfo"
      :columns="columns"
      :equipmentList="equipmentList"
      :getList="getList"
      :isShowCard="isShowCard"
      ref="spareForm"
    >
      <!-- 左侧 -->
      <template slot="headerLeft" v-if="!isChoose">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="margin-left: 5px"
          @click="handlerControls(null, 'add')"
          >领用备件</el-button
        >
      </template>
      <!-- 操作 -->
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          @click="handlerControls(scope.row, 'edit', scope)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handlerControls(scope.row, 'delete', scope)"
          >删除</el-button
        >
      </template>
    </SparePartsOperation>
    <div class="form-footer" v-if="!isShowCard">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary">保存并提交审批</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <!-- 对表格的操作 -->
    <!-- 对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
    >
      <TitleForm
        :columns="columns"
        :formData="formDataNow"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'120px'"
        :disabled="disabledForm"
      >
        <template #footer>
          <div class="form-footer">
            <el-button @click="save" type="primary">提交</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import SparePartsOperation from "@/views/sparepart/SparePartsOperation/index.vue";
import { listUser } from "@/api/system/user";
import { v4 as uuidv4 } from "uuid";
// import { listDept } from "@/api/system/dept";
export default {
  components: {
    SparePartsOperation,
    Wrapper,
  },
  dicts: ["spare_parts_unit"],

  data() {
    return {
      isChoose: false,
      equipmentList: null,
      formData: {},
      // 对话框
      formDataNow: {},
      disabledForm: false,
      title: "",
      drawer: false,
      selectIndex: null,
      addList: [],
      updateList: [],
      deleteList: [],
      isShowCard: false,
      deptOptions: [],
    };
  },
  created() {
    // this.getTreeSelect();
    // this.getUserList();
    this.getList();
    this.isShowCard = Number(this.$route.query.isShowCard);
    this.formData = this.$route.query.formData;
    this.isChoose = Number(this.$route.query.isShowCard);
  },
  mounted() {},
  computed: {
    columnsInfo() {
      return [
        {
          label: "备件领用单号",
          prop: "neckNo",
          span: 6,
          formDisabled: true,
        },
        {
          label: "备件领用名称",
          prop: "neckNo2",
          span: 6,
          // 多选select
        },

        {
          label: "领用人员",
          prop: "applyDeptPerson",
          span: 6,
          required: true,
          formDisabled: true,
        },

        {
          label: "领用日期",
          prop: "neckDate",
          span: 6,
          required: true,
          formType: "date",
        },
        {
          label: "备注",
          prop: "item8",
          span: 24,
          formType: "textarea",
          rows: 1,
        },
      ];
    },
    columns() {
      return [
        {
          label: "备件编码",
          prop: "item2",
          span: 22,
          required: true,
        },
        {
          label: "备件名称",
          prop: "item3",
          span: 22,
          required: true,
        },
        {
          label: "备件类别",
          prop: "item1",
          span: 22,
          required: true,
        },
        {
          label: "规格型号",
          prop: "item4",
          span: 22,
        },
        {
          label: "领用数量",
          prop: "item5",
          span: 22,
          formType: "number",
          required: true,
        },
        {
          label: "单位",
          prop: "item6",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
        },
        {
          label: "领用原因",
          prop: "item7",
          span: 22,
          formType: "textarea",
          rows: 4,
          span: 22,
        },
        {
          label: "备注",
          prop: "item8",
          span: 22,
          formType: "textarea",
          rows: 4,
          span: 22,
        },
      ];
    },
  },
  methods: {
    // ! 取消
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    // ! 保存
    submit() {
      this.$refs.spareForm.submitForm();
    },
    // ! 部门树数据
    // getTreeSelect() {
    //   listDept().then((response) => {
    //     this.deptOptions = response.data;
    //   });
    // },
    // ! 对话框
    save() {
      this.$refs.titleform.submitForm();
    },
    close() {
      this.drawer = false;
    },
    submitForm(formVal) {
      if (formVal.type === 1) {
        formVal.type = 2;
        this.equipmentList = this.equipmentList.concat([formVal]);
      } else {
        if (formVal.id) {
          this.equipmentList.splice(this.selectIndex, 1, formVal);
          this.updateList.push(formVal);
          console.log("========================有id编辑", this.updateList);
        }
      }
      this.close();
    },
    // ! 增删改操作
    handlerControls(row, act, scope) {
      if (act === "add") {
        // ! 新增
        this.title = "领用备件";
        this.formDataNow = { uuid: uuidv4(), type: 1 };
        this.drawer = true;
        this.$refs.titleform.clearValidate();

        return;
      } else if (act === "edit") {
        // ! 编辑
        this.title = "修改领用备件";
        this.drawer = true;
        this.formDataNow = JSON.parse(JSON.stringify(row));
        this.selectIndex = scope.index - 1;
        return;
      } else if (act === "delete") {
        // ! 删除

        this.selectIndex = scope.index - 1;
        this.$modal
          .confirm('是否确认删除备件编码为"' + row.partsCodes + '"的数据项？')
          .then(() => {
            // return delParts(ids);

            if (row.id) {
              this.equipmentList.splice(this.selectIndex, 1);
              this.deleteListList.push(row);
            } else this.equipmentList.splice(this.selectIndex, 1);
          })
          .then(() => {
            this.getList(this.queryParams);
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
        return;
      } else {
        // ! 其他
        return;
      }
    },
    // ! 信息提交
    spareSubmitForm(val) {
      console.log("========================父", val);
    },
    // ! 查询表格数据
    getList() {
      this.loading = true;

      this.equipmentList = [
        {
          id: 1,
          item1: "配件",
          item2: "BJ10101",
          item3: "六角螺栓",
          item4: "IQ18",
          item5: "1000",
          item6: "个",
          item7: "原因xxxxxxxxxxX",
          item8: "备注xxxxxxxxxxX",
        },
      ];
      this.total = this.equipmentList.length;
      this.loading = false;
    },
    // ! 查询组织数据
    getUserList(id) {
      if (!id) id = 100;
      this.loading = true;
      listUser({ deptId: id }).then((response) => {
        this.userList = response.rows.map((item) => ({
          label: item.nickName,
          value: item.nickName,
        }));
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.form-footer {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
</style>
