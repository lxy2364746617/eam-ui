<template>
  <div class="pageStyle">
    <el-card class="box-card1" shadow="never">
      <div class="header">
        <div class="chart_month">
          <p class="title">月添加案</p>
          <p class="value_text"><span>{{monthNum}}</span>例</p>
          <el-divider></el-divider>
          <p class="title">年添加案例</p>
          <p class="value_text"><span>{{yearNum}}</span>例</p>
        </div>
        <div class="chart">
          <div class="tag">故障分类案例统计</div>
          <div ref="chart" style="width: 100%; height: 90%"></div>
        </div>
        <div class="chart">
          <div class="tag">故障等级案例统计</div>
          <div ref="chart1" style="width: 100%; height: 90%"></div>
        </div>
        <div class="chart">
          <div class="tag">故障名称<i class="clearfix_new">Top5</i></div>
          <div class="content_body">
            <div v-for="(item,index) in jszlData.list" :key="index" class="textItem">
              <span class="title">故障{{index+1}}</span>
              <p>{{item.name}}</p>
              <span class="clickNo" :style="{color:item.color}">NO.{{index+1}}</span>
            </div>
          </div>
        </div>
      </div>
      <jm-table :tableData="templateList"
          @getList="getList"
          @linkClick="linkClick"
          :total="total" 
          :handleWidth="150"
          :columns="tablecolumns" ref="jmTable">
          <template #end_handle="scope">
            <el-button 
              size="mini" 
              type="text" 
              icon="el-icon-edit" 
              @click="handleUpdate(scope.row, 'edit')"
              v-hasPermi="['equipment:lbase:edit']"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['equipment:lbase:remove']"
            >删除</el-button>
          </template>
      </jm-table>
    </el-card>
  </div>
</template>

