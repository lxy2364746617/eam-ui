<template>
    <div class="app-container">
        <el-row :gutter="12">
            <el-col :span="3">
                <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>
                {{ formTitle }}
            </el-col>
        </el-row>
        <div style="margin-top: 20px;margin-bottom: 20px;">
            <span>选择六大设备：</span>
            <el-radio-group v-model="radio" @input="radioInput">
                <el-radio v-for="(item,index) in radioColumn" :label="index" :key="item.categoryId">{{ item.categoryName }}</el-radio>
            </el-radio-group>
        </div>
        <div v-if="radioColumn.length>0">
            <jm-table :tableData="deptList" @getList="getList" :total="total" :columns="radioColumn[radio].tableHead">
                <template slot="headerLeft">
                    <el-col :span="1.5">
                        <el-button v-if="deptList.length > 0" type="primary" icon="el-icon-download" size="mini"
                            @click="handleExport" v-hasPermi="['equipment:index:export']">下载</el-button>
                            <span v-if="total" style="display:inline-block;color:#AAAAAA;font-size:16px;margin-left:10px">{{findName(radioColumn,radioColumn[radio].categoryId)}}共{{total}}条</span> 
                    </el-col>
                </template>
            </jm-table>
        </div>
    </div>
</template>
  
<script>

import JmTable from "@/components/JmTable";
import { isSmEmCategoryCategory, exportIndexEquipment } from "@/api/equipment/category";
import { listIndexBASE } from "@/api/equipment/BASE";

export default {
    name: "deviceindex",
    dicts: [],
    components: { JmTable },
    props: {
        formTitle: {
            default: '设备指标',
            type: String,
        },
    },
    computed: {

    },
    data() {
        return {
            radio: 0,
            radioColumn: [],
            deptList: [],
            total: 0,
            // 遮罩层
            loading: true,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                isSm: "Y",
                categoryId: undefined,
            },
        };
    },
    created() {
        this.isSmEmCategoryRadio()
    },
    methods: {
        findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].categoryId == value) {
          name = options[i].categoryName;
        }
      }
      return name || value;
    },
        radioInput(val){
            this.queryParams.categoryId = this.radioColumn[val].categoryId
            this.getList({
                ...this.queryParams,
            })
        },
        isSmEmCategoryRadio(){
            isSmEmCategoryCategory().then(response => {
                response.data.forEach(b => {
                    if(b.tableHead){
                        b.tableHead.forEach(bb => {
                            bb.label = bb.fieldName
                            bb.prop = bb.fieldCode
                            bb.formType = bb.fieldType
                            bb.tableVisible = !bb.custom
                        });
                    }
                });
                this.radioColumn = response.data
                this.radioInput(this.radio)
            });
        },
        backparent(){
            this.$emit('back')
        },
        /** 查询部门列表 */
        getList() {
            this.loading = true;
            listIndexBASE(this.queryParams).then(response => {
                response.rows.forEach(b => {
                    Object.assign(
                        b,
                        b.archivesOther?b.archivesOther:{},
                        b.emArchivesExtendAtt?JSON.parse(b.emArchivesExtendAtt.fieldValue):{},
                        b.emArchivesIndex?JSON.parse(b.emArchivesIndex.fieldValue):{},
                        b.emArchivesSpecial?JSON.parse(b.emArchivesSpecial.fieldValue):{},
                    )
                });
                this.deptList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            // exportIndexEquipment(this.queryParams.categoryId).then(response => {

            // });
            var obj = {
                categoryId: this.queryParams.categoryId,
            }
            this.download('equipment/index/export',
                obj,
                `设备指标_${new Date().getTime()}.xlsx`)
        },
    }
};
</script>