<template>
    <div class="app-container">
        <div style="min-height: calc(100vh - 210px);">
            <div class="title">基本信息</div>
            <el-form ref="form" :model="form" label-width="160px" size="small" style="margin-top: 10px;">
                <el-row :gutter="10" style="padding: 0 40px;">
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="deviceName" @click.native="form.choosedrawer = true">
                            <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编码" prop="deviceCode">
                            <el-input v-model="form.deviceCode" placeholder="请输入设备编码" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类别" prop="categoryName">
                            <el-input v-model="form.categoryName" placeholder="请输入设备类别" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="是否特种设备" prop="isSpecial">
                            <el-select v-model="form.isSpecial" disabled>
                                <el-option :label="dict.label" :value="dict.value" v-for="dict in dict.type.em_is_special"
                                    :key="dict.value">
                                </el-option>
                            </el-select>
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="功能位置" prop="location">
                            <el-input v-model="form.location" placeholder="请输入功能位置" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="规格型号" prop="specs">
                            <el-input v-model="form.specs" placeholder="请输入规格型号" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="当前使用组织" prop="currDeptName">
                            <el-input v-model="form.currDeptName" placeholder="请输入当前使用组织" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12"> <el-form-item label="所属组织" prop="affDeptName">
                            <el-input v-model="form.affDeptName" placeholder="请输入所属组织" disabled />
                        </el-form-item></el-col>
                    <!-- <el-col :span="8"><el-form-item label="状态" prop="standardStatus">
                            <el-select v-model="form.standardStatus">
                                <el-option :label="dict.label" :value="dict.value"
                                    v-for="dict in dict.type.sys_normal_disable" :key="dict.value">
                                </el-option>
                            </el-select>
                        </el-form-item></el-col> -->
                    <!-- <el-col :span="12"><el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" placeholder="请输入备注" disabled />
                        </el-form-item></el-col> -->
                </el-row>
            </el-form>
            <!-- <jm-form class="mr20" :showButton="false" :columns="columns" :formData="formData" @submitForm="submitForm"
                ref="jmform" :disabled="disabled">
            </jm-form> -->
            <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
                <el-tab-pane label="日常点检" name="first"></el-tab-pane>
                <el-tab-pane label="精密点检" name="second"></el-tab-pane>
                <el-tab-pane label="专职点检" name="third"></el-tab-pane>
            </el-tabs>
            <div class="title">关联点检测项目
                <el-button type="text" icon="el-icon-edit" @click="handleAdd">添加</el-button>
            </div>
            <el-table v-loading="loading" :data="standardList" @selection-change="handleSelectionChange" ref="queryTable">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column label="巡点检项目编码" align="center" prop="itemCode" />
                <el-table-column label="部件" align="center" prop="partsName">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.partsName" placeholder="请输入部件" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.partsName"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检内容" align="center" prop="itemContent" />
                <el-table-column label="巡点检点数" align="center" prop="checkNum">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.checkNum" placeholder="请输入巡点检点数" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.checkNum"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检状态" align="center" prop="checkStatus">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.editType" v-model="scope.row.checkStatus" placeholder="请选择巡点检结果类型"
                            clearable>
                            <el-option v-for="dict in dict.type.mro_s_check_status" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                        <span v-else v-html="findName(dict.type.mro_s_check_status, scope.row.checkStatus)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检标准" align="center" prop="checkStandard">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.checkStandard" placeholder="请输入巡点检标准" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.checkStandard"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检方法" align="center" prop="itemMethod" />
                <el-table-column label="巡点检结果类型" align="center" prop="checkResType">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.editType" v-model="scope.row.checkResType" placeholder="请选择巡点检结果类型"
                            clearable>
                            <el-option v-for="dict in dict.type.mro_s_check_res_type" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                        <span v-else v-html="findName(dict.type.mro_s_check_res_type, scope.row.checkResType)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="巡点检结果设置" align="center" prop="checkResult">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.checkResult" placeholder="请输入巡点检标准" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.checkResult"></span>
                    </template>
                </el-table-column>
                <el-table-column label="定量值" align="center" prop="quotaValue">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quotaValue" placeholder="请输入定量值" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.quotaValue"></span>
                    </template>
                </el-table-column>
                <el-table-column label="定量上限" align="center" prop="remark">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quotaUpper" placeholder="请输入定量上限" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.quotaUpper"></span>
                    </template>
                </el-table-column>
                <el-table-column label="定量下限" align="center" prop="quotaLower">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quotaLower" placeholder="请输入定量下限" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.quotaLower"></span>
                    </template>
                </el-table-column>
                <el-table-column label="定量单位" align="center" prop="quotaUnit">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quotaUnit" placeholder="请输入定量单位" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.quotaUnit"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope)"
                            v-hasPermi="['maintain:standard:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope)"
                            v-hasPermi="['maintain:standard:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer title="选择设备" :visible.sync="form.choosedrawer" direction="rtl" size="80%" :wrapperClosable="false">
                <parentdevice :isChoose="true" @submitRadio="submitRadio2" @close="form.choosedrawer = false">
                </parentdevice>
            </el-drawer>

            <el-drawer :title="title" :visible.sync="pointItemForm.drawer" direction="rtl" size="80%"
                :wrapperClosable="false">
                <pointItem :isChoose="true" :formData="pointItemForm" @submitRadio="submitRadio1"
                    @close="pointItemForm.drawer = false" ref="itemForm" v-if="pointItemForm.drawer">
                </pointItem>
            </el-drawer>
        </div>

        <div style="width: 100%; height: 68px;"></div>
        <div
            style="position: fixed;bottom: 0px;width: calc(100% - 235px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 2;">
            <el-button size="mini" @click="goback">取消</el-button>
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">确定</el-button>
        </div>
    </div>
