<template>
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
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="drawer = true"
            v-hasPermi="['equipment:book:add']"
            >入库</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-upload
            :before-upload="beforeUpload"
            action=""
            v-hasPermi="['equipment:book:add']"
            ><el-button type="danger" size="mini" plain icon="el-icon-upload"
              >导入</el-button
            ></el-upload
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="exportWarnLog"
            v-hasPermi="['equipment:book:add']"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          v-if="scope.row.apvStatus === 4 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="goDetails(scope.row, 'edit')"
          v-hasPermi="['equipment:book:edit']"
          >编辑</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 4 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['equipment:book:remove']"
          >删除</el-button
        >
        <el-button
          v-if="scope.row.apvStatus === 4 || scope.row.apvStatus === 1"
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >提交</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleSet(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >审批流</el-button
        >
      </template>
    </jm-table>
    <el-drawer
      size="65%"
      class="drawer"
      title="设备入库-选择需求计划"
      :visible.sync="drawer"
    >
      <JmTableNoPaging
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
      >
      </JmTableNoPaging>

      <div class="submit">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-drawer>
    <el-col :span="18" :xs="24" v-if="addDetails">
      <add-details
        :formData="formData"
        :formTitle="title"
        @back="back()"
      ></add-details>
    </el-col>
    <add-edit
      v-if="addEdit"
      :formTitle="title"
      :formData="formData"
      @back="back"
    ></add-edit>
  </div>
</template>
<script>
import { findByTemplateType } from "@/api/equipment/attribute";
import {
  getPurchaseList,
  uploadInfo,
  download,
  getWarehousingList,
  deleteBASE,
} from "@/api/property/warehousing";
import JmTable from "@/components/JmTable";
import JmTableNoPaging from "@/components/JmTableNoPaging/index2";
import addEdit from "@/views/property/equipmentAcquisition/Warehousing/add";
import addDetails from "@/views/property/equipmentAcquisition/Warehousing/details";
import { listDept } from "@/api/system/dept";
export default {
  components: {
    JmTable,
    addEdit,
    JmTableNoPaging,
    addDetails,
  },
  dicts: ["em_device_att", "em_device_level", "apv_status"],
  props: {},
  data() {
    return {
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
        { label: "业务编码", prop: "wareHousingNo", tableVisible: true },
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
        { label: "所属组织", prop: "affDept", tableVisible: true },
        {
          label: "设备属性",
          prop: "deviceAtt",
          formType: "select",
          tableVisible: true,
          options: this.dict.type.em_device_att,
        },
        {
          label: "审批状态",
          prop: "apvStatus",
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.apv_status,
        },

        {
          label: "购置计划编号",
          prop: "purchasePlanNo",
          tableVisible: true,
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
          label: "创建时间",
          prop: "createTime",
          tableVisible: true,
          formType: "date",
        },
      ];
    },
    columns2() {
      return [
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        { label: "技术参数", prop: "technologyParam", tableVisible: true },

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
        },
        { label: "计划名称", prop: "purchasePlanName", tableVisible: true },
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
        { label: "申报单位", prop: "declarationDeptId", tableVisible: true },

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
    this.columns.forEach((b) => {});
    await this.getList();
    await this.getList2();
  },
  mounted() {},
  methods: {
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
      this.btnLoading = true;
      // 获取扩展数据
      findByTemplateType({ templateType: "K" })
        .then((response) => {
          this.formData = this.$options.data().formData;

          this.setFormLabel(response.data);
          // 扩展数据
          this.formData.emArchivesExtendAtt = {
            componentContent: response.data,
            fieldValue: {},
          };
          this.addEdit = true;
          this.drawer = false;

          this.title = "新增设备";
          this.btnLoading = false;
        })
        .catch((err) => {
          this.btnLoading = false;
          this.drawer = true;
        });
    },

    exportWarnLog(data) {
     
      download(this.ids).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
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
        this.equipmentList = response.rows;
        this.total = response.total;
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
        this.equipmentList2 = response.rows;
        this.total2 = response.total;
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
        "purchasePlanDetailId",
        JSON.stringify(this.ids2[this.ids2.length - 1])
      );
    },
    /** 修改按钮操作 */
    goDetails(row, f) {
      this.btnLoading = true;
      console.log("========================", row);
      this.title = "编辑设备";
      this.formData = row;
      window.sessionStorage.setItem(
        "purchasePlanDetailId",
        JSON.stringify(row.id)
      );
      // 第一步  特种设备
      if (this.formData.emArchivesSpecial) {
        this.formData.emArchivesSpecial.componentContent = JSON.parse(
          this.formData.emArchivesSpecial.componentContent
        );
        this.formData.emArchivesSpecial.fieldValue = JSON.parse(
          this.formData.emArchivesSpecial.fieldValue
        );
        this.setFormLabel(this.formData.emArchivesSpecial.componentContent);
      }
      // 第二步
      if (this.formData.archivesOther == null) {
        this.formData.archivesOther = {};
      }
      // 第二步  扩展数据
      if (this.formData.emArchivesExtendAtt) {
        this.formData.emArchivesExtendAtt.componentContent = JSON.parse(
          this.formData.emArchivesExtendAtt.componentContent
        );
        this.formData.emArchivesExtendAtt.fieldValue = JSON.parse(
          this.formData.emArchivesExtendAtt.fieldValue
        );
        this.setFormLabel(this.formData.emArchivesExtendAtt.componentContent);
      }
      // 第三步 主要指标
      if (this.formData.emArchivesIndex) {
        this.formData.emArchivesIndex.componentContent = JSON.parse(
          this.formData.emArchivesIndex.componentContent
        );
        this.formData.emArchivesIndex.fieldValue = JSON.parse(
          this.formData.emArchivesIndex.fieldValue
        );
        this.setFormLabel(this.formData.emArchivesIndex.componentContent);
      }
      this.btnLoading = false;
      if (f == "edit") {
        this.addEdit = true;
      } else if (f == "view") {
        this.title =
          this.getTreeParent(row.categoryId).join(" > ") +
          " > " +
          row.deviceName;
        this.addDetails = true;
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
  padding: 14px 15px;

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
