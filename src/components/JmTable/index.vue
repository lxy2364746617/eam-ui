<template>
    <div>
      <el-row :gutter="10" class="mb8" style="margin-bottom: 20px;">
        <slot name="headerLeft"></slot>
        <right-toolbar v-if="rightToolbarShow" :search="search" @queryTable="getList" :columns="columns" :tableVisible="tableVisible" :rightToolbarShow='rightToolbarShow'>
          <template #right_end>
            <slot name="right_end"></slot>
          </template>
        </right-toolbar>
      </el-row>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
        <el-table 
          v-loading="loading" 
          highlight-current-row 
          @current-change="handleCurrentChange"
          :data="tableData2" 
          @selection-change="handleSelectionChange">
          <el-table-column v-if="!isRadio" type="selection" width="55" align="center" :selectable="(row,index)=>index!=0 || !showSearch"/>
          <el-table-column v-if="isRadio" width="50">
            <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index" v-if="scope.$index!=0 && showSearch" class="leftRadio">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="序号" align="center" prop="noticeId" width="50" v-if="isIndex">
            <template slot-scope="scope">
              <div v-if="scope.$index != 0 && showSearch" v-html="scope.$index"></div>
              <div v-else-if="!showSearch">{{scope.$index +1}}</div>
            </template>
          </el-table-column>
          <template v-for='(col) in columns'>
            <el-table-column 
              :label="col.label" 
              :align="col.align||'center'" 
              :key="col.prop" 
              :sortable="false"
              :prop="col.prop" 
              :min-width="col.width||100" 
              :show-overflow-tooltip="col.showOverflowTooltip" 
              v-if="tableVisible[col.prop]">
              <template slot-scope="scope">
                <div v-if="scope.$index == 0 && showSearch">
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
                      v-else-if="col.formType=='select' || col.formType=='radio'||col.formType=='switch'" 
                      clearable
                      v-model="queryParams[col.prop]" 
                      @keyup.enter.native="handleQuery"
                      @change="selectchange($event,col.prop)"
                      placeholder="请选择">
                        <el-option :label="item.label" :value="item.value" v-for="item in col.options" :key="item.value">
                          <span v-if="col.optionShowValue" style="float: left">{{ item.label }}</span>
                          <span v-if="col.optionShowValue" style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                        </el-option>
                    </el-select>
                    <el-select 
                      v-else-if="col.formType=='selectTag'" 
                      clearable
                      v-model="queryParams[col.prop]" 
                      @keyup.enter.native="handleQuery"
                      @change="selectchange($event,col.prop)"
                      placeholder="请选择">
                        <el-option :label="item.label" :value="item.value" v-for="item in col.options" :key="item.value">
                          <el-tag class="selectTag" effect="light" :type="item.raw.listClass">
                            {{ item.label }}
                          </el-tag>
                        </el-option>
                    </el-select>
                    <treeselect 
                      size="small" 
                      v-else-if="col.formType=='selectTree'" 
                      v-model="queryParams[col.prop]" 
                      :options="col.options" 
                      clearable
                      clear-value-text="清除"
                      no-options-text="暂无数据"
                      clearValueText="清除"
                      noOptionsText="暂无数据"
                      :default-expand-level="4"
                      @keyup.enter.native="handleQuery"
                      placeholder="请选择" 
                      :normalizer="normalizer" 
                      :append-to-body="true"
                      :zIndex="9999"
                      />
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
                <span v-else-if="col.formType=='date'">{{ parseTime(scope.row[col.prop], '{y}-{m}-{d}') }}</span>
                <span v-else-if="col.formType=='select'||col.formType=='radio'" v-html="findName(col.options,scope.row[col.prop])"></span>
                <span v-else-if="col.formType=='selectTag'">
                  <el-tag class="selectTag" effect="light" :type="findClass(col.options,scope.row[col.prop])">
                    {{ findName(col.options,scope.row[col.prop]) }}
                  </el-tag>
                </span>
                <span v-else-if="col.formType=='switch'">
                  <el-switch
                    v-model="scope.row[col.prop]"
                    @change="switchchange($event,col.prop,scope.row)"
                    :active-value="col.options[0].value"
                    :inactive-value="col.options[1].value">
                  </el-switch>
                </span>
                <span v-else-if="col.formType=='radioSelect'">
                  <el-radio-group v-model="scope.row[col.prop]" @change="radiochange($event,col.prop,scope.row)">
                    <el-radio v-for="item in col.options" :key="item.value" :label="item.value"> {{ item.label }}</el-radio>
                  </el-radio-group>
                </span>
                <span v-else-if="col.formType=='selectTree'" v-html="findTreeName(col.options,scope.row[col.prop])"></span>
                <span v-else v-html="scope.row[col.prop]" :class="{ 'active' : col.class  }"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" :min-width="handleWidth||120" v-if="showOperate">
            <template slot-scope="scope">
              <div v-if="scope.$index == 0 && showSearch">
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
        isRadio: {
          default: false,
          type: Boolean
        },
        // 显示搜索条件
        showSearch:{
          default: true,
          type: Boolean
        },
         // 显示操作
         showOperate:{
          default: true,
          type: Boolean
        },
        // 显示序号
        isIndex: {
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
        initLoading:{
          default: true,
          type: Boolean
        },
        handleWidth: {
          default: 0,
          type: Number | String
        },
        // 显示右边工具
        rightToolbarShow:{
          default: true,
          type: Boolean
        },
    },
    watch: {
      tableData: {
        handler(val) {
          this.tableData2 = JSON.parse(JSON.stringify(this.tableData));
          if(this.showSearch && this.tableData2){
              this.tableData2.unshift({})
          }
          this.$nextTick(()=>{
            this.loading = false
          })
        },
        immediate: true,
        deep: true,
      },
    },
    created(){
      this.columns.forEach(b => {
        this.$set(this.tableVisible,b.prop,b.tableVisible==false?false:true)
      });
    },
    data() {
        return {
          radio: '',
          // 遮罩层
          loading: this.initLoading,
          // 表格数据
          tableData2: [],
          // 查询参数
          queryParams: {
              pageNum: 1,
              pageSize: 10,
          },
          tableVisible: {},
        }
    },
    methods: {
      switchchange($event,prop,row){
        this.$emit('switchchange',$event,prop,row)
      },
      radiochange($event,prop,row){
        this.$emit('radiochange',$event,prop,row)
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        if(currentRow){
          this.currentRow = currentRow;
          this.radio = this.tableData2.indexOf(currentRow);
          this.$emit('handleSelectionChange',[currentRow])
        }
      },
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
        selectchange($event,prop){
          this.$emit('selectchange',$event,prop)
        },
      findClass(options,value){
        var name = 'primary'
        for (let i = 0; i < options.length; i++) {
          if(options[i].value == value){
            name = options[i].raw.listClass
          }
        }
        return name
      },
      findName(options,value){
        var name = ''
        for (let i = 0; i < options.length; i++) {
          if(options[i].value == value){
            name = options[i].label
          }
        }
        return name || value
      },
      findTreeName(options,value){
        var name = ''
        function Name(name){
          this.name = name;
        }
        var name1 = new Name('')
        this.forfn(options,value,name1);
        return name1.name
      },
      forfn(options,value,name1){
        function changeName(n1,x){
          n1.name = x
        }
        for (let i = 0; i < options.length; i++) {
          if(options[i].id == value){
            changeName(name1, options[i].label)
          }
          if(options[i].children){
            this.forfn(options[i].children,value,name1)
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
  ::v-deep .el-form-item__content,
  ::v-deep .el-form-item__content .el-input--small,
  ::v-deep .el-form-item__content .el-input--small .el-input__inner,
  ::v-deep .el-form-item__content .el-select--small,
  ::v-deep .el-form-item__content .el-select--small .el-input--small,
  ::v-deep .el-form-item__content .el-select--small .el-input--small .el-input__inner,
  ::v-deep .vue-treeselect,
  ::v-deep .vue-treeselect .vue-treeselect__control{
    height: 100%;
    border-radius: 0;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  ::v-deep .vue-treeselect__placeholder, 
  ::v-deep .vue-treeselect__single-value{
    line-height: 46px;
  }
  ::v-deep .el-table th.el-table__cell{
    background-color: #e7f3ff;
  }
  .selectTag{
    background: none!important;
    border: none;
    margin: 0;
    padding: 0;
    height: auto;
    line-height: normal;
  }
  ::v-deep .vue-treeselect__portal-target{
    width: auto!important;
  }

  ::v-deep .leftRadio .el-radio__label{
    display: none;
  }

  .active{
    color: #007bfe;
    cursor: pointer;
    text-decoration: underline;
  }
</style>