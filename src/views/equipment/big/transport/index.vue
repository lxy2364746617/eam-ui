<template>
  <div class="app-container">
    <div>
      <div class="mb20" style="background-color: #fff;">{{ $route.meta.title }}</div>
      <jm-table :tableData="templateList" @getList="getList" @handleSelectionChange="handleSelectionChange"
        @switchchange="switchchange" :total="total" :handleWidth="120"
        :columns="tablecolumns" ref="jmTable">
        <template slot="headerLeft">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['equipment:transport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleImport"
              v-hasPermi="['equipment:transport:import']">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
              v-hasPermi="['equipment:transport:export']">下载</el-button>
          </el-col>
        </template>
        <template #end_handle="scope">
          <!-- <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-view"
                    @click="handleUpdate(scope.row,'view')"
                    v-hasPermi="['equipment:template:edit']"
                  >查看</el-button> -->
          <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row, 'edit')"
                    v-hasPermi="['equipment:transport:edit']"
                    >编辑</el-button>
          <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['equipment:transport:remove']"
                  >删除</el-button>
          <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document-add"
                    @click="handleUpdate(scope.row,'view')"
                    v-hasPermi="['equipment:transport:query']"
                  >查看详情</el-button>
        </template>
      </jm-table>

      <!-- 导入 -->
      <file-import @handleFileSuccess="handleFileSuccess" :downloadTemplateUrl="'/equipment/transport/importTemplate'" ref="fileImport"
        :importUrl="'/equipment/transport/importData'" :isUpdate='false' :templateName='"主要辅助运输设备(模板)"'>
      </file-import>
    </div>
  </div>
</template>

<script>
import { listTransport, getTransport, delTransport, addTransport, updateTransport, importTransport } from "@/api/equipment/big/transport";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import child from "@/views/formTemplate/child";
import fileImport from "@/components/FileImport";

export default {
  name: "Template",
  dicts: ['system_supplier_level', 'system_supplier_type', 'system_supplier_statue'],
  components: { JmTable, JmForm, child, fileImport },
  computed: {

    // 列信息
    tablecolumns() {
      return [
        { label:"矿井名称", prop:"mineName", span: 8, required: true, },
        { label:"设备类型", prop:"deviceType", span: 8, },
        { label:"产品名称", prop:"productName", span: 8, },
        { label:"数量", prop:"sum", span: 8, },
        { label:"型号", prop:"model", span: 8, },
        { label:"运输能力", prop:"transportPower", span: 8, },
        { label:"运行速度", prop:"run", span: 8, },
        { label:"爬坡能力", prop:"climbing", span: 8, },
        { label:"用途", prop:"use", span: 8, },
        { label:"动力形式", prop:"runPower", span: 8, },
        { label:"生产厂家", prop:"produceManufacturer", span: 8, },
        { label:"生产日期", prop:"produceTime", span: 8, formType: "date", },
        { label:"使用日期", prop:"useTime", span: 8, formType: "date", },
      ]
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formData: {},
      nowclickitem: '',
      disabled: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      drawer: false,
      drawer2: false,
      direction: 'rtl',
      // 设备平台_表单模板表格数据
      templateList: [],
      // 弹出层标题
      title: "新增表单",
      // 是否显示弹出层
      open: false,
      importData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
    };
  },
  created() {
    this.getList(this.queryParams);
  },
  methods: {
    handleImport() {
      this.$refs.fileImport.upload.open = true
    },
    handleFileSuccess() {
      this.getList(this.queryParams);
    },
    uploadChange(val) {
      this.importData = val
    },
    switchchange(val, prop, row) {
      this.submitForm(row)
    },
    saveHandle() {
      this.$refs.jmform.submitForm()
    },
    saveHandle2() {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      importTransport(this.importData).then(response => {
        loading.close();
        this.$modal.msgSuccess("上传成功");
        this.getList(this.queryParams)
      });
    },
    handleClose(done) {
      done()
    },
    /** 查询设备平台_表单模板列表 */
    getList(queryParams) {
      this.loading = true;
      listTransport(queryParams).then(response => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        templateId: null,
        templateName: null,
        templateCode: null,
        templateType: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.largeId)
      this.queryParams.exportIds = selection.map(item => item.largeId).join(',')
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/device/big/transport/add', })
      // this.reset();
      // this.drawer = true;
      // this.title = "新增表单模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row, state) {
      this.disabled = state == 'view' ? true : false
      // const id = row.id
      // getlbase(id).then(response => {
      // this.formData = JSON.parse(JSON.stringify(row));
      this.title = state == 'view' ? "查看表单模板" : "修改表单模板";
      this.$router.push({ path: '/device/big/transport/add', query: {l: row.largeId, d: this.disabled }})
      // this.drawer = true;
      // });
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      if (formdata.id != undefined) {
        updateTransport(formdata).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.drawer = false;
          this.getList();
        });
      } else {
        addTransport(formdata).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.drawer = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.largeId || this.ids;
      this.$modal.confirm('是否确认删除？').then(function () {
        return delTransport(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 设置字段
    handleSet(row) {
      this.nowclickitem = row
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipment/transport/export', {
        ...this.queryParams
      }, `主要辅助运输设备_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
