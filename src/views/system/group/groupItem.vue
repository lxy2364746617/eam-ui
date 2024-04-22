<template>
  <div class="app-container" style="padding-top: 0;">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree :treeData="deptOptions" @handleNodeClick="handleNodeClick" style="height: calc(100vh - 201px);">
        </jm-user-tree>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <jm-table :tableData="equipmentList" @getList="getList" @handleSelectionChange="handleSelectionChange"
          :total="total" ref="jmtable" :isRadio="isChoose" :handleWidth="230" :columns="columns">
        </jm-table>
      </el-col>


    </el-row>
    <div
      style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
  </div>
</template>

<script>
import { listBASE } from "@/api/equipment/BASE";
import { groupList,  deptTreeSelect ,deptTreeNoAnnotation} from "@/api/system/user";
import { equipmentTree } from "@/api/equipment/category";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "devicebook1",
  dicts: ['em_device_att', 'em_device_level'],
  components: { Treeselect, JmUserTree, JmTable },
  props: {
    isChoose: {
      default: true,
      type: Boolean,
    },
    formData: {
      default: () => { },
      type: Object,
    },
    isFzrFlag:{
      default:false,
      type:Boolean
    }
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "用户名", prop: "userName", class: true },
        { label: "姓名", prop: "nickName", class: true },
        /* { label: "岗位", prop: "specs" }, */
        { label: "联系方式", prop: "phonenumber" },
        { label: "所属组织", prop: "deptId",options:this.deptOptions,width:210,formType:'selectTree'},
      ]
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      checkBoxRows: [],
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
    close() {
      this.$emit('close')
    },
    submitRadio() {
      if (this.isChoose) {
        // 单选
        this.$emit('submitRadio2', this.radioRow)
      } else {
        // 多选
        this.$emit('submitRadio', this.checkBoxRows)
      }
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      var data = {
        deptId: this.queryParams.deptId,
        ...queryParams
      }
      this.isFzrFlag&&(
        data = {
        deptId: this.queryParams.deptId,
        ...queryParams,
        
        params:{
          selectUserIds:this.formData.disIds.join(','), 
          isFzrFlag:0,
          groupId:this.formData.id,
          selectDataUserIds:this.formData.selectDataUserIds
        }
      }
      )
      groupList(data).then(response => {
        // 不展示自身
        /* if (this.formData) {
          response.rows.forEach((b, i) => {
            if (b.userId == this.formData.userId) {
              response.rows.splice(i, 1)
            }
          });
          this.equipmentList = response.rows.filter(item => {
            if (this.formData.disIds.includes(item.userId)) {
              return false
            } else {
              return true
            }
          })
        }else{ */
          this.equipmentList = response.rows
        /* } */
       /*  this.equipmentList=this.equipmentList.filter(item=>{
          return item.userGroup==""
        }) */
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    /** 查询部门下拉树结构 */
    getTree() {
      deptTreeNoAnnotation().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
      console.log('this.queryParams',this.queryParams)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0]
      this.checkBoxRows = selection;
    },
    setFormLabel(arr) {
      arr.forEach(b => {
        b.label = b.fieldName;
        b.prop = b.fieldCode;
        b.required = b.required == '0' ? true : false;

      });
    },
  }
};
</script>