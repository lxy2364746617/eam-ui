<template>
  <div class="app-container">
    <jm-table :tableData="groupList" @getList="getList" @handleSelectionChange="handleSelectionChange" 
    :total="total" ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" 
          @click="handleAdd" v-hasPermi="['system:group:add']">新增</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete"
            v-hasPermi="['maintain:group:remove']">删除</el-button>
          <el-button type="primary" icon="el-icon-download" size="mini" 
          @click="handleExport" v-hasPermi="['system:group:export']">导出</el-button>
        </el-col>
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleUpdate(scope.row)" 
        v-hasPermi="['system:group:edit']">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)" 
        v-hasPermi="['system:group:remove']">删除</el-button>
      </template>
    </jm-table>
  </div>
</template>

<script>
import {
  listGroup,
  getGroup,
  delGroup,
  addGroup,
  updateGroup,
  changeItemStatus
} from '@/api/system/group';
import { maintainType} from '@/api/knowledge'
import JmTable from "@/components/JmTable";
export default {
  name: "Template",
  components:{JmTable},
  dicts: ['sys_normal_disable','system_group_type'],
  computed: {
    columns() {
      return [
        { label: "班组名称", prop: "groupName",  },
        { label: "班组类型", prop: "groupType", formType: 'selectTree', options: this.typeOptions,disableBranchNode:true },
        { label: "班组负责人", prop: "leaderName",  },
        { label: "班组成员", prop: "userVar", showOverflowTooltip:true  },
        {
          label: "状态",
          prop: "groupStatue",
          formType: "switch",
          options: this.dict.type.sys_normal_disable,
          span: 24,
          formVisible: false,
        },
        { label: "备注", prop: "remark" },
        { label: "创建时间", prop: "createTime", formType: "daterange",width:200 },
      ];
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
      // 总条数
      total: 0,
      //表格数据
      groupList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupName:null,
        groupType:null,
        leaderName:null,
        userVar:null,
        groupStatue:null,
        remark:null,
        createTime:null,
      },
      exportIds:undefined,
      typeOptions:[]
    };
  },
 async created() {
    await  maintainType().then(res=>{
        this.typeOptions=res.data
      })
    await this.getList(this.queryParams) 
  },
  methods:{
      /** 列表 */
   async getList(queryParams) {
      this.loading = true
     await listGroup(queryParams).then((response) => {
        this.groupList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.exportIds = selection.map((item) => item.id).join(',')
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleStatusChange(event, prop, row) {
      let text = row.groupStatue === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.groupName + '"吗？')
        .then(function () {
          return changeItemStatus(row.id, row.groupStatue)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.groupStatue = row.groupStatue === '0' ? '1' : '0'
        })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/system/group/add', query: { l: '', d: false } })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/system/group/add', query: { l: row.id, d: false, i: true } })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const groupIds = row.id || this.ids
      if(row.id||this.ids.length>0){
        this.$modal
        .confirm(!row.id?'确认删除吗？' :'是否确认删除检验计划名称为"' + row.groupName + '"的数据项？')
        .then(function () {
          return delGroup(groupIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {this.ids=[]})
         
      }
      else{
        this.$modal.msgSuccess("请至少选择一项");
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/group/export',
        {
          ...this.queryParams,exportIds:this.exportIds
        },
        `group_${new Date().getTime()}.xlsx`
      )
    },
  }
};
</script>

<style>
</style>