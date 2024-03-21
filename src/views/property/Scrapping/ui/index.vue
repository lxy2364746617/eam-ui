<template>
  <Wrapper>
    <PropertyOperation
      :formData="formData"
      @submitForm="spareSubmitForm"
      infoTitle="设备报废信息"
      detailTitle="设备报废明细"
      :columnsInfo="columnsInfo"
      :columns="columns"
      :equipmentList="equipmentList2"
      :getList="getList"
      :isShowCard="isShowCard"
      :isChoose="isChoose"
      :busId="formData.scrapNo"
      :handleSelectionChange="handleSelectionChange"
      :busString="'busId'"
      @addFileList="handlerAddFileList"
      @delFileList="handlerDelFileList"
      ref="spareForm"
    >
      <!-- 左侧 -->
      <template slot="headerLeft">
        <el-button
          v-if="!isChoose"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="margin-left: 5px"
          v-hasPermi="['property:scrapping:add']"
          @click="handlerControls(null, 'add')"
          >新增</el-button
        >
        <el-button
          type="primary"
          v-else
          icon="el-icon-download"
          size="mini"
          style="margin-left: 5px"
          v-hasPermi="['property:scrapping:download']"
          @click="handlerControls(null, 'download')"
          >下载</el-button
        >
      </template>
      <!-- 操作 -->
      <template #end_handle="scope" v-if="!isChoose">
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
      <el-button type="primary" @click="submitReview">保存并提交审批</el-button>
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
        :columns="columns.filter((item) => item.prop !== 'createTime')"
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

    <el-drawer
      title="选择设备"
      :visible.sync="addItem.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        v-if="addItem.choosedrawer"
        :isChoose="true"
        :formData="form"
        @submitRadio="submitRadio2"
        @close="addItem.choosedrawer = false"
      ></parentdevice>
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
import parentdevice from "@/views/device/book/device";

