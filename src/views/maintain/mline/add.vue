<template>
    <div class="app-container">
        <div class="title">保养路线名称</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small" style="margin: 10px auto;">
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
        <div class="title">设备列表
            <el-button type="primary"  size="mini" icon="el-icon-plus" @click="handleAdd" style="margin-left: auto;">添加</el-button>
            <el-button type="primary"  size="mini" icon="el-icon-delete" @click="allDelete">批量删除</el-button>
        </div>
        <el-table v-loading="loading" :data="lineList" @selection-change="handleSelectionChange" ref="queryTable"
            row-key="deviceCode"  :header-cell-style="{'background-color':'#e7f3ff'}">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="设备编码" align="center" prop="deviceCode" min-width="150">
                <template slot-scope="scope">
                    <span class="active">{{scope.row.deviceCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备名称" align="center" prop="deviceName" min-width="150"></el-table-column>
            <el-table-column label="规格型号" align="center" prop="specs" min-width="150" />
            <el-table-column label="设备类别" align="center" prop="categoryName" min-width="150"></el-table-column>
            <el-table-column label="功能位置" align="center" prop="location" min-width="150">
                <template slot-scope="scope">
                     {{findTreeName(locationOptions,scope.row.location)}}
                </template>
            </el-table-column>
            <el-table-column label="所属子公司" align="center" prop="subCompanyName" min-width="150"></el-table-column>
            <el-table-column label="所属组织" align="center" prop="affDeptName" min-width="150" />
            <!-- <el-table-column label="设备状态" align="center" prop="deviceStatus">
                <template slot-scope="scope">
                    <span v-html="findName(dict.type.em_device_state, scope.row.deviceStatus)"></span>
                </template>
            </el-table-column> -->
            <el-table-column label="日常保养" align="center" prop="dayNum" min-width="150">
                <template slot-scope="scope">
                    <span class="viewSpan" @click="viewFun('RCBY', scope.row.deviceId, scope.row.dayNum)">{{
                        scope.row.dayNum }} 浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="一级保养" align="center" prop="oNum" min-width="150">
                <template slot-scope="scope">
                    <span class="viewSpan" @click="viewFun('YJBY', scope.row.deviceId, scope.row.oNum)">{{
                        scope.row.oNum }} 浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="二级保养" align="center" prop="tNum" min-width="150">
                <template slot-scope="scope">
                    <span class="viewSpan" @click="viewFun('EJBY', scope.row.deviceId, scope.row.tNum)">{{
                        scope.row.tNum }} 浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="常规润滑" align="center" prop="cNum" min-width="150">
                <template slot-scope="scope">
                    <span class="viewSpan" @click="viewFun('CGRH', scope.row.deviceId, scope.row.cNum)">{{
                        scope.row.cNum }} 浏览</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="150">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope)"
                        v-hasPermi="['maintain:mline:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改设备平台_表单模板对话框 -->
        <el-drawer title="选择设备" :visible.sync="form.choosedrawer" direction="rtl" size="80%" :wrapperClosable="false">
            <parentdevice :isChoose="false" @submitRadio="submitRadio2" @close="form.choosedrawer = false" :formData="form.disIds"
                v-if="form.choosedrawer">
            </parentdevice>
        </el-drawer>

        <el-drawer :title="title" :visible.sync="drawer" direction="rtl" size="80%" :wrapperClosable="false">
            <jm-table :tableData="plineList" ref="jmtable" :columns="columns"  :showSearch='false'>
            </jm-table>
        </el-drawer>

        <div style="width: 100%; height: 68px;"></div>
        <div
            style="position: absolute;bottom: 0px;width: calc(100% - 40px);background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;z-index: 9;">
            <el-button size="mini" @click="submitForm" type="primary" :loading="btnLoading">提交</el-button>
            <el-button size="mini" @click="goback">取消</el-button>
        </div>
    </div>
</template>
          
<script>
import { getMline, addMline, updateMline, findByDeviceId, findByDeviceIdAndItemType, larchivesList } from "@/api/maintain/mline";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import parentdevice from '@/views/maintain/mline/selectDevice'
import Sortable from 'sortablejs'
import { getLocationTree} from '@/api/Location'
export default {
    name: "Template",
    dicts: ['sys_normal_disable', 'em_device_state', 'mro_s_check_status','mro_m_cycle_type'],
    components: { JmTable, JmForm, parentdevice },
    computed: {
        // 列信息
        columns() {
            return [
                { label: '部件', prop: 'partsName', },
                { label: '保养项编码', prop: 'itemCode' },
                { label: '保养项名称', prop: 'itemName', },
                { label: '保养部位', prop: 'itemArea', },
                { label: '保养内容', prop: 'itemContent',showOverflowTooltip:true },
                { label: '保养标准', prop: 'checkStandard', },
                { label: '点数', prop: 'checkNum', },
                { label: '周期', prop: 'checkCycle', },
                { label: '保养周期类别', prop: 'checkCycleType', formType: 'selectTag', options: this.dict.type.mro_m_cycle_type, span: 24, },
                { label: '保养工具', prop: 'itemTool', },
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
                lineStatus: '0',
                lineId: 1,
            },
            // 关联点检测项目
            lineList: [],
            drawer: false,
            // 弹出层标题
            title: "关键点检测",
            plineList: [],
            selectArr: [],
            sortable: null,
            // 表单校验
            rules: {
                lineName: [
                    { required: true, message: '路线名称不能为空', trigger: 'blur' },
                ],
                lineStatus: [
                    { required: true, message: '状态不能为空', trigger: 'blur' },
                ],
            },
            locationOptions:[]
        };
    },
    mounted() {
        const el = this.$refs.queryTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
            onEnd: e => { //onEnd是结束拖拽时触发，onUpdate是列表内元素顺序更新的时候触发，更多请看文末配置项 //e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置 
                const targetRow = this.lineList.splice(e.oldIndex, 1)[0];
                this.lineList.splice(e.newIndex, 0, targetRow);
                let dragId = this.lineList[e.newIndex].deviceCode;//拖动行的id 
                let oneId, twoId //拖动行的前一行 
                if (this.lineList[e.newIndex - 1]) { oneId = this.lineList[e.newIndex - 1].id; } else { oneId = "" } //拖动行的后一行 
                if (this.lineList[e.newIndex + 1]) { twoId = this.lineList[e.newIndex + 1].id; } else { twoId = "" }
                console.log("拖动行：" + dragId); console.log("前一行：" + oneId); console.log("后一行：" + twoId); //然后就可以发送请求了...... 
            }
        })
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
        getLocationTree().then(res=>{
                this.locationOptions=this.getTreeName(res.data)
            })
    },
    methods: {
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
        findTreeName(options, value) {
      var name = "";
      function Name(name) {
        this.name = name;
      }
      var name1 = new Name("");
      this.forfn(options, value, name1);
      return name1.name;
    },
    forfn(options, value, name1) {
      function changeName(n1, x) {
        n1.name = x;
      }
      for (let i = 0; i < options.length; i++) {
        if (options[i].id == value) {
          changeName(name1, options[i].label);
        }
        if (options[i].children) {
          this.forfn(options[i].children, value, name1);
        }
      }
    },
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
            getMline(queryParams).then(response => {
                this.form = response.data;
                // if (mroMaintainLineArchivesList.length > 0) {
                larchivesList({ lineId: this.form.lineId }).then(res => {
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
            let lineIds = this.lineList.map(item => item.deviceId) || [];
            this.$set(this.form, 'disIds', lineIds)
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
                console.log(that.selectArr[0],that.lineList[0],that.selectArr[0]==that.lineList[0])
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
            let that = this;
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let data = {
                        ...that.form,
                        mroMaintainLineArchivesList: that.lineList.map(item => {
                            return { deviceId: item.deviceId }
                        }),
                    }
                     if(this.lineList.length==0) return  that.$modal.msgError(`请添加设备`);
                    let arr = this.lineList.filter(item=>{
                        return item.cNum==0&&item.dayNum==0&&item.oNum==0&&item.tNum==0
                    })
                   if(arr.length>0) {
                    let msg =  arr.map(item=>item.deviceName).join(',')
                    return that.$modal.msgError(`${msg}保养检修标准为0，请添加标准`);
                   }
                    if (that.lineId != '' && that.lineId) {
                        data.lineId=that.lineId;
                        updateMline(data).then(response => {
                            that.$modal.msgSuccess("修改成功");
                            that.goback()
                        }).catch((err) => {
                        });
                    } else {
                        addMline(data).then(response => {
                            that.$modal.msgSuccess("新增成功");
                            // this.getList();
                            that.goback()
                        }).catch((err) => {
                        });
                    }
                }
            })
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
    margin-bottom: 10px;
}

.viewSpan {
    color: #007bfe;
    cursor: pointer;
    text-decoration: underline;
}

.active{
    color: #007bfe;
    cursor: pointer;
    text-decoration: underline;
  }

</style>
          