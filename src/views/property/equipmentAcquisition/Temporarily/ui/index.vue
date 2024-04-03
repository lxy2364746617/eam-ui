<template>
  <Wrapper>
    <PropertyOperation
      :formData="formData"
      @submitForm="spareSubmitForm"
      infoTitle="计划信息"
      detailTitle="计划明细"
      attachmentsTitle="关联附件"
      :columnsInfo="columnsInfo"
      :columns="columns"
      :equipmentList="equipmentList2"
      :getList="getList"
      :isShowCard="isShowCard"
      :busId="formData.purchasePlanNo"
      :handleSelectionChange="handleSelectionChange"
      :busString="'busId'"
      @addFileList="handlerAddFileList"
      @delFileList="handlerDelFileList"
      ref="spareForm"
    >
      <!-- 左侧 -->
      <template slot="headerLeft">
        <el-button
          v-if="!isShowCard"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="margin-left: 5px"
          v-hasPermi="['property:purchase:add']"
          @click="handlerControls(null, 'add')"
          >新增</el-button
        >
        <el-button
          type="primary"
          v-if="isShowCard"
          icon="el-icon-download"
          size="mini"
          style="margin-left: 5px"
          v-hasPermi="['property:purchase:download']"
          @click="handlerControls(null, 'download')"
          >下载</el-button
        >
      </template>
      <!-- 操作 -->
      <template #end_handle="scope" v-if="!isShowCard">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handlerControls(scope.row, 'edit', scope)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handlerControls(scope.row, 'delete', scope)"
          >删除</el-button
        >
      </template>
    </PropertyOperation>
    <div class="form-footer" v-if="!isShowCard">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button v-hasPermi="['property:purchase:submit']" type="primary" @click="submitReview">保存并提交审批</el-button>
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
        :columns="columns.filter((item) => item.prop !== 'lineNum')"
        :formData="formDataNow"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'130px'"
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
    <!-- 提交 -->
    <el-dialog
      :title="subtitle"
      :visible.sync="subopen"
      width="60%"
      append-to-body
    >
      <subprocess
        :tableData="tableData"
        @submit="sub"
        @getTableData="getTableData"
      ></subprocess>
    </el-dialog>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import PropertyOperation from "@/views/property/PropertyOperation/index.vue";
import { listUser } from "@/api/system/user";
import { v4 as uuidv4 } from "uuid";
import { listDept } from "@/api/system/dept";

