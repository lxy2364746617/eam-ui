<template>
  <div class="app-container">
    <div v-show="isParent">
      <div class="mb20" style="background-color: #fff;">表单配置</div>
      <jm-table
        :tableData="templateList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        :total="total"
        :handleWidth="280"
        :columns="columns">
        <template slot="headerLeft">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['equipment:template:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['equipment:template:remove']"
            >删除</el-button>
          </el-col>
        </template>
        <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row,'view')"
            v-hasPermi="['equipment:template:query']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'edit')"
            v-hasPermi="['equipment:template:edit']"
          >修改</el-button>
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
            @click="handleSet(scope.row)"
            v-hasPermi="['equipment:attribute:list']"
          >设置字段</el-button>
        </template>
      </jm-table>
  
      <!-- 添加或修改设备平台_表单模板对话框 -->
      <el-drawer
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        size="40%"
        :wrapperClosable="false"
        :before-close="handleClose">
        <jm-form 
          class="mr20"
          :columns="columns" 
          :formData="formData" 
          @submitForm="submitForm" 
          ref="jmform"
          :disabled="disabled">
          <template #footer>
            <div style="text-align: center;">
              <el-button size="mini" @click="drawer=false">取消</el-button>
              <el-button size="mini" @click="saveHandle" type="primary" v-if="!disabled">保存</el-button>
            </div>
          </template>
        </jm-form>
      </el-drawer>
    </div>
    <child v-if="!isParent" :nowclickitem="nowclickitem" @back="isParent=true"></child>
  </div>
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate } from "@/api/equipment/template";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import child from "@/views/formTemplate/child";

export default {
  name: "Template",
  dicts: ['form_attribute','equipment_attribute','equipment_dimension'],
  components: { JmTable, JmForm, child },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      isParent: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formData:{},
      nowclickitem: '',
      disabled: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      drawer: false,
      direction: 'rtl',
      // 设备平台_表单模板表格数据
      templateList: [],
      // 弹出层标题
      title: "新增表单",
      columns: [ 
        { label: '表单名称', prop: 'templateName',width: 100, required: true, span:24, },
        { label: '表单属性', prop: 'formAttribute',formType: 'select', required: true,options: [], width: 100, span:24,  },
        { label: '所属模块', prop: 'module',formType: 'select',required: true, options: [], width: 200, span:24, },
        { label: '所属维度', prop: 'templateType',formType: 'select', options: [] ,width: 100, required: true, span:24, },
        { label: '备注', prop: 'remark', width: 100, span:24, },
        { label: '更新时间', prop: 'updateTime',width: 100, span:24,formVisible:false },
      ],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateName: null,
        templateCode: null,
        templateType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    // data赋值
    this.columns.forEach(b => {
      if(b.prop=='formAttribute') this.$set(b,'options',this.dict.type.form_attribute)
      if(b.prop=='module') this.$set(b,'options',this.dict.type.equipment_attribute)
      if(b.prop=='templateType') this.$set(b,'options',this.dict.type.equipment_dimension)
    });
    this.getList();
  },
  methods: {
    saveHandle() {
      this.$refs.jmform.submitForm()
    },
    handleClose(done){
      done()
    },
    /** 查询设备平台_表单模板列表 */
    getList(queryParams) {
      this.loading = true;
      listTemplate(queryParams).then(response => {
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
      this.ids = selection.map(item => item.templateId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.drawer = true;
      this.title = "新增表单模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row,state) {
      this.disabled = state=='view'?true:false
      // const templateId = row.templateId
      // getTemplate(templateId).then(response => {
        this.formData = JSON.parse(JSON.stringify(row));
        this.title = state=='view'?"查看表单模板":"修改表单模板";
        this.drawer = true;
      // });
    },
    /** 提交按钮 */
    submitForm: function(formdata) {
      if (formdata.templateId != undefined) {
        updateTemplate(formdata).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.drawer = false;
          this.getList();
        });
      } else {
        addTemplate(formdata).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.drawer = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const templateIds = row.templateId || this.ids;
      this.$modal.confirm('是否确认删除设备平台_表单模板编号为"' + templateIds + '"的数据项？').then(function() {
        return delTemplate(templateIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    // 设置字段
    handleSet(row){
      this.nowclickitem = row
      this.isParent = false
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipment/template/export', {
        ...this.queryParams
      }, `template_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
