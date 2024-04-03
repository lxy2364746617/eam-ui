<template>
  <div>
    <el-table fit :data="tableData" border>
      <el-table-column label="流程名称" align="center" prop="name" />
      <el-table-column label="流程版本" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流程分类" align="center" prop="category">
        <template slot-scope="scope">{{findName(dict.type.process_category,scope.row.category)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleStartProcess(scope.row)">发起流程</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="processTotal>0" :total="processTotal" :page.sync="queryProcessParams.pageNum" :limit.sync="queryProcessParams.pageSize" @pagination="listDefinition" />
    <el-dialog :visible="open" top="15vh" append-to-body :show-close='false'>
      <el-form ref="taskForm" :model="taskForm"  label-width="120px" >
              <el-form-item label="下级审批人" prop="nextUserIds">
                <el-tag :key="index" v-for="(item, index) in nextUser" closable :disable-transitions="false" @close="handleClose(item)">{{ item.nickName }}</el-tag>
                <el-button class="button-new-tag" type="primary" icon="el-icon-plus" size="mini" circle @click="onSelectNextUsers" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button @click="open = false">取 消</el-button>
          <el-button type="primary" @click="submitPro">确 定</el-button>
        </span>
    </el-dialog>
    <el-drawer :title="userData.title" :visible.sync="userData.open" size="50%" append-to-body>
      <el-row type="flex" :gutter="20">
        <el-col :span="20" :offset="2">
          <el-table ref="userTable" height="500" :data="userList" highlight-current-row @selection-change="handleSelectionChange">
            <el-table-column width="55" type="selection" />
            <el-table-column label="用户名" align="center" prop="userName" />
            <el-table-column label="姓名" align="center" prop="nickName" />
            <el-table-column label="岗位" align="center" prop="postName" />
            <el-table-column label="班组" align="center" prop="userGroup" />
            <el-table-column label="部门" align="center" prop="dept.deptName" />
            <el-table-column label="手机" align="center" prop="phonenumber" />
          </el-table>
          <pagination v-if="userList" :total="userList.length" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getUserList" />
        </el-col>
      </el-row>
      <span style="display:block;width:100%;text-align:center;margin-top:20px">
        <el-button @click="userData.open = false">取 消</el-button>
        <el-button type="primary" @click="submitUserData">确 定</el-button>
      </span>
    </el-drawer>
  </div>
</template>

<script>
import FlowUser from '@/components/flow/User'
import {
  userList,nextFlowNodeByStart
} from "@/api/flowable/todo";
export default {
  components: {
    FlowUser,
  },
  dicts: ["process_category"],
  name: "subprocess",
  props: {
    tableData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      taskForm:{},
      userList:[],
      userData: {
        title: "下一级审批人",
        type: "",
        open: false,
      },
      proData:null,
      open:false,
      queryProcessParams: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams:{
        pageNum: 1,
        pageSize: 10,
      },
      checkType: 'multiple',
      selectIds:null,
      checkValues:null,
      userMultipleSelection: [],
      userobj:{},
      nextUser:[]
    };
  },
  created() {},
  computed: {
    processTotal() {
      return this.tableData.length;
    },
  },
  methods: {
    onSelectNextUsers() {
      this.userData.open = true;
      this.getUserList()
      this.userMultipleSelection = this.nextUser;
    },
    submitPro(){
      if(!this.taskForm.nextUserIds) return this.$message.error('请选择下级审批人!')
      this.$confirm("确定发起流程？",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(()=>{
          let ids=this.taskForm.nextUserIds 
             this.$emit("submit", this.proData,ids) 
            this.open=false 
        })
    },
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    // 用户选中数据
    handleUserSelect(selection) {
      const that = this;
      if (selection) {
        if (selection instanceof Array) {
          const userIds = selection.map(item => item.userId);
          const nickName = selection.map(item => item.nickName);
          that.checkValues = nickName;
          that.selectIds=userIds
        } else {
          that.checkValues = selection.nickName;
          that.selectIds=selection.userId
        }
      }
    },
    handleStartProcess(row) {
      this.open=true
      this.nextUser=[]
      this.proData=row
      nextFlowNodeByStart({ deploymentId:row.deploymentId }).then(res=>{
        if(res.data){
          this.userobj = {
            flowDataType:res.data.flowDataType,
            selectUsers:res.data.assignee?res.data.assignee:res.data.candidateGroups?res.data.candidateGroups:
            res.data.candidateUsers.length>0?res.data.candidateUsers.join(','):'',
            deptId:res.data.deptId?res.data.deptId:''
          }
            const formData = new FormData();  
            Object.entries(this.userobj).forEach(([key, value]) => {  
            formData.append(key, value);
            })
          userList(formData).then(res=>{
            this.userList=res.data
          })
        }
      })
    },
    listDefinition(val) {
      this.$emit("getTableData", val);
    },
    /** 查询用户列表 */
    getUserList() {
      console.log(this.userobj)
      const formData = new FormData();  
            Object.entries(this.userobj).forEach(([key, value]) => {  
            formData.append(key, value);
            })
      userList(formData ).then((res) => {
        this.userList = res.data;
        this.toggleSelection(this.userMultipleSelection);
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userMultipleSelection = selection;
    },
    toggleSelection(selection) {
      if (selection && selection.length > 0) {
        this.$nextTick(() => {
          selection.forEach((item) => {
            let row = this.userList.find((k) => k.userId === item.userId);
            this.$refs.userTable.toggleRowSelection(row);
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.userTable.clearSelection();
        });
      }
    },
    submitUserData() {
      if (
        !this.userMultipleSelection ||
        this.userMultipleSelection.length <= 0
      ) {
        this.$modal.msgError("请选择用户");
        return false;
      }
      let userIds = this.userMultipleSelection.map((k) => k.userId);
      this.nextUser = this.userMultipleSelection;
      this.taskForm.nextUserIds = userIds instanceof Array ? userIds.join(",") : userIds;
      this.userData.open = false;
    },
    // 关闭标签
    handleClose(tag) {
      let userObj = this.userMultipleSelection.find(item => item.userId === tag.id);
      this.userMultipleSelection.splice(this.userMultipleSelection.indexOf(userObj), 1);
      this.nextUser = this.userMultipleSelection;
        // 设置抄送人ID
        if (this.nextUser && this.nextUser.length > 0) {
          const val = this.nextUser.map(item => item.id);
          this.taskForm.nextUserIds = val instanceof Array ? val.join(',') : val;
        } else {
          this.taskForm.nextUserIds = '';
        }

    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__open .el-drawer.rtl{
  padding:0 15px !important
}
::v-deep .el-dialog:not(.is-fullscreen) {
    margin-top: 30vh !important;
}
</style>