</template>
          
<script>
import { getStandard, addStandard, updateStandard } from "@/api/maintain/standard";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import { equipmentTree } from "@/api/equipment/category";
import { listDept } from "@/api/system/dept";
import parentdevice from '@/views/device/book/device'
import pointItem from './pointItem'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'em_is_special', 'mro_s_check_res_type', 'mro_s_check_status'],
    components: { JmTable, JmForm, parentdevice, pointItem },
    computed: {
        // 列信息
        columns() {
            return [
                { label: "设备名称", prop: "deviceName", span: 8, required: true, },
                { label: "设备编码", prop: "deviceCode", span: 8, required: true, },
                { label: "设备类别", prop: "categoryId", formType: 'selectTree', options: this.categoryOptions, span: 8, required: true, },
                { label: "是否是特种设备", prop: "isSpecial", formType: 'select', options: this.dict.type.em_is_special, tableVisible: false, span: 8, formDisabled: true, required: true, }, //(Y 是、N 否)
                { label: "功能位置", prop: "location", span: 8, required: true, },
                { label: "规格型号", prop: "specs", span: 8, },
                { label: "当前使用组织", prop: "currDeptId", formType: 'selectTree', options: this.deptOptions, span: 8, required: true, },
                { label: "所属组织", prop: "afdeviceStatusfDeptId", formType: 'selectTree', options: this.deptOptions, span: 8, required: true, },
                { label: "状态", prop: "deviceStatus", formType: 'selectTag', options: this.dict.type.sys_normal_disable, span: 8, required: true, },
                { label: "备注", prop: "remark", span: 8, },
            ]
        },
        // 列信息
        tablecolumns() {
            return [
                { label: "设备编码", prop: "deviceCode", },
                { label: "设备名称", prop: "deviceName", },
                { label: "规格型号", prop: "specs", },
                { label: "设备类别", prop: "categoryId", formType: 'selectTree', options: this.categoryOptions, },
                { label: "设备状态", prop: "deviceStatus", formType: 'select', options: this.dict.type.em_device_state, },
                { label: "功能位置", prop: "location", },
                { label: "重要等级", prop: "level", formType: 'select', options: this.dict.type.em_device_level, }, //(A、B、C)
                { label: "所属子公司", prop: "111", },
                { label: "所属组织", prop: "affDeptId", formType: 'selectTree', options: this.deptOptions, },
                { label: "当前使用组织", prop: "currDeptId", formType: 'selectTree', options: this.deptOptions, },
                { label: "购置日期", prop: "makerAoTime", formType: 'date', },
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
            btnLoading: false,
            // 部门树选项
            deptOptions: [],
            categoryOptions: [],
            valueMap: {},
            disabled: false,
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
                choosedrawer: false,
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
            //选择关键点
            pointItemForm: {
                drawer: false,
                type: 'add',
                index: 0,
                disIds: []
            },
        };
    },
    created() {
        this.disabled = this.$route.query.d == 'true';
        if (this.$route.query.l) {
            this.standardId = this.$route.query.l;
            this.getDetails(this.$route.query.l);
        } else {
            this.standardId = '';
        }
        this.getTree();
        this.getTreeSelect();
        this.getList()
    },
    methods: {
        /** 查询设备档案下拉树结构 */
        getTree() {
            equipmentTree().then(response => {
                this.categoryOptions = response.data;
                // 方便获取父级tree
                this.loops(this.categoryOptions)
            });
        },
        /** 查询部门下拉树结构 */
        getTreeSelect() {
            listDept().then(response => {
                this.deptOptions = response.data;
            });
        },
        // 递归获取treeselect父节点
        loops(list, parent) {
            return (list || []).map(({ children, id, label }) => {
                const node = (this.valueMap[id] = {
                    parent,
                    label,
                    id
                });
                node.children = this.loops(children, node);
                return node;
            });
        },

        submitRadio2(row) {
            console.log(row)
            this.form = {
                ...row,
                choosedrawer: false
            };
        },
        submitRadio1(row) {
            if (this.pointItemForm.type == 'add') {
                let { ...data } = row;
                this.standardList.push(data)
            } else {
                this.standardList.splice(this.pointItemForm.index, 1, row)
            }
            Object.assign(this.$data.pointItemForm, this.$options.data().pointItemForm)
        },
        getList(queryParams) {
            this.loading = false;
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            getStandard(queryParams).then(response => {
                let { dayMroPatrolStandardCheckList, preMroPatrolStandardCheckList, fullMroPatrolStandardCheckList, ...other } = response.data
                this.activeName = 'first';
                this.standardList = dayMroPatrolStandardCheckList;
                this.standardList1 = dayMroPatrolStandardCheckList;
                this.standardList2 = preMroPatrolStandardCheckList;
                this.standardList3 = fullMroPatrolStandardCheckList;
                this.form = other;
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            let disIds1 = [...this.standardList1, ...this.standardList2, ...this.standardList3];
            let disIds2 = disIds1.length == 0 ? [] : disIds1.map(item => { return item.itemCode })
            this.pointItemForm = {
                drawer: true,
                type: 'add',
                index: 0,
                disIds: disIds2
            }
            this.$refs.queryTable.doLayout()
        },
        /** 修改按钮操作 */
        handleUpdate(scope) {
            this.$set(this.standardList[scope.$index], 'editType', this.standardList[scope.$index].editType ? false : true)
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                that.standardList.splice(scope.$index, 1);
            }).catch(() => { });
        },
        /** 切换选项卡 */
        handleClick(tab, event) {
            console.log(tab);
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
            this.$refs.itemForm.doLayout()
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
                dayMroPatrolStandardCheckList: [...this.standardList1],
                preMroPatrolStandardCheckList: [...this.standardList2],
                fullMroPatrolStandardCheckList: [...this.standardList1],
            }
            if (this.standardId != '' && this.standardId) {
                updateStandard(data).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    this.goback()
                }).catch((err) => {
                    this.btnLoading = false;
                });
            } else {
                addStandard(data).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    // this.getList();
                    this.goback()
                }).catch((err) => {
                    this.btnLoading = false;
                });
            }
        },
        handleSelectionChange() { },
        findName(options, value) {
            var name = ''
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == value) {
                    name = options[i].label
                }
            }
            return name || value
        },
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
          