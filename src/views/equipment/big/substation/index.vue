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
              v-hasPermi="['equipment:template:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleImport"
              v-hasPermi="['equipment:book:add']">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
              v-hasPermi="['equipment:book:add']">下载</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
                    <el-button
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      :disabled="multiple"
                      @click="handleDelete"
                      v-hasPermi="['equipment:template:remove']"
                    >删除</el-button>
                  </el-col> -->
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
                    v-hasPermi="['equipment:template:edit']"
                    >编辑</el-button>
          <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['equipment:template:remove']"
                  >删除</el-button>
          <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document-add"
                    @click="handleUpdate(scope.row,'view')"
                    v-hasPermi="['equipment:template:edit']"
                  >查看详情</el-button>
        </template>
      </jm-table>

      <!-- 添加或修改设备平台_表单模板对话框 -->
      <!-- <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="40%" :wrapperClosable="false"
        :before-close="handleClose">
        <jm-form class="mr20" :columns="columns" :formData="formData" @submitForm="submitForm" ref="jmform"
          :disabled="disabled">
          <template #footer>
            <div style="text-align: center;">
              <el-button size="mini" @click="drawer = false">取消</el-button>
              <el-button size="mini" @click="saveHandle" type="primary" v-if="!disabled">保存</el-button>
            </div>
          </template>
        </jm-form>
      </el-drawer> -->

      <!-- 导入 -->
      <file-import @handleFileSuccess="handleFileSuccess" downloadTemplateUrl='' ref="fileImport"
        :importUrl="'/equipment/substation/importData'">
      </file-import>
    </div>
  </div>
</template>
        
<script>
import { listSubstation, getSubstation, delSubstation, addSubstation, updateSubstation, importSubstation } from "@/api/equipment/big/substation";
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
{ label:"变电所名称", prop:"substationName", span: 8, },
{ label:"电源电压等级", prop:"vcc", span: 8, },
{ label:"电源电缆型号", prop:"cableModel", span: 8, },
{ label:"高压开关设备型号", prop:"highPowerModel", span: 8, },
{ label:"高压开关电压等级", prop:"highPowerLevel", span: 8, },
{ label:"高压开关设备厂家", prop:"highManufacturer", span: 8, },
{ label:"高压投运时间", prop:"highPutTime", span: 8, },
{ label:"所用变容量", prop:"variableCapacity", span: 8, },
{ label:"所用变台数", prop:"variableSum", span: 8, },
{ label:"低压开关设备型号", prop:"lowPowerModel", span: 8, },
{ label:"低压开关电压等级", prop:"lowPowerLevel", span: 8, },
{ label:"低压开关设备厂家", prop:"lowManufacturer", span: 8, },
{ label:"低压投运时间", prop:"lowPutTime", span: 8, formType: "date", },
{ label:"监控分站供电电源", prop:"powerSupply", span: 8, },
{ label:"监控分站台数", prop:"powerSupplySum", span: 8, },
{ label:"监控分站自动切换", prop:"automatic", span: 8, },
{ label:"直流电源设备型号", prop:"directModel", span: 8, },
{ label:"智能保护型号", prop:"protectModel", span: 8, },
{ label:"智能保护厂家", prop:"protectManufacturer", span: 8, },
{ label:"矿井产能", prop:"producePower", span: 8, },
{ label:"电源上级名称", prop:"topSubstationName", span: 8, },
{ label:"电源供电距离", prop:"powerSupplyLength", span: 8, },
{ label:"高压开关台数", prop:"highPowerSum", span: 8, },
{ label:"所用变电设备型号", prop:"changePowerModel", span: 8, },
{ label:"所用变投运日期", prop:"changePutTime", span: 8, formType: "date", },
{ label:"低压开关数", prop:"lowPowerSum", span: 8, },
{ label:"监控分站设备型号", prop:"monitorModel", span: 8, },
{ label:"监控分站控制方式", prop:"monitorMethod", span: 8, },
{ label:"直流电源厂家", prop:"directManufacturer", span: 8, },
{ label:"无人值守", prop:"unmanned", span: 8, formType: "select", options: [], },//(是/否)


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
      importSubstation(this.importData).then(response => {
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
      listSubstation(queryParams).then(response => {
        this.templateList = response.data;
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/decive/big/substation/add', })
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
      this.$router.push({ path: '/decive/big/substation/add', query: {l: row.largeId, d: this.disabled }})
      // this.drawer = true;
      // });
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      if (formdata.id != undefined) {
        updateSubstation(formdata).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.drawer = false;
          this.getList();
        });
      } else {
        addSubstation(formdata).then(response => {
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
        return delSubstation(ids);
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
      this.download('equipment/substation/export', {
        ...this.queryParams
      }, `供电设备_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
        