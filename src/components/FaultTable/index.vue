<template>
  <div class="box">
    <slot></slot>
    <div class="title">
      批量添加设备
      <el-button
        v-if="!disabled2"
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        style="margin-left: auto"
        >添加</el-button
      >
    </div>
    <ContTable
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      class="mt20"
      :isShow="isShow"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
      :showSearch="false"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5" v-if="!disabled2">
          <el-button
            type="primary"
            size="mini"
            :loading="btnLoading"
            @click="handleUpdate"
            >批量维护故障</el-button
          >
        </el-col>
        <el-col :span="1.5" v-else>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="importHandler"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'view')"
          >浏览</el-button
        >
        <el-button
          v-if="!disabled2"
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, scope.index, 'edit', 1)"
          >维护故障</el-button
        >
        <el-button
          v-if="!disabled2"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          >删除</el-button
        >
      </template>
    </ContTable>

    <!-- 选取设备 -->
    <el-drawer
      title="选择设备"
      :visible.sync="addItem.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <SelectParentDeviceDialog
        v-if="addItem.choosedrawer"
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="addItem.choosedrawer = false"
      ></SelectParentDeviceDialog>
    </el-drawer>

    <!-- 维护故障弹窗 -->
    <el-drawer
      size="50%"
      class="drawer"
      title="故障信息"
      :before-close="close"
      :visible.sync="drawer"
    >
      <carry-form
        class="mr20 ml20"
        :columns="columnsForm"
        :formData="formData"
        @submitForm="submitForm"
        ref="titleform"
        :showButton="showButton"
        :disabled="disabled"
      >
        <template #footer>
          <image-upload
            class="upload-demo"
            :fileType="['jpg', 'png']"
            @uploadChange="uploadChange1"
            :value="formData.fileList"
            :disabled="disabled"
            :extraData="{ category: 1 }"
            :listType="'picture-card'"
          >
          </image-upload>
          <div style="text-align: center" class="footer">
            <el-button @click="saveHandle" type="primary" v-if="!disabled"
              >提交</el-button
            >
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </carry-form>
    </el-drawer>

    <!-- 选择故障类型 -->
    <el-drawer
      title="故障类型"
      :visible.sync="drawerFaultManage"
      size="70%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <faultManage
        @submitRadio="submitFaultManage"
        :isRadio="true"
        @close="closeFaultManage"
      ></faultManage>
    </el-drawer>
  </div>
