<template>
  <div class="app-container">
    <jm-table :tableData="rplanList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" @switchchange="handleStatusChange">
      <template slot="headerLeft">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['maintain:rplan:add']">新增</el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete"
            v-hasPermi="['maintain:rplan:remove']">删除</el-button>
        </el-col>
       <!--  <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['maintain:rplan:export']">导出</el-button>
        </el-col> -->
      </template>
      <template #end_handle="scope">
        <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
          v-hasPermi="['maintain:rplan:edit']">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)"
          v-hasPermi="['maintain:rplan:remove']">删除</el-button></template>
    </jm-table>
    
  </div>
</template>

<script>
import {
  listRplan,
  getRplan,
  delRplan,
  addRplan,
  updateRplan,
  changeItemStatus
} from '@/api/maintain/rplan';
import JmTable from '@/components/JmTable';

export default {
  name: "Template",
  dicts: ['mro_m_cycle_type', 'sys_normal_disable','mro_plan_cycle_type','DQJY'],
  computed: {
    // 列信息
    columns() {
      return [
        { label: '检验计划编码', prop: 'planCode', class: true },
        { label: '检验计划名称', prop: 'planName', class: true },
         { label: '计划开始时间', prop: 'planBeginTime', formType: 'daterange',width:200 },
        { label: '计划结束时间', prop: 'planEndTime', formType: 'daterange',width:200 },
        { label: '检验设备数量', prop: 'deviceNum', class: true },
        { label: '状态', prop: 'planStatus', formType: 'switch', options: this.dict.type.sys_normal_disable, span: 24, formVisible: false, },
        { label: '检测单位', prop: 'supplierName', },
        { label: '内部负责人', prop: 'headUserName', },
        //{ label: '本次执行日期', prop: 'thisExecuteTime',  },
        //{ label: '下次执行日期', prop: 'nextExecuteTime',  },
        { label: '检验周期', prop: 'planCycle', },
        { label: '检验周期类别', prop: 'planCycleType', formType: 'select', options: this.dict.type.mro_plan_cycle_type, },
        { label: '检验类型', prop: 'itemType',  formType: 'select', options: this.dict.type.DQJY, },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime', formType: 'daterange',width:200 },
        { label: '修改人', prop: 'updateBy' },
        { label: '修改时间', prop: 'updateTime', formType: 'daterange',width:200 }
      ]
    },
  },
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
      // 总条数
      total: 0,
      // 巡点检计划表格数据
      rplanList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: null,
        planCode: null,
        planName: null,
        planStatus: '0',
        itemType: null,
        planCycle: null,
        planCycleType: null,
        planBeginTime: null,
        planEndTime: null,
        thisExecuteTime: null,
        nextExecuteTime: null,
        supplierId: null,
        leader: null,
        userId: null,
        delFlag: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planId: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList(this.queryParams)
  },
  methods: {
    formatDate(date) {  
            const year = date.getFullYear();  
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以+1，并使用padStart填充至两位数  
            const day = String(date.getDate()).padStart(2, '0'); // 使用padStart填充至两位数  
            const hours = String(date.getHours()).padStart(2, '0'); // 小时  
            const minutes = String(date.getMinutes()).padStart(2, '0'); // 分钟  
            const seconds = String(date.getSeconds()).padStart(2, '0'); // 秒  
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  
        },
    /** 查询巡点检计划列表 */
    getList(queryParams) {
      this.loading = true
      listRplan(queryParams).then((response) => {
        response.rows.forEach(item=>{
          if(item.thisExecuteTime){
            let datetime=new Date(item.thisExecuteTime)
                    if(item.planCycleType=='时')  datetime.setHours(datetime.getHours()+item.planCycle) //时
                    if(item.planCycleType=='班') datetime.setDate(datetime.getDate()+1)
                    if(item.planCycleType=='天') datetime.setDate(datetime.getDate()+item.planCycle)
                    if(item.planCycleType=='周') datetime.setDate(datetime.getDate()+7*item.planCycle)
                    if(item.planCycleType=='月') {
                    let currentDate=datetime.getDate()
                    datetime = new Date(datetime.getFullYear(), datetime.getMonth() + item.planCycle, datetime.getDate())
                    if(datetime.getDate() !== currentDate){
                         datetime.setDate(0)
                    }
                    }
                    if(item.planCycleType=='年') datetime.setFullYear(datetime.getFullYear()+item.planCycle)
                    item.nextExecuteTime=new Date(datetime)>new Date(item.planEndTime) ?'':this.formatDate(datetime)
          }
        })
        this.rplanList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.planId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleStatusChange(event, prop, row) {
      let text = row.planStatus === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.planName + '"吗？')
        .then(function () {
          return changeItemStatus(row.planId, row.planStatus)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.planStatus = row.planStatus === '0' ? '1' : '0'
        })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/maintain/rplan/add', query: { l: '', d: false } })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/maintain/rplan/add', query: { l: row.planId, d: false, i: true } })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.planId != null) {
            updateRplan(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRplan(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const planIds = row.planId || this.ids
      if(row.planId||this.ids.length>0){
        this.$modal
        .confirm(!row.planId?'确认删除吗？' :'是否确认删除检验计划名称为"' + row.planName + '"的数据项？')
        .then(function () {
          return delRplan(planIds)
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
  },
}
</script>
