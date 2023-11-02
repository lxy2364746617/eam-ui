<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small" style="">
            <div class="title">计划信息</div>
            <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
                <el-col :span="12">
                    <el-form-item label="巡点检计划编码" prop="planCode">
                        <el-input v-model="form.planCode" placeholder="请输入路线编码" :disabled="true" />
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检计划名称" prop="planName">
                        <el-input v-model="form.planName" placeholder="请输入路线名称" />
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="计划状态" prop="planStatus">
                        <el-radio-group v-model="form.planStatus">
                            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{
                                dict.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检类型" prop="itemType">
                        <el-select v-model="form.itemType" placeholder="请选择巡点检类型">
                            <el-option v-for="dict in dict.type.XDJ" :key="dict.value" :label="dict.label"
                                :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检周期" prop="planCycle">
                        <el-input-number v-model="form.planCycle" :min="1" :max="10" label="请输入巡点检周期"></el-input-number>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检周期类别" prop="planCycleType">
                        <el-select v-model="form.planCycleType" placeholder="请选择巡点检周期类别">
                            <el-option v-for="dict in dict.type.mro_plan_cycle_type" :key="dict.value" :label="dict.label"
                                :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="计划开始时间" prop="planBeginTime">
                        <el-date-picker clearable v-model="form.planBeginTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择计划开始时间" :picker-options="startDatePicker"></el-date-picker>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="计划结束时间" prop="planEndTime">
                        <el-date-picker clearable v-model="form.planEndTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择计划结束时间" :picker-options="endDatePicker"></el-date-picker>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="本次执行日期" prop="thisExecuteTime">
                        <el-date-picker clearable v-model="form.thisExecuteTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择本次执行日期" :disabled="true"></el-date-picker>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="下次执行日期" prop="nextExecuteTime">
                        <el-date-picker clearable v-model="form.nextExecuteTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择下次执行日期" :disabled="(planId != '' && planId)?true:false"></el-date-picker>
                    </el-form-item></el-col>

                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
                    </el-form-item></el-col>
            </el-row>
            <div class="title">人员配置</div>
            <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
                <el-col :span="7" >
                    <el-form-item label="巡点检班组" prop="groupId">
                        <el-select v-model="form.groupId" @change="changeGroupId">
                            <el-option v-for=" item in groupOptions" :key="item.id" :label="item.groupName" 
                            :value="item.id" >
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="巡点检执行人" prop="executors">
                        <el-select v-model="form.executors" multiple>
                            <el-option v-for="item in groupMembers" :key="item.userId" :label="item.nickName" 
                            :value="item.userId" >
                            </el-option>
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="7">
                    <el-form-item label="巡点检负责人" prop="directorName">
                        <el-input v-model="form.directorName" placeholder="请输入巡点检负责人" :disabled="true" />
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <div class="title">巡点检路线
            <el-button type="text" icon="el-icon-edit" @click="handleAdd" style="margin-left: auto;">添加</el-button>
            <el-button type="text" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
        </div>
        <jm-table :tableData.sync="plineList" ref="jmtable1" :columns="columns1" :showSearch="false"
            @radiochange="radiochange" style="margin-top:20px" :rightToolbarShow="false">
            <template #end_handle="scope">
                <el-button size="mini" type="text" @click="showLine(scope.row)"
                    v-hasPermi="['maintain:pline:remove']">查看</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope)"
                    v-hasPermi="['maintain:pline:remove']">删除</el-button>
            </template>
        </jm-table>
        <div class="title" style="margin-top: 20px;">关联文档
            <el-button type="text" @click="AddFile" v-hasPermi="['maintain:pplan:add']">上传</el-button>
        </div>

        <jm-table :tableData.sync="fileResourceList" ref="jmtable2" :columns="columns2" :showSearch="false"
            style="margin-top:20px" :rightToolbarShow="false">
            <template #end_handle="scope">
                <el-button size="mini" type="text" @click="downloadFile(scope.row)"
                    v-hasPermi="['maintain:pplan:edit']">下载</el-button>
                <el-button size="mini" type="text" @click="handleDelete2(scope.row)"
                    v-hasPermi="['maintain:pplan:remove']">删除</el-button>
                <el-button size="mini" type="text" v-if="fileType.includes(scope.row.fileType)"
                    @click="handlePreview(scope.row)" v-hasPermi="['maintain:pplan:edit']">预览</el-button>
            </template>
        </jm-table>

        <!-- 添加巡点检路线 -->
        <el-drawer title="巡点检路线" :visible.sync="plineForm.choosedrawer" direction="rtl" size="40%" :wrapperClosable="false">
            <pline :isChoose="false" @submitRadio="submitRadio2" @close="plineForm.choosedrawer = false"
                :formData="plineForm" v-if="plineForm.choosedrawer"></pline>
        </el-drawer>
        <el-drawer title="关联巡点检项" :visible.sync="deviceForm.choosedrawer" direction="rtl" size="80%"
            :wrapperClosable="false">
            <el-table v-loading="deviceForm.loading" :data="deviceList" ref="queryTable2">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column label="设备编码" align="center" prop="deviceCode" min-width="150" />
                <el-table-column label="设备名称" align="center" prop="deviceName" min-width="150"></el-table-column>
                <el-table-column label="规格型号" align="center" prop="specs" min-width="150" />
                <el-table-column label="设备类别" align="center" prop="categoryName" min-width="150"></el-table-column>
                <el-table-column label="功能位置" align="center" prop="location" min-width="150"></el-table-column>
                <el-table-column label="所属子公司" align="center" prop="subCompanyName" min-width="150"></el-table-column>
                <el-table-column label="所属组织" align="center" prop="affDeptName" min-width="150" />
                <el-table-column label="设备状态" align="center" prop="deviceStatus">
                    <template slot-scope="scope">
                        <span v-html="findName(dict.type.em_device_state, scope.row.deviceStatus)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="日常点检" align="center" prop="dayNum" min-width="150">
                    <template slot-scope="scope">
                        <span class="viewSpan" @click="viewFun('RCDJ', scope.row.deviceId, scope.row.dayNum)">{{
                            scope.row.dayNum }} 浏览</span>
                    </template>
                </el-table-column>
                <el-table-column label="精密点检" align="center" prop="preNum" min-width="150">
                    <template slot-scope="scope">
                        <span class="viewSpan" @click="viewFun('JMDJ', scope.row.deviceId, scope.row.preNum)">{{
                            scope.row.preNum }} 浏览</span>
                    </template>
                </el-table-column>
                <el-table-column label="专职点检" align="center" prop="fullNum" min-width="150">
                    <template slot-scope="scope">
                        <span class="viewSpan" @click="viewFun('ZZDJ', scope.row.deviceId, scope.row.fullNum)">{{
                            scope.row.fullNum }} 浏览</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
        <el-drawer :title="title" :visible.sync="drawer" direction="rtl" size="60%" :wrapperClosable="false">
            <jm-table :tableData="lineList" ref="jmtable" :columns="columns">
            </jm-table>
        </el-drawer>


        <!-- 上传文件 -->
        <el-drawer title="选择文件" :visible.sync="filedrawer" direction="rtl" :destroy-on-close="true"
            :wrapperClosable="false">
            <file-upload :drag="true" @uploadChange="uploadChange2" :listType="'picture-card'" style="padding: 0 20px;">
            </file-upload>
        </el-drawer>

        <div style="width: 100%; height: 68px;"></div>
        <div
            style="position: absolute;bottom: 0px;width: calc(100% - 40px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 2;">
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">提交</el-button>
            <el-button size="mini" @click="goback">取消</el-button>
        </div>
    </div>
