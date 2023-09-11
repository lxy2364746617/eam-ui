<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree :treeData="deptOptions" @handleNodeClick="handleNodeClick" style="position: fixed;top: 121px;height: calc(100vh - 141px);">
          <template slot="middle-pos">
            <el-button type="text" icon="el-icon-document-add" @click="addTreeItem"></el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="editTreeItem"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete(nowClickTreeItem)"></el-button>
          </template>
        </jm-user-tree>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <el-card shadow="never" style="margin-bottom: 20px;">
          <div slot="header">
            <span>{{ rightTitle }}</span>
          </div>
          <jm-form 
            :columns="columns" 
            :formData="formData" 
            @submitForm="submitForm" 
            @close="close" 
            :disabled="disabled">
          </jm-form>
        </el-card>
        <el-card shadow="never" v-show="disabled">
          <div slot="header">
            <span>下级信息</span>
          </div>
          <jm-table
            :tableData="deptList"
            @getList="getList"
            @handleExport="handleExport"
            :total="total"
            :columns="columns">
            <template slot="headerLeft">
              <el-col :span="1.5">
                <el-button
                  v-if="deptList.length>0"
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                >导出</el-button>
              </el-col>
            </template>
            <template slot="end_handle">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </jm-table>
        </el-card>
      </el-col>
    </el-row>
    

    <!-- 添加或修改部门对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, getDeptChild } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmUserTree from "@/components/JmUserTree";
import JmForm from "@/components/JmForm";
import JmTable from "@/components/JmTable";

export default {
  name: "Dept",
  dicts: ['sys_prt_org','sys_second_unit','sys_lease'],
  components: { Treeselect, JmUserTree, JmForm, JmTable },
  computed: {
    // 表格列
    columns() {
      return [
        { label: '部门编码', prop: 'deptCode', disabled: true,width: 120, tableVisible: true,  },
        { label: '是否产权组织', prop: 'prtOrg', formType: 'select', options:this.dict.type.sys_prt_org ,width: 100, required: true, tableVisible: true, },
        { label: '部门名称', prop: 'deptName',width: 100, required: true, tableVisible: true, },
        { label: '是否二级单位', prop: 'secondUnit',formType: 'select', options:this.dict.type.sys_second_unit ,width: 100, required: true, tableVisible: true,  },
        { label: '父级组织', prop: 'parentId', disabled: true,formType: 'selectTree', options: this.deptOptions, width: 200, tableVisible: true, },
        { label: '是否租赁公司', prop: 'lease',formType: 'select', options:this.dict.type.sys_lease , width: 200, required: true, tableVisible: true,},
        { label: '电话', prop: 'phone', width: 200, required: true, tableVisible: true, },
        { label: '邮箱', prop: 'email',width: 200, required: true, tableVisible: true, },
        { label: '地址', prop: 'address', width: 200, required: true, tableVisible: true,},
        { label: '传真', prop: 'fax',width: 200, required: true, tableVisible: true, },
      ]
    }
     
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 部门名称
      deptName: undefined,
      disabled: true,
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 点击树的基本详情
      formData: {},
      nowClickTreeItem: "",
      rightTitle: '基本信息',
      // 点击树的表格详情
      deptList: [],
      // 点击树的表格详情
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getDeptTree();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getDeptTree() {
      listDept().then(response => {
        this.deptOptions = response.data;
      });
    },
    /** 查询部门列表 */
    getList(queryParams) {
      var obj = {
        parentId: this.nowClickTreeItem.id,
        ...queryParams
      }
      getDeptChild(obj).then(response => {
        this.deptList = response.data
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 新增
    addTreeItem(){
      this.rightTitle = '新增'
      console.log(this.nowClickTreeItem,555)
      this.formData = {
        parentId:this.nowClickTreeItem.id
      }
      this.disabled = false;
    },
    editTreeItem(){
      this.rightTitle = '编辑'
      this.disabled=false
    },
    close(){
      this.rightTitle = '基本信息'
      this.disabled=true
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    // 点击树
    handleNodeClick(row){
      if(!this.disabled){
        this.$message('请退出当前编辑')
      }else{
        this.nowClickTreeItem = row
        getDept(row.id).then(response => {
          this.formData = response.data
        });
        var obj = {
          parentId: row.id
        }
        getDeptChild(obj).then(response => {
          this.deptList = response.data
        });
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
        listDeptExcludeChild(row.deptId).then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
          if (this.deptOptions.length == 0) {
            const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
            this.deptOptions.push(noResultsOptions);
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function(formdata) {
      if (formdata.deptId != undefined) {
        updateDept(formdata).then(response => {
          this.rightTitle = '基本信息'
          this.$modal.msgSuccess("修改成功");
          this.disabled = true;
          this.getDeptTree();
        });
      } else {
        addDept(formdata).then(response => {
          this.rightTitle = '基本信息'
          this.$modal.msgSuccess("新增成功");
          this.disabled = true;
          this.getDeptTree();
        });
      }
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //   }
      // });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + (row.label) + '"的数据项？').then(function() {
        return delDept(row.id);
      }).then(() => {
        this.getDeptTree();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport(queryParams) {
      var obj = {
        ...queryParams,
        parentId: this.nowClickTreeItem.id
      }
      this.download('system/dept/export', 
        obj,
       `config_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
<style scoped lang="scss">
  .eltree{
    border: 1px solid #007bfe;
    border-radius: 6px;
    padding: 15px;
    background-color: #f7fbff;
  }
</style>