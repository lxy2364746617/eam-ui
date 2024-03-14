<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div style="width:100%"></div>
        <jm-user-tree
          :treeData="deptOptions"
          @handleNodeClick="handleNodeClick"
          :defaultExpIds="defaultExpIds"
          :showSlot='true'
          style=" height:78vh;width:100%"
        >
          <!-- <template slot="middle-pos">
            <el-button type="text" icon="el-icon-document-add" @click="addTreeItem"></el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="editTreeItem"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete(nowClickTreeItem)"></el-button>
          </template> -->
        </jm-user-tree>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" style="max-height:78vh;overflow:auto">
        <el-card shadow="never" style="margin-bottom: 20px">
          <div slot="header">
            <span>{{ rightTitle }}</span>
          </div>
          <jm-form
            :columns="columns"
            :formData="formData"
            @submitForm="submitForm"
            @close="close"
            :disabled="disabled"
            ref="jmForm"
          >
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
            :columns="columns"
          >
            <template slot="headerLeft" slot-scope="scope">
              <el-col :span="1.5">
                <el-button
                  v-if="deptList.length > 0"
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                  v-hasPermi="['system:dept:export']"
                  >导出</el-button
                >
              </el-col>
            </template>
            <!-- <template #end_handle="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="editTreeItem2(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template> -->
          </jm-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild,
  getDeptChild,
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmUserTree from "@/components/JmUserTree";
import JmForm from "@/components/JmForm";
import JmTable from "@/components/JmTable";

export default {
  name: "Dept_Prtorg",
  dicts: ["sys_prt_org", "sys_second_unit", "sys_lease"],
  components: { Treeselect, JmUserTree, JmForm, JmTable },
  computed: {},
  data() {
    return {
      formParams: {
        prtOrg: "Y",
      },
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 部门树选项
      deptOptions: [],
      defaultExpIds:[],
      // 弹出层标题
      title: "",
      // 部门名称
      deptName: undefined,
      // 表格列
      columns: [
        { label: "部门编码", prop: "deptCode", formDisabled: true, width: 120 },
        {
          label: "是否产权组织",
          prop: "prtOrg",
          formType: "select",
          options: [],
          width: 100,
          required: true,
        },
        { label: "部门名称", prop: "deptName", width: 100, required: true },
        {
          label: "是否二级单位",
          prop: "secondUnit",
          formType: "select",
          options: [],
          width: 100,
          required: true,
        },
        {
          label: "父级组织",
          prop: "parentId",
          formDisabled: true,
          formType: "selectTree",
          options: [],
          width: 200,
        },
        {
          label: "是否租赁公司",
          prop: "lease",
          formType: "select",
          options: [],
          width: 200,
          required: true,
        },
        { label: "电话", prop: "phone", width: 200, required: true },
        { label: "邮箱", prop: "email", width: 200, required: true },
        { label: "地址", prop: "address", width: 200, required: true },
        { label: "传真", prop: "fax", width: 200, required: true },
      ],
      disabled: true,
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 点击树的基本详情
      formData: {},
      formDataInit: "",
      nowClickTreeItem: "",
      rightTitle: "基本信息",
      // 点击树的表格详情
      deptList: [],
      // 点击树的表格详情
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  async created() {
    await this.getDeptTree();
    // data赋值
    this.columns.forEach((b) => {
      if (b.prop == "prtOrg")
        this.$set(b, "options", this.dict.type.sys_prt_org);
      if (b.prop == "secondUnit")
        this.$set(b, "options", this.dict.type.sys_second_unit);
      if (b.prop == "lease") this.$set(b, "options", this.dict.type.sys_lease);
      if (b.prop == "parentId") this.$set(b, "options", this.deptOptions.concat([{id:0,label:'无上级组织'}]));
    });
  },
  methods: {
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
        //展开一二级
          let arr=[]
          this.deptOptions.forEach(item=>{
            arr.push(item.id)
          })
          this.defaultExpIds=arr
      });
    },
    /** 查询部门列表 */
    getList(queryParams) {
      var obj = {
        parentId: this.nowClickTreeItem.id,
        ...queryParams,
        ...this.formParams,
      };
      getDeptChild(obj).then((response) => {
        this.deptList = response.data;
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
        children: node.children,
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 新增
    addTreeItem() {
      this.rightTitle = "新增下级组织";
      console.log(this.nowClickTreeItem, 555);
      this.formData = {
        parentId: this.nowClickTreeItem.id,
      };
      this.disabled = false;
    },

    editTreeItem2(row) {
      this.formData = JSON.parse(JSON.stringify(row));
      this.rightTitle = "编辑";
      this.disabled = false;
    },
    editTreeItem() {
      this.rightTitle = "编辑";
      this.disabled = false;
    },
    close() {
      this.rightTitle = "基本信息";
      this.disabled = true;
      this.formData = JSON.parse(this.formDataInit);
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
        status: "0",
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
      listDept().then((response) => {
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
    handleNodeClick(row) {
      if (!this.disabled) {
        this.$message("请退出当前编辑");
      } else {
        this.nowClickTreeItem = row;

        getDept(row.id, this.formParams).then((response) => {
          this.formDataInit = JSON.stringify(response.data);
          this.formData = response.data;
          this.$refs.jmForm.clearValidate()
        });
        var obj = {
          parentId: row.id,
          ...this.formParams,
        };
        getDeptChild(obj).then((response) => {
          this.deptList = response.data;
        });
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
        listDeptExcludeChild(row.deptId, this.formParams).then((response) => {
          this.deptOptions = this.handleTree(response.data, "deptId");
          if (this.deptOptions.length == 0) {
            const noResultsOptions = {
              deptId: this.form.parentId,
              deptName: this.form.parentName,
              children: [],
            };
            this.deptOptions.push(noResultsOptions);
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      var obj = {
        ...formdata,
        ...this.formParams,
      };
      if (formdata.deptId != undefined) {
        updateDept(obj).then((response) => {
          this.rightTitle = "基本信息";
          this.$modal.msgSuccess("修改成功");
          this.disabled = true;
          this.getDeptTree();
        });
      } else {
        addDept(obj).then((response) => {
          this.rightTitle = "基本信息";
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
      var name = row.label ? row.label : row.deptName;
      var id = row.id ? row.id : row.deptId;
      this.$modal
        .confirm('是否确认删除名称为"' + name + '"的数据项？')
        .then(function () {
          return delDept(id, this.formParams);
        })
        .then(() => {
          this.getDeptTree();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport(queryParams) {
      var obj = {
        ...queryParams,
        parentId: this.nowClickTreeItem.id,
      };
      this.download(
        "system/dept/export",
        obj,
        `config_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped lang="scss">
.eltree {
  border: 1px solid #007bfe;
  border-radius: 6px;
  padding: 15px;
  background-color: #f7fbff;
}
</style>