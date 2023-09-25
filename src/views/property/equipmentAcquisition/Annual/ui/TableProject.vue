<template>
  <div class="box">
    <slot></slot>

    <jm-table
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
            >新增</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, 'view')"
          v-hasPermi="['equipment:book:edit']"
          >详情</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, 'edit')"
          v-hasPermi="['equipment:book:edit']"
          >修改</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['equipment:book:remove']"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleSet(scope.row)"
          v-hasPermi="['equipment:book:edit']"
          >提交</el-button
        >
      </template>
    </jm-table>

    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
      <div class="title">新增</div>
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
        class="from"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="formData.deviceName"
            placeholder="请输入设备名称"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="sModel">
          <el-input
            v-model="formData.sModel"
            placeholder="请输入规格型号"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="技术参数" prop="technologyParam">
          <el-input
            v-model="formData.technologyParam"
            type="textarea"
            placeholder="请输入技术参数"
            :maxlength="200"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="必要性分析" prop="necessityAnalysis">
          <el-input
            v-model="formData.necessityAnalysis"
            type="textarea"
            placeholder="请输入必要性分析"
            :maxlength="200"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="需求日期" prop="demandDate">
          <el-date-picker
            v-model="formData.demandDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: '100%' }"
            placeholder="请选择需求日期"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="需求数量" prop="demandNum">
          <el-input-number
            v-model="formData.demandNum"
            placeholder="需求数量"
            :step="1"
            controls-position="right"
            :max="99"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label-width="120px"
          label="计划单价(万元)"
          prop="planPrice"
        >
          <el-input-number
            v-model="formData.planPrice"
            placeholder="计划单价(万元)"
            :step="1"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="需求组织" prop="demandOrganization">
          <el-cascader
            v-model="formData.demandOrganization"
            :options="demandOrganizationOptions"
            :props="demandOrganizationProps"
            :style="{ width: '100%' }"
            placeholder="请选择需求组织"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="项目分类" prop="projectCategory">
          <el-input
            v-model="formData.projectCategory"
            placeholder="请输入项目分类"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="子公司审查依据" prop="examinationAccording">
          <el-input
            v-model="formData.examinationAccording"
            placeholder="请输入子公司审查依据"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import { getProjectList, getProjectAdd } from "@/api/property/purchase";
import JmTable from "@/components/JmTable";
export default {
  components: {
    JmTable,
  },
  props: {},
  data() {
    return {
      drawer: false,
      equipmentList: null,
      btnLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      isChoose: false,
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },

      total: 0,
      formData: {
        deviceName: undefined,
        sModel: undefined,
        technologyParam: "",
        necessityAnalysis: "",
        demandDate: null,
        demandNum: 0,
        planPrice: 0,
        demandOrganization: ["1", "2", "3"],
        projectCategory: undefined,
        examinationAccording: undefined,
        remark: undefined,
        field124: undefined,
      },
      rules: {
        deviceName: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
        sModel: [
          {
            required: true,
            message: "请输入规格型号",
            trigger: "blur",
          },
        ],
        technologyParam: [
          {
            message: "请输入技术参数",
            trigger: "blur",
          },
        ],
        necessityAnalysis: [
          {
            required: true,
            message: "请输入必要性分析",
            trigger: "blur",
          },
        ],
        demandDate: [
          {
            required: true,
            message: "请选择需求日期",
            trigger: "change",
          },
        ],
        demandNum: [
          {
            required: true,
            message: "需求数量",
            trigger: "blur",
          },
        ],
        planPrice: [
          {
            required: true,
            message: "计划单价(万元)",
            trigger: "blur",
          },
        ],
        demandOrganization: [
          {
            type: "array",
            message: "请至少选择一个需求组织",
            trigger: "change",
          },
        ],
        projectCategory: [
          {
            required: true,
            message: "请输入项目分类",
            trigger: "blur",
          },
        ],
        examinationAccording: [
          {
            message: "请输入子公司审查依据",
            trigger: "blur",
          },
        ],
        remark: [
          {
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        field124: [
          {
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
      },
      demandOrganizationOptions: [],
      demandOrganizationProps: {
        multiple: false,
        label: "label",
        value: "value",
        children: "children",
      },
    };
  },
  computed: {
    columns() {
      return [
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        { label: "技术参数", prop: "technologyParam", tableVisible: true },
        {
          label: "必要性分析",
          prop: "necessityAnalysis",

          options: [],
          tableVisible: true,
        }, //(1 设备、2 部件)
        { label: "项目分类", prop: "projectCategory", tableVisible: true },
        {
          label: "子公司审查依据",
          prop: "examinationAccording",
          tableVisible: true,
        },
        {
          label: "需求日期",
          prop: "demandDate",

          options: [],
          tableVisible: true,
        }, //(A、B、C)
        {
          label: "需求数量",
          prop: "demandNum",

          options: [],
          tableVisible: true,
        }, //(0 父级)
        { label: "计划单价(万元)", prop: "planPrice", tableVisible: true },
        { label: "需求组织", prop: "demandOrganization", tableVisible: true },
        { label: "备注", prop: "remark", tableVisible: true },
        { label: "行号", prop: "lineNum", tableVisible: true },
      ];
    },
  },
  watch: {},
  created() {
    this.getDemandOrganizationOptions();
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList(queryParams = { pageNum: 1, pageSize: 10 }) {
      this.loading = true;
      getProjectList(queryParams).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.drawer = !this.drawer;
    },
    submitForm() {
      this.$refs["elForm"].validate(async (valid) => {
        console.log("========================", valid);
        if (!valid) return;
        await getProjectAdd(this.formData);
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    getDemandOrganizationOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      this.$axios({
        method: "get",
        url: "/property/purchase/plan/selectDetailPage",
      }).then((resp) => {
        var { data } = resp;
        this.demandOrganizationOptions = data.list;
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
  .from {
    padding: 30px;
    padding-left: 10px;
    label {
      width: 120px;
    }
  }
  .title {
    font-size: 20px;
    width: 100%;
    height: 58px;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: start;
    align-items: center;
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
</style>
