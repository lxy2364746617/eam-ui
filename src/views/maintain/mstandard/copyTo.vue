<template>
    <div class="app-container2">
        <div class="container-box1">
            <div class="title" style="margin-bottom: 10px;">待复制到设备列表</div>
            <jm-table :tableData="itemList" :showSearch="false" @handleSelectionChange="handleSelectionChange"
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
                <el-tab-pane label="日常保养" name="first"></el-tab-pane>
                <el-tab-pane label="一级保养" name="second"></el-tab-pane>
                <el-tab-pane label="二级保养" name="third"></el-tab-pane>
                <el-tab-pane label="常规润滑" name="fourth"></el-tab-pane>
            </el-tabs>
            <div class="title">关联保养检修项</div>
            <el-table v-loading="loading" :data="standardList" @selection-change="handleSelectionChange" ref="queryTable">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column label="部件" align="center" prop="partsName"></el-table-column>
                <el-table-column label="保养项编码" align="center" prop="itemCode" min-width="150" />
                <el-table-column label="保养项名称" align="center" prop="itemName" min-width="150" />
                <el-table-column label="保养部位" align="center" prop="itemArea" min-width="150" />
                <el-table-column label="保养内容" align="center" prop="itemContent" min-width="150" />
                <el-table-column label="周期" align="center" prop="checkCycle" min-width="150" />
                <el-table-column label="保养周期类别" align="center" prop="checkCycleType" min-width="150">
                    <template slot-scope="scope">
                        <span v-html="findName(dict.type.mro_m_cycle_type, scope.row.checkCycleType)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="保养标准" align="center" prop="checkStandard" min-width="150" />
                <el-table-column label="保养工具" align="center" prop="itemTool" min-width="150" />
                <el-table-column label="保养点数" align="center" prop="checkNum" min-width="150" />
            </el-table>
            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer title="选择设备" :visible.sync="drawer" direction="rtl" size="80%" :wrapperClosable="false">
                <parentdevice :isChoose="false" @submitRadio="submitRadio2" :formData="deviceForm" @close="drawer = false"
                    v-if="drawer">
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
import { getMstandard, copyStandard } from "@/api/maintain/mstandard";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import parentdevice from '@/views/device/book/device'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'em_is_special', 'mro_m_cycle_type'],
    components: { JmTable, JmForm, parentdevice, },
    computed: {
        // 列信息
        columns() {
            return [
                { label: "设备名称", prop: "deviceName", },
                { label: "设备编码", prop: "deviceCode", },
                { label: "规格型号", prop: "specs", },
                { label: "设备类别", prop: "categoryName", },
                { label: "功能位置", prop: "location", },
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
            standardList4: [],
            drawer: false,
            itemList: [],
            deviceForm: {
                disIds: []
            }
        };
    },
    created() {
        this.standardId = this.$route.query.l;
        this.getDetails(this.$route.query.l);
    },
    methods: {
        submitRadio2(row) {
            this.drawer = false;
            this.itemList = this.itemList.concat(row)
        },
        handleAdd() {
            this.drawer = true;
            let disIds = this.itemList.length == 0 ? [] : this.itemList.map(item => { return item.deviceId })
            this.deviceForm = {
                disIds: disIds
            }
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getMstandard(queryParams).then(response => {
                let { dayMroMaintainStandardCheckList, oMroMaintainStandardCheckList, tMroMaintainStandardCheckList,cMroMaintainStandardCheckList, ...other } = response.data
                this.activeName = 'first';
                this.standardList = dayMroMaintainStandardCheckList || [];
                this.standardList1 = dayMroMaintainStandardCheckList || [];
                this.standardList2 = oMroMaintainStandardCheckList || [];
                this.standardList3 = tMroMaintainStandardCheckList || [];
                this.standardList4 = cMroMaintainStandardCheckList || [];
                this.form = response.data;
                this.loading = false;
            });
        },
        /** 删除按钮操作 */
        handleDelete(scope) {
            if (this.ids.length == 0) {
                that.$modal.msgSuccess("暂无可删除项");
            }
            var that = this;
            this.$modal.confirm('是否确认删除？').then(function () {
                let arr = that.itemList.filter(item => {
                    return !that.ids.includes(item.deviceId)
                })
                that.itemList = [].concat(arr)
                that.ids = []
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
                case "fourth":
                    this.standardList = [...this.standardList4];
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
                mroMaintainStandards: this.itemList || [],
                standardId: this.standardId
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
          