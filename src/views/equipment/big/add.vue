<template>
    <div class="app-container">
        <div>
            <div class="mb20" style="background-color: #fff;">0000000</div>
            <jm-form class="mr20" :showButton="false" :columns="columns" :formData="formData" @submitForm="submitForm" ref="jmform"
                :disabled="disabled">
                <template #footer>
                    <div style="text-align: center;">
                        <el-button size="mini" @click="drawer = false">取消</el-button>
                        <el-button size="mini" @click="saveHandle" type="primary" v-if="!disabled">保存</el-button>
                    </div>
                </template>
            </jm-form>
            <div class="mb20" style="background-color: #fff;">11111111</div>
            <jm-table :tableData="formData.emArchivesParts" @getList="getList" @handleSelectionChange="handleSelectionChange"
                @switchchange="switchchange" :total="total" :handleWidth="120" :columns="tablecolumns" ref="jmTable">
                <template slot="headerLeft">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                            v-hasPermi="['equipment:template:add']">关联设备</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleImport"
                            v-hasPermi="['equipment:book:add']">导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                            v-hasPermi="['equipment:book:add']">下载</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                      <el-button
                        type="primary"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['equipment:template:remove']"
                      >解除关联</el-button>
                    </el-col>
                </template>
                <template #end_handle="scope">
                    <!-- <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-view"
                      @click="handleUpdate(scope.row,'view')"
                      v-hasPermi="['equipment:template:edit']"
                    >查看</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row, 'edit')"
                        v-hasPermi="['equipment:template:edit']">编辑</el-button>
                    <!-- <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['equipment:template:remove']"
                    >删除</el-button> -->
                    <!-- <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-document-add"
                      @click="handleSet(scope.row)"
                      v-hasPermi="['equipment:template:edit']"
                    >设置字段</el-button> -->
                </template>
            </jm-table>

            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="40%" :wrapperClosable="false"
                :before-close="handleClose">
                <jm-form class="mr20" :columns="columns" :formData="formData" @submitForm="submitForm" ref="jmform"
                    :disabled="disabled">
                    <template #footer>
                        <div style="text-align: center;">
                            <el-button size="mini" @click="drawer = false">取消</el-button>
                            <el-button size="mini" @click="saveHandle" type="primary" v-if="!disabled">保存</el-button>
                        </div>
                    </template>
                </jm-form>
            </el-drawer>

            <!-- 导入 -->
            <file-import @handleFileSuccess="handleFileSuccess" downloadTemplateUrl='' ref="fileImport"
                :importUrl="'/system/supplier/importData'">
            </file-import>
        </div>
    </div>
</template>
          
<script>
import { listlbase, getlbase, dellbase, addlbase, updatelbase, importlbase } from "@/api/equipment/big/lbase";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import child from "@/views/formTemplate/child";
import fileImport from "@/components/FileImport";
import parentdevice from "@/views/decive/book/device";

