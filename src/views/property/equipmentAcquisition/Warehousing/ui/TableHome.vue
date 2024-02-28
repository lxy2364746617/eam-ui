<template>
  <div class="box">
    <ContTable
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :handleWidth="130"
      :columns="columns"
      v-if="!addEdit"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="drawer = true"
            v-hasPermi="['property:warehousing:add']"
            >入库</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-upload2"
            @click="handlerImport"
            v-hasPermi="['property:warehousing:export']"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="exportWarnLog"
            v-hasPermi="['property:warehousing:download']"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <!-- <el-button
          size="mini"
          type="text"
          @click="goDetails(scope.row, 'edit')"
          v-hasPermi="['property:warehousing:edit']"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:warehousing:remove']"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleSubmit(scope.row)"
          v-hasPermi="['property:warehousing:submit']"
          >提交</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleFlowRecord(scope.row)"
          v-hasPermi="['property:warehousing:edit']"
          >审批流</el-button
        > -->
        <!-- <el-button
          size="mini"
          type="text"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:warehousing:remove']"
          >删除</el-button
        > -->
      </template>
    </ContTable>
    <el-drawer
      size="65%"
      class="drawer"
      title="设备入库-选择需求计划"
      :visible.sync="drawer"
    >
      <div style="padding: 0 20px">
        <ContTable2
          :tableData="equipmentList2"
          @getList="getList2"
          @handleSelectionChange="handleSelectionChange2"
          :total="total2"
          ref="jmtable"
          :isRadio="isChoose2"
          :handleWidth="230"
          :columns="columns2"
          :isEdit="false"
          v-if="!addEdit2"
          :showOperate="false"
        >
        </ContTable2>
      </div>

      <div class="submit">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="close">取消</el-button>
      </div>
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

    <!-- 导入 -->
    <file-import
      @handleFileSuccess="handleFileSuccess"
      :downloadTemplateUrl="'/device/warehousing/importTemplate'"
      ref="fileImport"
      :isUpdate="false"
      :importUrl="'/device/warehousing/import'"
    ></file-import>
  </div>
