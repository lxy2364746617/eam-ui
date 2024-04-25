<template>
  <Wrapper>
    <PropertyOperation
      :formData="formData"
      @submitForm="spareSubmitForm"
      infoTitle="位置状态变动信息"
      :columnsInfo="columnsInfo"
      :columns="columns"
      :equipmentList="equipmentList2"
      :getList="getList"
      :isShowCard="isShowCard"
      :busId="formData.changeNo"
      :busString="'busId'"
      @addFileList="handlerAddFileList"
      @delFileList="handlerDelFileList"
      :handleSelectionChange="handleSelectionChange"
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
          @click="handlerControls(null, 'add')"
          >选取设备</el-button
        >
        <el-button
          v-if="!isShowCard"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handlerControls(null, 'batchEdit')"
          >批量设置</el-button
        >
        <!-- <el-button
          type="primary"
          v-if="isShowCard"
          icon="el-icon-download"
          size="mini"
          style="margin-left: 5px"
          @click="handlerControls(null, 'download')"
          >下载</el-button
        > -->
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
      <el-button
        v-hasPermi="['property:position:submit']"
        type="primary"
        @click="submitReview"
        >保存并提交审批</el-button
      >
      <el-button @click="cancel">取消</el-button>
    </div>
    <!-- 对表格的操作 -->
    <!-- 对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      width="40%"
    >
      <TitleForm
        :columns="columnsForm"
        :formData="formDataNow"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'110px'"
        :disabled="disabledForm"
        :showButton="false"
      >
        <template #footer>
          <div class="form-footer">
            <el-button @click="save" type="primary">提交</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-dialog>

    <el-drawer
      title="选择设备"
      :visible.sync="addItem.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        v-if="addItem.choosedrawer"
        :isChoose="false"
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
} from "@/api/property/positionchange";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
import { getLocationTree } from "@/api/Location";
import { equipmentTree } from "@/api/equipment/category";
export default {
  components: {
    PropertyOperation,
    Wrapper,
    subprocess,
    parentdevice,
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
        useDeptId: this.$store.state.user.standing.dept.deptId,
      },
      formDataType: 1,
      categoryOptions: [],
      locationOptions: [],
      ids: [],
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
        this.$route.query?.formData?.changeNo ||
        this.businessId
      ) {
        getPurchaseDetail({
          changeNo:
            this.$route.query.i ||
            this.$route.query?.formData?.changeNo ||
            this.businessId,
        }).then((res) => {
          if (res.code == 200) {
            this.formData = res.data;
            this.reviewCode = this.formData.changeNo;
            this.getTreeSelect();
          }
        });
      }
    } else {
      this.formData = {
        applyPersonId: this.$store.state.user.standing.userId,
        applyPersonName: this.$store.state.user.standing.nickName,
        applyDeptId: this.$store.state.user.standing.deptId,
        affOrgId: this.$store.state.user.standing.deptId,
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
    "formData.applyDeptId": {
      handler(newFormData, oldFormData) {
        if (newFormData) {
          this.delFileList = this.equipmentList.filter((item) => item.id);
          this.form.useDeptId = newFormData;
          this.equipmentList = [];
          this.updateList = [];
          this.getUserList(newFormData);
        }
      },
    },
  },
  computed: {
    columnsInfo() {
      return [
        {
          label: "变动单号",
          prop: "changeNo",
          span: 8,
          formDisabled: true,
        },
        {
          label: "业务日期",
          prop: "busDate",
          span: 8,
          required: true,
          formType: "date",
        },
        {
          label: "所属组织",
          prop: "affOrgId",
          span: 8,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
          formDisabled: true,
        },
        {
          label: "申请部门",
          prop: "applyDeptId",
          span: 8,
          formType: "selectTree",
          options: this.deptOptions,
          required: true,
        },
        {
          label: "申请部门负责人",
          prop: "applyPersonId",
          span: 8,
          required: true,
          formType: "select",
          options: this.userList,
        },

        { label: "参考信息", prop: "referenceInformation", span: 24 },
      ];
    },
    columns() {
      return [
        {
          label: "创建日期",
          prop: "createTime",
          tableVisible: true,
          width: 200,
          formType: "date",
        },
        {
          label: "设备名称",
          prop: "deviceName",
          tableVisible: true,
          width: 200,
        },
        { label: "规格型号", prop: "sModel", tableVisible: true, width: 200 },
        {
          label: "设备编码",
          prop: "deviceCode",
          tableVisible: true,
          width: 200,
        },
        {
          label: "设备类别",
          prop: "deviceType",
          formType: "selectTree",
          options: this.categoryOptions,
          width: 200,
        },
        {
          label: "功能位置",
          prop: "location",
          tableVisible: true,
          formType: "selectTree",
          options: this.locationOptions,
          width: 200,
        },
        {
          label: "设备批次号",
          prop: "batchNo",
          tableVisible: true,
          width: 200,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          tableVisible: true,
        },
        {
          label: "目标功能位置",
          prop: "targetLocation",
          tableVisible: true,
          formType: "selectTree",
          options: this.locationOptions,
          width: 150,
        }, //(0 父级)
        {
          label: "目标设备状态",
          prop: "targetDeviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
        },
        {
          label: "目标使用组织",
          prop: "orgId",
          width: 150,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "目标使用部门",
          prop: "deptId",
          width: 150,
          formType: "selectTree",
          options: this.deptOptions,
          required: true,
        },
      ];
    },
    columnsForm() {
      return [
        {
          label: "目标功能位置（工作面）",
          prop: "targetLocation",
          span: 23,
          tableVisible: true,
          formType: "selectTree",
          options: this.locationOptions,
          required: true,
        },
        {
          label: "目标设备状态",
          prop: "targetDeviceStatus",
          span: 23,
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          required: true,
        },
        {
          label: "目标使用组织",
          prop: "orgId",
          span: 23,
          required: true,
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "目标使用部门",
          prop: "deptId",
          span: 23,
          formType: "selectTree",
          options: this.deptOptions,
          required: true,
        },
      ];
    },
  },
  methods: {
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
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
      this.equipmentList = this.equipmentList.concat(
        row.map((item) => ({
          ...item,
          sModel: item.specs,
          deviceType: item.categoryId,
          id: item.deviceId,
          location: item.locationCode,
        }))
      );
      this.addItem.choosedrawer = false;
    },

    // ! 提交审批流
    sub(val, userIds) {
      if (!this.formData.id) {
        setProject(this.approvalContent).then((res) => {
          if (res.code === 200) {
            definitionStart2(val.id, res.msg, "position_change", {
              path: "/property/positionChangeControls",
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
            definitionStart2(val.id, this.reviewCode, "position_change", {
              path: "/property/positionChangeControls",
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
        category: "position_change",
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
        category: "position_change",
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
    // ! 部门树数据
    getTreeSelect() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        if (this.formData?.changeNo) {
          getProjectList({
            changeNo: this.formData?.changeNo,
            pageNum: 1,
            pageSize: 1000,
          }).then((res) => {
            if (res.code == 200) {
              this.equipmentList = res.data ?? [];
            }
          });
        }
        this.loops(this.categoryOptions);

        // 方便获取父级tree
      });
      getLocationTree().then((res) => {
        this.locationOptions = this.locationTree(res.data);
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
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
    locationTree(arr) {
      arr.forEach((item) => {
        item.id = item.deptCode;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.locationTree(item.children);
        }
      });
      return arr;
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
      if (this.title === "批量设置") {
        let newArr = [];
        this.equipmentList.forEach((item) => {
          if (this.ids.includes(item.id)) {
            if (
              typeof item.id === "number" &&
              this.updateList.indexOf(item.id) === -1
            ) {
              this.updateList.push({ ...item, ...formVal });
            }
            newArr.push({ ...item, ...formVal });
          } else {
            newArr.push({ ...item });
          }
        });
        this.equipmentList = newArr;
      } else {
        this.equipmentList.splice(this.selectIndex, 1, formVal);
        if (
          typeof formVal.id === "number" &&
          this.updateList.indexOf(formVal.id) === -1
        ) {
          this.updateList.push(formVal);
        }
      }
      this.close();
    },
    // ! 增删改操作
    handlerControls(row, act, scope) {
      if (act === "add") {
        // ! 新增
        this.title = "新增";
        this.formDataNow = {};
        this.$set(this.addItem, "choosedrawer", true);
        let lineIds = this.equipmentList2.map((item) => item.deviceId) || [];
        this.$set(this.form, "disIds", lineIds);
        return;
      } else if (act === "edit") {
        // ! 编辑
        this.title = "编辑";
        this.drawer = true;
        this.formDataNow = JSON.parse(JSON.stringify(row));
        this.selectIndex = scope.index - 1;
        return;
      } else if (act === "batchEdit") {
        // ! 批量设置
        this.title = "批量设置";
        if (this.ids.length) {
          this.formDataNow = {};
          this.drawer = true;
        } else {
          this.$message.warning("请选择一行数据进行修改!");
          return;
        }
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
        }).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          saveAs(blob, `PositionChange_${new Date().getTime()}`);
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
      delete val.time;
      delete val.userId;
      // * 新增
      this.equipmentList = this.equipmentList.map((item) => {
        item['targetOrgId']=item.orgId
        item['targetDeptId']=item.deptId
        if (typeof item.id === "string") {
          delete item.id;
          return item;
        } else {
          return item;
        }
      });
      if (!this.equipmentList.every((item) => item.targetLocation))
        return this.$message.error(
          "已选取设备的位置状态变动信息不能为空，请核查!"
        );
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
            if (search[key] == "" || search[key] === null) continue;
            return false;
          }
        }
        return true;
      });
      this.equipmentList2 = matches;
      this.total = 0;
    },
    // ! 查询所有用户
    getUserList(id) {
      if (!id) id = 100;
      listUser({ deptId: id }).then((response) => {
        this.userList = response.rows.map((item) => ({
          label: item.nickName,
          value: item.userId,
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