export default {
    name: "Template",
    dicts: ['system_supplier_level', 'system_supplier_type', 'system_supplier_statue'],
    components: { JmTable, JmForm, child, fileImport, parentdevice },
    computed: {
        // 列信息
        columns() {
            return [
                { label: "矿井名称", prop: "mineName", required: true, span: 8, },
                { label: "变电所名称", prop: "ssName", required: true, span: 8, },
                { label: "上级变电站", prop: "parentSsName", span: 8, },
                { label: "供电电压等级", prop: "vcc", span: 8, },
                { label: "供电距离(m)", prop: "vcm", span: 8, },
                { label: "本回电源共几基塔杆", prop: "tb", span: 8, },
                { label: "是否过采区塌陷区", prop: "isTx", span: 8, },//(Y 是、N 否)
                { label: "采空、塌陷区塔杆共几层", prop: "cTb", span: 8, },
                { label: "有无地面备用发电机", prop: "isBg", span: 8, },//(0 有、1 无)
                { label: "发电机数量", prop: "cenNo", span: 8, },
                { label: "发电机功率", prop: "cenPower", span: 8, },
                { label: "站内母线形式", prop: "mxXs", span: 8, },
                { label: "主变压器型号", prop: "motXh", span: 8, },
                { label: "主变压客量(kvVA)", prop: "motKl", span: 8, },
                { label: "主变压器运行方式", prop: "motYxfs", span: 8, },
                { label: "主变有调压", prop: "motTy", span: 8, },//(有/无)
                { label: "主变设备厂家", prop: "motCj", span: 8, },
                { label: "主变投运日期", prop: "motTyTime", span: 8, },
                { label: "高压开关电压(KV)", prop: "psV", span: 8, },
                { label: "高压开关设备型号", prop: "psXh", span: 8, },
                { label: "高压开关台数", prop: "psTs", span: 8, },
                { label: "高压开关断路器", prop: "psDlq", span: 8, },
                { label: "高压开关手车电动", prop: "psScdd", span: 8, },
                { label: "高压开关设备厂家", prop: "psCj", span: 8, },
                { label: "高压开关投运时间", prop: "psTyTime", span: 8, },
                { label: "低压开关电压 (KV)", prop: "lvsV", span: 8, },
                { label: "低压开关设备型号", prop: "lvsXh", span: 8, },
                { label: "低压开关台数", prop: "lvsTs", span: 8, },
                { label: "低压开关断路器", prop: "lvsDlq", span: 8, },
                { label: "低压开关手车电动", prop: "lvsScdd", span: 8, },//(是/否)
                { label: "低压开关设备厂家", prop: "lvsCj", span: 8, },
                { label: "低压开关投运时间", prop: "lvsTyTime", span: 8, },
                { label: "无功补偿形式", prop: "sVc", span: 8, },
                { label: "无功补偿厂家", prop: "svCj", span: 8, },
                { label: "直流电源形式", prop: "dcXs", span: 8, },
                { label: "直流电源型号", prop: "dcXh", span: 8, },
                { label: "直流电源厂家", prop: "dcCj", span: 8, },
                { label: "综自保护型号", prop: "zzXh", span: 8, },
                { label: "综自保护规约", prop: "zzGy", span: 8, },
                { label: "综自保护厂家", prop: "zzCj", span: 8, },
                { label: "五防形式", prop: "wfXs", span: 8, },
                { label: "具备无人信守条件", prop: "wrTj", span: 8, },
            ]
        },
        // 列信息
        tablecolumns() {
            return [
                { label:"设备编码", prop:"deviceCode",  },
                { label:"设备名称", prop:"deviceName",  },
                { label:"规格型号", prop:"sModel",  },
                { label:"设备类别", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions,   },
                { label:"设备状态", prop:"deviceStatus", formType: 'select', options: this.dict.type.em_device_state, },
                { label:"功能位置", prop:"location",  },
                { label:"重要等级", prop:"level", formType: 'select', options: this.dict.type.em_device_level, }, //(A、B、C)
                { label:"所属子公司", prop:"111",  },
                { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions,  },
                { label:"当前使用组织", prop:"currDeptId", formType: 'selectTree', options: this.deptOptions, },
                { label:"购置日期", prop:"makerAoTime", formType: 'date', }, 
                
            ]
        },
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            formData: {},
            nowclickitem: '',
            // 部门树选项
            deptOptions: undefined,
            categoryOptions: undefined,
            disabled: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            drawer: false,
            drawer2: false,
            direction: 'rtl',
            // 设备平台_表单模板表格数据
            templateList: [],
            // 弹出层标题
            title: "新增表单",
            // 是否显示弹出层
            open: false,
            importData: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                largeId: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
            },
        };
    },
    created() {
        this.queryParams.largeId = this.$route.query.largeId;
        this.getDetails(this.$route.query.largeId);
    },
    methods: {
        handleImport() {
            this.$refs.fileImport.upload.open = true
        },
        handleFileSuccess() {
            this.getList(this.queryParams);
        },
        uploadChange(val) {
            this.importData = val
        },
        switchchange(val, prop, row) {
            this.submitForm(row)
        },
        saveHandle() {
            this.$refs.jmform.submitForm()
        },
        saveHandle2() {
            const loading = this.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            importlbase(this.importData).then(response => {
                loading.close();
                this.$modal.msgSuccess("上传成功");
                this.getList(this.queryParams)
            });
        },
        handleClose(done) {
            done()
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getlbase(queryParams).then(response => {
                this.formData = response.data;
                if(this.formData.emArchivesParts==null){
                    this.formData.emArchivesParts = []
                }
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                templateId: null,
                templateName: null,
                templateCode: null,
                templateType: null,
                remark: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.drawer = true;
            this.title = "新增表单模板";
        },
        /** 修改按钮操作 */
        handleUpdate(row, state) {
            this.disabled = state == 'view' ? true : false
            // const id = row.id
            // getlbase(id).then(response => {
            this.formData = JSON.parse(JSON.stringify(row));
            this.title = state == 'view' ? "查看表单模板" : "修改表单模板";
            this.drawer = true;
            // });
        },
        /** 提交按钮 */
        submitForm: function (formdata) {
            if (formdata.id != undefined) {
                updatelbase(formdata).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    this.drawer = false;
                    this.getList();
                });
            } else {
                addlbase(formdata).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    this.drawer = false;
                    this.getList();
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal.confirm('是否确认删除设备平台_表单模板编号为"' + ids + '"的数据项？').then(function () {
                return dellbase(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        // 设置字段
        handleSet(row) {
            this.nowclickitem = row
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('system/supplier/export', {
                ...this.queryParams
            }, `supplier_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
          