</template>
<script>
import {
  getPurchaseList,
  uploadInfo,
  download,
  getWarehousingList,
  deleteBASE,
} from "@/api/property/warehousing";
import ContTable from "@/components/ContTable";
import ContTable2 from "@/components/ContTable/index2";
import { listDept } from "@/api/system/dept";
import { listDefinition1 } from "@/api/flowable/definition";
import subprocess from "@/views/device/book/process";
import { definitionStart2 } from "@/api/flowable/definition";
import fileImport from "@/components/FileImport";
export default {
  components: {
    ContTable,
    subprocess,
    ContTable2,
    fileImport,
  },
  dicts: ["em_device_att", "em_device_level", "wf_process_status"],
  props: {},
  data() {
    return {
      subtitle: "",
      subopen: false,
      tableData: null,
      formData: {
        archivesOther: {}, // 步骤2 值
        emArchivesExtendAtt: {}, // 步骤2-扩展数据  模板 值
        emArchivesIndex: {}, // 步骤3 主要指标  模板 值
        emArchivesSpecial: {}, // 步骤3 特种设备  模板 值
        archivesPartsList: [], // 步骤4  表格
        genFileResourceList: [], // 步骤5  上传图片
        imgFileResourceList: [], // 步骤5  上传文件
        purchasePlanDetailId: null,
      },
      addDetails: false,

      drawer: false,
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
      equipmentList: null,
      equipmentList2: null,
      isChoose: false,
      isChoose2: true,
      // 遮罩层
      loading: true,
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
    };
  },
  computed: {
    columns() {
      return [
        {
          label: "业务编码",
          prop: "wareHousingNo",
          tableVisible: true,
          width: 150,
        },
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        { label: "设备类别", prop: "deviceType", tableVisible: true },
        {
          label: "设备状态",
          prop: "deviceStatus",
          tableVisible: true,
        },
        {
          label: "功能位置",
          prop: "location",
          tableVisible: true,
        },
        {
          label: "重要等级",
          prop: "grade",
          tableVisible: true,
          formType: "select",
          options: this.dict.type.em_device_level,
        },
        { label: "所属子公司", prop: "affCompany", tableVisible: true },
        {
          label: "所属组织",
          prop: "affDept",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
        },
        {
          label: "设备属性",
          prop: "deviceAtt",
          formType: "select",
          tableVisible: true,
          options: this.dict.type.em_device_att,
        },
        // {
        //   label: "审批状态",
        //   prop: "apvStatus",
        //   tableVisible: true,
        //   formType: "selectTag",
        //   options: this.dict.type.wf_process_status,
        // },

        {
          label: "购置计划编号",
          prop: "relatePurchasePlanNo",
          tableVisible: true,
          width: 150,
        },
        {
          label: "行号",
          prop: "lineNum",
          tableVisible: true,
        },
        {
          label: "计划类型",
          prop: "purchasePlanType",
          tableVisible: true,
          formType: "select",
          options: [
            {
              label: "年度采购",
              value: 1,
            },
            {
              label: "临时采购",
              value: 2,
            },
          ],
        },
        {
          label: "创建时间",
          prop: "createTime",
          tableVisible: true,
          formType: "date",
        },
      ];
    },
    columns2() {
      return [
        {
          label: "设备名称",
          prop: "deviceName",
          tableVisible: true,
          width: 150,
        },
        { label: "规格型号", prop: "smodel", tableVisible: true, width: 300 },
        {
          label: "技术参数",
          prop: "technologyParam",
          tableVisible: true,
          width: 300,
        },

        {
          label: "需求日期",
          prop: "demandDate",
          formType: "date",
          tableVisible: true,
        }, //(A、B、C)
        {
          label: "需求数量",
          prop: "demandNum",

          tableVisible: true,
        },

        { label: "需求组织", prop: "demandOrganization", tableVisible: true },
        {
          label: "入库数量",
          prop: "wareHousingNum",
          tableVisible: true,
        },
        { label: "行号", prop: "lineNum", tableVisible: true },

        {
          label: "购置计划编号",
          prop: "purchasePlanNo",
          tableVisible: true,
          width: 200,
        },
        {
          label: "计划名称",
          prop: "purchasePlanName",
          tableVisible: true,
          width: 200,
        },
        {
          label: "计划类型",
          prop: "purchasePlanType",
          tableVisible: true,
          options: [
            {
              label: "年度计划",
              value: 1,
            },
            {
              label: "临时计划",
              value: 2,
            },
          ],
        },
        {
          label: "申报单位",
          prop: "declarationDeptId",
          tableVisible: true,
          formType: "selectTree",
          options: this.deptOptions,
          width: 150,
        },

        {
          label: "申报日期",
          prop: "declarationDate",
          tableVisible: true,
          formType: "date",
        },
      ];
    },
  },
  watch: {
    drawer: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getList2();
        }
      },
      deep: true,
    },
  },
  async created() {
    // data赋值
    this.getDeptTree();
    await this.getList2();
  },
  mounted() {},
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
    // ! 导入
    /** 导入按钮操作 */
    handlerImport() {
      this.$refs.fileImport.upload.open = true;
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.getList();
    },
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
        this.getList();
      });
    },
    // 跳转流程详情
    handleFlowRecord(row) {
      this.$router.push({
        path: "/flowable/task/finished/detail/index",
        query: {
          procInsId: row.processInstanceId,
          deployId: row.deployId,
          taskId: row.taskId,
        },
      });
    },
    sub(val) {
      definitionStart2(
        val.id,
        this.radioRow.purchasePlanNo,
        "device_warehousing",
        {}
      ).then((res) => {
        this.subopen = false;
        this.getList();
      });
    },
    getTableData(val) {
      let data = {
        pageNum: val.page,
        pageSize: val.limit,
        category: "device_warehousing",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },
    /* 提交按钮 */
    handleSubmit(row) {
      this.subopen = true;
      this.subtitle = "提交";
      let data = {
        pageNum: 1,
        pageSize: 10,
        category: "device_warehousing",
      };
      listDefinition1(data).then((res) => {
        this.tableData = res.data.records;
      });
    },

    handleSet() {},
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBASE(row.id).then(async (res) => {
          if ((res.code = 200)) {
            this.getList();
            res.message
              ? this.$message.success(res.message)
              : this.$message.success("删除成功！");
          } else {
            this.$message.success("删除失败！");
          }
        });
      });
    },
    back() {
      this.addEdit = false;
      this.addDetails = false;
      this.getList(this.queryParams);
    },
    close() {
      this.drawer = false;
    },
    save() {
      if (this.ids2.length == 0) {
        this.$message.warning("请选择需求计划！");
        return;
      }
      // this.btnLoading = true;
      this.$router.push({ path: "/property/purchase/warehousingAdd" });
    },

    exportWarnLog(data) {
      download({
        ids: this.ids.length > 0 ? this.ids : null,
        ...this.convertToDefaultObject(this.columns),
      }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `warehousing_${new Date().getTime()}`);
      });
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
      this.loading = true;
      getPurchaseList(form).then((response) => {
        this.equipmentList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 抽屉
    async getList2(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading = true;
      getWarehousingList(form).then((response) => {
        this.equipmentList2 = response.data.records;
        this.total2 = response.data.total;
        this.loading2 = false;
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
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
      window.sessionStorage.setItem(
        "purchaseValue",
        JSON.stringify({
          id: selection[0].id,
          purchasePlanDetailId: selection[0].id,
          purchasePlanType: selection[0].purchasePlanType,
          relatePurchasePlanNo: selection[0].purchasePlanNo,
        })
      );
    },
    /** 修改按钮操作 */
    goDetails(row, f) {
      const deviceId = "c52611e54d494a06aed1048099623383";
      if (f == "edit") {
        // this.addEdit = true;
        this.$router.push({
          path: "/property/purchase/warehousingAdd?i=" + deviceId,
        });
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
