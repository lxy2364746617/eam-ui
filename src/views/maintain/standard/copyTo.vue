<template>
    <div class="app-container2">
        <div class="container-box1">
            <div class="title" style="margin-bottom: 10px;">待复制到设备列表</div>
            <jm-table :tableData="itemList" :showSearch="false"  :showOperate="false" @handleSelectionChange="handleSelectionChange"
                :total="total" ref="jmtable" :handleWidth="230" :columns="columns">
                <template slot="headerLeft">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleAdd">添加</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete">删除</el-button>
                    </el-col>
                </template>
            </jm-table>
            <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
                <el-tab-pane label="日常点检" name="first"></el-tab-pane>
                <el-tab-pane label="精密点检" name="second"></el-tab-pane>
                <el-tab-pane label="专职点检" name="third"></el-tab-pane>
            </el-tabs>
            <div class="title">关联巡点检项</div>
            <el-table v-loading="loading" :data="standardList" ref="queryTable">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column label="巡点检项目编码" align="center" prop="itemCode" min-width="150" />
                <el-table-column label="部件" align="center" prop="partsName" min-width="200">
                    <template slot-scope="scope">
                        <span v-html="scope.row.partsName"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检内容" align="center" prop="itemContent" min-width="150" />
                <el-table-column label="巡点检点数" align="center" prop="checkNum" min-width="150">
                    <template slot-scope="scope">
                        <span v-html="scope.row.checkNum"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检状态" align="center" prop="checkStatus" min-width="150">
                    <template slot-scope="scope">
                        <span v-html="findName(dict.type.mro_s_check_status, scope.row.checkStatus)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检标准" align="center" prop="checkStandard" min-width="150">
                    <template slot-scope="scope">
                        <span v-html="scope.row.checkStandard"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检方法" align="center" prop="itemMethod" min-width="150" />
                <el-table-column label="巡点检结果类型" align="center" prop="checkResType" min-width="150">
                    <template slot-scope="scope">
                        <span v-html="findName(dict.type.mro_s_check_res_type, scope.row.checkResType)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检结果设置" align="center" prop="checkResult" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.checkResType == '模拟'">
                            <span v-html="scope.row.checkResult"></span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="定量值" align="center" prop="quotaValue" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.checkResType == '数字'">
                            <span v-html="scope.row.quotaValue"></span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="定量上限" align="center" prop="quotaUpper" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.checkResType == '数字'">
                            <span v-html="scope.row.quotaUpper"></span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="定量下限" align="center" prop="quotaLower" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.checkResType == '数字'">
                            <span v-html="scope.row.quotaLower"></span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="定量单位" align="center" prop="quotaUnit" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.checkResType == '数字'">
                            <span v-html="scope.row.quotaLower"></span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer title="选择设备" :visible.sync="drawer" direction="rtl" size="80%" :wrapperClosable="false">
                <parentdevice :isChoose="false" @submitRadio="submitRadio2"  :formData="deviceForm.disIds" @close="drawer = false" v-if="drawer">
                </parentdevice>
            </el-drawer>
        </div>
        <div class="container-box2">
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">提交</el-button>
            <el-button size="mini" @click="goback">取消</el-button>
        </div>
    </div>
</template>
          