<script>
import { faultCaseList,faultCaseListDel,faultCaseInfo,faultCaseType,faultCaseLevel } from '@/api/knowledge'
import JmTable from "@/components/JmTable1";
import * as echarts from "echarts";
  export default {
    name:'faults',
    components: { 
      JmTable
    },
    data(){
      return {
        // 月添加案例数
        monthNum:'8',
        // 年添加案例数
        yearNum:'32',
        // 表单头部
        tablecolumns:[
          { label: "案例编码", prop: "caseNo" },
          { label: "故障代码", prop: "code" },
          { label: "故障名称", prop: "faultName", },
          { label: "故障分类", prop: "type", formType: "select",options:[]},
          { label: "故障设备编码", prop: "deviceCode",type:'link'},
          { label: "设备名称", prop: "deviceName", },
          { label: "故障部件(KV)", prop: "location", },
          { label: "故障等级", prop: "level", formType: "select",options:[{label:'1',value:'1'}]},
          { label: "工单编码", prop: "orderCode", type:'link'},
          { label: "故障描述", prop: "faultInfo", },
          { label: "故障原因", prop: "faultReason", },
          { label: "维修措施", prop: "repairInfo", },
          { label: "预防对策", prop: "prevention", },
          { label: "补充说明", prop: "footNote", },
          { label: "添加日期", prop: "createTime", formType: "date", },
          { label: "添加人", prop: "createBy", },  
          { label: "更新时间", prop: "updateBy", },
          { label: "更新人", prop: "updateTime", },
        ],
        // 表格数据
        templateList: [],
        // 总条数
        total: 0,
        // 遮罩层
        loading: true,
        jszlData:{
          list:[]
        },
        myChart:null,
        myChart1:null,
        option:{
          color: ['#06DEFF', '#0094FF', '#007E96','#FFA000'],
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            top: 'center',
            right:'3%',
          },
          series: [
            {
              left: '15%',
              center:['30%','50%'],
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                // position: 'center',
                formatter(param) {
                  // correct the percentage
                  return  param.percent+'%';
                }
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true,
              },
              data: [
                { value: 1048, name: 'Search' },
                { value: 735, name: 'Direct' },
                { value: 535, name: 'Engine' },
              ]
            }
          ]
        },
        option1:{
          color: ['#06DEFF', '#0094FF', '#007E96','#FFA000'],
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            top: 'center',
            right:'3%',
          },
          series: [
            {
              left: '15%',
              center:['30%','50%'],
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                // position: 'center',
                formatter(param) {
                  // correct the percentage
                  return  param.percent+'%';
                }
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true,
              },
              data: [
                { value: 1048, name: 'Search' },
                { value: 735, name: 'Direct' },
                { value: 535, name: 'Engine' },
              ]
            }
          ]
        }
      }
    },
    mounted(){
      this.initChart();
      this.getList()
      this.getInfoAll()
      this.getFaultsType()
    },
    methods:{
      initChart() {
        console.log(echarts)
        this.myChart = echarts.init(this.$refs.chart);
        this.myChart1 = echarts.init(this.$refs.chart1);
      },
      // 获取表头所有信息
      getInfoAll(){
        faultCaseInfo().then(res=>{
          console.log(res)
          this.monthNum = res.data.monthAdd
          this.yearNum = res.data.yearAdd
          this.option.series[0].data = res.data.faultStatics
          this.option1.series[0].data = res.data.levelStatics
          console.log(this.option)
          this.jszlData.list = res.data.top5Statics
          if(this.jszlData.list){
            let colorArr = ['#FC297D','#FFB64F','#007BFE']
            this.jszlData.list.forEach((item,idx)=>{
              if(colorArr[idx]){
                item.color = colorArr[idx]
              }
            })
          }
          // 渲染图表
        this.myChart.setOption(this.option);
        this.myChart1.setOption(this.option1);
        })
      },
      // 获取故障类型
      getFaultsType(){
        faultCaseType().then(res=>{
          console.log(res,'故障类型')
          if(res.data){
            res.data.forEach(item=>{
              item.label = item.dictLabel
              item.value = item.dictValue
            })
          }
          this.tablecolumns.forEach(item=>{
            if(item.prop == 'type'){
              item.options = res.data
            }
          })
        })
      },
       // 获取故障等级
       getFaultsLevel(){
        faultCaseLevel().then(res=>{
          this.tablecolumns.forEach(item=>{
            if(item.prop == 'level'){
              item.options = res.data
            }
          })
        })
      },
      // 获取表单数据
      getList(queryParams) {
        this.loading = true;
        faultCaseList(queryParams).then(response => {
          console.log(response)
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        // this.ids = selection.map(item => item.largeId)
        // this.single = selection.length !== 1
        // this.multiple = !selection.length
      },
      switchchange(val, prop, row) {
        this.submitForm(row)
      },
      // 点击编辑
      handleUpdate(row){
        this.$router.push({name:'faults_details',query:{id:row.id}})
      },
      // 点击删除
      handleDelete(row){
        console.log(row)
        faultCaseListDel({id:row.id}).then(res=>{
          this.getList()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
      },
      linkClick(row,item){
        console.log(row,item)
        if(item.label == "故障设备编码"){
          this.$router.push({name:'bookDetails',query:{i:row.id,t:row.title}})
        }else if(item.label == '工单编码'){
          this.$router.push({name:'faults_details',query:{id:row.id}})
        }
  
      }
    },
    beforeDestroy() {
      if (!this.chart) return;

      this.chart.dispose();

      this.chart = null;
    },
  }
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 337px;
  border-radius: 6px;
  border: 1px solid #e9eaef;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 15px;
  background-color: #f7fbff;
  .chart_month{
    width: 10%;
    min-width:120px;
    height: 270px;
    background-color: #fff;
    margin: 0 20px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    p{
      margin: 0;
    }
    .title{
      width: 100%;
      display: block;
      text-align: center;
    }
    .value_text{
      width: 100%;
      display: block;
      text-align: center;
      font-weight: bold;
      span{
        font-size: 35px;
        margin-right:5px;
      }
    }
  }
  .chart {
    width: 30%;
    height: 270px;
    position: relative;
    background-color: #fff;
    margin-right: 20px;
    &::before {
      content: "";
      display: block;
      width: 103.5%;
      height: 10%;
      background: url("../../../assets/images/chart-down.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: -7px;
      bottom: -8%;
      z-index: 2;
    }
    .tag {
      width: 100%;
      height: 38px;
      background: linear-gradient(0deg, #e7f3ff 0%, #e7f3ff 100%),url(<path-to-image>), lightgray 0px 0px / 97.436% 100% no-repeat;
      margin: 0;
      padding: 0;
      color: #55566d;
      display: flex;
      justify-content: start;
      align-items: center;
      &::before {
        content: "";
        width: 30px;
        height: 38px;
        margin-left: 10px;
        display: flex;
        background: url("../../../assets/images/tag.png");
      }
      .clearfix_new{
        color: #FF2828;
      }
    }
  }
}

.content_body{
  padding: 10px 15px;
  height: 200px;
  overflow-y: auto;
  .textItem{
      display: flex;
      line-height: 35px;
      justify-content: space-between;
      .title{
        width: 130px;
        margin: 0;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
      .clickNo{
        width: 100px;
        text-align: right;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
      p{
        padding: 0;
        margin: 0;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
      }
    }
}
</style>