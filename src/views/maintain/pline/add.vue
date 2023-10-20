<template>
    <div class="app-container">
        <div class="title">巡点检路线名称</div>
        <el-form ref="form" :model="form" label-width="140px" size="small" style="margin: 10px auto;">
            <el-row :gutter="10" style="padding: 0 20px;">
                <el-col :span="8">
                    <el-form-item label="路线编码" prop="lineCode">
                        <el-input v-model="form.lineCode" placeholder="请输入路线编码" disabled />
                    </el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item label="路线名称" prop="lineName">
                        <el-input v-model="form.lineName" placeholder="请输入路线名称" />
                    </el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item label="状态" prop="lineStatus">
                        <el-select v-model="form.lineStatus" placeholder="请选择状态">
                            <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <div class="title">关联巡点检项
            <el-button type="text" icon="el-icon-edit" @click="handleAdd" style="margin-left: auto;">添加</el-button>
            <el-button type="text" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
        </div>
        <el-table v-loading="loading" :data="lineList" @selection-change="handleSelectionChange" ref="queryTable">
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
                        scope.row.dayNum }}_浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="精密点检" align="center" prop="preNum" min-width="150">
                <template slot-scope="scope">
                    <span class="viewSpan" @click="viewFun('JMDJ', scope.row.deviceId, scope.row.preNum)">{{
                        scope.row.preNum }}_浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="专职点检" align="center" prop="fullNum" min-width="150">
                <template slot-scope="scope">
                    <span class="viewSpan" @click="viewFun('ZZDJ', scope.row.deviceId, scope.row.fullNum)">{{
                        scope.row.fullNum }}_浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="150">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope)"
                        v-hasPermi="['maintain:pline:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改设备平台_表单模板对话框 -->
        <el-drawer title="选择设备" :visible.sync="form.choosedrawer" direction="rtl" size="80%" :wrapperClosable="false">
            <parentdevice :isChoose="false" @submitRadio="submitRadio2" @close="form.choosedrawer = false">
            </parentdevice>
        </el-drawer>

        <el-drawer :title="title" :visible.sync="drawer" direction="rtl" size="80%" :wrapperClosable="false">
            <jm-table :tableData="plineList" ref="jmtable" :columns="columns">
            </jm-table>
        </el-drawer>

        <div style="width: 100%; height: 68px;"></div>
        <div
            style="position: absolute;bottom: 0px;width: calc(100% - 40px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 2;">
            <el-button size="mini" @click="goback">取消</el-button>
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">确定</el-button>
        </div>
    </div>
</template>
          
<script>
import { getPline, addPline, updatePline, findByDeviceId, findByDeviceIdAndItemType, larchivesList } from "@/api/maintain/pline";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import parentdevice from '@/views/device/book/device'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'em_device_state', 'mro_s_check_status'],
    components: { JmTable, JmForm, parentdevice },
    computed: {
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
            lineId: '',
            loading: true,
            btnLoading: false,
            disabled: false,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                lineId: undefined,
            },
            // 表单参数
            form: {
                choosedrawer: false,
                lineCode: '',
                lineName: '',
                lineStatus: '',
                lineId: 1,
            },
            // 关联点检测项目
            lineList: [],
            drawer: false,
            // 弹出层标题
            title: "关键点检测",
            plineList: [],
            selectArr: []
        };
    },
    created() {
        this.disabled = this.$route.query.d == 'true';
        if (this.$route.query.l) {
            this.lineId = this.$route.query.l;
            this.getDetails(this.$route.query.l);
        } else {
            this.lineId = '';
            this.loading = false;
        }
    },
    methods: {
        submitRadio2(row) {
            let deviceIds = row.map(item => item.deviceId);
            let formData = new FormData();
            formData.append('deviceIds', deviceIds.toString());
            // Object.keys(data).forEach((key) => {
            //     formData.append(key, data[key]);
            // });
            findByDeviceId(formData).then(res => {
                this.lineList = this.lineList.concat(res.data)
            })
            this.$set(this.form, 'choosedrawer', false)
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getPline(queryParams).then(response => {
                this.form = response.data;
                // if (mroPatrolLineArchivesList.length > 0) {
                    larchivesList({ lineId:this.form.lineId} ).then(res => {
                        this.lineList = res.data || [];
                    })
                // }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$set(this.form, 'choosedrawer', true)
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                that.lineList.splice(scope.$index, 1);
            }).catch(() => { });
        },
        allDelete() {
            var that = this;
            if (this.selectArr.length == 0) {
                this.$modal.msgSuccess("请至少选择一项");
            } else {
                this.$modal.confirm('是否确认删除？').then(function () {
                    that.selectArr.forEach(element => {
                        let index = that.lineList.indexOf(element);
                        that.lineList.splice(index, 1);
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
                mroPatrolLineArchivesList: this.lineList.map(item => {
                    return { deviceId: item.deviceId }
                }),
            }
            if (this.lineId != '' && this.lineId) {
                updatePline(data).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    this.goback()
                }).catch((err) => {
                    this.btnLoading = false;
                });
            } else {
                addPline(data).then(response => {
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
        findName(options, value) {
            var name = ''
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == value) {
                    name = options[i].label
                }
            }
            return name || value
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
        }

    }
};
</script>
<style scoped lang="scss">
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

.viewSpan {
    color: #007bfe;
    cursor: pointer;
}
</style>
          