<script>
import { getStandard, copyStandard } from "@/api/maintain/standard";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import parentdevice from '@/views/maintain/standard/selectDevice'
import { getLocationTree} from '@/api/Location'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'em_is_special', 'mro_s_check_res_type', 'mro_s_check_status'],
    components: { JmTable, JmForm, parentdevice, },
    computed: {
        // 列信息
        columns() {
            return [
                { label: "设备名称", prop: "deviceName", },
                { label: "设备编码", prop: "deviceCode", },
                { label: "规格型号", prop: "specs", },
                { label: "设备类别", prop: "categoryName", },
                { label: "功能位置", prop: "location",formType: 'selectTree', options: this.locationOptions,width:180 },
                { label: "当前使用组织", prop: "currDeptName", },
                { label: "所属组织", prop: "affDeptName", },
                { label: "是否是特种设备", prop: "isSpecial", formType: 'select', options: this.dict.type.em_is_special, tableVisible: false, span: 8, formDisabled: true, required: true, }, //(Y 是、N 否)
                { label: "状态", prop: "deviceStatus", formType: 'selectTag', options: this.dict.type.sys_normal_disable, span: 8, required: true, },
                { label: "备注", prop: "remark", span: 8, },
            ]
        },
    },
    watch: {
        standardList(newData, oldData) {
            switch (this.activeName) {
                case "first":
                    this.standardList1 = [...newData]
                    break;
                case "second":
                    this.standardList2 = [...newData]
                    break;
                case "third":
                    this.standardList3 = [...newData]
                    break;
                default:
                    break;
            }
        }
    },
    data() {
        return {
            // 遮罩层
            standardId: '',
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            btnLoading: false,
            // 总条数
            total: 0,
            // 弹出层标题
            title: "关键点检测",
            // 是否显示弹出层
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                standardId: undefined,
            },
            // 表单参数
            form: {
                deviceName: '',
                deviceCode: '',
                categoryId: '',
                isSpecial: 1,
                specs: '',
                currDeptId: '',
                affDeptId: '',
                deviceStatus: '',
                remark: ""
            },
            activeName: 'first',
            // 关联点检测项目
            standardList: [],
            standardList1: [],
            standardList2: [],
            standardList3: [],
            drawer: false,
            itemList: [],
            deviceForm:{
                disIds:[]
            },
            locationOptions:[],
        };
    },
    created() {
        this.standardId = this.$route.query.l;
        this.getDetails(this.$route.query.l);
        getLocationTree().then(res=>{
                this.locationOptions=this.getTreeName(res.data)
            })
    },
    methods: {
        submitRadio2(row) {
            this.drawer = false;
            this.itemList=this.itemList.concat(row)
        },
        handleAdd() {
            this.drawer = true;
            let disIds = this.itemList.length == 0 ? [] : this.itemList.map(item => { return item.deviceId })
            //disIds.push(this.$route.query.deviceId)
            this.deviceForm = {
                disIds: disIds
            }
        },
        getTreeName(arr){
        arr.forEach(item=>{
          item.value=item.deptId
          item.label=item.deptName
          item.isDisabled=item.locationFlag=='N'?true:false
          if(item.children&&item.children.length>0){
            this.getTreeName(item.children)
          }
        })
        return arr
    },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getStandard(queryParams).then(response => {
                let { dayMroPatrolStandardCheckList, preMroPatrolStandardCheckList, fullMroPatrolStandardCheckList, ...other } = response.data
                this.activeName = 'first';
                this.standardList = dayMroPatrolStandardCheckList || [];
                this.standardList1 = dayMroPatrolStandardCheckList || [];
                this.standardList2 = preMroPatrolStandardCheckList || [];
                this.standardList3 = fullMroPatrolStandardCheckList || [];
                this.form = response.data;
                this.loading = false;
            });
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            if(this.ids.length == 0){
                that.$modal.msgSuccess("暂无可删除项");
            }
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                let arr =  that.itemList.filter(item => {
                    return !that.ids.includes(item.deviceId)
                })
                that.itemList=[].concat(arr)
                that.ids=[]
            }).catch(() => { });
        },
        /** 切换选项卡 */
        handleClick(tab, event) {
            switch (tab.name) {
                case "first":
                    this.standardList = [...this.standardList1];
                    break;
                case "second":
                    this.standardList = [...this.standardList2];
                    break;
                case "third":
                    this.standardList = [...this.standardList3];
                    break;
                default:
                    break;
            }
            // this.$refs.itemForm.doLayout()
        },
        goback() {
            this.$store.dispatch('tagsView/delView', this.$route)  // 关闭当前页
            this.$router.go(-1)//跳回上页
        },
        /** 提交按钮 */
        submitForm() {
            let that = this;
            that.btnLoading = true;
            let data = {
                mroPatrolStandards:this.itemList||[],
                standardId:this.standardId
            }
            copyStandard(data).then(response => {
                data.standardStatus = 0;
                that.$modal.msgSuccess("新增成功");
                // this.getList();
                that.goback()
            }).catch((err) => {
                that.btnLoading = false;
            });
        },
        findName(options, value) {
            var name = ''
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == value) {
                    name = options[i].label
                }
            }
            return name || value
        },
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.deviceId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
    }
};
</script>
<style scoped lang="scss">
.app-container2 {
    position: relative;
    height: calc(100vh - 102px);
    display: flex;
    flex-direction: column;

    .container-box1 {
        padding: 20px;
        flex: 1;
        overflow-y: scroll;
    }

    .container-box2 {
        flex-shrink: 0;
        background-color: #fff;
        text-align: center;
        padding: 20px;
        border-top: 1px solid #ddd;
        z-index: 2;
    }
}

::v-deep {
    .el-select {
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
</style>
          