<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-document">已办任务</span>
        <el-button
          style="float: right"
          size="mini"
          type="danger"
          @click="goBack"
          >关闭</el-button
        >
      </div>
      <el-tabs tab-position="top" v-model="activeName" @tab-click="handleClick">
        <!--表单信息-->
        <el-tab-pane label="表单信息" name="1" v-if="!readonly">
          <el-col :span="24">
            <div class="test-form">
              <parser
                v-if="variablesData"
                :key="new Date().getTime()"
                :form-conf="variablesData"
              />
              <!-- 批量设备 -->
              <device-list
                v-if="batch==1"
                :batchId='batchId'
              ></device-list>
              <!-- 设备档案详情 -->
              <device-detail
                v-if="batch==0&&path == '/device/book/details'"
                :detailReadonly="true"
                :detailId="taskForm.businessId"
              ></device-detail>
              <receive-detail
                v-if="path == '/property/receiveControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
                :isShow="true"
              ></receive-detail>
              <backspace-detail
                v-if="path == '/property/backspaceControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></backspace-detail>
              <annual-detail
                v-if="path == '/property/purchase/annualControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></annual-detail>
              <temporarily-detail
                v-if="path == '/property/purchase/temporarilyControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></temporarily-detail>
              <scrapping-detail
                v-if="path == '/property/scrappingControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></scrapping-detail>
              <positionChange-detail
                v-if="path == '/property/positionChangeControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></positionChange-detail>
              <turnOver-detail
                v-if="path == '/property/turnOverControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></turnOver-detail>
              <spareReceive-detail
                v-if="path == '/sparepart/spareReceiveControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></spareReceive-detail>
              <requirement-detail
                v-if="path == '/sparepart/requirementControls'"
                :detailReadonly="true"
                :businessId="taskForm.businessId"
              ></requirement-detail>
            </div>
          </el-col>
        </el-tab-pane>
        <!--流程流转记录-->
        <el-tab-pane label="流转记录" name="2">
          <el-col :span="16" :offset="4">
            <div class="block">
              <!--<el-timeline>
                <el-timeline-item
                  v-for="(item,index ) in flowRecordList"
                  :key="index"
                  :icon="setIcon(item.finishTime)"
                  :color="setColor(item.finishTime)"
                >
                  <p style="font-weight: 700">{{item.taskName}}</p>
                  <el-card :body-style="{ padding: '10px' }">
                    <el-descriptions class="margin-top" :column="1" size="small" border>
                      <el-descriptions-item v-if="item.assigneeName" label-class-name="my-label">
                        <template slot="label"><i class="el-icon-user"></i>办理人</template>
                        {{item.assigneeName}}
                        <el-tag type="info" size="mini">{{item.deptName}}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.candidate" label-class-name="my-label">
                        <template slot="label"><i class="el-icon-user"></i>候选办理</template>
                        {{item.candidate}}
                      </el-descriptions-item>
                      <el-descriptions-item label-class-name="my-label">
                        <template slot="label"><i class="el-icon-date"></i>接收时间</template>
                        {{item.createTime}}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.finishTime" label-class-name="my-label">
                        <template slot="label"><i class="el-icon-date"></i>处理时间</template>
                        {{item.finishTime}}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.duration"  label-class-name="my-label">
                        <template slot="label"><i class="el-icon-time"></i>耗时</template>
                        {{item.duration}}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.comment" label-class-name="my-label">
                        <template slot="label"><i class="el-icon-tickets"></i>处理意见</template>
                        {{item.comment.comment}}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-timeline-item>
              </el-timeline> -->
              <ul>
                <li
                  class="linetime"
                  v-for="(item, index) in flowRecordList"
                  :key="index"
                >
                  <el-card :body-style="{ padding: '10px' }">
                    <p>
                      <span v-if="item.activityType == 'startEvent'"
                        >发起人:</span
                      >{{
                        item.assigneeName
                          ? item.assigneeName
                          : "" +
                            (item.duration ? "(" + item.duration + ")" : "")
                      }}
                    </p>
                    <p
                      style="color: #02b606"
                      v-if="item.comment && item.comment.type == 1"
                    >
                      同意
                    </p>
                    <p
                      style="color: #ea0000"
                      v-if="item.comment && item.comment.type == 3"
                    >
                      驳回
                    </p>
                    <p>{{ item.comment ? item.comment.comment : "" }}</p>
                    <p>{{ item.createTime }}</p>
                  </el-card>
                </li>
              </ul>
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="流程图" name="3">
          <flow :flowData="flowData" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import  deviceList  from "@/views/flowable/task/myProcess/deviceList";