import {
  getProjectList,
  setProject,
  updateProject,
  getPurchaseDetail,
  downDetailLoad,
} from "@/api/property/scrapping";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
import { equipmentTree } from "@/api/equipment/category";
export default {
  components: {
    PropertyOperation,
    Wrapper,
    subprocess,
    parentdevice,
  },
  dicts: ["em_device_state", "em_property_type", "em_scrap_way"],

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

      userList: [],
      userList2: [],

      // 选择设备
      addItem: {
        choosedrawer: false,
        copyInputName: "",
        copyInputId: "",
        addDrawer: false,
        addRadio: 1,
      },
      // 过滤设备
      form: {
        disIds: [],
      },
      categoryOptions: [],
      ids: [],
      radioRow: null,
      approvalContent: null,
    };
  },
  created() {
    this.getTreeSelect();
    // this.getUserList();
    if (this.$route.query.formData) {
      this.formData = this.$route.query.formData;
      this.isShowCard = Number(this.$route.query.isShowCard);
      this.isChoose = Number(this.$route.query.isShowCard);
      // this.getList(this.queryParams);

      if (this.formData.id) {
        // getPurchaseDetail({ id: this.formData.id }).then((res) => {
        //   if (res.code == 200) {
        //     this.formData = res.data;
        //   }
        // });

        this.reviewCode = this.formData.scrapNo;
      }
    } else {
      this.formData = {
        scrapUnitId: this.$store.state.user.standing.deptId,
        scrapUnit: this.$store.state.user.standing.dept.deptName,
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
    formDataNow: {
      handler(val) {
        // price 单价
        // depreciation 折旧

        if (!val.price && !val.depreciation) return;
        if (val.price < val.depreciation)
          return this.$message.warning("单价不能小于折旧金额！");

        this.formDataNow.lossAmount = val.price - val.depreciation;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    columnsInfo() {
      return [
        { label: "业务名称", prop: "busName", span: 6, required: true },
        {
          label: "报废方式",
          prop: "scrapType",
          span: 6,
          required: true,
          formType: "select",
          options: this.dict.type.em_scrap_way,
        },
        {
          label: "报废单位",
          prop: "scrapUnitId",
          span: 6,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
          formDisabled: true,
        },
        {
          label: "报废日期",
          prop: "scrapDate",
          formType: "date",
          span: 6,
          required: true,
        },
        { label: "备注", prop: "remark", span: 24 },
      ];
    },
    columns() {
      return [
        {
          label: "设备编码",
          prop: "deviceCode",
          tableVisible: true,
          width: 200,
          span: 23,
          clickFn: () => {
            this.$set(this.addItem, "choosedrawer", true);
            let lineIds = this.equipmentList.map((item) => item.deviceId) || [];
            this.$set(this.form, "disIds", lineIds);
          },
          required: true,
        },
        {
          label: "设备名称",
          prop: "deviceName",
          tableVisible: true,
          width: 200,
          span: 23,
          formDisabled: true,
          required: true,
        },
        {
          label: "规格型号",
          prop: "sModel",
          tableVisible: true,
          width: 200,
          span: 23,
          formDisabled: true,
          required: true,
        },
        {
          label: "设备类别",
          prop: "deviceType",
          tableVisible: true,
          formType: "selectTree",
          options: this.categoryOptions,
          width: 280,
          span: 23,
          formDisabled: true,
          required: true,
        },
        {
          label: "功能位置",
          prop: "location",
          tableVisible: true,
          span: 23,
          formDisabled: true,
          required: true,
        },
        {
          label: "索引号",
          prop: "indexNo",
          tableVisible: true,
          span: 23,
          required: true,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          tableVisible: true,
          formDisabled: true,
          span: 23,
          required: true,
        },
        {
          label: "资产类别",
          prop: "propertyType",
          formType: "select",
          options: this.dict.type.em_property_type,
          tableVisible: true,
          width: 150,
          span: 23,
        }, //(A、B、C)
        {
          label: "单价",
          prop: "price",
          formType: "number",
          tableVisible: true,
          span: 23,
          required: true,
        }, //(0 父级)
        {
          label: "已提折旧",
          prop: "depreciation",
          tableVisible: true,
          span: 23,
          formType: "number",
          required: true,
        },
        {
          label: "损失金额",
          prop: "lossAmount",
          tableVisible: true,
          span: 23,
          formDisabled: true,
          formType: "number",
          required: true,
        },
        {
          label: "折旧年限",
          prop: "depreciationLife",
          tableVisible: true,
          span: 23,
          formType: "number",
          required: true,
        },
        {
          label: "已使用年限",
          prop: "usedLife",
          tableVisible: true,
          span: 23,
          formType: "number",
          required: true,
        },
        {
          label: "损失原因",
          prop: "lossReason",
          tableVisible: true,
          width: 200,
          span: 23,
          required: true,
        },
        {
          label: "损失说明情况",
          prop: "lossSituation",
          tableVisible: true,
          width: 200,
          span: 23,
          formType: "textarea",
          rows: 3,
          required: true,
        },
        {
          label: "损失鉴定情况",
          prop: "lossIdentity",
          tableVisible: true,
          width: 200,
          span: 23,
          formType: "textarea",
          rows: 3,
        },
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
    submitRadio2(row) {
      this.addItem.copyInputName = row.deviceName;
      this.addItem.copyInputId = row.deviceId;
      this.formDataNow = {
        ...this.formDataNow,
        deviceCode: row.deviceCode,
        deviceName: row.deviceName,
        sModel: row.specs,
        deviceType: row.categoryId,
        location: row.location,
        deviceStatus: row.deviceStatus,
        propertyType: row.archivesOther.propertyType,
      };
      this.$set(this.addItem, "choosedrawer", false);
    },
    /** 查询用户列表 */
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
    /** 查询用户列表 */
    getUserList2(id) {
      if (!id) id = 100;
      this.loading = true;
      listUser({ deptId: id }).then((response) => {
        this.userList2 = response.rows.map((item) => ({
          label: item.nickName,
          value: item.nickName,
        }));
      });
    },
    // ! 提交审批流
    sub(val) {
      if (!this.formData.id) {
        setProject(this.approvalContent).then((res) => {
          if (res.code === 200) {
            definitionStart2(val.id, res.msg, "device_scrapped", {}).then(
              (res) => {
                if (res.code == 200) {
                  this.approvalContent = null;
                  this.$message.success(res.msg);
                  this.subopen = false;
                }
              }
            );
            this.cancel();
          }
        });
      } else {
        updateProject(this.approvalContent).then((res) => {
          if (res.code === 200) {
            definitionStart2(
              val.id,
              this.reviewCode,
              "device_scrapped",
              {}
            ).then((res) => {
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
        category: "device_scrapped",
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
        category: "device_scrapped",
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
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    // ! 部门树数据
    getTreeSelect() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;

        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
        if (this.$route.query.formData.id) {
          getProjectList({
            scrapNo: this.$route.query.formData.scrapNo,
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
          .confirm('是否确认删除设备编码为"' + row.deviceCode + '"的数据项？')
          .then(() => {
            // return delList(ids);

            if (row.id) {
              this.equipmentList.splice(this.selectIndex, 1);
              this.delList.push(row.id);
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
          scrapNo: this.formData.scrapNo,
        }).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          saveAs(blob, `sparePartDetail_${new Date().getTime()}`);
        });
      } else {
        // ! 其他
        return;
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.radioRow = selection[0];
    },
    handlerAddFileList(val) {
      this.addFileList = val;
    },
    handlerDelFileList(val) {
      this.delFileList = val;
    },
    // ! 信息提交
    spareSubmitForm(val, review) {
      delete val.time;
      // * 新增
      if (review) {
        if (!this.formData.id) {
          val["addDetails"] = this.equipmentList;
          // if (!(val["addList"].length >=0))
          this.approvalContent = val;
          this.handleSubmit();
        } else {
          // * 编辑
          val["addDetails"] = this.equipmentList.filter((item) => !item.id);
          if (this.delList && this.delList.length > 0)
            val["delDetails"] = this.delList;
          if (this.updateList && this.updateList.length > 0)
            val["updateDetails"] = this.updateList;

          this.approvalContent = val;
          this.handleSubmit();
        }
      } else {
        if (!this.formData.id) {
          val["addDetails"] = this.equipmentList;
          // if (!(val["addList"].length >=0))
          setProject(val).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("添加成功！");
              this.cancel();
            }
          });
        } else {
          // * 编辑
          val["addDetails"] = this.equipmentList.filter((item) => !item.id);
          if (this.delList && this.delList.length > 0)
            val["delDetails"] = this.delList;
          if (this.updateList && this.updateList.length > 0)
            val["updateDetails"] = this.updateList;
          updateProject(val).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("更新成功！");
              this.cancel();
            }
          });
        }
      }
    },
    // ! 查询表格数据
    getList(queryParams) {
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      let matches = this.equipmentList.filter((item) => {
        for (let key in search) {
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
