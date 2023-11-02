<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small" style="">
            <div class="title">计划信息</div>
            <el-row :gutter="10" style="padding: 0 40px; margin: 10px auto;">
                    <el-col :span="12">
                    <el-form-item label="检验计划编码" prop="planCode">
                        <el-input v-model="form.planCode"  disabled />
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="检验计划名称" prop="planName">
                        <el-input v-model="form.planName" placeholder="请输入保养计划名称" />
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="计划状态" prop="planStatus">
                        <el-radio-group v-model="form.planStatus">
                            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{
                                dict.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="检验类型" prop="itemType">
                        <el-select v-model="form.itemType" placeholder="请选择检验类型">
                            <el-option v-for="dict in dict.type.DQJY" :key="dict.value" :label="dict.label"
                                :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="检验周期" prop="planCycle">
                        <el-input-number v-model="form.planCycle" :min="1" :max="10" label="请输入保养周期"></el-input-number>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="检验周期类别" prop="planCycleType">
                        <el-select v-model="form.planCycleType" placeholder="请选择保养周期类别">
                            <el-option v-for="dict in dict.type.mro_m_cycle_type" :key="dict.value" :label="dict.label"
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
                            placeholder="请选择本次执行日期" disabled></el-date-picker>
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
                <el-col :span="8">
                    <el-form-item label="检测单位" prop="supplierId">
                        <el-select v-model="form.supplierId" placeholder="请选择检测单位" @change="changeSupplierId">
                            <el-option v-for="dict in gysArr" :key="dict.id" :label="dict.supplierName"
                                :value="dict.id"></el-option>
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item label="检测单位负责人" prop="leader">
                        <el-input v-model="form.leader" placeholder="请输入检测单位负责人"  disabled/>
                    </el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item label="内部负责人" prop="userId">
                        <el-select v-model="form.userId" placeholder="请选择内部负责人">
                            <el-option v-for="dict in userArr" :key="dict.userId" :label="dict.dickName"
                                :value="dict.userId"></el-option>
                        </el-select>
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <div class="title">设备信息
            <el-button type="text" icon="el-icon-edit" @click="handleAdd" style="margin-left: auto;">添加</el-button>
            <el-button type="text" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
        </div>
        <jm-table :tableData.sync="lineList" ref="jmtable1" :columns="columns1" :showSearch="false" 
             style="margin-top:20px" :rightToolbarShow="false" @handleSelectionChange="handleSelectionChange">
            <template #end_handle="scope">
                <!-- <el-button size="mini" type="text" @click="showLine(scope.row)"
                    v-hasPermi="['maintain:rplan:remove']">查看</el-button> -->
                <el-button size="mini" type="text" @click="handleDelete(scope)"
                    v-hasPermi="['maintain:rplan:remove']">删除</el-button>
            </template>
        </jm-table>
        <div class="title" style="margin-top: 20px;">关联文档
            <el-button type="text" @click="AddFile" v-hasPermi="['maintain:rplan:add']">上传</el-button>
        </div>
        <jm-table :tableData.sync="fileResourceList" ref="jmtable2" :columns="columns2" :showSearch="false"
            style="margin-top:20px" :rightToolbarShow="false">
            <template #end_handle="scope">
                <el-button size="mini" type="text" @click="downloadFile(scope.row)"
                    v-hasPermi="['maintain:rplan:edit']">下载</el-button>
                <el-button size="mini" type="text" @click="handleDelete2(scope.row)"
                    v-hasPermi="['maintain:rplan:remove']">删除</el-button>
                <el-button size="mini" type="text" v-if="fileType.includes(scope.row.fileType)"
                    @click="handlePreview(scope.row)" v-hasPermi="['maintain:rplan:edit']">预览</el-button>
            </template>
        </jm-table>

        <!-- 添加或修改设备平台_表单模板对话框 -->
        <el-drawer title="选择上级设备" :visible.sync="lineForm.choosedrawer" direction="rtl" size="80%" :wrapperClosable="false">
            <parentdevice :isChoose="false" @submitRadio="submitRadio2" @close="lineForm.choosedrawer = false" :formData="lineForm"
                v-if="lineForm.choosedrawer">
            </parentdevice>
        </el-drawer>


        <!-- 上传文件 -->
        <el-drawer title="选择文件" :visible.sync="filedrawer" direction="rtl" :destroy-on-close="true"
            :wrapperClosable="false">
            <file-upload :drag="true" @uploadChange="uploadChange2" :listType="'picture-card'" style="padding: 0 20px;">
            </file-upload>
        </el-drawer>

        <div style="width: 100%; height: 68px;"></div>
        <div style="position: absolute;bottom: 0px;width: calc(100% - 40px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 2;">
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">提交</el-button>
            <el-button size="mini" @click="goback">取消</el-button>
        </div>
    </div>
</template>
          
<script>
import { getRplan, addRplan, updateRplan,gysfindAll,userfindAll } from "@/api/maintain/rplan";
import { larchivesList, findByDeviceIdAndItemType } from "@/api/maintain/mline";
import { listResource, addResource, delResource } from "@/api/system/resource";
import JmTable from "@/components/JmTable";
import { login, logout, getInfo } from '@/api/login'
import parentdevice from '@/views/device/book/device'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'DQJY', 'mro_m_cycle_type', 'mro_is_photo', 'em_device_state','em_is_special'],
    components: { JmTable ,parentdevice},
    computed: {
        columns1() {
            return [
                { label: '设备名称', prop: 'deviceName', class: true },
                { label: '设备编码', prop: 'deviceCode', class: true },
                { label: '规格型号', prop: 'specs', },
                { label: '设备类别', prop: 'categoryName', },
                { label: '功能位置', prop: 'location', },
                { label: '设备批次号', prop: 'batchNo', },
                { label: '所属子公司', prop: 'subCompanyName', },
                { label: '所属组织', prop: 'affDeptName', },
                { label: '是否特种设备', prop: 'isSpecial',formType: "select",options: this.dict.type.em_is_special,span: 18, },
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
                supplierId: null,
                leader: null,
                userId: null,
                createBy: null,
                remark: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
            },
            gysArr:[],//检测单位
            userArr:[],//内部负责人
            // 弹出层标题
            title: "关键点检测",
            //线路数组
            choosedrawer: false,
            selectArr: [],
            lineForm: {
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
            username:"",
            // 表单校验
            rules: {
                planName: [
                    { required: true, message: '检验计划名称不能为空', trigger: 'blur' },
                ],
                planStatus: [
                    { required: true, message: '计划状态不能为空', trigger: 'blur' },
                ],
                itemType: [
                    { required: true, message: '检验类型不能为空', trigger: 'blur' },
                ],
                planCycle: [
                    { required: true, message: '检验周期不能为空', trigger: 'blur' },
                ],
                planCycleType: [
                    { required: true, message: '检验周期类别不能为空', trigger: 'blur' },
                ],
                planBeginTime: [
                    { required: true, message: '计划开始时间不能为空', trigger: 'blur' },
                ],
                planEndTime: [
                    { required: true, message: '计划结束时间不能为空', trigger: 'blur' },
                ],
                 /* thisExecuteTime: [
                     { required: true, message: '本次执行日期不能为空', trigger: 'blur' },
                 ], */
                nextExecuteTime: [
                    { required: true, message: '下次执行日期不能为空', trigger: 'blur' },
                ],
                /* supplierId: [
                    { required: true, message: '检测单位不能为空', trigger: 'blur' },
                ],
                leader: [
                    { required: true, message: '检测单位负责人不能为空', trigger: 'blur' },
                ], */
                userId: [
                    { required: true, message: '内部负责人不能为空', trigger: 'blur' },
                ],
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
        getInfo().then(res=>{
            this.username=res.user.userName
            this.findAll()
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
        changeSupplierId(val){
            let obj={}
            obj=this.gysArr.find(item=>{
                return item.id==val
            })
            this.form.leader=obj.contacts
        },
        submitRadio2(row) {
            this.lineList = this.lineList.concat(row)
            this.$set(this.lineForm, 'choosedrawer', false)
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getRplan(queryParams).then(response => {
                let { mroRegularPlanArchivesList, fileResourceList, ...other } = response.data;
                this.form = other;
                this.lineList = mroRegularPlanArchivesList || [];
                this.fileResourceList = fileResourceList || [];
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        findAll(){
            gysfindAll().then(res=>{
                this.gysArr=res.data
            })
            userfindAll().then(res=>{
                this.userArr=res.data
                if(!this.$route.query.l){
                   let obj={}
                   obj=this.userArr.find(item=>{
                        return item.userName==this.username
                    })
                     this.form.userId=obj.userId 
                }
            })
        },
        /** 新增按钮操作 */
        handleAdd() {
            let lineIds = this.lineList.map(item => item.deviceId) || [];
            this.$set(this.lineForm, 'disIds', lineIds)
            this.$set(this.lineForm, 'choosedrawer', true)
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                that.lineList.splice(scope.index, 1);
            }).catch(() => { });
        },
        allDelete() {
            var that = this;
            if (this.selectArr.length == 0) {
                this.$modal.msgSuccess("请至少选择一项");
            } else {
                this.$modal.confirm('是否确认删除？').then(function () {
                    that.lineList=that.lineList.filter(element=>{
                      return !that.selectArr.some(item=>item.deviceId===element.deviceId)
                    })
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
                        /* mroRegularPlanArchivesList: that.lineList.map(item => {
                            return { deviceId: item.deviceId, isPhoto: item.isPhoto }
                        }), */
                        mroRegularPlanArchivesList:that.lineList,
                        fileResourceList: that.fileResourceList
                    }
                    if (that.planId != '' && that.planId) {
                        data.planId = that.planId;
                        updateRplan(data).then(response => {
                            that.$modal.msgSuccess("修改成功");
                            that.goback()
                        }).catch((err) => {
                            that.btnLoading = false;
                        });
                    } else {
                        addRplan(data).then(response => {
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
                    case "RCBY":
                        this.title = '日常保养';
                        break;
                    case "YJBY":
                        this.title = '一级保养';
                        break;
                    case "EJBY":
                        this.title = '二级保养';
                        break;
                    case "CGRH":
                        this.title = '常规润滑';
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
        findName(options, value) {
            var name = ''
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == value) {
                    name = options[i].label
                }
            }
            return name || value
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
          