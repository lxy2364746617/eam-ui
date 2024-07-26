<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
         <!-- <el-button class="btn_status" style="background:#92E182;color:#02B606;">已同意</el-button>
         <el-button class="btn_status" style="background:#F7CCCC;color:#EA0000;">已删除</el-button> -->
      </el-form-item>
      <el-form-item label="申请编号" prop="businessCode">
        <el-input
          v-model="queryParams.businessCode"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="deployTime">
        <el-date-picker clearable size="small"
                        v-model="queryParams.deployTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:deployment:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <el-empty v-if="finishedList.length==0" :image-size="200" v-loading='loading'></el-empty>
    <el-card v-for="item in finishedList" :key="item.taskId" v-loading="loading">
      <div v-if="item.processStatus" class="card_status" :style="'color:'+(item.processStatus=='completed'?'#4DCA38;':'#F15555;')+'background:'+(item.processStatus=='completed'?'#CAF6C2':'#F7CCCC')">
        {{findName(dict.type.wf_process_status,item.processStatus)}}
      </div>
      <el-col :span="8" class="card_col1">
        <img src="@/assets/images/device.svg" style="width:80px;height:80px;margin:auto 0"> 
        <div style="flex:1;margin:auto">
          <div class="card_info">
          <p>{{findName(dict.type.process_category,item.category)}}</p>
          <el-tooltip>
              <div slot="content" style="white-space:nowrap;">
                <span v-for="item in item.businessCode.split(',')" :key="item">{{ item }}<br /></span>
              </div>
              <p>{{item.businessCode.split(',')[0]+(item.businessCode.split(',')[1]?'...':'')}}</p>
            </el-tooltip>
        </div>
        </div>
        
      </el-col>
      <el-col :span="8" class="card_col2">
        <div class="card_info">
        <p>申请部门：{{item.startDeptName}}</p>
        <p>申请部门负责人：{{item.startUserName}}</p>
        <p>申请时间：{{item.createTime}}</p>
        </div>
        
      </el-col>
      <el-col :span="4" class="card_col3">
        <div class="card_info">
         <p>审核人：</p> 
         <p>{{item.assigneeName}}</p>
        </div>
        
      </el-col>
      <el-col :span="4" class="card_col4">
        <el-button type="primary"  @click="handleFlowRecord(item)">审批流程</el-button>
      </el-col>
    </el-card>
    <!-- <el-table v-loading="loading" :data="finishedList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务编号" align="center" prop="taskId" :show-overflow-tooltip="true"/>
      <el-table-column label="流程名称" align="center" prop="procDefName" :show-overflow-tooltip="true"/>
      <el-table-column label="任务节点" align="center" prop="taskName" />
      <el-table-column label="流程发起人" align="center">
        <template slot-scope="scope">
          <label>{{scope.row.startUserName}} <el-tag type="info" size="mini">{{scope.row.startDeptName}}</el-tag></label>
        </template>
      </el-table-column>
      <el-table-column label="接收时间" align="center" prop="createTime" width="180"/>
      <el-table-column label="审批时间" align="center" prop="finishTime" width="180"/>
      <el-table-column label="耗时" align="center" prop="duration" width="180"/>
      <el-table-column label="操作" width="150" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleFlowRecord(scope.row)"
          >流转记录</el-button>
           <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh-left"
            @click="handleRevoke(scope.row)"
          >撤回
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { finishedList, getDeployment, delDeployment, addDeployment, updateDeployment, exportDeployment, revokeProcess } from "@/api/flowable/finished";

export default {
  name: "Deploy",
  dicts: ['wf_process_status','process_category'],
  components: {
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
      // 已办任务列表数据
      finishedList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      src: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      categoryObj:{}
    };
  },
  watch:{
    'queryParams.deployTime':{
      handler(newVal){
        this.queryParams.beginTime=newVal[0]
        this.queryParams.endTime=newVal[1]
      }
    }
  },
  created() {
    
    this.getList();
  },
  methods: {
    findName(options,value){
        var name = ''
        for (let i = 0; i < options.length; i++) {
          if(options[i].value == value){
            name = options[i].label
          }
        }
        return name || value
      },
    /** 查询流程定义列表 */
    getList() {
      this.loading = true;
      finishedList(this.queryParams).then(response => {
        response.data.records.forEach(item=>{
          item.processStatus = item.procVars.processStatus
        })
        this.finishedList = response.data.records;
        this.total = response.data.total;
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
        id: null,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null
      };
      this.resetForm("form");
    },
    setIcon(val){
      if (val){
        return "el-icon-check";
      }else {
        return "el-icon-time";
      }

    },
    setColor(val){
      if (val){
        return "#2bc418";
      }else {
        return "#b3bdbb";
      }

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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程定义";
    },
    /** 流程流转记录 */
    handleFlowRecord(row){
      this.$router.push({ path: '/flowable/task/finished/detail/index',
        query: {
          procInsId: row.procInsId,
          deployId: row.deployId,
          taskId: row.taskId,
          businessId: row.businessId,
          batch:row.batch,
          batchId:row.businessCode
      }})
    },
    /** 撤回任务 */
    handleRevoke(row){
      const params = {
        instanceId: row.procInsId
      }
      revokeProcess(params).then( res => {
       this.$modal.msgSuccess(res.msg);
        this.getList();
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDeployment(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程定义";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDeployment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDeployment(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除流程定义编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delDeployment(ids);
      }).then(() => {
        this.getList();
       this.$modal.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有流程定义数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportDeployment(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.btn_status{
  margin: 0;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.302);
}
.btn_status:active{
  box-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.302) !important;
  border:1px solid transparent;
  transform: translateY(2px);
}
::v-deep .el-card{
  position: relative;
   height: 168px;
   margin-bottom: 10px;
   p{
     padding: 0;
     margin: 0;
   }
   .el-card__body, [class*=el-col-]{
     text-align: center;
     height: 100% !important;
   }
   .card_col1{
     display: flex;
     justify-content: space-around;
   }
   .card_col1,.card_col2,.card_col3{
     display: flex;
     justify-content: space-around;
     border-right: 1px solid #9C9393;
     
   }
   .card_col4{
     line-height: 128px;
   }
   .card_status{
     width: 86px;
     height: 42px;
     border-radius:5px ;
     position: absolute;
     top: 0;
     right: 0;
     line-height: 42px;
     text-align: center;
     font-weight: 500;
   }
   .card_info{
     height:80px;
     display:flex;
     flex-direction: column;
     justify-content: space-between;
     margin:auto 0
   }
}

</style>
