<template>
  <div class="app-container">
    <!-- <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <jm-table :tableData="faultcodeList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" >
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['maintain:faultcode:add']"
        >新增</el-button>
        <el-button
          type="success"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['maintain:faultcode:edit']"
        >导入</el-button>
          <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="importTemplate"
          v-hasPermi="['maintain:faultcode:export']"
        >下载模板</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['maintain:faultcode:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['maintain:faultcode:remove']"
          >删除</el-button>
        </template>
    </jm-table>
    <!-- <el-table v-loading="loading" :data="faultcodeList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="55" align="center" />
      <el-table-column label="故障代码" align="center" prop="faultCode" />
      <el-table-column label="故障名称" align="center" prop="faultName" />
      <el-table-column label="故障症状" align="center" prop="symptom" />
      <el-table-column label="故障分类" align="center" prop="faultType" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
         
          
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改故障代码管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form"  label-width="120px">
        <el-form-item v-if="isEdit" label="故障代码" prop="faultCode" >
          <el-input v-model="form.faultCode"  disabled />
        </el-form-item>
        <el-form-item label="故障名称" prop="faultName" :rules='[{required:true,message:"请填写故障名称"}]'>
          <el-input v-model="form.faultName" placeholder="请输入故障名称" />
        </el-form-item>
        <el-form-item label="故障分类" prop="faultType" :rules='[{required:true,message:"请选择故障分类"}]'>
          <el-select v-model="form.faultType" style="width:100%">
            <el-option v-for="item in dict.type.kdb_fault_type" :key="item.value" :label="item.label" :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障症状" prop="symptom" :rules='[{required:true,message:"请填写故障症状"}]'>
          <el-input v-model="form.symptom" type="textarea" placeholder="请输入故障症状"  :autosize="{ minRows: 3}" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="故障分析原因" prop="reasons" :rules='[{required:true,message:"请填写故障分析原因"}]'>
          <el-input v-model="form.reasons" type="textarea" placeholder="请输入故障分析原因"  :autosize="{ minRows: 3}" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="故障处理措施" prop="measure" :rules='[{required:true,message:"请填写故障处理措施"}]'>
          <el-input v-model="form.measure" type="textarea" placeholder="请输入故障处理措施"  :autosize="{ minRows: 3}" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0"><span style="color:#0BCD15">启用</span></el-radio>
          <el-radio v-model="form.status" label="1"><span style="color:#F30909">停用</span></el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
      <file-import @handleFileSuccess="handleFileSuccess" :downloadTemplateUrl="'/maintain/faultCode/importTemplate'" ref="fileImport"
        :importUrl="'/maintain/faultCode/importData'">
      </file-import>
  </div>
</template>

<script>
import { listFaultcode, getFaultcode, delFaultcode, addFaultcode, updateFaultcode } from "@/api/monitor/faultcode";
import JmTable from '@/components/JmTable';
import fileImport from "@/components/FileImport";
export default {
  name: "Faultcode",
  components:{JmTable,fileImport},
  dicts:['kdb_fault_type'],
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 故障代码管理表格数据
      faultcodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        codeId: null,
        faultCode: null,
        faultName: null,
        faultType: null,
        symptom: null,
        reasons: null,
        measure: null,
        status: '0',
        delFlag: null,
        remark: null,
        userId: null,
        deptId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      },
      // 表单参数
      form: {},
      isEdit:false,
      statusArr:[
        {label:'启用',value:'0',class:'green'},
        {label:'停用',value:'1'},
        ]
    };
  },
  computed:{
    columns(){
      return [
        { label: '故障代码', prop: 'faultCode', },
        { label: '故障名称', prop: 'faultName',  },
        { label: '故障症状', prop: 'symptom',  },
        { label: '故障分类', prop: 'faultType',formType:'select',options: this.dict.type.kdb_fault_type, },
        { label: '状态', prop: 'status',formType:'select',options: this.statusArr, },
        { label: '创建人', prop: 'createBy',},
        { label: '创建时间', prop: 'createTime', formType: 'date'},
      ]
    }
  },
  created() {
    setTimeout(() => {
        this.getList();
    }, 1);
    
  },
  methods: {
    /** 查询故障代码管理列表 */
    getList() {
      this.loading = true;
      listFaultcode(this.queryParams).then(response => {
        this.faultcodeList = response.rows;
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
        codeId: null,
        faultCode: null,
        faultName: null,
        faultType: null,
        symptom: null,
        reasons: null,
        measure: null,
        status: null,
        delFlag: null,
        remark: null,
        userId: null,
        deptId: null,
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
      this.ids = selection.map(item => item.codeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isEdit=false
      this.reset();
      this.open = true;
      this.title = "添加故障代码管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isEdit=true
      this.reset();
      const codeId = row.codeId || this.ids
      getFaultcode(codeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改故障代码管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.codeId != null) {
            updateFaultcode(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFaultcode(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const codeIds = row.codeId || this.ids;
      this.$modal.confirm('是否确认删除故障代码管理编号为"' + codeIds + '"的数据项？').then(function() {
        return delFaultcode(codeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /* 导入 */
    handleImport() {
      this.$refs.fileImport.upload.open = true
    },
    handleFileSuccess() {
      this.getList(this.queryParams);
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        '/maintain/faultCode/importTemplate',
        {},
        `faultCode${new Date().getTime()}.xlsx`
      )
    },
  }
};
</script>
