<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree 
          :treeData="deptOptions" 
          @handleNodeClick="handleNodeClick" 
          style="position: fixed;top: 121px;height: calc(100vh - 141px);">
        </jm-user-tree>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <jm-table
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="isChoose"
          :handleWidth="230"
          :columns="columns">
        </jm-table>
      </el-col>
      

    </el-row>
    <div style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
  </div>
</template>

<script>
import { listBASE } from "@/api/equipment/BASE";
import { equipmentTree } from "@/api/equipment/category";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "devicebook1",
  dicts: [],
  components: { Treeselect, JmUserTree, JmTable },
  props:{
    isChoose:{
      default:true,
      type: Boolean,
    }
  },
  computed:{
    // 列信息
    columns(){
      return [
        { label:"设备编码", prop:"deviceCode",  },
        { label:"设备名称", prop:"deviceName",  },
        { label:"规格型号", prop:"sModel",  },
        { label:"设备类别", prop:"categoryId",  },
        { label:"设备属性", prop:"deviceAtt", formType: 'select', options:[],  },  //(1 设备、2 部件)
        { label:"财务资产编码", prop:"propertyCode",  },
        { label:"功能位置", prop:"LOCATION",  },
        { label:"重要等级", prop:"LEVEL", formType: 'select', options:[],  }, //(A、B、C)
        { label:"上级设备", prop:"parentId", formType: 'select', options:[],  }, //(0 父级)
        { label:"所属组织", prop:"affDeptId",  },
        { label:"当前使用组织", prop:"currDeptId",  },
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      radioRow: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    close(){
      this.$emit('close')
    },
    submitRadio(){
      this.$emit('submitRadio',this.radioRow)
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      var data = {
        categoryId:this.queryParams.categoryId,
        ...queryParams
      }
      listBASE(data).then(response => {
          this.equipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTree() {
      equipmentTree().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      this.getCount({categoryId:this.queryParams.categoryId})
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0]
    },
    setFormLabel(arr){
      arr.forEach(b => {
        b.label=b.fieldName;
        b.prop=b.fieldCode;
        b.required = b.required=='0'?true:false;

      });
    },
  }
};
</script>