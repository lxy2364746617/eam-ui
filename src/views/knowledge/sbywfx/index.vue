<template>
    <div class="box">
      <div class="box1">
        <div class="box1_left">
          <div style="padding-left:10px;height:20%;background:#e7f3ff;">累计故障处理情况</div>
          <div style="height:80%">
            <div style="width:50%;height:100%;display:inline-block;">
              <span class="box1_num" style="height:40%">500</span>
              <span class="box1_num">当月故障处理数量</span>
            </div>
            <div style="width:50%;height:100%;display:inline-block">
              <span class="box1_num" style="height:40%">1,000</span>
              <span class="box1_num" >当年故障处理数量</span>
            </div>
          </div>
        </div>
        <div class="box1_mid">
          <div style="padding-left:10px;height:20%;background:#e7f3ff">累计巡检情况</div>
          <div style="height:80%">
            <div style="width:50%;height:100%;display:inline-block;">
              <span class="box1_num" style="height:40%">500</span>
              <span class="box1_num">当月点巡检设备数量</span>
            </div>
            <div style="width:50%;height:100%;display:inline-block">
              <span class="box1_num" style="height:40%">1,000</span>
              <span class="box1_num" >当年点巡检设备数量</span>
            </div>
          </div>
        </div>
        <div class="box1_right">
          <div style="padding-left:10px;height:20%;background:#e7f3ff">累计保养情况</div>
          <div style="height:80%">
            <div style="width:50%;height:100%;display:inline-block;">
              <span class="box1_num" style="height:40%">500</span>
              <span class="box1_num">当月保养设备数量</span>
            </div>
            <div style="width:50%;height:100%;display:inline-block">
              <span class="box1_num" style="height:40%">1,000</span>
              <span class="box1_num" >当年保养设备数量</span>
            </div>
          </div>
        </div>
      </div>
      <div class="box2">
        <div class="box2_left" id="chart1"></div>
        <div class="box2_right" id="chart2"></div>
      </div>
      <div class="box3">
         <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
        <el-table highlight-current-row :data="tableData"  border>
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
    </div>
    
</template>
<script>
import * as echarts from 'echarts'
export default {
  data(){
    return{
      columns:[
        { label: "状态", prop: "data1"},
        { label: "设备编码", prop: "data2"},
        { label: "设备名称", prop: "data3"},
        { label: "设备类型", prop: "data4"},
        { label: "存放地点", prop: "data5"},
        { label: "故障代码", prop: "data6"},
        { label: "故障描述", prop: "data7"},
        { label: "报修时间", prop: "data8",},
        { label: "紧急程度", prop: "data9",},
        { label: "维修人员", prop: "data10",},
        { label: "持续时间", prop: "data11",},
      ],
      tableData:[{data1:'维修中',data2:'001',data3:'采煤机',data4:'CH01',data5:'煤采区泵房',data6:'001',
      data7:'无',data8:'2024-01',data9:'一级',data10:'李四',data11:'0.2h'},
      {data1:'维修中',data2:'001',data3:'采煤机',data4:'CH01',data5:'煤采区泵房',data6:'001',
      data7:'无',data8:'2024-01',data9:'一级',data10:'李四',data11:'0.2h'},
      {data1:'维修中',data2:'001',data3:'采煤机',data4:'CH01',data5:'煤采区泵房',data6:'001',
      data7:'无',data8:'2024-01',data9:'一级',data10:'李四',data11:'0.2h'},
      {data1:'维修中',data2:'001',data3:'采煤机',data4:'CH01',data5:'煤采区泵房',data6:'001',
      data7:'无',data8:'2024-01',data9:'一级',data10:'李四',data11:'0.2h'},{data1:'维修中',data2:'001',data3:'采煤机',data4:'CH01',data5:'煤采区泵房',data6:'001',
      data7:'无',data8:'2024-01',data9:'一级',data10:'李四',data11:'0.2h'}],
      queryParams:{}
    }
  },
  mounted(){
    this.echartInit()
  },
  methods:{
    echartInit(){
      let myChart1 = echarts.init(document.getElementById('chart1')) 
      let myChart2 = echarts.init(document.getElementById('chart2'))
      myChart1.setOption({
         tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' 
          }
        },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value'
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',]
          },
          series: [
            {
              name: '已完成',
              type: 'bar',
              stack: 'total',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: [320, 302, 301, 334, 390, 330, 320,302, 301, 334, 390, 330, 320]
            },
            {
              name: '未完成',
              type: 'bar',
              stack: 'total',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134,  210]
            },
          
            
          ]
      })
      myChart2.setOption({
         tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' 
          }
        },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value'
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',]
          },
          series: [
            {
              name: '已完成',
              type: 'bar',
              stack: 'total',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: [320, 302, 301, 334, 390, 330, 320,302, 301, 334, 390, 330, 320]
            },
            {
              name: '未完成',
              type: 'bar',
              stack: 'total',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134,  210]
            },
          
            
          ]
      })
    }
    
  }
}
</script>

<style lang="scss" scoped>
.box{
  height: calc(100vh - 111px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.box1,.box2,.box3{
  width: 90%;
  margin: auto;
  border-radius: 5px;
  background: white;

}
.box1{
  flex:1.5;
  display: flex;
  margin-top: 10px;
  justify-content: space-around;
  .box1_left,.box1_mid,.box1_right{
    width: 30%;
    height: 100%;
    border-radius: 5px;
    .box1_num{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.box2{
  flex:2;
  display: flex;
  justify-content: space-around;
  .box2_left,.box2_right{
    width:45% ;
    height:100%;
    border-radius: 5px;
  }
  
}
.box3{
  flex:2;
  margin-bottom:10px
}
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