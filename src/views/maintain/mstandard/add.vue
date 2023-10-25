<template>
    <div class="app-container2">
        <div class="container-box1">
            <div class="title">设备信息</div>
            <el-form ref="form" :model="form" label-width="140px" :rules="rules" size="small"
                style="margin: 10px auto; width: 70%;">
                <el-row :gutter="10" style="padding: 0 40px;">
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="deviceName" @click.native="openSb">
                            <el-input v-model="form.deviceName" placeholder="请输入设备名称">
                                <i slot="suffix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编码" prop="deviceCode">
                            <el-input v-model="form.deviceCode" placeholder="请输入设备编码" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="设备规格" prop="specs">
                            <el-input v-model="form.specs" placeholder="请输入规格型号" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类别" prop="categoryName">
                            <el-input v-model="form.categoryName" placeholder="请输入设备类别" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="功能位置(工作面)" prop="location">
                            <el-input v-model="form.location" placeholder="请输入功能位置" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12"> <el-form-item label="所属组织" prop="affDeptName">
                            <el-input v-model="form.affDeptName" placeholder="请输入所属组织" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="当前使用组织" prop="currDeptName">
                            <el-input v-model="form.currDeptName" placeholder="请输入当前使用组织" disabled />
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="是否特种设备" prop="isSpecial">
                            <el-radio disabled v-model="form.isSpecial" :label="dict.value"
                                v-for="dict in dict.type.em_is_special" :key="dict.value">{{ dict.label }}</el-radio>
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
                <el-tab-pane label="日常保养" name="first"></el-tab-pane>
                <el-tab-pane label="一级保养" name="second"></el-tab-pane>
                <el-tab-pane label="二级保养" name="third"></el-tab-pane>
                <el-tab-pane label="常规润滑" name="fourth"></el-tab-pane>
            </el-tabs>
            <div class="title">关联保养检修项
                <el-button type="text" icon="el-icon-edit" @click="handleAdd">添加</el-button>
            </div>
            <el-table v-loading="loading" :data="standardList" @selection-change="handleSelectionChange" ref="queryTable">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column label="部件" align="center" prop="partsName">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.partsName" placeholder="请输入部件" v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.partsName"></span>
                    </template>
                </el-table-column>
                <el-table-column label="保养项编码" align="center" prop="itemCode" min-width="150" />
                <el-table-column label="保养项名称" align="center" prop="itemName" min-width="150" />
                <el-table-column label="保养部位" align="center" prop="itemArea" min-width="150" />
                <el-table-column label="保养内容" align="center" prop="itemContent" min-width="150" />
                <el-table-column label="周期" align="center" prop="checkCycle" min-width="150">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.checkCycle" placeholder="请输入周期"
                            v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.checkCycle"></span>
                    </template>
                </el-table-column>
                <el-table-column label="保养周期类别" align="center" prop="checkCycleType" min-width="150">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.editType" v-model="scope.row.checkCycleType" placeholder="请选择保养周期类别"
                            clearable>
                            <el-option v-for="dict in dict.type.mro_m_cycle_type" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                        <span v-else v-html="findName(dict.type.mro_m_cycle_type, scope.row.checkCycleType)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="保养标准" align="center" prop="checkStandard" min-width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.checkStandard" placeholder="请输入保养标准"
                            v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.checkStandard"></span>
                    </template>
                </el-table-column>
                <el-table-column label="保养工具" align="center" prop="itemTool" min-width="150" />
                <el-table-column label="保养点数" align="center" prop="checkNum" min-width="150">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.checkNum" placeholder="请输入保养点数"
                            v-if="scope.row.editType" />
                        <span v-else v-html="scope.row.checkNum"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right"
                    min-width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUpdate(scope)"
                            v-hasPermi="['maintain:mstandard:edit']">{{ scope.row.editType ? '保存' : '编辑' }}</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope)"
                            v-hasPermi="['maintain:mstandard:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer title="选择设备" :visible.sync="form.choosedrawer" direction="rtl" size="80%" :wrapperClosable="false">
                <parentdevice :isChoose="true" @submitRadio="submitRadio2" @close="form.choosedrawer = false">
                </parentdevice>
            </el-drawer>

            <el-drawer :title="title" :visible.sync="pointItemForm.drawer" direction="rtl" size="40%"
                :wrapperClosable="false">
                <pointItem :isChoose="false" :formData="pointItemForm" @submitRadio="submitRadio1"
                    @close="pointItemForm.drawer = false" ref="itemForm" v-if="pointItemForm.drawer">
                </pointItem>
            </el-drawer>
        </div>

        <div class="container-box2">
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">提交</el-button>
            <el-button size="mini" @click="goback">取消</el-button>
        </div>
    </div>
