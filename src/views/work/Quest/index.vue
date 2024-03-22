<template>
  <Wrapper :title="wrapperTitle">
    <div class="box">
      <ContTable
        :tableData="equipmentList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        :total="total"
        ref="jmtable"
        :isRadio="isChoose"
        :handleWidth="230"
        :columns="columns"
        v-if="!addEdit"
      >
        <template slot="headerLeft" v-if="!isChoose">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              :loading="btnLoading"
              @click="handlerAdd"
              v-hasPermi="['work:quest:quest']"
              >任务转派</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handlerDerive"
              v-hasPermi="['work:request:download']"
              >下载</el-button
            >
          </el-col>
        </template>
        <template #end_handle="scope" v-if="!isChoose">
          <el-button
            v-if="
              scope.row.orderStatus !== '待验收' &&
              scope.row.orderStatus !== '已关闭'
            "
            size="mini"
            type="text"
            icon="el-icon-edit"
            :loading="btnLoading"
            @click="goCarryOut(scope.row, 'edit')"
            v-hasPermi="['work:quest:carry']"
            >执行</el-button
          >
          <el-button
            v-if="scope.row.orderStatus === '待验收'"
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            :loading="btnLoading"
            @click="goCheck(scope.row, 'check')"
            v-hasPermi="['work:quest:check']"
            >验收</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            :loading="btnLoading"
            @click="goDetails(scope.row, 'view')"
            v-hasPermi="['work:request:view']"
            >详情</el-button
          >
          <el-button
            v-if="scope.row.orderStatus === '待执行'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleAllot(scope.row)"
            v-hasPermi="['work:quest:allot']"
            >转派</el-button
          >
          <el-button
            v-if="
              scope.row.orderStatus !== '已关闭' &&
              scope.row.orderStatus !== '待验收'
            "
            size="mini"
            type="text"
            icon="el-icon-document-add"
            @click="handleDelete(scope.row)"
            v-hasPermi="['work:quest:off']"
            >关闭</el-button
          >
        </template>
      </ContTable>
      <!-- 分派人员 -->
      <el-drawer
        size="65%"
        class="drawer"
        title="选择执行人员"
        :visible.sync="isDrawer"
      >
        <ContTable
          class="mr20 ml20"
          :tableData="equipmentList2"
          @getList="getList2"
          @handleSelectionChange="handleSelectionChange2"
          :total="total2"
          ref="jmtable"
          :isRadio="true"
          :handleWidth="230"
          :columns="columns2"
          :isEdit="false"
          :showSearch="false"
        >
        </ContTable>

        <div class="submit">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </el-drawer>

      <!-- 关闭工单 -->
      <el-dialog :visible.sync="drawer2">
        <template slot="title"
          ><span class="custom-dialog-title">
            <i class="el-icon-warning"></i>
            确认要关闭工单吗
          </span></template
        >

        <el-form
          ref="elForm2"
          :model="formData2"
          :rules="rules2"
          size="medium"
          label-width="40px"
          class="from"
        >
          <el-form-item prop="closeReason">
            <el-input
              v-model="formData2.closeReason"
              type="textarea"
              placeholder="请输入关闭原因"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '95%' }"
            ></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="submitFormAdd2">提交</el-button>
            <el-button @click="resetForm2">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 验收工单是否加入故障案例库 -->
      <el-dialog :visible.sync="drawer3" width="25%">
        <template slot="title"
          ><span class="custom-dialog-title">
            <i class="el-icon-warning"></i>
            验收工单是否加入故障案例库
          </span></template
        >

        <el-form
          ref="elForm3"
          :model="formData3"
          :rules="rules3"
          size="medium"
          label-width="40px"
          class="from"
        >
          <el-form-item prop="caseFlag">
            <el-radio-group v-model="formData3.caseFlag">
              <el-radio label="true" :value="true">是</el-radio>
              <el-radio label="false" :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="submitFormAdd3">提交</el-button>
            <el-button @click="resetForm3">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </Wrapper>
</template>
<script>
import JmForm from "@/components/JmForm";
import {
  getScheduleList,
  getExecutorList,
  updateExecutor,
  getAllocationClose,
  updateAllocation,
  getWorkOrderSchedule,
  checkWomInfo,
} from "@/api/work/schedule";
import JmTable from "@/components/JmTable/index.vue";
import ContTable from "@/components/ContTable";
import Wrapper from "@/components/wrapper";
import { orderTemplate } from "@/api/work/template";
import { listUser } from "@/api/system/user";
import { findAll } from "@/api/system/group";
import { exportWomInfo } from "@/api/work/schedule";

