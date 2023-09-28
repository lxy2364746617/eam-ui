<template>
  <div>
    <div class="mb20" style="background-color: #fff;">
      <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>
      字段配置
    </div>
    <jm-table
      :tableData="templateList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      :handleWidth="200"
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
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,'view')"
          v-hasPermi="['equipment:template:edit']"
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
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate } from "@/api/equipment/attribute";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import { optionselect as getDictOptionselect } from "@/api/system/dict/type";

export default {
  name: "Template_child",
  dicts: ['equipment_attribute_filed','equipment_attribute_assembly','equipment_attribute_must','equipment_attribute_int','equipment_attribute_use'],
  components: { JmTable, JmForm },
  props:{
    nowclickitem: {
      default: {},
      type: Object,
    },
  },
  computed:{
    columns(){
      return [ 
        { label: '字段编码', prop: 'fieldCode',width: 100, required: true, span:24, },
        { label: '字段名称', prop: 'fieldName', required: true, width: 100, span:24,  },
        { label: '字段值类型', prop: 'fieldType',formType: 'radio',required: true, options: this.dict.type.equipment_attribute_filed, width: 200, span:24, },
        { label: '字典属性', prop: 'dictionaryType', formType:'select', options: this.dictOptions,required: true, optionShowValue: true, formVisible: this.formData.fieldType=='dictionary', width: 100,  span:24, },
        // { label: '取值路径', prop: 'valuePath',width: 100,  span:24, },
        { label: '组件类型', prop: 'componentType',formType: 'radio',required: true, options: this.dict.type.equipment_attribute_assembly, width: 100, span:24, },
        { label: '组件提示语', prop: 'componentContent',width: 100, span:24, },
        { label: '是否必填', prop: 'required',formType: 'radio',required: true, options: this.dict.type.equipment_attribute_must,  width: 100, span:24, },
        { label: '是否可修改', prop: 'isModify',formType: 'radio',required: true, options: this.dict.type.equipment_attribute_int, width: 100, span:24, },
        { label: '备注', prop: 'remark',width: 100, span:24, },
        // { label: '启用状态', prop: 'disabled',formType: 'radio',required: true, options: this.dict.type.equipment_attribute_use,width: 100, span:24, },
        { label: '更新时间', prop: 'updateTime',width: 100, span:24, formVisible:false, },
      ]
    }
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
      formData:{},
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
      title: "新增自定义字段",
      // columns: [ 
      //   { label: '字段编码', prop: 'fieldCode',width: 100, required: true, span:24, },
      //   { label: '字段名称', prop: 'fieldName', required: true, width: 100, span:24,  },
      //   { label: '字段值类型', prop: 'fieldType',formType: 'radio',required: true, options: [], width: 200, span:24, },
      //   { label: '取值路径', prop: 'valuePath',width: 100,  span:24, },
      //   { label: '组件类型', prop: 'componentType',formType: 'radio',required: true, options: [], width: 100, span:24, },
      //   { label: '组件内容', prop: 'componentContent',width: 100, span:24, },
      //   { label: '是否必填', prop: 'REQUIRED',formType: 'radio',required: true, options: [],  width: 100, span:24, },
      //   { label: '是否可修改', prop: 'isModify',formType: 'radio',required: true, options: [], width: 100, span:24, },
      //   { label: '备注', prop: 'remark',width: 100, span:24, },
      //   { label: '启用状态', prop: 'DISABLED',formType: 'radio',required: true, options: [],width: 100, span:24, },
      //   { label: '更新时间', prop: 'updateTime',width: 100, span:24, formVisible:false, },
      // ],
      // 是否显示弹出层
      open: false,
      // 字典信息
      dictOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateId: null,
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
    // this.columns.forEach(b => {
    //   if(b.prop=='fieldType') this.$set(b,'options',this.dict.type.equipment_attribute_filed)
    //   if(b.prop=='componentType') this.$set(b,'options',this.dict.type.equipment_attribute_assembly)
    //   if(b.prop=='REQUIRED') this.$set(b,'options',this.dict.type.equipment_attribute_must)
    //   if(b.prop=='isModify') this.$set(b,'options',this.dict.type.equipment_attribute_int)
    //   if(b.prop=='DISABLED') this.$set(b,'options',this.dict.type.equipment_attribute_use  )
    // });
    /** 查询字典下拉列表 */
    getDictOptionselect().then(response => {
      response.data.forEach(b => {
        b.label = b.dictName;
        b.value = b.dictType;
      });
      this.dictOptions = response.data;
    });
    this.queryParams.templateId = this.nowclickitem.templateId
    this.getList(this.queryParams);
  },
  methods: {
    backparent(){
      this.$emit('back')
    },
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
      this.getList(this.queryParams);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fieldId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.formData = {
        templateId: this.nowclickitem.templateId,
      }
      // this.reset();
      this.drawer = true;
      this.disabled = false
      this.title = "新增自定义字段";

    },
    /** 修改按钮操作 */
    handleUpdate(row,state) {
      this.disabled = state=='view'?true:false
      // this.reset();
      // const templateId = row.templateId
      // getTemplate(templateId).then(response => {
        this.formData = JSON.parse(JSON.stringify(row));
        this.title = state=='view'?"查看自定义字段":"修改自定义字段";
        this.drawer = true;
      // });
    },
    /** 提交按钮 */
    submitForm: function(formdata) {
      console.log(this.nowclickitem,333);
      if (formdata.fieldId != undefined) {
        updateTemplate(formdata).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.drawer = false;
          this.getList(this.queryParams);
        });
      } else {
        // var obj = {
        //   templateId: this.nowclickitem.templateId,
        //   ...formdata
        // }
        addTemplate(formdata).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.drawer = false;
          this.getList(this.queryParams);
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fieldIds = row.fieldId || this.ids;
      this.$modal.confirm('是否确认删除设备平台_表单模板编号为"' + fieldIds + '"的数据项？').then(function() {
        return delTemplate(fieldIds);
      }).then(() => {
        this.getList(this.queryParams);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
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