</template>
          
<script>
import { getPplan, addPplan, updatePplan, } from "@/api/maintain/pplan";
import { larchivesList, findByDeviceIdAndItemType } from "@/api/maintain/pline";
import { listResource, addResource, delResource } from "@/api/system/resource";
import {findAll,getGroup} from '@/api/system/group';
import JmTable from "@/components/JmTable";
import pline from '@/views/maintain/pplan/pline'
import { number } from 'echarts';
export default {
    name: "Template",
    dicts: ['sys_normal_disable','XDJ', 'mro_plan_cycle_type', 'mro_s_check_status', 'mro_is_photo', 'em_device_state'],
    components: { JmTable, pline },
    computed: {
        columns1() {
            return [
                { label: '巡点检路线编码', prop: 'lineCode', class: true },
                { label: '巡点检路线名称', prop: 'lineName', class: true },
                { label: '巡点检设备数量', prop: 'deviceNum', },
                { label: '日常巡点检', prop: 'sCheckNum', },
                { label: '是否拍照', prop: 'isPhoto', formType: 'radioSelect', options: this.dict.type.mro_is_photo, span: 18, },
            ]
        },
        columns2() {
            return [
                { label: '文件名', prop: 'originalFileName' },
                { label: '创建时间', prop: 'createTime', },
                { label: '创建人', prop: 'createBy', },
                { label: '文件大小', prop: 'fileSize', },
            ]
        },
        // 列信息
        columns() {
            return [
                { label: '巡点检项目编码', prop: 'itemCode' },
                { label: '部件', prop: 'partsName', },
                { label: '巡点检内容', prop: 'itemContent', },
                { label: '巡点检点数', prop: 'checkNum', },
                { label: '巡点检状态', prop: 'checkStatus', formType: 'select', options: this.dict.type.mro_s_check_status, span: 24, },
                { label: '巡点检标准', prop: 'checkStandard', },
                { label: '巡点检方法', prop: 'itemMethod', },
                { label: '巡点检结果类型', prop: 'checkResType', },
                { label: '巡点检结果设置', prop: 'checkResult', },
                { label: '定量值', prop: 'quotaValue', },
                { label: '定量上限', prop: 'quotaUpper', },
                { label: '定量下限', prop: 'quotaLower', },
                { label: '定量单位', prop: 'quotaUnit' },
            ]
        },

    },
    data() {
        return {
            // 遮罩层
            planId: '',
            loading: true,
            btnLoading: false,
            disabled: false,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                planId: undefined,
            },
            //班组选项
            groupOptions:[],
            groupMembers:[],
            // 表单参数
            form: {
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
                groupId: null,
                executor: null,
                executors:[],
                directorName: null,
                directorName:null,
                remark: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
            },
            // 弹出层标题
            title: "关键点检测",
            //线路数组
            choosedrawer: false,
            plineList: [],
            selectArr: [],
            plineForm: {
                choosedrawer: false,
                disIds: []
            },
            //设备弹窗
            deviceForm: {
                choosedrawer: false,
                loading: false,
            },
            deviceList: [],
            // 关联点检测项目
            lineList: [],
            drawer: false,
            title: '',
            //文档
            fileList: [],
            filedrawer: false,
            fileType: ['png', 'jpg', 'bmp', 'jpeg', 'pdf', 'gif'],
            fileResourceList: [],
            // 表单校验
            rules: {
                planName: [
                    { required: true, message: '巡点检计划名称不能为空', trigger: 'blur' },
                ],
                planStatus: [
                    { required: true, message: '计划状态不能为空', trigger: 'blur' },
                ],
                itemType: [
                    { required: true, message: '巡点检类型不能为空', trigger: 'blur' },
                ],
                planCycle: [
                    { required: true, message: '巡点检周期不能为空', trigger: 'blur' },
                ],
                planCycleType: [
                    { required: true, message: '巡点检周期类别不能为空', trigger: 'blur' },
                ],
                planBeginTime: [
                    { required: true, message: '计划开始时间不能为空', trigger: 'blur' },
                ],
                planEndTime: [
                    { required: true, message: '计划结束时间不能为空', trigger: 'blur' },
                ],
                // thisExecuteTime: [
                //     { required: true, message: '本次执行日期不能为空', trigger: 'blur' },
                // ],
                nextExecuteTime: [
                    { required: true, message: '下次执行日期不能为空', trigger: 'blur' },
                ],
                groupId: [
                    { required: true, message: '巡点检班组不能为空', trigger: 'blur' },
                ],
                executors: [
                    { required: true, message: '巡点检执行人不能为空', trigger: 'blur' },
                ],
                /* directorName: [
                    { required: true, message: '巡点检负责人不能为空', trigger: 'blur' },
                ], */
            },
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate(),
        };
    },
    created() {
        this.disabled = this.$route.query.d == 'true';
        if (this.$route.query.l) {
            this.planId = this.$route.query.l;
            this.getDetails(this.$route.query.l);
        } else {
            this.planId = '';
            this.loading = false;
        }
        findAll({groupType:'XDJ'}).then(res=>{
        this.groupOptions=res.data
      })
    },
    methods: {
        beginDate() {
            const self = this;
            return {
                disabledDate(time) {
                    if (
                        self.form.planEndTime != "" &&
                        self.form.planEndTime != null &&
                        self.form.planEndTime != undefined
                    ) {
                        //如果结束时间不为空，则小于结束时间
                        return new Date(self.form.planEndTime).getTime() < time.getTime();
                    } else {
                        // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                },
            };
        },
        processDate() {
            const self = this;
            return {
                disabledDate(time) {
                    if (
                        self.form.planBeginTime != "" &&
                        self.form.planBeginTime != null &&
                        self.form.planBeginTime != undefined
                    ) {
                        //如果开始时间不为空，则结束时间大于开始时间
                        return new Date(self.form.planBeginTime).getTime() > time.getTime();
                    } else {
                        // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                },
            };
        },
        submitRadio2(row) {
            let row1 = row.map(item => {
                item.isPhoto = 'Y';
                return item
            })
            this.plineList = this.plineList.concat(row1)
            this.$set(this.plineForm, 'choosedrawer', false)
        },
        //选择班组
        changeGroupId(val){
            let obj={}
            obj=this.groupOptions.find(item=>{
                return item.id==val
            })
            this.form.director=obj.leaderId
            this.form.directorName=obj.leaderName
            this.form.executors=[]
            getGroup(val).then(response=>{
               this.groupMembers= response.data.sysUserGroupList
            })
        },       
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getPplan(queryParams).then(response => {
                getGroup(response.data.groupId).then(res=>{
                this.groupMembers= res.data.sysUserGroupList
                let { mroPatrolPlanLineList, fileResourceList, ...other } = response.data;
                this.form = other;
                this.plineList = mroPatrolPlanLineList || [];
                this.fileResourceList = fileResourceList || [];
                this.loading = false;
                this.form.executors=response.data.executor.split(',').map(item=>Number(item))
                })
            }).catch(() => {
                this.loading = false
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            let lineIds = this.plineList.map(item => item.lineId) || [];
            this.$set(this.plineForm, 'disIds', lineIds)
            this.$set(this.plineForm, 'choosedrawer', true)
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                that.plineList.splice(scope.$index, 1);
            }).catch(() => { });
        },
        allDelete() {
            var that = this;
            if (this.selectArr.length == 0) {
                this.$modal.msgSuccess("请至少选择一项");
            } else {
                this.$modal.confirm('是否确认删除？').then(function () {
                    that.selectArr.forEach(element => {
                        let index = that.plineList.indexOf(element);
                        that.plineList.splice(index, 1);
                    });
                }).catch(() => { });
            }
        },
        goback() {
            this.$store.dispatch('tagsView/delView', this.$route)  // 关闭当前页
            this.$router.go(-1)//跳回上页
        },
        /** 提交按钮 */
        submitForm() {
            let that = this;
            that.$refs['form'].validate((valid) => {
                if (valid) {
                    that.btnLoading = true;
                    let data = {
                        ...that.form,
                        executor:that.form.executors.join(','),
                        mroPatrolPlanLineList: that.plineList.map(item => {
                            return { lineId: item.lineId, isPhoto: item.isPhoto }
                        }),
                        fileResourceList: that.fileResourceList
                    }
                     if (that.planId != '' && that.planId) {
                        data.planId = that.planId;
                        updatePplan(data).then(response => {
                            that.$modal.msgSuccess("修改成功");
                            that.goback()
                        }).catch((err) => {
                            that.btnLoading = false;
                        });
                    } else {
                        addPplan(data).then(response => {
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
            this.selectArr = selection;
        },
        viewFun(itemType, deviceId, num) {
            if (num == 0) {
                this.$modal.msgSuccess("浏览量为0");
            } else {
                switch (itemType) {
                    case "RCDJ":
                        this.title = '日常点检项';
                        break;
                    case "JMDJ":
                        this.title = '精密点检项';
                        break;
                    case "ZZDJ":
                        this.title = '专职点检项';
                        break;
                    default:
                        break;
                }
                let data = {
                    itemType,
                    deviceId
                }
                findByDeviceIdAndItemType(data).then(res => {
                    this.lineList = res.data
                    this.drawer = true;
                })
            }
        },
        //巡点检路线列表修改拍照状态
        radiochange(event, prop, row) {
            this.plineList.forEach((item, index) => {
                if (item.lineId == row.lineId) {
                    item.isPhoto = row.isPhoto
                }
            })
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
        //查看线路下的设备 
        showLine(row) {
            this.$set(this.deviceForm, 'loading', true)
            this.$set(this.deviceForm, 'choosedrawer', true)
            larchivesList({ lineId: row.lineId }).then(res => {
                this.deviceList = res.data || [];
                this.$set(this.deviceForm, 'loading', false)
            }).catch(() => {
                this.$set(this.deviceForm, 'loading', false)
            });
        },
        //上传文件
        AddFile() {
            this.fileList = []
            this.filedrawer = true;
        },
        uploadChange2(val) {
            this.fileResourceList = this.fileResourceList.concat(val)
            this.fileList = [];
            this.filedrawer = false
        },
        /** 删除按钮操作 */
        handleDelete2(row) {
            var name = row.originalFileName;
            let that = this;
            this.$modal.confirm('是否确认删除名称为"' + name + '"的数据项？').then(function () {
                return delResource(id);
            }).then(() => {
                that.fileResourceList.forEach((element, index) => {
                    if (element.originalFileName == row.originalFileName) {
                        that.fileResourceList.splice(index, 1);
                    }
                });
            }).catch(() => { });
        },
        downloadFile(row) {
            this.download('common/download', {
                fileName: row.fileName
            }, row.originalFileName,)
        },
        handlePreview(row) {
            window.open(process.env.VUE_APP_BASE_API + row.fileName)
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
          