import {
  getProjectList,
  setProject,
  updateProject,
  getPurchaseDetail,
  downDetailLoad,
} from "@/api/property/purchase";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
export default {
  components: {
    PropertyOperation,
    Wrapper,
    subprocess,
  },
  dicts: [
    "em_device_state",
    "em_device_att",
    "em_device_level",
    "acquisition_plan",
  ],
  props: {
    detailReadonly: {
      type: Boolean,
      default: false,
    },
    businessId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isChoose: 0,
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
      updateList: [],
      delList: [],
      isShowCard: false,
      deptOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      addFileList: [],
      delFileList: [],
      // 选择备件
      drawersupplier: false,
      userList: [],
      // 审批流
      reviewCode: "",
      subtitle: "",
      subopen: false,
      tableData: [],
      ids: [],
      radioRow: null,
      approvalContent: null,
    };
  },
  created() {
    if (
      this.$route.query.formData ||
      this.$route.query.i ||
      this.detailReadonly
    ) {
      this.isShowCard =
        Number(this.$route.query.isShowCard) ||
        this.$route.query.i ||
        this.detailReadonly
          ? true
          : false;
      if (
        this.$route.query.i ||
        this.$route.query?.formData?.purchasePlanNo ||
        this.businessId
      ) {
        getPurchaseDetail({
          purchasePlanNo:
            this.$route.query.i ||
            this.$route.query?.formData?.purchasePlanNo ||
            this.businessId,
        }).then((res) => {
          if (res.code == 200) {
            this.formData = res.data;
            this.reviewCode = this.formData.purchasePlanNo;
            this.getTreeSelect();
          }
        });
      }
    } else {
      this.formData = {
        purchasePlanType: 2,
      };
      this.isShowCard = false;
      this.getTreeSelect();
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
          label: "计划名称",
          prop: "purchasePlanName",
          span: 6,
          required: true,
        },
        {
          label: "计划类型",
          prop: "purchasePlanType",
          span: 6,
          required: true,
          formType: "select",
          options: [
            {
              label: "临时采购",
              value: 2,
            },
          ],
          formDisabled: true,
        },
        // {
        //   label: "年度",
        //   prop: "annual",
        //   span: 5,
        //   formType: "dateYear",
        //   required: true,
        // },
        {
          label: "开竣工时间",
          prop: "time",
          span: 12,
          required: true,
          formType: "dateRange",
        },
      ];
    },
    columns() {
      return [
        {
          label: "设备名称",
          prop: "deviceName",
          tableVisible: true,
          width: 150,
          span: 23,
          required: true,
        },
        {
          label: "规格型号",
          prop: "sModel",
          tableVisible: true,
          span: 23,
          required: true,
        },
        {
          label: "技术参数",
          prop: "technologyParam",
          tableVisible: true,
          width: 250,
          span: 23,
          formType: "textarea",
          rows: 4,
        },
        {
          label: "必要性分析",
          prop: "necessityAnalysis",
          tableVisible: true,
          width: 250,
          span: 23,
          required: true,
          formType: "textarea",
          rows: 4,
        }, //(1 设备、2 部件)
        {
          label: "项目分类",
          prop: "projectCategory",
          tableVisible: true,
          span: 23,
        },
        {
          label: "子公司审查依据",
          prop: "examinationAccording",
          tableVisible: true,
          width: 150,
          span: 23,
        },
        {
          label: "需求日期",
          prop: "demandDate",
          width: 150,
          formType: "date",
          tableVisible: true,
          span: 23,
          required: true,
        }, //(A、B、C)
        {
          label: "需求数量",
          prop: "demandNum",
          formType: "number",
          tableVisible: true,
          span: 23,
          required: true,
        }, //(0 父级)
        {
          label: "计划单价(万元)",
          prop: "planPrice",
          tableVisible: true,
          width: 120,
          formType: "number",
          span: 23,
          required: true,
        },
        {
          label: "需求组织",
          prop: "demandOrganization",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
          span: 23,
          required: true,
        },
        {
          label: "备注",
          prop: "remark",
          tableVisible: true,
          span: 23,
        },
        { label: "行号", prop: "lineNum", tableVisible: true, span: 23 },
      ];
    },
  },
  methods: {
    // ! 提供下载列表字段
    convertToDefaultObject(columns) {
      const defaultObject = {};

      columns.forEach((column) => {
        if (column.prop) {
          defaultObject[column.prop] = null;
        }
      });

      return defaultObject;
    },
    // ! 提交审批流
    sub(val, userIds) {
      if (!this.formData.id) {
        setProject(this.approvalContent).then((res) => {
          if (res.code === 200) {
            definitionStart2(val.id, res.data, "purchase_plan", {
              path: "/property/temporarilyControls",
              nextUserIds: userIds,
            }).then((res) => {
              if (res.code == 200) {
                this.approvalContent = null;
                this.$message.success(res.msg);
                this.subopen = false;
              }
            });
            this.cancel();
          }
        });
      } else {
        updateProject(this.approvalContent).then((res) => {
          if (res.code === 200) {
            definitionStart2(val.id, this.reviewCode, "purchase_plan", {
              path: "/property/annualControls",
              nextUserIds: userIds,
            }).then((res) => {
              if (res.code == 200) {
                this.approvalContent = null;
                this.$message.success(res.msg);
                this.subopen = false;
              }
            });
            this.cancel();
          }
        });
      }
    },
    getTableData(val) {
      let data = {
        pageNum: val.page,
        pageSize: val.limit,
        category: "purchase_plan",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    handleSubmit(row) {
      this.subopen = true;
      this.subtitle = "提交";
      let data = {
        pageNum: 1,
        pageSize: 10,
        category: "purchase_plan",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    // ! 选择备件
    submitRadio(row) {
      this.formDataNow = { ...row, ...this.formDataNow };
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
    getTree(arr) {
      arr.forEach((item) => {
        item.id = item.label;
        item.label = item.label;
        if (item.children && item.children.length > 0) {
          this.getTree(item.children);
        }
      });
      return arr;
    },
    // ! 部门树数据
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = this.getTree(response.data);
        if (this.formData?.purchasePlanNo) {
          getProjectList({
            purchasePlanNo: this.formData?.purchasePlanNo,
            pageNum: 1,
            pageSize: 1000,
          }).then((res) => {
            if (res.code == 200) {
              this.equipmentList = res.data ?? [];
            }
          });
        }
      });
    },
    // ! 对话框
    save() {
      this.$refs.titleform.submitForm();
    },
    submitReview() {
      this.$refs.spareForm.submitForm("review");
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
        this.title = "新增";
        this.formDataNow = { type: 1 };
        this.drawer = true;
        this.$refs.titleform.clearValidate();

        return;
      } else if (act === "edit") {
        // ! 编辑
        this.title = "编辑";
        this.drawer = true;
        this.formDataNow = JSON.parse(JSON.stringify(row));
        this.selectIndex = scope.index - 1;
        return;
      } else if (act === "delete") {
        // ! 删除

        this.selectIndex = scope.index - 1;
        this.$modal
          .confirm('是否确认删除设备名称为"' + row.deviceName + '"的数据项？')
          .then(() => {
            // return delList(ids);

            if (row.id) {
              this.equipmentList.splice(this.selectIndex, 1);
              this.delList.push(row);
            } else this.equipmentList.splice(this.selectIndex, 1);
          })
          .then(() => {
            this.getList(this.queryParams);
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
        return;
      } else if (act === "download") {
        downDetailLoad({
          ids: this.ids.length > 0 ? this.ids : null,
          ...this.convertToDefaultObject(this.columns),
          purchasePlanNo: this.formData.purchasePlanNo,
        }).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          saveAs(blob, `purchaseDetail_${new Date().getTime()}`);
        });
      } else {
        // ! 其他
        return;
      }
    },
    handlerAddFileList(val) {
      this.addFileList = val;
    },
    handlerDelFileList(val) {
      this.delFileList = val;
    },
    // ! 信息提交
    spareSubmitForm(val, review) {
      val["startTime"] = val.time[0];
      val["endTime"] = val.time[1];
      val["annual"] = val.time[1].substring(0, 4);
      delete val.time;
      // * 新增
      if (review) {
        if (!this.formData.id) {
          val["addList"] = this.equipmentList;
          val["addFileList"] = this.addFileList;
          // if (!(val["addList"].length >=0))

          this.approvalContent = val;
          this.handleSubmit();
        } else {
          // * 编辑
          val["addList"] = this.equipmentList.filter((item) => !item.id);
          val["addFileList"] = this.addFileList;
          if (this.delList && this.delList.length > 0)
            val["delList"] = this.delList;
          if (this.updateList && this.updateList.length > 0)
            val["updateList"] = this.updateList;

          if (this.delFileList && this.delFileList.length > 0)
            val["delFileList"] = this.delFileList;
          this.approvalContent = val;
          this.handleSubmit();
        }
      } else {
        if (!this.formData.id) {
          val["addList"] = this.equipmentList;
          val["addFileList"] = this.addFileList;
          // if (!(val["addList"].length >=0))
          setProject(val).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("添加成功！");
              this.cancel();
            }
          });
        } else {
          // * 编辑
          val["addList"] = this.equipmentList.filter((item) => !item.id);
          val["addFileList"] = this.addFileList;
          if (this.delList && this.delList.length > 0)
            val["delList"] = this.delList;
          if (this.updateList && this.updateList.length > 0)
            val["updateList"] = this.updateList;
          if (this.delFileList && this.delFileList.length > 0)
            val["delFileList"] = this.delFileList;
          updateProject(val).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("更新成功！");
              this.cancel();
            }
          });
        }
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.radioRow = selection[0];
    },
    // ! 查询表格数据
    getList(queryParams) {
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      let matches = this.equipmentList.filter((item) => {
        for (let key in search) {
          // if (item[key] != search[key]) {
          if (!String(item[key]).includes(search[key])) {
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
    // ! 查询所有用户
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
