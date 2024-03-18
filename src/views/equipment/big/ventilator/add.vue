<template>
    <div class="app-container">
        <div>
            <div class="mb20" style="background-color: #fff;">基本信息</div>
            <jm-form class="mr20" :showButton="false" :columns="columns" :formData="formData" @submitForm="submitForm"
                ref="jmform" :disabled="disabled" :labelWidth="'140px'">
            </jm-form>
            <div class="mb20" style="background-color: #fff;">详细设备信息</div>
            <jm-table :tableData="formData.emArchivesParts" @getList="getList"
                @handleSelectionChange="handleSelectionChange" @switchchange="switchchange" :total="total"
                :handleWidth="120" :columns="tablecolumns" ref="jmTable" :showSearch='false' :showOperate='false'>
                <template slot="headerLeft" v-if="!disabled">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                        >关联设备</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple"
                            @click="handleDelete">解除关联</el-button>
                    </el-col>
                </template>
                <!-- <template #end_handle="scope" v-if="!disabled">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row, 'edit')"
                        v-hasPermi="['equipment:template:edit']">编辑</el-button>
                </template> -->
            </jm-table>

            <div style="text-align: center;margin-top: 20px;" v-if="!disabled">
                <el-button size="mini" @click="goback">取消</el-button>
                <el-button size="mini" @click="saveHandle" type="primary" :loading="btnLoading">保存</el-button>
            </div>

            <!-- 添加或修改设备平台_表单模板对话框 -->
            <el-drawer title="选择上级设备" :visible.sync="drawer" direction="rtl" :destroy-on-close="true" size="80%"
                :wrapperClosable="false">
                <parentdevice @submitRadio="submitRadio" @close="close" :isChoose="false" :formData='formData.emArchivesParts'></parentdevice>
            </el-drawer>
        </div>
    </div>
</template>
          
<script>
import { listVentilator, getVentilator, delVentilator, addVentilator, updateVentilator, importVentilator } from "@/api/equipment/big/ventilator";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import child from "@/views/formTemplate/child";
import fileImport from "@/components/FileImport";
import parentdevice from "@/views/equipment/big/selectDevice";
import { equipmentTree } from "@/api/equipment/category";
import { listDept } from "@/api/system/dept";
import { getLocationTree} from '@/api/Location'
export default {
    name: "Template",
    dicts: ['em_device_state', 'em_device_level','equipment_large_have','equipment_large_base','equipment_large_switch','equipment_common_yw','equipment_ventilator_lubrication','equipment_common_sf'],
    components: { JmTable, JmForm, child, fileImport, parentdevice },
    computed: {
        // 列信息
        columns() {
            return [
                { label:"矿井名称", prop:"mineName", span: 8, required: true, },
                { label:"机房名称", prop:"ventilatorName", span: 8, required: true, },
                { label:"设备型号", prop:"deviceModel", span: 8, },
                { label:"功率(KW)", prop:"ventilatorPower", span: 8, },
                { label:"台数", prop:"psTs", span: 8,formDisabled:true },
                { label:"设备厂家", prop:"equipmentManufacturer", span: 8, },
                { label:"煤安标志证号", prop:"signCode", span: 8, },
                { label:"生产日期", prop:"produceTime", span: 8, formType: "date", },
                { label:"投运日期", prop:"tyTime", span: 8, formType: "date", },
                { label:"电压等级", prop:"vcc", span: 8, },
                { label:"配电装置开关型号", prop:"turnModel", span: 8, },
                { label:"配电装置设备厂家", prop:"powerEquipmentManufacturer", span: 8, },
                { label:"配电装置投运时间", prop:"putTime", span: 8, formType: "date", },
                { label:"直流电源形式", prop:"dcXs", span: 8, },
                { label:"直流电源型号", prop:"dcPowerLevel", span: 8, },
                { label:"直流电源厂家", prop:"dcCj", span: 8, },
                { label:"标称风量(m³/min)", prop:"wind", span: 8, },
                { label:"标称负压(pa)", prop:"standardLevel", span: 8, },
                { label:"风门形式", prop:"windModel", span: 8, },
                { label:"启动与拖动方式", prop:"moveMethod", span: 8, },
                { label:"一键启动和倒机", prop:"buttonStart", span: 8, },
                { label:"电源快切装置", prop:"have", span: 8, formType: "select", options: this.dict.type.equipment_common_yw, },
                { label:"不停机调风叶", prop:"isCease", span: 8,formType: "select", options: this.dict.type.equipment_common_sf, },
                { label:"具备无人值守条件", prop:"unmanned", span: 8, formType: "select", options: this.dict.type.equipment_common_sf,  },
                { label:"润滑方式", prop:"lubricationModel", span: 8, formType: "select", options: this.dict.type.equipment_ventilator_lubrication,  },
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
                { label: "功能位置", prop: "location",formType: 'selectTree', options: this.locationOptions,width:180 },
                { label: "重要等级", prop: "level", formType: 'select', options: this.dict.type.em_device_level, }, //(A、B、C)
                { label: "所属子公司", prop: "subCompanyId",formType: 'selectTree', options: this.deptOptions, },
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
            btnLoading: false,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            formData: {
                psTs:0,
                emArchivesParts:[]
            },
            nowclickitem: '',
            // 部门树选项
            deptOptions: [],
            categoryOptions: [],
            locationOptions:[],
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
     watch:{
        'formData.emArchivesParts':{
            handler(val){
                this.formData.psTs=val.length
            }
        },
        immediate:true,
        deep:true
    },
    async created() {
        this.queryParams.largeId = this.$route.query.l;
        this.disabled = this.$route.query.d == 'true';
        await this.getTree();
        await this.getTreeSelect();
        if(this.$route.query.l){
            this.getDetails(this.$route.query.l);
        }
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
        async getTree() {
            await equipmentTree().then(response => {
                this.categoryOptions = response.data;
                // 方便获取父级tree
                this.loops(this.categoryOptions)
            });
            await getLocationTree().then(res=>{
                this.locationOptions=this.getTreeName(res.data)
            })
        },
        /** 查询部门下拉树结构 */
        async getTreeSelect() {
            await listDept().then(response => {
                this.deptOptions = response.data;
            });
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
            importVentilator(this.importData).then(response => {
                loading.close();
                this.$modal.msgSuccess("上传成功");
                this.getList(this.queryParams)
            });
        },
        handleClose(done) {
            done()
        },
        getList(queryParams) {
            if(this.$route.query.l){
            this.getDetails(this.$route.query.l);
        }
        },
        /** 查询设备平台_表单模板列表 */
        getDetails(queryParams) {
            this.loading = true;
            getVentilator(queryParams).then(response => {
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
            this.btnLoading = true;
            formdata.partIds = formdata.emArchivesParts.map((b)=>b.deviceId);
            if (formdata.largeId != undefined) {
                updateVentilator(formdata).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    // this.drawer = false;
                    // this.getList();
                    this.goback()
                }).catch((err)=>{
                    this.btnLoading = false;
                });
            } else {
                addVentilator(formdata).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    // this.drawer = false;
                    // this.getList();
                    this.goback()
                }).catch((err)=>{
                    this.btnLoading = false;
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            var that = this
            const ids = row.deviceId?[row.deviceId]:this.ids;
            this.$modal.confirm('确认要解除所选的'+ids.length+'条设备关联吗？').then(function () {
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
          