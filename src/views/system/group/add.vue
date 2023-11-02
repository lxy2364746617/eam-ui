<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small" style>
      <div class="title">计划信息</div>
      <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
        <el-col :span="12">
          <el-form-item label="班组名称" prop="groupName" >
            <el-input v-model="form.groupName"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
        <el-col :span="12">
          <el-form-item label="班组类型" prop="groupType">
            <el-select v-model="form.groupType">
              <el-option v-for="dict in this.dict.type.system_group_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
        <el-col :span="12">
          <el-form-item label="班组负责人" prop="leaderName" >
            <el-input v-model="form.leaderName" ref="leaderName"  suffix-icon="el-icon-search" readonly  @click.native='leaderClick'/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
        <el-col :span="12">
          <el-form-item label="状态" prop="groupStatue">
            <el-radio-group v-model="form.groupStatue">
              <el-radio v-for="dict in this.dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">
                {{dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"  type="textarea" placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="title">
      班组成员信息
      <el-button type="text" icon="el-icon-edit" @click="handleAdd" style="margin-left: auto;">添加</el-button>
      <el-button type="text" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
    </div>
    <jm-table :tableData.sync="groupList" ref="jmtable1" :columns="columns" :showSearch="false" style="margin-top:20px" :rightToolbarShow="false" 
    @handleSelectionChange="handleSelectionChange">
      <template #end_handle="scope">
        <!-- <el-button size="mini" type="text" @click="showLine(scope.row)"
        v-hasPermi="['maintain:rplan:remove']">查看</el-button>-->
        <el-button size="mini" type="text" @click="handleDelete(scope)" v-hasPermi="['maintain:rplan:remove']">删除</el-button>
      </template>
    </jm-table>
    <el-drawer :title="groupItemForm.leaderShow?'选择班组负责人':'选择班组成员'" :visible.sync="groupItemForm.drawer" direction="rtl" size="80%"
                :wrapperClosable="false">
        <group-item :isChoose="groupItemForm.leaderShow" :formData="groupItemForm" @submitRadio="submitRadio1" @submitRadio2="submitRadio2"
                    @close="groupItemForm.drawer = false" ref="itemForm"  v-if="groupItemForm.drawer">
        </group-item>
    </el-drawer>
    <div style="width: 100%; height: 68px;"></div>
    <div style="position: absolute;bottom: 0px;width: calc(100% - 40px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 2;">
        <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">提交</el-button>
        <el-button size="mini" @click="goback">取消</el-button>
    </div>
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
import JmTable from "@/components/JmTable";
import groupItem from '@/views/system/group/groupItem'
export default {
    name: "Template",
    components:{JmTable,groupItem},
  dicts: [
    "sys_normal_disable",
    "system_group_type",
  ],
  computed: {
    columns() {
      return [
        { label: "用户名", prop: "userName", },
        { label: "姓名", prop: "nickName",  },
        { label: "岗位", prop: "postName" },
        { label: "联系方式", prop: "phonenumber" },
        { label: "所属组织", prop: "deptName" },
      ];
    },
  },
  data() {
    return {
      id: "",
      title:'新增成员',
      loading: true,
      btnLoading: false,
      disabled: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
      },
      // 表单参数
      form: {
        groupName:'',
        groupType:'',
        leaderId:'',
        leaderName:'',
        groupStatue:'0',
        remark:'',
        
      },
      groupList:[],
      // 表单校验
      rules: {
        groupName: [
          { required: true, message: "班组名称不能为空", trigger: "blur" },
        ],
        groupType: [
          { required: true, message: "班组类型不能为空", trigger: "blur" },
        ],
        leaderName: [
          { required: true, message: "班组负责人不能为空", trigger: "blur" },
        ],
        groupStatue: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
      },
    groupItemForm: {
        drawer: false,
        disIds: [],
        leaderShow:false
    },
    };
  },
  created() {
        this.disabled = this.$route.query.d == 'true';
        if (this.$route.query.l) {
            this.id=this.$route.query.l
            this.getDetails(this.$route.query.l);
        } else {
            this.id = '';
            this.loading = false;
        }
    },
    methods: {
        
        /** 列表 */
        getDetails(queryParams) {
            this.loading = true;
            getGroup(queryParams).then(response => {
                let { sysUserGroupList, ...other } = response.data;
                this.form = other;
                sysUserGroupList.forEach(item=>{
                  item.deptName=item.dept.deptName
                })
                this.groupList = sysUserGroupList || [];
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        /** 提交按钮 */
        submitForm() {
            let that = this;
            that.$refs['form'].validate((valid) => {
                if (valid) {
                    that.btnLoading = true;
                    let data = {
                        ...that.form,
                        /* sysUserGroupList: that.groupList.map(item => {
                            return { deviceId: item.deviceId, isPhoto: item.isPhoto }
                        }), */
                        sysUserGroupList:that.groupList,
                        fileResourceList: that.fileResourceList
                    }
                    if (that.id != '' && that.id) {
                        data.id = that.id;
                        updateGroup(data).then(response => {
                            that.$modal.msgSuccess("修改成功");
                            that.goback()
                        }).catch((err) => {
                            that.btnLoading = false;
                        });
                    } else {
                        addGroup(data).then(response => {
                            that.$modal.msgSuccess("新增成功");
                            // this.getList();
                            that.goback()
                        }).catch((err) => {
                            that.btnLoading = false;
                        });
                    }
                }
            })
        },
        handleSelectionChange(selection) {
          console.log(selection)
            this.selectArr = selection;
        },
        //选择班组负责人
        leaderClick(){
          this.$set(this.groupItemForm, 'drawer', true)
          this.$set(this.groupItemForm, 'leaderShow', true)
        },
        /** 新增按钮操作 */
        handleAdd() {
            let groupIds = this.groupList.map(item => item.userId) || [];
            this.$set(this.groupItemForm, 'disIds', groupIds)
            this.$set(this.groupItemForm, 'drawer', true)
            this.$set(this.groupItemForm, 'leaderShow', false)
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                that.groupList.splice(scope.index, 1);
            }).catch(() => {this.selectArr=[]});
        },
        allDelete() {
            var that = this;
            if (this.selectArr.length == 0) {
                this.$modal.msgSuccess("请至少选择一项");
            } else {
                this.$modal.confirm('是否确认删除？').then(function () {
                    that.groupList=that.groupList.filter(element=>{
                      return !that.selectArr.some(item=>item.userId===element.userId)
                    })
                }).catch(() => { });
            }
        },
        submitRadio1(row) {
          row.forEach(element => {
            element.deptName=element.dept.deptName
          }); 
          this.groupList = this.groupList.concat(row)
          this.$set(this.groupItemForm, 'drawer', false)
        },
        submitRadio2(row){
          console.log('submitRadio2')
          this.form.leaderId=row.userId
          this.form.leaderName=row.userName
          this.$set(this.groupItemForm, 'drawer', false)
          this.$refs.form.clearValidate(['leaderName'])
        },
        goback() {
            this.$store.dispatch('tagsView/delView', this.$route)  // 关闭当前页
            this.$router.go(-1)//跳回上页
        },
    }
};
</script>

<style scoped lang="scss">
::v-deep {
    .el-select,
    .el-date-editor {
        width: 100%;
    }

    .el-tabs__nav-scroll {
        width: 50% !important;
        margin: 0 auto !important;
    }

    .el-tabs__nav-wrap {
        padding-top: 10px;
    }

    .el-tabs__nav-wrap::after {
        top: 0;
    }

    .el-radio__inner {
        border-radius: 2px;
    }

    .el-radio__input.is-checked .el-radio__inner::after {
        content: "";
        width: 8px;
        height: 3px;
        border: 1px solid white;
        border-top: transparent;
        border-right: transparent;
        text-align: center;
        display: block;
        position: absolute;
        top: 3px;
        left: 2px;
        transform: rotate(-45deg);
        border-radius: 0px;
        background: none;
    }
}

.title {
    padding: 0 24px;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 18px;
    background: rgba(0, 116, 217, 0.08);
    justify-content: space-between;
}

.viewSpan {
    color: #007bfe;
    cursor: pointer;
    text-decoration: underline;
}
</style>