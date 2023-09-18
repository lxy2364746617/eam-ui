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
            :labelWidth="'150px'"
            @submitForm="submitForm" 
            @close="close" 
            :disabled="disabled">
          </jm-form>
        </el-card>
      </el-col>
    </el-row>
    

  </div>
</template>

<script>
import { equipmentTree, listCategory, getCategory, delCategory, addCategory, updateCategory } from "@/api/equipment/category";
import { listTemplate } from "@/api/equipment/template";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import JmUserTree from "@/components/JmUserTree";
import JmForm from "@/components/JmForm";

export default {
  name: "Dept",
  dicts: ['em_is_special','em_is_sm'],
  components: { Treeselect, JmUserTree, JmForm, },
  computed: {
    columns(){
      return [ 
        { label: '类别名称', prop: 'categoryName',width: 100, required: true, tableVisible: true, span:24, },
        { label: '类别编码', prop: 'categoryCode', formDisabled: true,width: 100, tableVisible: true, span:24,  },
        { label: '上级编码', prop: 'parentId', formDisabled: true,formType: 'selectTree', options: this.deptOptions, width: 200, tableVisible: true, span:24, },
        { label: '是否是特种设备', prop: 'isSpecial',formType: 'radio', options: this.dict.type.em_is_special ,width: 100, required: true, tableVisible: true, span:24, },
        { label: '特种设备模板', prop: 'special',formDisabled: this.formData.isSpecial=="N",formType: 'select', options: this.special ,width: 100, tableVisible: true, span:24, },
        { label: '是否是六大设备类型', prop: 'isSm',formType: 'radio', options: this.dict.type.em_is_sm ,width: 100, required: true, tableVisible: true, span:24, },
        { label: '六大设备类型模板', prop: 'sm',formDisabled: this.formData.isSm=="N",formType: 'select', options: this.sm ,width: 100, tableVisible: true, span:24, },
        { label: '备注', prop: 'remark',width: 100, tableVisible: true, span:24, },
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
      special: [],
      sm: [],
      // 弹出层标题
      title: "",
      // 部门名称
      deptName: undefined,
      // columns: [ 
      //   { label: '类别名称', prop: 'categoryName',width: 100, required: true, tableVisible: true, span:24, },
      //   { label: '类别编码', prop: 'categoryCode', formDisabled: true,width: 100, tableVisible: true, span:24,  },
      //   { label: '上级编码', prop: 'parentId', formDisabled: true,formType: 'selectTree', options: [], width: 200, tableVisible: true, span:24, },
      //   { label: '是否是特种设备', prop: 'isSpecial',formType: 'radio', options: [] ,width: 100, required: true, tableVisible: true, span:24, },
      //   { label: '特种设备模板', prop: 'isSpecial2',formType: 'select', options: [] ,width: 100, tableVisible: true, span:24, },
      //   { label: '是否是六大设备类型', prop: 'isSm',formType: 'radio', options: [] ,width: 100, required: true, tableVisible: true, span:24, },
      //   { label: '六大设备类型模板', prop: 'isSm2',formType: 'select', options: [] ,width: 100, tableVisible: true, span:24, },
      //   { label: '备注', prop: 'remark',width: 100, tableVisible: true, span:24, },
      // ],
      disabled: true,
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 点击树的基本详情
      formDataInit: {},
      formData: {},
      nowClickTreeItem: "",
      rightTitle: '基本信息',
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
  async created() {
    this.getSelect();
    await this.getDeptTree();
    // data赋值
    // this.columns.forEach(b => {
    //   if(b.prop=='isSpecial') this.$set(b,'options',this.dict.type.em_is_special)
    //   if(b.prop=='isSm') this.$set(b,'options',this.dict.type.em_is_sm)
    //   if(b.prop=='parentId') this.$set(b,'options',this.deptOptions)
    //   if(b.prop=='isSpecial2') this.$set(b,'formDisabled',this.formData.isSpecial)
    // });
  },
  mounted(){
    
  },
  methods: {
    getSelect(){
      var obj = {
        pageNum: 1,
        pageSize: 10000,
      }
      var obj2 = {
        ...obj,
        templateType: 'T'
      }
      var obj3 = {
        ...obj,
        templateType: 'Z'
      }
      listTemplate(obj2).then(response => {
        this.special = response.rows;
        this.special.forEach(b => {
          b.label = b.templateName
          b.value = b.templateId
        });
      });
      listTemplate(obj3).then(response => {
        this.sm = response.rows;
        this.sm.forEach(b => {
          b.label = b.templateName
          b.value = b.templateId
        });
      });
    },
    
    setColumns(prop,val){
      this.columns.forEach(b => {
        if(b.prop==prop) Object.assign(b,val)
      });
    },
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      // await listCategory().then(response => {
      //   this.forfn(response.rows)
      //   this.deptOptions = response.rows;
      // });
      await equipmentTree().then(response => {
        // this.forfn(response.rows)
        this.deptOptions = response.data;
      });
    },
    // forfn(options){
    //   for (let i = 0; i < options.length; i++) {
    //     options[i].label = options[i].categoryName
    //     options[i].id = options[i].categoryId
    //     if(options[i].children){
    //       this.forfn(options[i].children)
    //     }
    //   }
    // },
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
      this.rightTitle = '新增下级组织'
      console.log(this.nowClickTreeItem,555)
      this.formData = {
        parentId:this.nowClickTreeItem.id || 0
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
      this.formData = JSON.parse(this.formDataInit)
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
      listCategory().then(response => {
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
        this.getCategoryFn()
      }
    },
    getCategoryFn(){
      getCategory(this.nowClickTreeItem.id).then(response => {
        this.formDataInit = JSON.stringify(response.data)
        this.formData = response.data
      });
    },
    /** 提交按钮 */
    submitForm: function(formdata) {
      if (formdata.categoryId != undefined) {
        updateCategory(formdata).then(response => {
          this.rightTitle = '基本信息'
          this.$modal.msgSuccess("修改成功");
          this.disabled = true;
          this.getCategoryFn()
        });
      } else {
        addCategory(formdata).then(response => {
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
      var name = row.label?row.label:row.deptName;
      var id = row.id?row.id:row.deptId;
      this.$modal.confirm('是否确认删除名称为"' + name + '"的数据项？').then(function() {
        return delCategory(id);
      }).then(() => {
        this.getDeptTree();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
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