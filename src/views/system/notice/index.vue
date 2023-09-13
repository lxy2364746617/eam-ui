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
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="col.span||12" v-for="col in columns" :key="col.prop" v-if="col.formVisible!=false">
            <el-form-item :label="col.label" :prop="col.prop">
              <editor v-if="col.formType=='textarea'" v-model="form.noticeContent" :min-height="192"/>
              <el-input v-else v-model="form[col.prop]" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
import JmTable from "@/components/JmTable";
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
        { label: '创建时间', prop: 'createTime', width: '120', tableVisible: true, formType: 'date', formVisible: false },
        { label: '发布人', prop: 'issUser', width: '100', tableVisible: true },
        { label: '标题', prop: 'noticeTitle', width: '100', tableVisible: true },
        { label: '简介', prop: 'noticeIntro', width: '100', tableVisible: true },
        { label: '内容', prop: 'noticeContent', width: '200', tableVisible: true, formType: 'textarea', span: 24 },
        // { label: '公告类型', prop: 'noticeType', width: '200', tableVisible: true,  },
        // { label: '状态', prop: 'status', width: '200', tableVisible: true,  },
        // { label: '创建者', prop: 'createBy', width: '200', tableVisible: true,  },
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
      form: {},
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
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotice(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(function() {
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
