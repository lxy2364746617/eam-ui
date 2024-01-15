<template>
  <div class="app-container">
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span class="el-icon-document">已发任务</span>
        <el-button style="float: right;" size="mini" type="danger" @click="goBack">关闭</el-button>
      </div>
      <el-tabs  tab-position="top" v-model="activeName" @tab-click="handleClick">
        <!--表单信息-->
        <el-tab-pane label="表单信息" name="1" v-if="isDetail">
          <el-col :span="16" :offset="4">
            <div class="test-form">
                <parser :key="new Date().getTime()" :form-conf="variablesData" />
            </div>
         </el-col>
        </el-tab-pane>
        <!--流程流转记录-->
        <el-tab-pane label="流转记录" name="2" v-if="!isDetail">
          <!-- <el-col :span="8">
            <flow :flowData="flowData"/>
          </el-col> -->
          <el-col :span="16"  :offset="4">
            <div class="block">
              <!-- <el-timeline>
                <el-timeline-item icon='el-icon-plus'>

                </el-timeline-item>
                <el-timeline-item
                  v-for="(item,index ) in flowRecordList"
                  :key="index"
                  
                  placement="top"
                >
                   <p style="font-weight: 700">{{item.taskName}}</p> 
                  <el-card :body-style="{ padding: '10px' }">
                    <p>{{item.assigneeName+'('+item.duration+')'}}</p>
                    <p>同意</p>
                    <p>具体意见。。。</p>
                    <p>{{item.finishTime}}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline> -->
              <ul>
                <li class="linetime" v-for="(item,index ) in flowRecordList" :key="index">
                 <el-card :body-style="{ padding: '10px' }">
                    <p>{{item.assigneeName+(item.duration? ('('+item.duration+')'):'')}}</p>
                    <p style="color:#02B606" v-if="item.comment&&item.comment.type==1">同意</p>
                    <p style="color:#EA0000" v-if="item.comment&&item.comment.type==3">驳回</p>
                    <p>{{item.comment?item.comment.comment:''}}</p>
                    <p>{{item.createTime}}</p>
                  </el-card>
                  </li>
              </ul>
            </div>
          </el-col>
        </el-tab-pane>
        <!--流程图-->
        <el-tab-pane label="流程图" name="3" v-if="!isDetail">
          <flow :flowData="flowData"/>
        </el-tab-pane>
    </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {flowRecord} from "@/api/flowable/finished";
import Parser from '@/components/parser/Parser'
import {getProcessVariables, readXml, getFlowViewer, getHighlight, flowXmlAndNode} from "@/api/flowable/definition";
import flow from '@/views/flowable/task/myProcess/detail/flow'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Record",
  components: {
    Parser,
    flow
  },
  props: {},
  data() {
    return {
      isDetail:false,
      // 模型xml数据
      flowData: {},
      activeName: '1',
      // 查询参数
      queryParams: {
        deptId: undefined
      },
      // 遮罩层
      loading: true,
      flowRecordList: [], // 流程流转数据
      taskForm:{
        multiple: false,
        comment:"", // 意见内容
        procInsId: "", // 流程实例编号
        instanceId: "", // 流程实例编号
        deployId: "",  // 流程定义编号
        taskId: "" ,// 流程任务编号
        procDefId: "",  // 流程编号
      },
      variablesData: {}, // 流程变量数据
    };
  },
  created() {
    this.taskForm.deployId = this.$route.query && this.$route.query.deployId;
    this.taskForm.taskId  = this.$route.query && this.$route.query.taskId;
    this.taskForm.procInsId = this.$route.query && this.$route.query.procInsId;
    this.isDetail=this.$route.query.isDetail=='true'?true:false
    this.activeName=this.isDetail?'1':'2'
    // 回显流程记录
    // 流程任务重获取变量表单
    this.processVariables( this.taskForm.taskId)
    this.getFlowRecordList(this.taskForm.procInsId, this.taskForm.deployId);
    flowXmlAndNode({procInsId:this.taskForm.procInsId,deployId:this.taskForm.deployId}).then(res => {
          this.flowData = res.data;
        })
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === '3'){
        flowXmlAndNode({procInsId:this.taskForm.procInsId,deployId:this.taskForm.deployId}).then(res => {
          this.flowData = res.data;
        })
      }
    },
    getFlowViewer(procInsId,executionId) {
      getFlowViewer(procInsId,executionId).then(res => {
        this.taskList = res.data
      })
    },
    setIcon(val) {
      if (val) {
        return "el-icon-check";
      } else {
        return "el-icon-time";
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418";
      } else {
        return "#b3bdbb";
      }
    },
    /** 流程流转记录 */
    getFlowRecordList(procInsId, deployId) {
      const that = this
      const params = {procInsId: procInsId, deployId: deployId}
      flowRecord(params).then(res => {
        that.flowRecordList = res.data.flowList;
      }).catch(res => {
        this.goBack();
      })
    },
    fillFormData(form, data) {
      form.fields.forEach((item) => {
        const vModel = item.__vModel__;
        const val = data[item.__vModel__];

        // 特殊处理el-upload，回显图片
        if (item.__config__.tag === "el-upload") {
          // 回显图片
          item["file-list"] = (val || []).map((url) => ({
            name: `${vModel}${i}`,
            url,
          }));
        }

        if (val) {
          item.__config__.defaultValue = val;
        }
      });
    },
    /** 获取流程变量内容 */
    processVariables(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        getProcessVariables(taskId).then(res => {
          this.variablesData = res.data.variables;
        });
      }
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      const obj = this.$route
      this.$tab.closePage1(obj);
    },
  }
};
</script>
<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.my-label {
  background: #E1F3D8;
}
.linetime{
  list-style:none;
  border-left:4px solid #D9D9D9;
  padding:20px;
  position: relative;
}
.linetime::before{
  content:'';
  width: 20px;
  height: 20px;
  background: white;
  border: 4px solid #1890FF;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
}
.el-card{
  padding-left: 10px;
}
</style>
