<template>
    <div class="app-container">
        <div class="title">计划信息</div>
        <el-form ref="form" :model="form" label-width="140px" size="small" style="margin: 10px auto;">
            <el-row :gutter="10" style="padding: 0 40px;">
                <el-col :span="12">
                    <el-form-item label="巡点检计划编码" prop="planCode">
                        <el-input v-model="form.planCode" placeholder="请输入路线编码" disabled />
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检计划名称" prop="planName">
                        <el-input v-model="form.planName" placeholder="请输入路线名称" />
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="计划状态" prop="lineStatus">
                        <el-radio-group v-model="form.planStatus">
                            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{
                                dict.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检类型" prop="itemType">
                        <el-select v-model="form.itemType" placeholder="请选择巡点检类型">
                            <el-option v-for="dict in dict.type.mro_item_type" :key="dict.value" :label="dict.label"
                                :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="巡点检周期" prop="planCycle">
                        <el-input v-model="form.planCycle" placeholder="请输入巡点检周期" />
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
                            placeholder="请选择计划开始时间"></el-date-picker>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="计划结束时间" prop="planEndTime">
                        <el-date-picker clearable v-model="form.planEndTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择计划结束时间"></el-date-picker>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="本次执行日期" prop="thisExecuteTime">
                        <el-date-picker clearable v-model="form.thisExecuteTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择本次执行日期"></el-date-picker>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="下次执行日期" prop="nextExecuteTime">
                        <el-date-picker clearable v-model="form.nextExecuteTime" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择下次执行日期"></el-date-picker>
                    </el-form-item></el-col>

                <el-col :span="12">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" placeholder="请输入备注" />
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <div class="title">人员配置</div>
        <el-form ref="form2" :model="form" label-width="140px" size="small" style="margin: 10px auto;">
            <el-row :gutter="10" style="padding: 0 40px;">
                <el-col :span="8">
                    <el-form-item label="巡点检班组" prop="groupId">
                        <el-input v-model="form.groupId" placeholder="请输入巡点检班组" />
                    </el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item label="巡点检执行人" prop="executor">
                        <el-input v-model="form.executor" placeholder="请输入巡点检执行人" />
                    </el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item label="巡点检负责人" prop="director">
                        <el-input v-model="form.director" placeholder="请输入巡点检负责人" />
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <div class="title">巡点检路线
            <el-button type="text" icon="el-icon-edit" @click="handleAdd" style="margin-left: auto;">添加</el-button>
            <el-button type="text" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
        </div>
        <jm-table :tableData="plineList" ref="jmtable1" :columns="columns1" :showSearch="false"></jm-table>
        <!-- 添加或修改设备平台_表单模板对话框 -->
        <el-drawer title="巡点检路线" :visible.sync="plineForm.choosedrawer" direction="rtl" size="40%" :wrapperClosable="false">
            <pline :isChoose="false" @submitRadio="submitRadio2" @close="plineForm.choosedrawer = false"
              :formData="plineForm" v-if="plineForm.choosedrawer"></pline>
        </el-drawer>

        <!-- <el-drawer :title="title" :visible.sync="drawer" direction="rtl" size="80%" :wrapperClosable="false">
            <jm-table :tableData="plineList" ref="jmtable" :columns="columns">
            </jm-table>
        </el-drawer> -->

        <div style="width: 100%; height: 68px;"></div>
        <div
            style="position: absolute;bottom: 0px;width: calc(100% - 40px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 2;">
            <el-button size="mini" @click="goback">取消</el-button>
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">确定</el-button>
        </div>
    </div>
</template>
          
<script>
import { getPplan, addPplan, updatePplan, findByDeviceId, findByDeviceIdAndItemType } from "@/api/maintain/pline";
import JmTable from "@/components/JmTable";
import pline from '@/views/maintain/pplan/pline'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'mro_item_type', 'mro_plan_cycle_type', 'mro_s_check_status', 'mro_is_photo'],
    components: { JmTable, pline },
    computed: {
        columns1() {
            return [
                { label: '巡点检路线编码', prop: 'lineCode' },
                { label: '巡点检路线名称', prop: 'lineName', },
                { label: '巡点检设备数量', prop: 'deviceNum', },
                { label: '日常巡点检', prop: 'sCheckNum', },
                { label: '是否拍照', prop: 'isPhoto', formType: 'switch', options: this.dict.type.mro_is_photo, span: 24, },
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
                director: null,
                remark: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
            },
            // 关联点检测项目
            lineList: [],
            drawer: false,
            // 弹出层标题
            title: "关键点检测",
            //线路数组
            choosedrawer: false,
            plineList: [],
            selectArr: [],
            plineForm: {
                choosedrawer: false,
                disIds: []
            }
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
    },
    methods: {
        submitRadio2(row) {
            let row1=row.map(item=>{
                item.isPhoto='Y';
                return item
            })
            this.plineList = this.lineList.concat(row1)
            this.$set(this.plineForm, 'choosedrawer', false)
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getPplan(queryParams).then(response => {
                let { mroPatrolPlanLineList, ...other } = response.data;
                this.form = other;
                this.plineList = mroPatrolPlanLineList || [];
                this.loading = false;
            }).catch(() => {
                this.loading = false;
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
            this.btnLoading = true;
            let data = {
                ...this.form,
                mroPatrolPlanLineList: this.lineList.map(item => {
                    return { lineId: item.lineId, isPhoto: item.isPhoto }
                }),
            }
            if (this.planId != '' && this.planId) {
                updatePplan(data).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    this.goback()
                }).catch((err) => {
                    this.btnLoading = false;
                });
            } else {
                addPplan(data).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    // this.getList();
                    this.goback()
                }).catch((err) => {
                    this.btnLoading = false;
                });
            }
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
                    this.plineList = res.data
                    this.drawer = true;
                })
            }
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
}
</style>
          