</template>
          
<script>
import { getMstandard, addMstandard, updateMstandard } from "@/api/maintain/mstandard";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import { equipmentTree } from "@/api/equipment/category";
import { listDept } from "@/api/system/dept";
import parentdevice from '@/views/device/book/device'
import pointItem from '@/views/maintain/mstandard/pointItem'
import { number } from 'echarts';
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'em_is_special', 'mro_m_cycle_type'],
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
                case "fourth":
                    this.standardList4 = [...newData]
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
            standardList4: [],
            //选择关键点
            pointItemForm: {
                drawer: false,
                type: 'add',
                index: 0,
                disIds: []
            },
            // 表单校验
            rules: {
                deviceName: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' },
                ],
                deviceCode: [
                    { required: true, message: '设备编码不能为空', trigger: 'blur' },
                ],
                specs: [
                    { required: true, message: '设备规格不能为空', trigger: 'blur' },
                ],
                categoryName: [
                    { required: true, message: '设备类别不能为空', trigger: 'blur' },
                ],
                location: [
                    { required: true, message: '功能位置(工作面)不能为空', trigger: 'blur' },
                ],
                affDeptName: [
                    { required: true, message: '所属组织不能为空', trigger: 'blur' },
                ],
                currDeptName: [
                    { required: true, message: '当前使用组织不能为空', trigger: 'blur' },
                ],
                isSpecial: [
                    { required: true, message: '是否特种设备不能为空', trigger: 'blur' },
                ],
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
            this.form = {
                ...row,
                // choosedrawer: false
            };
            this.$set(this.form, 'choosedrawer', false)
        },
        submitRadio1(row) {
            if (this.pointItemForm.type == 'add') {
                this.standardList = this.standardList.concat(row)
            } else {
                this.standardList.splice(this.pointItemForm.index, 1, row)
            }
            Object.assign(this.$data.pointItemForm, this.$options.data().pointItemForm)
        },
        openSb() {
            this.$set(this.form, 'choosedrawer', true)
        },
        getList(queryParams) {
            this.loading = false;
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            getMstandard(queryParams).then(response => {
                let { dayMroMaintainStandardCheckList, oMroMaintainStandardCheckList, tMroMaintainStandardCheckList,cMroMaintainStandardCheckList, ...other } = response.data
                this.activeName = 'first';
                this.standardList = dayMroMaintainStandardCheckList || [];
                this.standardList1 = dayMroMaintainStandardCheckList || [];
                this.standardList2 = oMroMaintainStandardCheckList || [];
                this.standardList3 = tMroMaintainStandardCheckList || [];
                this.standardList4 = cMroMaintainStandardCheckList || [];
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
            let disIds = this.standardList.length == 0 ? [] : this.standardList.map(item => { return item.itemCode })
            this.pointItemForm = {
                drawer: true,
                type: 'add',
                index: 0,
                disIds: disIds
            }
            this.$forceUpdate()
            // this.$refs.queryTable.doLayout()
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
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    that.btnLoading = true;
                    let data = {
                        ...that.form,
                        dayMroMaintainStandardCheckList: [...that.standardList1] || [],
                        oMroMaintainStandardCheckList: [...that.standardList2] || [],
                        tMroMaintainStandardCheckList: [...that.standardList3] || [],
                        cMroMaintainStandardCheckList: [...that.standardList4] || [],
                    }
                    if (that.standardId != '' && that.standardId) {
                        data.standardId = that.standardId;
                        updateMstandard(data).then(response => {
                            that.$modal.msgSuccess("修改成功");
                            that.goback()
                        }).catch((err) => {
                            that.btnLoading = false;
                        });
                    } else {
                        addMstandard(data).then(response => {
                            data.standardStatus = 0;
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
        UpperFun(e, quotaLower) {
            console.log(e)
            if (e.target.value - quotaLower < 0) {
                e.target.value = quotaLower;
                this.standardList.splice(1, 0)
            }
        },
        LowerFun(event, quotaUpper) {
            if (event.target.value - quotaUpper > 0) {
                event.target.value = quotaUpper;
                this.standardList.splice(1, 0)
            }
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
          