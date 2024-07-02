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
          <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              :loading="btnLoading"
              @click="handleAdd"
              v-hasPermi="['work:request:add']"
              >新增</el-button
            >
          </el-col> -->

          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handlerDerive"
              v-hasPermi="['work:request:download']"
              >导出</el-button
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
            v-hasPermi="['work:request:view']"
            >详情</el-button
          >
          <!-- <el-button
            v-if="scope.row.orderStatus !== '已关闭'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['work:request:off']"
            >关闭</el-button
          > -->
        </template>
      </ContTable>

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
            <el-button @click="resetForm2">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import ContTable from "@/components/ContTable";
import {
  getScheduleList,
  exportWomInfo,
  getWorkOrderSchedule,
  getAllocationClose,
} from "@/api/work/schedule";
import { orderTemplate } from "@/api/work/template";
import { listUser2 } from "@/api/system/user";
import { findAll } from "@/api/system/group";
export default {
  components: { Wrapper, ContTable },
  data() {
    return {
      btnLoading: false,
      wrapperTitle: "",
      equipmentList: null,
      isChoose: false,
      addEdit: false,
      total: 0,
      ids: [],
      orderOptions: [],
      userList: [],
      formData2: { closeReason: "" },
      drawer2: false,
      typeAll: [],
      loading: false,
      queryParams: { pageNum: 1, pageSize: 10 },
      rules2: {
        closeReason: [
          {
            required: true,
            message: "请输入关闭原因",
            trigger: "blur",
          },
        ],
      },
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
  async created() {
    await this.getUserList();
    await this.getOrderTree();
    await this.getTypeList();
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
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
        { label: "工单状态", prop: "orderStatus", tableVisible: true },
        {
          label: "计划执行日期",
          prop: "planExecuteDate",
          tableVisible: true,
          formType: "date",
          formType: "date",
          width: 150,
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
          prop: "executorName",
          // formType: "selectTree",
          // options: this.userList,
          tableVisible: true,
          width: 150,
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
          formType: "date",
          width: 150,
          tableVisible: true,
        },
      ];
    },
  },
  methods: {
    // 获取路由参数
    getRouteData() {
      let routeData = this.$route.query?.data
        ? JSON.parse(this.$route.query.data)
        : null;
      if (routeData) {
        let params = {
          ...routeData,
          pageNum: 1,
          pageSize: 10,
        };
        this.getList(params);
      } else {
        this.getList();
      }
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
    getTypeList() {
      findAll().then(async (res) => {
        this.typeAll = await res.data.map((item) => {
          return {
            id: item.id,
            label: item.groupName,
          };
        });
        this.getRouteData();
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
    resetForm2() {
      this.drawer2 = false;
    },
    getUserList() {
      listUser2({ pageNum: 1, pageSize: 10000 }).then((res) => {
        this.userList = res.data.map((item) => {
          return {
            id: item.userId,
            label: item.nickName,
          };
        });
      });
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
              query: { item: row, disabled: true },
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
              query: { item: row, disabled: true },
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
    handleAdd() {
      this.$router.push({ path: "/work/requestAdd" });
    },
    handleDelete(row) {
      this.title = "关闭";

      this.drawer2 = true;
      this.$refs["elForm2"].resetFields();
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
    handlerDerive() {
      exportWomInfo({
        ids: this.ids.length > 0 ? this.ids : null,
        ...this.convertToDefaultObject(this.columns),
        searchType: 1,
      }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `work_${new Date().getTime()}`);
      });
    },
    async getList(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      form["searchType"] = 1;
      this.queryParams = form;
      this.loading = true;
      getScheduleList(form).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  padding-bottom: 20px;
}
</style>
