<template>
  <div class="pageStyle">
    <el-card class="box-card1" shadow="never">
      <div class="title1"><i class="el-icon-document"></i>案例详情</div>
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
      <div class="title1"><i class="el-icon-document"></i>解决方案</div>
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
          <el-table-column v-for="(item,index) in table.header" :key="index" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true"></el-table-column>
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
import { getWomInfo,getWomAttachmentList,getWomRepairInfo,getWomRepairInfoOut,faultCaseEdit,getFaultCaseEdit } from '@/api/knowledge'
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
          {label:'案例编码',value:'',prop:'caseNo'},
          {label:'故障代码',value:'',prop:'faultCode'},
          {label:'故障名称',value:'',prop:'faultName'},
          {label:'故障分类',value:'',prop:'faultType'},
          {label:'设备名称',value:'',prop:'deviceName'},
          {label:'设备编码',value:'',prop:'deviceCode'},
          {label:'规格型号',value:'',prop:'specs'},
          {label:'设备类别',value:'',prop:'deviceType'},
          {label:'故障部件',value:'',prop:'faultLocation'},
          {label:'故障等级',value:'',prop:'faultGrade'},
          {label:'故障时间',value:'',prop:'faultDate'},
          {label:'是否特种设备',value:'',prop:'specialFlag'},
          {label:'是否停机',value:'',prop:'haltFlag'},
          {label:'工单编码',value:'',prop:'orderCode'},
          {label:'工单名称',value:'',prop:'orderName'},
          {label:'工单类型',value:'',prop:'orderType'},
          {label:'故障描述',value:'',span:4,prop:'faultInfo'},
          {label:'故障图片',value:[],type:'img',srcList:[],prop:'fileList'},
        ],
        // 处理信息
        infoList1:[],
        // 备件记录
        table:{
          header:[
           {label:'备件编码',prop:'attachmentCode'},
           {label:'备件名称',prop:'attachmentName'},
           {label:'备件类别',prop:'attachmentType'},
           {label:'规格型号',prop:'specs'},
           {label:'供应商名称',prop:'supplierName'},
           {label:'使用部位',prop:'location'},
           {label:'更换数量',prop:'replaceNum'},
           {label:'单位',prop:'unit'},
           {label:'原件编码',prop:'scriptCode'},
           {label:'更换时间',prop:'createTime'},
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
          { label:"预防对策", prop:"prevention", span: 24,formType:'textarea'},
          { label:"补充说明：", prop:"footNote", span: 24,formType:'textarea' },
        ],
        formData:{
          prevention:'',
          footNote:''
        }, //   表格value 
        orderCode:'', // 工单编码
        deviceCode:'', // 设备编码
        orderType:'', // 工单类型
        detailsId:'', // ID
      }
    },
    mounted(){
      this.getRouteData();
    },
    methods:{
      // 获取路由参数
      getRouteData(){
        console.log(this.$route.query)
        let routeData = this.$route.query
        this.orderCode = routeData.orderCode
        this.deviceCode = routeData.deviceCode
        this.detailsId =routeData.id
        if(this.orderCode && this.deviceCode){
          this.getDetails(routeData)
        }
        if(this.detailsId){
          this.getDcbcInfo()
        }
        this.getBjjlInfo()
      },
      // 获取详情信息
      getDetails(row){
        // console.log(row)
        // 工单信息
        console.log(this.deviceCode)
        let params = {
          deviceCode:this.deviceCode,
          orderCode:this.orderCode,
        }
        getWomInfo(params).then(res=>{
          console.log(res,'工单基本信息')
          this.orderType = res.data.orderType
          this.infoList.forEach(item=>{    
            let value = res.data[item.prop] || res.data.faultInfoDTO[item.prop]
            if(item.prop == 'fileList'){
              if(res.data.faultInfoDTO.fileList.length){
                res.data.fileList.forEach(items=>{
                  items.src = items.url
                  item.srcList.push(items.url)
                })
                item.value = value
              }
            }else if(['haltFlag'].includes(item.prop)){
              item.value = res.data[item.prop] === 0?'否':'是'
            }else if(['caseNo'].includes(item.prop)){
              item.value = this.$route.query.caseNo
            }else{
              item.value = value
            }
          })
          if(this.orderType == 'WWWX'){
            this.getWWWXInfo()
          }else{
            this.getClxxInfo()
          }
        })
      },
      // 获取备件记录
      getBjjlInfo(){
        getWomAttachmentList({orderCode:this.orderCode}).then(res=>{
          console.log(res,'备件记录')
          this.table.list = res.data
        })
      },
      // 获取【维修】处理信息
      getClxxInfo(){
        // 处理信息
        getWomRepairInfo({orderCode:this.orderCode}).then(res=>{
          console.log(res,'处理【维修】信息')
          this.infoList1 = [
            {label:'工单编码',value:'',prop:'orderCode'},
            {label:'维修单位',value:'',prop:'unit'},
            {label:'执行人员',value:'',prop:'executor'},
            {label:'维修开始',value:'',prop:'startTime'},
            {label:'维修结束',value:'',prop:'endTime'},
            {label:'维修工时',value:'',prop:'workHours'},
            {label:'是否完成维修',value:'',prop:'finishFlag'},
            {label:'是否更换备件',value:'', prop:'attachmentFlag'},
            {label:'故障类型',value:'',prop:'faultType'},
            {label:'维修措施',value:'',span:3,prop:'repairInfo'},
            {label:'故障原因',value:'',span:4,prop:'faultReason'},
            {label:'故障详情',value:'',span:4,prop:''},
          ]
          this.infoList1.forEach(item=>{
            if(['finishFlag','attachmentFlag','haltFlag'].includes(item.prop)){
              let val = res.data[item.prop] === 0?'否':'是'
              item.value = val
            }else{
              item.value = res.data[item.prop]
            }
            
          })
        })
      },
      // 获取【委外维修】处理信息
      getWWWXInfo(){
        getWomRepairInfoOut({orderCode:this.orderCode}).then(res=>{
          console.log(res,'处理信息')
          this.infoList1 = [
            {label:'工单编码',value:'',prop:'orderCode'},
            {label:'委外维修单位',value:'',prop:'unit'},
            {label:'委外单位负责人',value:'',prop:'director'},
            {label:'联系方式',value:'',prop:'phonenumber'},
            {label:'设备状态鉴定结果',value:'',prop:'identityResult'},
            {label:'设备状态验收结果',value:'',prop:'acceptResult'},
            {label:'鉴定报告',value:'',span:4,prop:'identityFile'},
            {label:'验收报告',value:'',span:4,prop:'acceptFile'},
            {label:'备注',value:'',span:4,prop:'remark'},
          ]
          this.infoList1.forEach(item=>{
            item.value = res.data[item.prop]
          })
        })
      },
      // 获取对策补充
      getDcbcInfo(){
        let params = {
          id:this.detailsId
        }
        getFaultCaseEdit(params).then(res=>{
          console.log(res,'对策补充')
          this.formData.prevention = res.data.prevention
          this.formData.footNote = res.data.footNote
          console.log(this.formData)
        })
      },
      //保存
      save(formref){
        this.$refs['jmform'+formref].submitForm()
      },
      // 表单回调
      submitForm(val){
        // console.log(val)
        let params = {
          ...val,
          id:this.detailsId
        }
        faultCaseEdit(params).then(res=>{
          console.log(res)
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.disabled3 = true
        })
      },
      closeEdit(formref){
        this.disabled3 = true
      },
    }
  }
</script>

<style lang="scss" scoped>
.title1{
  background-color: #F7F8FA;
  height: 50px;
  line-height: 50px;
  text-align: left;
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