<template>
  <Wrapper :title="wrapperTitle">
    <div class="box">
      <jm-table
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
              @click="handleAdd"
              v-hasPermi="['work:request:add']"
              >新增</el-button
            >
          </el-col>

          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handlerDerive"
              v-hasPermi="['work:request:derive']"
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
            v-hasPermi="['work:request:edit']"
            >详情</el-button
          >

          <el-button
            v-if="scope.row.orderStatus !== '已关闭'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['work:request:remove']"
            >关闭</el-button
          >
        </template>
      </jm-table>

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
    </div>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import JmTable from "@/components/JmTable";
import { getScheduleList, exportWomInfo } from "@/api/work/schedule";
import { orderTemplate } from "@/api/work/template";
import { listUser } from "@/api/system/user";
import { findAll } from "@/api/system/group";
export default {
  components: { Wrapper, JmTable },
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
      formData2: {},
      drawer2: false,
      typeAll: [],
      loading: false,
      rules2: {
        closeReason: [
          {
            required: true,
            message: "请输入关闭原因",
            trigger: "blur",
          },
        ],
      },
    };
  },
  async created() {
    await this.getUserList();
    await this.getOrderTree();
    await this.getTypeList();
    await this.getList();
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
          prop: "director",
          formType: "selectTree",
          options: this.userList,
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
          tableVisible: true,
        },
      ];
    },
  },
  methods: {
    getTypeList() {
      findAll().then((res) => {
        this.typeAll = res.data.map((item) => {
          return {
            id: item.id,
            label: item.groupName,
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
    resetForm2() {
      this.$refs["elForm2"].resetFields();
    },
    getUserList() {
      listUser({ deptId: 100 }).then((res) => {
        this.userList = res.rows.map((item) => {
          return {
            id: item.userId,
            label: item.nickName,
          };
        });
      });
    },
    goDetails(row) {
      // this.$router.push({
      //   path: "/work/requestAdd",
      //   query: { item: row, disabled: true },
      // });
      switch (row.orderType + row.orderObj) {
        // ! 巡点捡
        case "RCDJ1":
        case "ZZDJ1":
        case "JMDJ1":
          this.$router.push({
            path: "/work/questAdd7",
          });
          localStorage.setItem(
            "item",
            JSON.stringify({ item: row, disabled: true })
          );
          break;
        case "RCDJ2":
        case "ZZDJ2":
        case "JMDJ2":
          this.$router.push({
            path: "/work/questAdd5",
          });

          localStorage.setItem(
            "item",
            JSON.stringify({ item: row, disabled: true })
          );
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
          });
          localStorage.setItem(
            "item",
            JSON.stringify({ item: row, disabled: true })
          );
          break;
        // ! 保养
        case "RCBY1":
        case "YJBY1":
        case "EJBY1":
        case "CGRH1":
          this.$router.push({
            path: "/work/questAdd6",
          });

          localStorage.setItem(
            "item",
            JSON.stringify({ item: row, disabled: true })
          );
          break;
        case "RCBY2":
        case "YJBY2":
        case "EJBY2":
        case "CGRH2":
          this.$router.push({
            path: "/work/questAdd4",
          });

          localStorage.setItem(
            "item",
            JSON.stringify({ item: row, disabled: true })
          );
          break;
        default:
          break;
      }
    },
    handleAdd() {
      this.$router.push({ path: "/work/requestAdd" });
    },
    handleDelete(row) {
      this.title = "关闭";

      this.drawer2 = true;
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
      exportWomInfo({ ids: this.ids }).then((res) => {
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
