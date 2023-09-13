<template>
    <div>
      <el-row :gutter="10" class="mb8">
        <slot name="headerLeft"></slot>
        <right-toolbar :search="search" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-table v-loading="loading" :data="tableData2" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" :selectable="(row,index)=>index!=0"/>
          <el-table-column label="序号" align="center" prop="noticeId" width="50">
            <template slot-scope="scope">
                <div v-if="scope.$index != 0" v-html="scope.$index"></div>
              </template>
          </el-table-column>
          <template v-for='(col) in columns'>
            <el-table-column 
              :label="col.label" 
              :align="col.align||'center'" 
              :key="col.prop" 
              :prop="col.prop" 
              :min-width="col.width||100" 
              :show-overflow-tooltip="col.showOverflowTooltip" 
              v-if="col.tableVisible">
              <template slot-scope="scope">
                <div v-if="scope.$index == 0">
                  <el-form-item label="" :prop="col.prop" style="margin-bottom: 0;">
                    <el-date-picker
                      v-if="col.formType=='date'"
                      v-model="queryParams[col.prop]"
                      value-format="yyyy-MM-dd"
                      size="small"
                      type="date"
                      clearable
                      @keyup.enter.native="handleQuery"
                      style="width: auto;"
                      placeholder="选择日期">
                    </el-date-picker>
                    <el-select 
                      v-else-if="col.formType=='select'||col.formType=='radio'" 
                      clearable
                      v-model="queryParams[col.prop]" 
                      @keyup.enter.native="handleQuery"
                      placeholder="请选择">
                        <el-option :label="item.label" :value="item.value" v-for="item in col.options" :key="item.value"></el-option>
                    </el-select>
                    <treeselect 
                      size="small" 
                      v-else-if="col.formType=='selectTree'" 
                      v-model="queryParams[col.prop]" 
                      :options="col.options" 
                      clearable
                      clear-value-text="清除"
                      no-options-text="暂无数据"
                      @keyup.enter.native="handleQuery"
                      placeholder="请选择" 
                      :normalizer="normalizer" 
                      append-to-body
                      style="height: 32px;line-height: 32px;"/>
                    <el-input
                      v-else
                      v-model="queryParams[col.prop]"
                      clearable
                      @keyup.enter.native="handleQuery"
                      size="small"
                      :placeholder="'请输入'+col.label"
                    />
                    <!-- 是否为六大类设备  关联表单模板：名称 标识 添加字段
                    是否为特种设备 -->
                  </el-form-item>
                </div>
                <span v-else-if="col.prop=='date'">{{ parseTime(scope.row[col.prop], '{y}-{m}-{d}') }}</span>
                <span v-else-if="col.formType=='select'" v-html="findName(col.options,scope.row[col.prop])"></span>
                <span v-else-if="col.formType=='radio'" v-html="findName(col.options,scope.row[col.prop])"></span>
                <span v-else-if="col.formType=='selectTree'" v-html="findTreeName(col.options,scope.row[col.prop])"></span>
                <span v-else v-html="scope.row[col.prop]"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" :min-width="handleWidth||120">
            <template slot-scope="scope">
              <div v-if="scope.$index == 0">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-search" 
                  @click="handleQuery"
                >搜索</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-refresh" 
                  @click="resetQuery"
                >重置</el-button>
              </div>
              <div v-else>
                <slot name="end_handle" :row="scope.row" :index="scope.$index"></slot>
              </div>
            </template>
          </el-table-column>
        </el-table>
      
      </el-form>
  
  
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="pagination"
      />
    </div>
</template>
<script>

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    name: "JmTable",
    components: { Treeselect },
    props:{
        tableData:{
          default: ()=>[],
          type: Array
        },
        // 显示搜索条件
        showSearch:{
          default: true,
          type: Boolean
        },
        // 表格列
        columns: {
          default: ()=>[],
          type: Array
        },
        // 总条数
        total: {
          default: 0,
          type: Number
        },
        search:{
          default: false,
          type: Boolean
        },
        handleWidth: {
          default: 0,
          type: Number | String
        },
    },
    watch: {
      tableData(){
        this.tableData2 = JSON.parse(JSON.stringify(this.tableData));
        this.tableData2.unshift({})
        this.$nextTick(()=>{
          this.loading = false
        })
      }
    },
    created(){
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 表格数据
            tableData2: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
        }
    },
    methods: {
      /** 转换部门数据结构 */
      normalizer(node) {
            if (JSON.stringify(node.children)=='[]') {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.label,
                children: node.children
            };
        },
      findName(options,value){
        var name = ''
        for (let i = 0; i < options.length; i++) {
          if(options[i].value == value){
            name = options[i].label
          }
        }
        return name
      },
      findTreeName(options,value){
        var name = ''
        name = this.forfn(options,value);
        return name
      },
      forfn(options,value){
        for (let i = 0; i < options.length; i++) {
          if(options[i].id == value){
            return options[i].label
          }
          if(options[i].children){
            return this.forfn(options[i].children,value)
          }
        }
      },
      pagination(val){
        this.$set(this.queryParams,'pageNum',val.page)
        this.$set(this.queryParams,'pageSize',val.limit)
        this.getList()
      },
        getList(){
          this.loading = true
          this.$emit('getList',this.queryParams)
        },
        /** 搜索按钮操作 */
        handleQuery() {
          this.queryParams.pageNum = 1;
          this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.queryParams = this.$options.data().queryParams
          this.resetForm("queryForm");
          this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
          this.$emit('handleSelectionChange',selection)
          
            // this.ids = selection.map(item => item.noticeId)
            // this.single = selection.length!=1
            // this.multiple = !selection.length
        },
        handleExport(){
          this.$emit('handleExport',this.queryParams)
        },
    },
}

</script>
<style scoped lang="scss">
</style>