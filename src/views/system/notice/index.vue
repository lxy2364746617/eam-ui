<template>
  <div class="app-container">
    <jm-table
      :tableData="noticeList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      :columns="columns">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:notice:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:notice:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:notice:export']"
          >导出</el-button>
        </el-col>
        
      </template>
      <template #end_handle="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          v-if="scope.row.status==0"
          v-hasPermi="['system:notice:edit']"
        >修改</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['system:notice:remove']"
        >删除</el-button>
      </template>
    </jm-table>

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1080px" :close-on-click-modal='false' append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24"  >
            <el-form-item label="标题" prop="noticeTitle">
              <el-input  v-model="form.noticeTitle" />
              </el-form-item>
              </el-col>
              <el-col :span="13"  >
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="form.createTime"  type="datetime" value-format="yyyy-MM-dd hh:mm:ss"  placeholder="选择日期时间" style="width:300px">
    </el-date-picker>
              </el-form-item>
              </el-col>
              <el-col :span="13"  >
            <el-form-item label="发布人" prop="issUser">
              <el-input  v-model="form.issUser"  style="width:300px"/>
              </el-form-item>
              </el-col>
              <el-col :span="13"  >
            <el-form-item label="简介" prop="noticeIntro">
              <el-input type="textarea"  v-model="form.noticeIntro" />
              </el-form-item>
              </el-col>
          <el-col :span="24"  >
            <el-form-item label="内容" prop="noticeContent">
              <editor  v-model="form.noticeContent" :min-height="192"/>
              </el-form-item>
              </el-col>
              
          
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="submitForm(0)">保存草稿</el-button>
        <el-button type="primary" @click="submitForm(1)">保存并发布</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
import JmTable from "@/components/JmTable1";
export default {
  name: "Notice",
  dicts: ['sys_notice_status', 'sys_notice_type'],
  components: { JmTable },
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
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表格列
      columns: [
        { label: '创建时间', prop: 'createTime', formType: 'datetime',formType: "daterange" },
        { label: '发布人', prop: 'issUser',  },
        { label: '标题', prop: 'noticeTitle',  },
        { label: '简介', prop: 'noticeIntro',   },
        { label: '内容', prop: 'noticeContent', formType: 'editor', showOverflowTooltip:false},
        // { label: '公告类型', prop: 'noticeType', width: '200',  },
        // { label: '状态', prop: 'status', width: '200',  },
        // { label: '创建者', prop: 'createBy', width: '200',  },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // noticeTitle: undefined,
        // createBy: undefined,
        // status: undefined
      },
      // 表单参数
      form: {
        noticeTitle:'',
        createTime:'',
        issUser:'',
        noticeIntro:'',
        noticeContent:'',
      },
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList(queryParams) {
      this.loading = true;
      console.log('queryParams',queryParams,'this.queryParams',this.queryParams)
      listNotice(queryParams||this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    changeDate(){
      console.log(arguments,22);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
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
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      getNotice(noticeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId != undefined) {
            updateNotice({...this.form,status:status}).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotice({...this.form,status:status}).then(response => {
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
      const noticeIds = row.noticeId || this.ids
      this.$modal.confirm('是否确认删除公告标题为"' + row.noticeTitle + '"的数据项？').then(function() {
        return delNotice(noticeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/notice/export', {
        ...this.queryParams
      }, `config_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
