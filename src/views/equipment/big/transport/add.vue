<template>
    <div class="app-container">
        <div>
            <div class="mb20" style="background-color: #fff;">基本信息</div>
            <jm-form class="mr20" :showButton="false" :columns="columns" :formData="formData" @submitForm="submitForm"
                ref="jmform" :disabled="disabled">
            </jm-form>
            <div class="mb20" style="background-color: #fff;">详细设备信息</div>
            <jm-table :tableData="formData.emArchivesParts" @getList="getList"
                @handleSelectionChange="handleSelectionChange" @switchchange="switchchange" :total="total"
                :handleWidth="120" :columns="tablecolumns" ref="jmTable">
                <template slot="headerLeft" v-if="!disabled">
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
                        <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple"
                            @click="handleDelete" v-hasPermi="['equipment:template:remove']">解除关联</el-button>
                    </el-col>
                </template>
                <template #end_handle="scope" v-if="!disabled">
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

            <div style="text-align: center;margin-top: 20px;" v-if="!disabled">
                <el-button size="mini" @click="goback">取消</el-button>
                <el-button size="mini" @click="saveHandle" type="primary">保存</el-button>
            </div>

            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer title="选择上级设备" :visible.sync="drawer" direction="rtl" :destroy-on-close="true" size="80%"
                :wrapperClosable="false">
                <parentdevice @submitRadio="submitRadio" @close="close" :isChoose="false"></parentdevice>
            </el-drawer>

            <!-- 导入 -->
            <file-import @handleFileSuccess="handleFileSuccess" downloadTemplateUrl='' ref="fileImport"
                :importUrl="'/system/supplier/importData'">
            </file-import>
        </div>
    </div>
</template>
          
<script>
import { listTransport, getTransport, delTransport, addTransport, updateTransport, importTransport } from "@/api/equipment/big/transport";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import child from "@/views/formTemplate/child";
import fileImport from "@/components/FileImport";
import parentdevice from "@/views/decive/book/device";
import { equipmentTree } from "@/api/equipment/category";
import { listDept } from "@/api/system/dept";

export default {
    name: "Template",
    dicts: ['em_device_state', 'em_device_level','equipment_large_have','equipment_large_base','equipment_large_switch'],
    components: { JmTable, JmForm, child, fileImport, parentdevice },
    computed: {
        // 列信息
        columns() {
            return [
            { label:"矿井名称", prop:"mineName", span: 8, required: true, },
{ label:"产品名称", prop:"productName", span: 8, },
{ label:"设备类型", prop:"deviceType", span: 8, },
{ label:"型号", prop:"model", span: 8, },
{ label:"运输能力", prop:"transportPower", span: 8, },
{ label:"用途", prop:"use", span: 8, },
{ label:"运行速度", prop:"run", span: 8, },
{ label:"动力形式", prop:"runPower", span: 8, },
{ label:"数量", prop:"sum", span: 8, },
{ label:"爬坡能力", prop:"climbing", span: 8, },
{ label:"生产厂家", prop:"produceManufacturer", span: 8, },
{ label:"生产日期", prop:"produceTime", span: 8, formType: "date", },
{ label:"使用日期", prop:"useTime", span: 8, formType: "date", },
{ label:"安全标志", prop:"safeCode", span: 8, },
{ label:"制动距离", prop:"retardation", span: 8, },
{ label:"使用地点", prop:"useAddress", span: 8, },
{ label:"运行巷道平均坡度", prop:"avgSlope", span: 8, },
{ label:"运行巷道最大坡度", prop:"maxSlope", span: 8, },
{ label:"运输长度", prop:"transportLength", span: 8, },
{ label:"目前状态", prop:"nowStatue", span: 8, formType: "select", options: [], },//(正常使用/备用/待修/报废/待报废)
{ label:"无极绳", prop:"noRope", span: 8, },
{ label:"调度绞车", prop:"winch", span: 8, },
{ label:"回往绞车", prop:"backWinch", span: 8, },
{ label:"指挥系统", prop:"system", span: 8, },
            ]
        },
        // 列信息
        tablecolumns() {
            return [
                { label: "设备编码", prop: "deviceCode", },
                { label: "设备名称", prop: "deviceName", },
                { label: "规格型号", prop: "sModel", },
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
            formData: {
                emArchivesParts:[]
            },
            nowclickitem: '',
            // 部门树选项
            deptOptions: [],
            categoryOptions: [],
            valueMap: {},
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
        this.queryParams.largeId = this.$route.query.l;
        this.disabled = this.$route.query.d == 'true';
        if(this.$route.query.l){
            this.getDetails(this.$route.query.l);
        }
        this.getTree();
        this.getTreeSelect();
    },
    methods: {
        close() {
            this.drawer = false
        },
        submitRadio(row) {
            row.forEach(b => {
                var flag = this.formData.emArchivesParts.some((bb)=>bb.deviceId==b.deviceId)
                if(!flag){
                    this.formData.emArchivesParts.push(b)
                }
            });
            this.formData.partIds = this.formData.emArchivesParts.map((b)=>b.deviceId)
            // this.$set(this.formData, 'parentId', row.deviceId)
            // this.$set(this.formData, 'parentDeviceName', row.deviceName)
            this.close()
        },
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
            importTransport(this.importData).then(response => {
                loading.close();
                this.$modal.msgSuccess("上传成功");
                this.getList(this.queryParams)
            });
        },
        handleClose(done) {
            done()
        },
        getList(queryParams) {

        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getTransport(queryParams).then(response => {
                this.formData = response.data;
                if (this.formData.emArchivesParts == null) {
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
            this.ids = selection.map(item => item.deviceId)
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
        goback(){
            this.$store.dispatch('tagsView/delView', this.$route)  // 关闭当前页
            this.$router.go(-1)//跳回上页
        },
        /** 提交按钮 */
        submitForm: function (formdata) {
            if (formdata.largeId != undefined) {
                updateTransport(formdata).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    // this.drawer = false;
                    // this.getList();
                    this.goback()
                });
            } else {
                addTransport(formdata).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    // this.drawer = false;
                    // this.getList();
                    this.goback()
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            var that = this
            const ids = row.deviceId?[row.deviceId]:this.ids;
            this.$modal.confirm('是否确认删除？').then(function () {
                ids.forEach(b => {
                    that.formData.emArchivesParts.forEach((bb,ii) => {
                        if(b == bb.deviceId){
                            that.formData.emArchivesParts.splice(ii,1)
                        }
                    });
                });
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
          