import { flowRecord } from "@/api/flowable/finished";
import Parser from "@/components/parser/Parser";
import { getProcessVariables, flowXmlAndNode } from "@/api/flowable/definition";
import flow from "@/views/flowable/task/finished/detail/flow";
import deviceDetail from "@/views/device/book/details";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import receiveDetail from "@/views/property/Receive/ui/index";
import backspaceDetail from "@/views/property/Backspace/ui/index";
import turnOverDetail from "@/views/property/TurnOver/ui/index";
import ScrappingDetail from "@/views/property/Scrapping/ui/index";
import AnnualDetail from "@/views/property/equipmentAcquisition/Annual/ui/index2";
import TemporarilyDetail from "@/views/property/equipmentAcquisition/Temporarily/ui/index2";
import PositionChangeDetail from "@/views/property/PositionChange/ui/index";
import spareReceiveDetail from "@/views/sparepart/spareReceive/ui/index";
import requirementDetail from "@/views/sparepart/requirement/ui/index";

export default {
  name: "Record",
  components: {
    Parser,
    flow,
    deviceDetail,
    receiveDetail,
    backspaceDetail,
    turnOverDetail,
    ScrappingDetail,
    AnnualDetail,
    TemporarilyDetail,
    PositionChangeDetail,
    spareReceiveDetail,
    requirementDetail,
    deviceList
  },
  props: {},
  data() {
    return {
      // 模型xml数据
      flowData: {},
      activeName: "1",
      // 用户表格数据
      userList: null,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        deptId: undefined,
      },
      // 遮罩层
      loading: true,
      flowRecordList: [], // 流程流转数据
      formConfCopy: {},
      src: null,
      taskForm: {
        multiple: false,
        comment: "", // 意见内容
        procInsId: "", // 流程实例编号
        instanceId: "", // 流程实例编号
        deployId: "", // 流程定义编号
        taskId: "", // 流程任务编号
        procDefId: "", // 流程编号
        vars: "",
        targetKey: "",
      },
      variables: [], // 流程变量数据
      variablesData: {}, // 流程变量数据
      variableOpen: false, // 是否加载流程变量数据
      path: "",
      readonly: false,
    };
  },
  created() {
    this.taskForm.deployId = this.$route.query && this.$route.query.deployId;
    this.taskForm.taskId = this.$route.query && this.$route.query.taskId;
    this.taskForm.procInsId = this.$route.query && this.$route.query.procInsId;
    this.taskForm.businessId = this.$route.query.businessId;
    this.readonly = this.$route.query.readonly;
    this.batch = this.$route.query.batch
      this.batchId = this.$route.query.batchId
    if (this.readonly) this.activeName = "2";
    // 回显流程记录
    // 流程任务重获取变量表单
    if (this.taskForm.taskId) {
      this.processVariables(this.taskForm.taskId);
    }
    this.getFlowRecordList(this.taskForm.procInsId, this.taskForm.deployId);
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "3") {
        flowXmlAndNode({
          procInsId: this.taskForm.procInsId,
          deployId: this.taskForm.deployId,
        }).then((res) => {
          this.flowData = res.data;
        });
      }
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
      const that = this;
      const params = { procInsId: procInsId, deployId: deployId };
      flowRecord(params)
        .then((res) => {
          that.flowRecordList = res.data.flowList;
        })
        .catch((res) => {
          this.goBack();
        });
    },
    /** 获取流程变量内容 */
    processVariables(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        getProcessVariables(taskId).then((res) => {
          this.path = res.data.path ? res.data.path : "";
          //this.variablesData = res.data.variables;
          this.variableOpen = true;
        });
      }
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      /* const obj = { path: "/task/finished", query: { t: Date.now()} };
      this.$tab.closeOpenPage(obj); */
      this.$tab.closePage();
    },
  },
};
</script>
<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 100% !important;
  padding: 0px 15px;
  padding-right: 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.my-label {
  background: #e1f3d8;
}
.linetime {
  list-style: none;
  border-left: 4px solid #d9d9d9;
  padding: 20px;
  position: relative;
}
.linetime::before {
  content: "";
  width: 20px;
  height: 20px;
  background: white;
  border: 4px solid #1890ff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
}
.el-card {
  padding-left: 10px;
}
.app-container {
  padding: 0 12px;
}
</style>
