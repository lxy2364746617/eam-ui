<template>
  <Wrapper>
    <SparePartsOperation
      :formData="formData"
      @submitForm="spareSubmitForm"
      infoTitle="需求信息"
      :columnsInfo="columnsInfo"
      :columns="columns"
      :equipmentList="equipmentList2"
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

    <!-- 选择备件 -->
    <el-drawer
      title="选择备件"
      :visible.sync="drawersupplier"
      size="60%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <spareList
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></spareList>
    </el-drawer>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import SparePartsOperation from "@/views/sparepart/SparePartsOperation/index.vue";
import { listUser } from "@/api/system/user";
import { v4 as uuidv4 } from "uuid";
import spareList from "@/views/sparepart/spareList/spareList.vue";
import {
  getAttachmentReceiptList,
  getAttachmentDetail,
  addAttachment,
  updateAttachment,
} from "@/api/sparePart/spareReceive";
export default {
  components: {
    SparePartsOperation,
    Wrapper,
    spareList,
  },
  dicts: ["spare_parts_unit", "spare_parts_type"],

  data() {
    return {
      isChoose: false,
      equipmentList: [],
      equipmentList2: [],
      formData: {},
      // 对话框
      formDataNow: {},
      disabledForm: false,
      title: "",
      drawer: false,
      selectIndex: null,
      addList: [],
      updateParts: [],
      delParts: [],
      isShowCard: false,
      deptOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },

      // 选择备件
      drawersupplier: false,
    };
  },
  created() {
    // this.getTreeSelect();
    // this.getUserList();
    if (this.$route.query.formData) {
      this.formData = this.$route.query.formData;
      this.isShowCard = Number(this.$route.query.isShowCard);
      this.isChoose = Number(this.$route.query.isShowCard);

      if (this.formData.id) {
        getAttachmentDetail({ receiptCode: this.formData.receiptCode }).then(
          (res) => {
            if (res.code == 200) {
              this.formData = res.data;
              this.equipmentList = res.data.parts ?? [];
            }
          }
        );
      }
    } else {
      this.formData = {
        recruiterName: this.$store.state.user.standing.nickName,
        recruiterId: this.$store.state.user.standing.userId,
      };
      this.isShowCard = 0;
    }
  },
  mounted() {},
  watch: {
    equipmentList: {
      handler(val) {
        this.equipmentList2 = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    columnsInfo() {
      return [
        {
          label: "备件领用单号",
          prop: "receiptCode",
          span: 6,
          formDisabled: true,
        },
        {
          label: "备件领用名称",
          prop: "receiptName",
          span: 6,
          // 多选select
        },

        {
          label: "领用人员",
          prop: "recruiterName",
          span: 6,
          required: true,
          formDisabled: true,
        },

        {
          label: "领用日期",
          prop: "receiptDate",
          span: 6,
          required: true,
          formType: "date",
        },
        {
          label: "备注",
          prop: "remark",
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
          prop: "partCode",
          span: 22,
          required: true,
          clickFn: () => {
            this.drawersupplier = true;
          },
        },
        {
          label: "备件名称",
          prop: "partName",
          span: 22,
          required: true,
          formVisible: true,
          formDisabled: true,
        },
        {
          label: "备件类别",
          prop: "partType",
          span: 22,
          required: true,
          formType: "select",

          options: this.dict.type.spare_parts_type,
          formVisible: true,
          formDisabled: true,
        },
        {
          label: "规格型号",
          prop: "sModel",
          span: 22,
          formVisible: true,
          formDisabled: true,
        },
        {
          label: "领用数量",
          prop: "quantity",
          span: 22,
          formType: "number",
          required: true,
        },
        {
          label: "单位",
          prop: "unit",
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
          required: true,
          formDisabled: true,
        },
        {
          label: "领用原因",
          prop: "reason",
          span: 22,
          formType: "textarea",
          rows: 4,
          span: 22,
        },
        {
          label: "备注",
          prop: "remark",
          span: 22,
          formType: "textarea",
          rows: 4,
          width: 200,
        },
      ];
    },
  },
  methods: {
    // ! 选择备件
    submitRadio(row) {
      this.formDataNow = row;
      this.closesupplier();
    },
    closesupplier() {
      this.drawersupplier = false;
    },
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
          this.updateParts.push(formVal);
        } else {
          this.equipmentList.splice(this.selectIndex, 1, formVal);
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
              this.delParts.push(row.id);
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
      delete val.parts;
      // * 新增
      if (!this.formData.id) {
        val["addParts"] = this.equipmentList;
        addAttachment(val).then((res) => {
          if (res.code === 200) {
            this.$modal.msgSuccess("添加成功！");
            this.cancel();
          }
        });
      } else {
        // * 编辑
        val["addParts"] = this.equipmentList.filter((item) => !item.id);
        if (this.delParts && this.delParts.length > 0)
          val["delParts"] = this.delParts;
        if (this.updateParts && this.updateParts.length > 0)
          val["updateParts"] = this.updateParts;
        updateAttachment(val).then((res) => {
          if (res.code === 200) {
            this.$modal.msgSuccess("更新成功！");
            this.cancel();
          }
        });
      }
    },
    // ! 查询表格数据
    getList(queryParams) {
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      let matches = this.equipmentList.filter((item) => {
        for (let key in search) {
          if (item[key] != search[key]) {
            if (search[key] == "") continue;
            return false;
          }
        }
        return true;
      });
      this.equipmentList2 = matches;
      this.total = 0;
      // getAttachmentReceiptList(queryParams).then((res) => {
      // this.equipmentList = res.data.parts;
      // this.total = 0;
      // });
    },
    // ! 查询组织数据
    getUserList(id) {
      if (!id) id = 100;
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
  padding-top: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
</style>
