<template>
  <Wrapper>
    <ContTable
      class="table"
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="false"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleControls(null, 'add')"
            >添加</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload"
            size="mini"
            :loading="btnLoading"
            @click="AddFile"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="btnLoading"
            @click="handleSet"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleControls(scope.row, 'view')"
          >详情</el-button
        >
        <el-button
          size="mini"
          type="text"
          :loading="btnLoading"
          @click="handleControls(scope.row, 'edit')"
          >编辑</el-button
        >
        <el-button size="mini" type="text" @click="handleSet">删除</el-button>
        <el-button size="mini" type="text" @click="handleSet">提交</el-button>
        <el-button size="mini" type="text" @click="handleSet">审批流</el-button>
      </template>
    </ContTable>
    <!-- 上传文件 -->
    <el-drawer
      title="选择文件"
      :visible.sync="filedrawer"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false"
    >
      <file-upload
        :drag="true"
        @uploadChange="uploadChange2"
        :listType="'picture-card'"
        style="padding: 0 20px"
      >
      </file-upload>
    </el-drawer>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import ContTable from "@/components/ContTable";
import { listParts } from "@/api/equipment/parts";
import { listDept } from "@/api/system/dept";

export default {
  components: { Wrapper, ContTable },
  data() {
    return {
      equipmentList: [],
      total: 0,
      loading: true,
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      deptOptions: [],
      // 文件上传
      filedrawer: false,
      fileType: [".xlsx"],
      fileList: [],
    };
  },
  async created() {
    await this.getTreeSelect();
    await this.getList(this.queryParams);
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "备件需求编号",
          prop: "partsCode",
          tableVisible: true,
          width: 150,
        },
        {
          label: "备件需求名称",
          prop: "partsName",
          tableVisible: true,
          width: 150,
        },
        { label: "需求类型", prop: "partsType", tableVisible: true },
        { label: "需求数量", prop: "stock", tableVisible: true },
        { label: "申报人员", prop: "createBy", tableVisible: true, width: 150 },
        {
          label: "申报单位",
          prop: "orgId",
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
          tableVisible: true,
        },
        {
          label: "申报日期",
          prop: "createTime",
          formType: "date",
          tableVisible: true,
        },
        { label: "审批状态", prop: "location", tableVisible: true },
      ];
    },
  },
  methods: {
    handleControls(row, act) {
      if (act === "add") {
        // ! 新增
        this.$router.push({
          path: "/sparepart/requirementControls",
          query: {
            formData: {
              applyDeptPerson: this.$store.state.user.standing.nickName,
            },
            isShowCard: 0,
          },
        });
        return;
      } else if (act === "view") {
        // ! 详情
        row.id = 4;
        this.$router.push({
          path: "/sparepart/requirementControls",
          query: { formData: row, isShowCard: 1 },
        });
        return;
      } else if (act === "edit") {
        // ! 编辑
        row.id = 4;
        this.$router.push({
          path: "/sparepart/requirementControls",
          query: { formData: row, isShowCard: 0, d: true },
        });
        return;
      } else if (act === "delete") {
        // ! 删除

        this.$modal
          .confirm('是否确认删除备件编码为"' + row.partsCodes + '"的数据项？')
          .then(() => {
            // return delParts(ids);
            console.log("========================", row.id);
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
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
    //上传文件
    AddFile() {
      this.filedrawer = true;
    },
    uploadChange2() {
      this.$message.success("文件上传成功！");
      this.filedrawer = false;
    },
    handleSet(row) {
      console.log("========================", row);
    },
    async getList(queryParams) {
      this.loading = true;
      listParts(queryParams).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleSelectionChange() {},
  },
};
</script>
<style lang='scss' scoped>
.table {
  margin-top: 20px;
}
</style>