export default {
  components: {
    JmTable,
    ContTable,
    JmForm,
    Wrapper,
  },
  dicts: ["order_source", "is_overdue"],
  props: {},
  data() {
    return {
      wrapperTitle: "",
      isDrawer: false,
      drawer: false,
      drawer2: false,
      drawer3: false,
      formData: {},
      formData2: {},
      formData3: {},

      rules: {
        demandDate: [
          {
            required: true,
            message: "请选择调整计划执行日期",
            trigger: "blur",
          },
        ],
      },
      rules2: {
        closeReason: [
          {
            required: true,
            message: "请输入关闭原因",
            trigger: "blur",
          },
        ],
      },
      rules3: {
        caseFlag: [
          {
            required: true,
            message: "是否加入故障案例库",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
      },
      // 选中行
      ids: [],
      ids2: [],
      groupIds: [],

      equipmentList: null,
      equipmentList2: null,
      isChoose: false,
      isChoose2: true,
      // 遮罩层
      loading: true,
      loading2: true,
      addEdit: false,
      addEdit2: false,
      total: 0,
      total2: 0,

      // 弹出层标题
      title: "",
      // 表单参数
      form: {},

      radioRow: {},
      deptOptions: null,
      itemValue: null,
      // 工单类型
      orderOptions: [],
      // 执行班组
      userList: [],
      typeAll: [],
      itemArr: [],
      listGroupId: null,
      // 进度
      workActiveList: [
        { orderStatus: "待派工" },
        { orderStatus: "待执行" },
        { orderStatus: "执行中" },
        { orderStatus: "待验收" },
        { orderStatus: "已完成" },
        { orderStatus: "已关闭" },
      ],
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "工单编码",
          prop: "orderCode",
          tableVisible: true,
          width: 200,
        },
        {
          label: "工单名称",
          prop: "orderName",
          tableVisible: true,
          width: 200,
        },

        {
          label: "工单类型",
          prop: "orderType",
          tableVisible: true,
          formType: "selectTree",
          options: this.orderOptions,
          width: 200,
        },

        {
          label: "计划执行日期",
          prop: "planExecuteDate",
          formType: "date",
          width: 150,
          tableVisible: true,
        },
        {
          label: "请求人员",
          prop: "createBy",
          tableVisible: true,
          width: 150,
        },

        {
          label: "请求时间",
          prop: "createTime",
          tableVisible: true,
          formType: "date",
          width: 160,
        },
        {
          label: "执行班组",
          prop: "groupId",
          formType: "selectTree",
          options: this.typeAll,
          tableVisible: true,
          width: 150,
        },
        {
          label: "执行人员",
          prop: "executor",
          formType: "selectTree",
          options: this.userList,
          tableVisible: true,
          width: 150,
        },
        {
          label: "工单来源",
          prop: "orderSource",
          formType: "select",
          options: this.dict.type.order_source,
          tableVisible: true,
          width: 160,
        },
        {
          label: "是否逾期",
          prop: "expected",
          tableVisible: true,
          formType: "select",
          options: this.dict.type.is_overdue,
        },
        {
          label: "工单状态",
          prop: "orderStatus",
          tableVisible: true,
        },
      ];
    },
    columns2() {
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
  watch: {
    isDrawer: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.itemValue && this.itemValue.groupId) {
            this.listGroupId = this.itemValue.groupId;
            this.getList2();
          } else {
            this.listGroupId = this.itemArr[0].groupId;
            this.getList2();
          }
        } else {
          this.title = "";
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.getUserList();
    await this.getOrderTree();
    await this.getTypeList();

    // data赋值
    // await this.getList2();
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  methods: {
    goCheck(row) {
      this.drawer3 = true;
      this.formData3["id"] = row.id;
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
    goDetails(row) {
      getWorkOrderSchedule({ orderCode: row.orderCode }).then((res) => {
        row["workActive"] = 0;
        if (
          row.orderType !== "DZWX" &&
          row.orderType !== "JDBWX" &&
          row.orderType !== "WWWX"
        ) {
          this.workActiveList.splice(3, 1);
        }
        this.workActiveList.forEach((item, index) => {
          const matchedItem = res.data.find(
            (val) => val.orderStatus === item.orderStatus
          );

          if (matchedItem) {
            row["workActive"] = index + 1;
            Object.assign(item, matchedItem);
          }
        });

        row["workOrderSchedule"] = this.workActiveList;
        switch (row.orderType + row.orderObj) {
          // ! 巡点捡
          case "RCDJ1":
          case "ZZDJ1":
          case "JMDJ1":
            this.$router.push({
              path: "/work/questAdd7",
              query: JSON.stringify({ item: row, disabled: true }),
            });
            break;
          case "RCDJ2":
          case "ZZDJ2":
          case "JMDJ2":
            this.$router.push({
              path: "/work/questAdd5",
              query: { item: row, disabled: true },
            });
            break;
          // ! 设备维修
          case "DZWX2":
          case "JDBWX2":
            this.$router.push({
              path: "/work/questAdd2",
              query: { item: row, disabled: true },
            });
            break;
          case "WWWX2":
            this.$router.push({
              path: "/work/questAdd3",
              query: { item: row, disabled: true },
            });
            break;
          case "DZWX3":
          case "WWWX3":
          case "JDBWX3":
            this.$router.push({
              path: "/work/questAdd",
              query: { item: row, disabled: true },
            });
            break;
          // ! 定期检验
          case "DQJY2":
            this.$router.push({
              path: "/work/questAdd8",
              query: JSON.stringify({ item: row, disabled: true }),
            });
            break;
          // ! 保养
          case "RCBY1":
          case "YJBY1":
          case "EJBY1":
          case "CGRH1":
            this.$router.push({
              path: "/work/questAdd6",
              query: { item: row, disabled: true },
            });
            break;
          case "RCBY2":
          case "YJBY2":
          case "EJBY2":
          case "CGRH2":
            this.$router.push({
              path: "/work/questAdd4",
              query: { item: row, disabled: true },
            });
            break;
          default:
            break;
        }
      });
    },
    getTypeList() {
      findAll().then((res) => {
        this.typeAll = res.data.map((item) => {
          return {
            id: item.id,
            label: item.groupName,
          };
        });
        this.getList();
      });
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
    async getOrderTree() {
      await orderTemplate().then((response) => {
        this.orderOptions = response.data.map((item) => {
          const children = item.sysDictDatas.map((dict) => {
            return {
              id: dict.dictValue,
              label: dict.dictLabel,
            };
          });

          return {
            id: item.value,
            label: item.name,
            children,
          };
        });
      });
    },
    submitFormAdd() {
      this.$refs["elForm"].validate(async (valid) => {
        if (!valid) return;

        updateAllocation({ ...this.radioRow, ...this.formData }).then((res) => {
          if (res.code === 200) {
            this.getList(this.queryParams);
            this.formData = {};
            this.radioRow = {};
            this.drawer = false;
            this.$message.success("编辑成功");
          }
        });
      });
    },
    submitFormAdd2() {
      this.$refs["elForm2"].validate(async (valid) => {
        if (!valid) return;
        getAllocationClose(Object.assign(this.radioRow, this.formData2)).then(
          (res) => {
            if (res.code === 200) {
              this.getList(this.queryParams);
              this.formData2 = {};
              this.radioRow = {};
              this.drawer2 = false;
              this.$message.success("关闭成功");
            }
          }
        );
      });
    },
    submitFormAdd3() {
      this.$refs["elForm3"].validate(async (valid) => {
        if (!valid) return;
        checkWomInfo(this.formData3).then((res) => {
          if (res.data.code == 200) {
            this.getList();
            this.$message.success("验收成功！");
            this.drawer3 = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    resetForm2() {
      this.$refs["elForm2"].resetFields();
    },
    resetForm3() {
      this.drawer3 = false;
    },
    handleDelete(row, f) {
      this.title = "关闭";

      this.drawer2 = true;
      // this.radioRow = row;
    },
    handlerAdd() {
      this.title = "手动分派";
      if (!(this.ids.length && this.ids.length > 0)) {
        this.$message.warning("请先选择要分派的工单！");
        return;
      }
      if (this.groupIds.size >= 2) {
        this.$message.warning("请先选择工单类型相同的工单！");
        return;
      }
      this.isDrawer = true;
    },
    handlerDerive() {
      exportWomInfo({
        ids: this.ids.length > 0 ? this.ids : null,
        ...this.convertToDefaultObject(this.columns),
      }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `work_${new Date().getTime()}`);
      });
    },
    handleAllot(row) {
      this.title = "转派";
      this.itemValue = row;
      this.isDrawer = true;
    },
    handlerGetId() {},

    back() {
      this.addEdit = false;
      this.addDetails = false;
      this.getList(this.queryParams);
    },
    close() {
      this.isDrawer = false;
    },
    save() {
      if (
        this.itemArr &&
        this.itemArr.length > 0 &&
        this.title === "任务转派"
      ) {
        this.itemArr = this.itemArr.map((item) => {
          item.workOrderCode = item.orderCode;
          delete item.orderCode;
          item = { ...item, ...this.radioRow2 };
          return item;
        });
        updateExecutor(this.itemArr).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.msg);
            this.isDrawer = false;
            this.getList(this.queryParams);
          }
        });
      } else if (this.itemValue && this.title === "转派") {
        this.itemValue.workOrderCode = this.itemValue.orderCode;
        delete this.itemValue.orderCode;
        updateExecutor([{ ...this.itemValue, ...this.radioRow2 }]).then(
          (res) => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.isDrawer = false;
              this.getList(this.queryParams);
            }
          }
        );
      }
    },

    // 导入
    beforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      const fileData = new FormData();
      fileData.append("files", file);
      fileData["purchasePlanType"] = 2;
      uploadInfo(fileData);
      return false;
    },
    async getList(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      form["pendingFlag"] = 1;
      this.queryParams = form;
      this.loading = true;

      getScheduleList(form).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    async getList2(row) {
      this.loading2 = true;
      getExecutorList({ groupId: this.listGroupId }).then((response) => {
        this.equipmentList2 = response.data;
        this.total2 = response.total;
        this.loading2 = false;
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      if (
        this.title !== "编辑设备" &&
        this.title !== "关闭" &&
        this.title !== "转派"
      ) {
        this.ids = selection.map((item) => item.id);
        this.groupIds = new Set(selection.map((item) => item.groupId));
        this.itemArr = selection;
      }

      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.id);
      this.single2 = selection.length != 1;
      this.multiple2 = !selection.length;
      this.radioRow2 = selection[0];
    },
    /** 修改按钮操作 */
    goCarryOut(row, f) {
      switch (row.orderType + row.orderObj) {
        // ! 巡点捡
        case "RCDJ1":
        case "ZZDJ1":
        case "JMDJ1":
          this.$router.push({
            path: "/work/questAdd7",
            query: { item: row, disabled: false },
          });
          break;
        case "RCDJ2":
        case "ZZDJ2":
        case "JMDJ2":
          this.$router.push({
            path: "/work/questAdd5",
            query: { item: row, disabled: false },
          });
          break;
        // ! 设备维修
        case "DZWX2":
        case "JDBWX2":
          this.$router.push({
            path: "/work/questAdd2",
            query: { item: row, disabled: false },
          });
          break;
        case "WWWX2":
          this.$router.push({
            path: "/work/questAdd3",
            query: { item: row, disabled: false },
          });
          break;
        case "DZWX3":
        case "WWWX3":
        case "JDBWX3":
          this.$router.push({
            path: "/work/questAdd",
            query: { item: row, disabled: false },
          });
          break;
        // ! 定期检验
        case "DQJY2":
          this.$router.push({
            path: "/work/questAdd8",
            query: { item: row, disabled: false },
          });

          break;
        // ! 保养
        case "RCBY1":
        case "YJBY1":
        case "EJBY1":
        case "CGRH1":
          this.$router.push({
            path: "/work/questAdd6",
            query: { item: row, disabled: false },
          });
          break;
        case "RCBY2":
        case "YJBY2":
        case "EJBY2":
        case "CGRH2":
          this.$router.push({
            path: "/work/questAdd4",
            query: { item: row, disabled: false },
          });
          break;
        default:
          break;
      }
    },
    getTreeParent(id) {
      const path = [];
      let current = this.valueMap[id];
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path;
    },
    setFormLabel(arr) {
      arr.forEach((b) => {
        b.label = b.fieldName;
        b.prop = b.fieldCode;
        b.required = b.required == "0" ? true : false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  font-size: 20px; /* 设置标题的字体大小 */
  /* 还可以添加其他样式，如颜色、字体样式等 */
  margin-bottom: 5px;
  color: #3d3d3d;
}
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  padding-bottom: 20px;
  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
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
.el-drawer {
  width: 300px !important; /* 使用!important来确保样式优先级 */
  background-color: aqua;
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
}
</style>
