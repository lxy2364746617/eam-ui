<template>
  <div class="pageStyle">
    <el-card class="box-card1" shadow="never">
      <div class="title"><i class="el-icon-document"></i>案例详情</div>
      <div class="detail_item">
        <el-descriptions :column="4">
          <el-descriptions-item v-for="(item,index) in infoList" :key="index" :label="item.label" :span="item.span">
            <div v-if="item.type == 'img'" class="block">
              <el-image style="width: 200px;" 
                v-for="(items,indexs) in item.value"
                :key="indexs"
                :src="items.src"
                :preview-src-list="item.srcList"
              ></el-image>
            </div>
            <div v-else>
              {{item.value}}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="title"><i class="el-icon-document"></i>解决方案</div>
      <div class="detail_item">
        <div class="subtitle"><i class="el-icon-caret-right"></i> 处理信息</div>
        <el-descriptions :column="4">
          <el-descriptions-item v-for="(item,index) in infoList1" :key="index" :label="item.label" :span="item.span">
            {{item.value}}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail_item">
        <div class="subtitle"><i class="el-icon-caret-right"></i>备件记录</div>
        <el-table
          :data="table.list"
          stripe
          style="width: 100%">
          <el-table-column v-for="(item,index) in table.header" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
        </el-table>
      </div>
      <div class="detail_item">
        <div class="subtitle"><i class="el-icon-caret-right"></i> 对策补充
          <span v-if="disabled3" class="rightbutton">
            <el-button type="text" icon="el-icon-edit" @click="disabled3=false">编辑</el-button>
          </span>
          <span v-else class="rightbutton">
            <el-button type="text" @click="save('3')">确认</el-button>
            <el-button type="text" @click="closeEdit('3')">取消</el-button>
          </span>
        </div>
        <jm-form 
          class="mr20"
          :columns="columns3" 
          :formData="formData" 
          :hideBorder="disabled3"
          :labelPosition="'left'"
          :disabled="disabled3"
          :showButton="false"
          @submitForm=submitForm
          ref="jmform3">
        </jm-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { faultCaseListDetails } from '@/api/knowledge'
import JmForm from "@/components/JmForm";
  export default {
    name:'faults_details',
    components: { 
      JmForm,
    },
    data(){
      return {
        disabled3: true,
        // 案例详情
        infoList:[
          {label:'案例编码',value:'A2309100001'},
          {label:'故障代码',value:'GZ0001'},
          {label:'故障名称',value:'电机转子不平衡'},
          {label:'故障分类',value:'电气故障'},
          {label:'设备名称',value:'空压机'},
          {label:'设备编码',value:'SXJMSYK001'},
          {label:'规格型号',value:'EBZ260A'},
          {label:'设备类别',value:'洗选设备'},
          {label:'故障部件',value:'电机'},
          {label:'故障等级',value:'A级'},
          {label:'故障时间',value:'2022-05-17'},
          {label:'是否特种设备',value:'否'},
          {label:'是否停机',value:'否'},
          {label:'工单编码',value:'GDDZWX23090001'},
          {label:'工单名称',value:'空压机电机转子不平衡'},
          {label:'工单类型',value:'队组维修'},
          {label:'故障描述',value:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。',span:4},
          {label:'故障图片',value:[{src:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'}],type:'img',srcList:['https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg']},
        ],
        // 处理信息
        infoList1:[
          {label:'维修单位',value:'XXX队组维修队'},
          {label:'执行人员',value:'李凡'},
          {label:'维修结果',value:'完成'},
          {label:'是否更换备件',value:'是'},
          {label:'维修开始',value:'2022-05-17 09:57:32'},
          {label:'维修结束',value:'2022-05-17 10:57:32'},
          {label:'维修工时',value:'3.5h',span:2},
          {label:'故障详情',value:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。',span:4},
          {label:'故障原因',value:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。',span:4},
          {label:'维修措施',value:'不平衡故障症状特征：振动主频率等于转子转速；径向振动占优势；振动相位稳定；振动随转速平方变化；振动相位偏移方向与测量方向成正比。',span:4},
        ],
        // 备件记录
        table:{
          header:[
           {label:'备件编码',prop:'date'},
           {label:'备件名称',prop:'name'},
           {label:'备件类别',prop:'address'},
           {label:'规格型号',prop:'xh'},
           {label:'供应商名称',prop:'mc'},
           {label:'使用部位',prop:'bw'},
           {label:'更换数量',prop:'sl'},
           {label:'单位',prop:'dw'},
           {label:'原件编码',prop:'bm'},
           {label:'更换时间',prop:'sj'},
          ],
          list:[
            { date: '2016-05-02', name: '王小虎', address: '上海市普陀'},
            { date: '2016-05-02', name: '王小虎', address: '上海市普陀'},
            { date: '2016-05-02', name: '王小虎', address: '上海市普陀'},
            { date: '2016-05-02', name: '王小虎', address: '上海市普陀'},
            { date: '2016-05-02', name: '王小虎', address: '上海市普陀'},
          ]
        },
        // 补充对策
        columns3:[
          { label:"预防对策", prop:"propertyNv", span: 24,formType:'textarea'},
          { label:"补充说明：", prop:"propertyNv", span: 24,formType:'textarea' },
          // { label:"故障分类", prop:"propertyType", formType: 'select', options: [], span: 12, },
        ],
        formData:{}, //   表格value 
        id:''
      }
    },
    mounted(){
      this.getRouteData();
    },
    methods:{
      // 获取路由参数
      getRouteData(){
        let id = this.$route.query.id
        if(id){
          this.id = id
        }
      },
      // 获取详情
      getDetails(){
        faultCaseListDetails().then(res=>{
          conosle.log(res)
        })
      },
      //保存
      save(formref){
        this.$refs['jmform'+formref].submitForm()
      },
      // 表单回调
      submitForm(val){
        console.log(val)
      },
      closeEdit(formref){
        this.disabled3 = true
      },
    }
  }
</script>

<style lang="scss" scoped>
.title{
  background-color: #F7F8FA;
  height: 50px;
  line-height: 50px;
  i{
    font-size: 25px;
    color: #1F77FC;
    margin-right: 10px;
  }
}
.detail_item{
  padding: 20px;
}
  .subtitle{
    border-left: 5px solid #1F77FC;
    background: #ebf4fc;
    line-height: 40px;
    margin-bottom: 20px;
    & > .rightbutton{
      margin-right: 20px;
      float: right;
    }
    i{
      margin-right: 10px;
      color:#1F77FC;
    }
  }
  ::v-deep .el-card__body{
    padding: 5px;
  }
  ::v-deep .hideBorder .el-textarea__inner{
    background-color: #f5f7fa !important;
  }
</style>