</template>
<script>
import { getProjectList, downDetailLoad } from "@/api/property/scrapping";
import ContTable from "@/components/ContTable";
import SelectParentDeviceDialog from "./SelectParentDeviceDialog";
import { v4 as uuidv4 } from "uuid";
import {
  setStore,
  getStore,
  delList,
  upName,
  convertToTargetFormat,
  removeStore,
} from "@/utils/property.js";
import { listDept } from "@/api/system/dept";
import { saveAs } from "file-saver";
import CarryForm from "@/components/CarryForm/index";
import { getWomDevice } from "@/api/work/schedule";
import faultManage from "@/views/work/Request/ui/faultManage.vue";
import { equipmentTree } from "@/api/equipment/category";
export default {
  components: {
    ContTable,
    SelectParentDeviceDialog,
    faultManage,
  },
  dicts: ["em_is_special", "em_device_state", "fault_grade"],
  props: {
    orderCode: {
      default: "",
      type: String,
    },
    disabled2: {
      default: false,
      type: Boolean,
    },
    isShow: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      rules: {
        demandDate: [
          {
            required: true,
            message: "请选择调整计划执行日期",
            trigger: "blur",
          },
        ],
      },
      drawerFaultManage: false,
      disabled: false,
      showButton: true,
      addItem: {
        choosedrawer: false,
        copyInputName: "",
        copyInputId: "",
        addDrawer: false,
        addRadio: 1,
      },
      // 需求组织
      deptOptions: null,
      deptOptions2: null,
      // 新增or编辑框 title
      title: "",
      drawer: false,
      equipmentList: null,
      btnLoading: false,
      isChoose: false,
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // ! 当前选中行数据
      itemValue: null,
      total: 0,
      formData: { checkValue: 1 },
      rowArr: [],
      // 选中数组
      ids: [],
      formParams: {
        prtOrg: "Y",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "设备编码",
          prop: "deviceCode",
          tableVisible: true,
          width: 200,
        },
        {
          label: "设备名称",
          prop: "deviceName",
          tableVisible: true,
          width: 200,
        },
        { label: "规格型号", prop: "specs", tableVisible: true, width: 200 },
        {
          label: "设备类别",
          prop: "deviceTypeName",
          tableVisible: true,
        },
        {
          label: "功能位置",
          prop: "locationName",
          tableVisible: true,
        },
        { label: "当前使用组织", prop: "currDept", tableVisible: true },
        {
          label: "所属组织",
          prop: "affDept",
          tableVisible: true,
          width: 150,
        },

        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          tableVisible: true,
        },
        {
          label: "是否特种设备",
          prop: "isSpecial",
          formType: "selectTag",
          options: this.dict.type.em_is_special,
          tableVisible: true,
          width: 150,
        }, //(A、B、C)
      ];
    },
    columnsForm() {
      return [
        {
          label: "故障时间",
          prop: "faultDate",
          span: 12,
          formType: "date",
          required: true,
        },
        {
          label: "故障部件(位)",
          prop: "faultLocation",
          span: 12,
          required: true,
        },
        {
          label: "故障类型",
          prop: "faultType",
          clickFn: () => {
            this.drawerFaultManage = true;
          },
          span: 12,
          required: true,
        },
        {
          label: "故障等级",
          prop: "faultGrade",
          formType: "select",
          options: this.dict.type.fault_grade,
          span: 12,
          required: true,
        },

        {
          label: "是否停机",
          prop: "haltFlag",
          span: 24,
          formType: "radio",
          options: [
            { label: "是", value: 1 },
            { label: "否", value: 0 },
          ],
          required: true,
        },
        {
          label: "故障描述",
          prop: "faultInfo",
          formType: "textarea",
          span: 24,
          required: true,
        },
      ];
    },
  },
  watch: {
    drawer: {
      handler(newValue) {
        if (!newValue) {
          this.handleCancel();
          this.title = "";
          this.formData = { checkValue: 1 };
        }
      },
    },
  },
  async created() {
    await this.getDeptTree();
    await this.getList();

    // data赋值
    this.columns.forEach((b) => {});
    this.deptOptions2 = await convertToTargetFormat(this.deptOptions);
    if (this.orderCode) {
      getWomDevice({ orderCode: this.orderCode, lineCode: "" }).then((res) => {
        this.equipmentList = res.data;
      });
    }
  },
  mounted() {},

  methods: {
    submitFaultManage(row) {
      this.$set(
        this.formData,
        "faultType",
        row.faultCode + " " + row.faultName
      );
      this.$set(this.formData, "faultCode", row.faultCode);
      this.closeFaultManage();
    },
    closeFaultManage() {
      this.drawerFaultManage = false;
    },
    uploadChange1(val) {
      this.formData.fileList = val;
    },

    handleCancel() {
      this.$refs.titleform.resetFields();

      this.formData = {};
      this.$refs.titleform.clearValidate();
      this.drawer = false;
      //   this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      //   this.$router.go(-1); //跳回上页
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    goDetails(row) {
      this.title = "浏览";
      this.drawer = true;
      this.formData = { ...this.formData, ...row["faultInfoDTO"] };
      this.disabled = true;
      // this.$refs.titleform.resetFields();
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      // ! 成功了才会走这
      // 多个维护
      if (this.title === "批量设置") {
        let newArr = this.rowArr.map((item) => ({
          ...item,
          faultInfoDTO: { ...formdata },
        }));
        let outArr = this.rowArr;
        getStore("addList").forEach((t) => {
          outArr = outArr.filter((item) => {
            return item.topicId != t.topicId;
          });
        });
        setStore("addList", outArr.concat(newArr));
        this.handleCancel();
        this.getList();
        this.formData = { checkValue: 1 };
        this.rowArr = [];
        this.drawer = false;
        return;
      }
      // 单个维护
      setStore(
        "addList",
        getStore("addList")
          .filter((item) => item.topicId != this.itemValue.topicId)
          .concat({ ...this.itemValue, faultInfoDTO: { ...formdata } })
      );

      this.handleCancel();
      this.getList();
      this.formData = { checkValue: 1 };
      this.drawer = false;
    },

    async submitRadio2(row) {
      let flag = getStore("equipmentList").some(
        (item) => item.deviceId === row.deviceId
      );
      if (flag) {
        this.$message.error("该设备已添加到设备清单中请重新选择");
        return;
      }
      row.forEach((item) => {
        item["deviceTypeName"] = item.categoryName;
        item["affDept"] = item.affDeptName;
        item["currDept"] = item.currDeptName;
        item["locationName"] = item.locationName;
      });

      if (getStore("equipmentList") && getStore("equipmentList").length > 0) {
        getStore("equipmentList").forEach((t) => {
          row = row.filter((item) => {
            return (
              item.sModel + item.deviceCode + item.deviceName + item.batchNo !==
              t.sModel + t.deviceCode + t.deviceName + t.batchNo
            );
          });
        });
      }
      if (getStore("addList") && getStore("addList").length > 0) {
        setStore(
          "addList",
          this.deduplicateByDeviceId(getStore("addList").concat(row))
        );
      } else {
        setStore("addList", row);
      }
      this.$message({
        type: "success",
        message: "选取设备成功",
      });
      this.addItem.choosedrawer = false;
      await this.getList();
      this.addItem.copyInputName = row.deviceName;
      this.addItem.copyInputId = row.deviceId;

      this.addItem.choosedrawer = false;
    },
    deduplicateByDeviceId(inputArray) {
      const deviceIdSet = new Set();
      return inputArray.reduce((result, item) => {
        let uniqueKey = `${item.specs}${item.deviceCode}${item.deviceName}${item.batchNo}`;
        if (!deviceIdSet.has(uniqueKey)) {
          deviceIdSet.add(uniqueKey);
          result.push(item);
        }
        return result;
      }, []);
    },
    showSelectDialog() {
      this.addItem.choosedrawer = true;
    },
    close() {
      this.handleCancel();
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    handleChange(value) {
      // this.formData.demandOrganization = value[value.length - 1];
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      if (JSON.stringify(node.children) == "[]") {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询计划明细列表 */
    async getList(queryParams = { pageNum: 1, pageSize: 10 }) {
      this.loading = true;
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      delete search.changeNo;
      if (getStore("equipmentList")) setStore("equipmentList", []);
      if (getStore("addList") && getStore("addList").length > 0) {
        setStore("equipmentList", [].concat(getStore("addList")));
      } else {
        setStore("equipmentList", []);
      }
      let matches = getStore("equipmentList").filter((item) => {
        for (let key in search) {
          if (!String(item[key]).includes(search[key])) {
            if (search[key] == "") continue;
            return false;
          }
        }
        return true;
      });
      this.equipmentList = matches;
      this.loading = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if (
        this.title !== "单个设置" &&
        this.title !== "浏览" &&
        this.title !== "删除"
      ) {
        this.ids = selection.map((item) => item.id);
      }
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.rowArr = selection;
    },
    handleAdd() {
      //   this.drawer = !this.drawer;
      this.addItem.choosedrawer = !this.addItem.choosedrawer;
      this.title = "新增";
    },
    importHandler() {
      downDetailLoad(this.ids).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
    handleDelete(row) {
      this.title = "删除";
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (!row.id) {
          setStore(
            "equipmentList",
            this.equipmentList.filter((item) => item.topicId != row.topicId)
          );
          setStore(
            "addList",
            getStore("addList").filter((item) => item.topicId != row.topicId)
          );
        } else {
          setStore(
            "updateList",
            getStore("updateList").filter((item) => item.id != row.id)
          );
          if (getStore("delList") && getStore("delList").length > 0) {
            setStore("delList", [
              ...getStore("delList").concat(
                this.equipmentList.filter((item) => item.id == row.id)
              ),
            ]);
          } else {
            setStore(
              "delList",
              this.equipmentList.filter((item) => item.id == row.id)
            );
          }
        }
        setStore(
          "equipmentList",
          this.equipmentList.filter((item) => item.id != row.id)
        );

        this.getList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    handleUpdate(row, index, exit, isRow) {
      this.disabled = false;
      if (!isRow) {
        this.title = "批量设置";
        if (this.ids.length) {
          this.formData = { fileList: [] };
          this.drawer = true;
          this.itemValue = JSON.parse(JSON.stringify(this.rowArr));
        } else {
          this.$message.error("请选择一行数据进行修改!");
          return;
        }
      } else {
        this.title = "单个设置";
        this.drawer = true;
        this.formData = { ...this.formData, ...row["faultInfoDTO"] };
        this.itemValue = JSON.parse(JSON.stringify(row));
      }
    },

    findTreeName(options, value) {
      var name = "";
      name = this.forfn(options, value);
      return name;
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  // padding: 14px 15px;
  .from {
    padding: 30px;
    padding-left: 10px;
    label {
      width: 120px;
    }
  }
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
  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
    padding-bottom: 10px;

    display: flex;
    justify-content: start;
    align-items: center;
  }

  .controls {
    padding-top: 15px;
    width: 100%;
    height: auto;
    padding-bottom: 30px;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #e9eaef;
      background: linear-gradient(
        139deg,
        #62b0ff 44.05%,
        #007bfe 105.54%,
        #007bfe 118.67%,
        #007bfe 129.22%
      );
      padding: 0;
    }
  }

  .overflow-hidden {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.drawer-wrapper {
  position: relative;
  .drawer-content {
    padding: 20px 20px 50px;
    overflow-y: auto;
  }
  .drawer-footer {
    width: 40%;
    height: 50px;
    padding: 0 20px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 0;
    z-index: 10;
  }
}
.upload-demo {
  transform: translateX(40px);
}
</style>
