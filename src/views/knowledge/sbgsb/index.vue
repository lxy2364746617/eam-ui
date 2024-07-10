<template>
    <div class="app-container" >
      <el-button type="primary" plain style="margin-bottom:5px">导出</el-button>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="救援设备" name="first"></el-tab-pane>
        <el-tab-pane label="长期储备" name="second"></el-tab-pane>
        <el-tab-pane label="闲置设备" name="third"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
        <el-table v-show="activeName=='first'" highlight-current-row :data="tableData1" :span-method="objectSpanMethod" border>
          <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" align="center" :width="item.width||'auto'">
            <template slot-scope="scope">
              <div v-if="scope.$index == 0">
                <el-form-item
                  label=""
                  :prop="item.prop"
                  style="margin-bottom: 0"
                >
                <el-input
                    v-model="queryParams[item.prop]"
                    clearable
                    size="small"
                    :placeholder="'请输入' + item.label"
                  />
                </el-form-item>
              </div>
              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-show="activeName=='second'" highlight-current-row :data="tableData2" :span-method="objectSpanMethod" border>
          <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" align="center" :width="item.width||'auto'">
            <template slot-scope="scope">
              <div v-if="scope.$index == 0">
                <el-form-item
                  label=""
                  :prop="item.prop"
                  style="margin-bottom: 0"
                >
                <el-input
                    v-model="queryParams[item.prop]"
                    clearable
                    size="small"
                    :placeholder="'请输入' + item.label"
                  />
                </el-form-item>
              </div>
              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-show="activeName=='third'" highlight-current-row :data="tableData3" :span-method="objectSpanMethod" border>
          <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" align="center" :width="item.width||'auto'">
            <template slot-scope="scope">
              <div v-if="scope.$index == 0">
                <el-form-item
                  label=""
                  :prop="item.prop"
                  style="margin-bottom: 0"
                >
                <el-input
                    v-model="queryParams[item.prop]"
                    clearable
                    size="small"
                    :placeholder="'请输入' + item.label"
                  />
                </el-form-item>
              </div>
              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
</template>

<script>
import tableData from './formulation.json'
export default {
  data(){
    return {
      tableData1:tableData[0],
      tableData2:tableData[1],
      tableData3:tableData[2],
      columns:[
        { label: "子分公司", prop: "data1",width:'100'},
        { label: "生产矿", prop: "data2"},
        { label: "部门", prop: "data3"},
        { label: "设备种类", prop: "data4"},
        { label: "设备名称", prop: "data5"},
        { label: "规格型号", prop: "data6"},
        { label: "功能位置", prop: "data7"},
        { label: "数量", prop: "data8",width:'100'},
      ],
      queryParams:{},
      activeName:'first'
    }
  },
  methods:{
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let data = this.activeName=='first'?this.tableData1:this.activeName=='second'?this.tableData2:this.tableData3
      if (columnIndex === 0) {
        // 获取当前单元格的值
        const currentValue = row[column.property];
        // 获取上一行相同列的值
        const preRow = data[rowIndex - 1];
        const preValue = preRow ? preRow[column.property] : null;
        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === '') {
          return { rowspan: 0, colspan: 0 };
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = rowIndex + 1; i < data.length; i++) {
            const nextRow = data[i];
            const nextValue = nextRow[column.property];
            if (nextValue === '') {
              rowspan++;
            } else {
              break;
            }
          }
          console.log({ rowspan, colspan: 1 })
          return { rowspan, colspan: 1 };
        }
        
      }
    },
    handleClick(val){
      this.activeName = val.name
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content,
::v-deep .el-form-item__content .el-input--small,
::v-deep .el-form-item__content .el-input--small .el-input__inner,
::v-deep .el-form-item__content .el-select--small,
::v-deep .el-form-item__content .el-select--small .el-input--small,
::v-deep
  .el-form-item__content
  .el-select--small
  .el-input--small
  .el-input__inner,
::v-deep .vue-treeselect,
::v-deep .el-date-editor--daterange,
  ::v-deep .el-range-editor--small.el-input__inner,
::v-deep .vue-treeselect .vue-treeselect__control {
  height: 100%;
  border-radius: 0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
::v-deep .el-table th.el-table__cell {
  background-color: #e7f3ff;
}
::v-deep .el-tabs--border-card>.el-tabs__content{
  padding: 5px;
}
</style>