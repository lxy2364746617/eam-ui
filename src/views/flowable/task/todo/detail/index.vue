<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-document">
          {{ readonly ? "审批流程" : "待办任务" }}</span
        >
        <el-tag v-if="!readonly" style="margin-left: 10px"
          >发起人:{{ startUser }}</el-tag
        >
        <el-tag v-if="!readonly">任务节点:{{ taskName }}</el-tag>
        <el-button
          style="float: right"
          size="mini"
          type="danger"
          @click="goBack"
          >关闭</el-button
        >
      </div>
      <div style="position: relative">
        <el-tabs
          tab-position="top"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <!--表单信息-->
          <el-tab-pane label="表单信息" name="1" v-if="!readonly">
            <el-col :span="24">
              <div class="test-form">
                <parser
                  v-if="variablesData"
                  :key="new Date().getTime()"
                  :form-conf="variablesData"
                  @submit="submitForm"
                  ref="parser"
                />
                <!-- 设备档案详情 -->
                <device-detail
                  v-if="path == '/device/book/details'"
                  :detailReadonly="true"
                  :detailId="taskForm.businessId"
                ></device-detail>
                <receive-detail
                  style="overflow: none"
                  v-if="path == '/property/receiveControls'"
                  :detailReadonly="true"
                  :businessId="taskForm.businessId"
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
                  v-if="path == '/property/temporarilyControls'"
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

                <adminParentdevice
                  v-if="
                    taskName === '设备管理员' &&
                    path == '/property/receiveControls'
                  "
                  @equipmentList="handlerDeviceList"
                ></adminParentdevice>

                <adminParentdevice3
                  v-if="
                    taskName !== '设备管理员' &&
                    path == '/property/receiveControls'
                  "
                  :detailReadonly="true"
                  :businessId="taskForm.businessId"
                ></adminParentdevice3>
              </div>
              <div>
                <!-- <el-button v-if="!formKeyExist" icon="el-icon-edit-outline" type="success" size="mini"
                         @click="handleComplete">审批
              </el-button>-->
              </div>
            </el-col>
          </el-tab-pane>
          <!--流程流转记录-->
          <el-tab-pane label="流转记录" name="2">
            <!--flowRecordList-->
            <el-col :span="16" :offset="4">
              <div class="block">
                <!-- <el-timeline>
                <el-timeline-item v-for="(item,index ) in flowRecordList" :key="index" :icon="setIcon(item.finishTime)" :color="setColor(item.finishTime)">
                  <p style="font-weight: 700">{{ item.taskName }}</p>
                  <el-card :body-style="{ padding: '10px' }">
                    <el-descriptions class="margin-top" :column="1" size="small" border>
                      <el-descriptions-item v-if="item.assigneeName" label-class-name="my-label">
                        <template slot="label">
                          <i class="el-icon-user"></i>办理人
                        </template>
                        {{ item.assigneeName }}
                        <el-tag type="info" size="mini">{{ item.deptName }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.candidate" label-class-name="my-label">
                        <template slot="label">
                          <i class="el-icon-user"></i>候选办理
                        </template>
                        {{ item.candidate }}
                      </el-descriptions-item>
                      <el-descriptions-item label-class-name="my-label">
                        <template slot="label">
                          <i class="el-icon-date"></i>接收时间
                        </template>
                        {{ item.createTime }}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.finishTime" label-class-name="my-label">
                        <template slot="label">
                          <i class="el-icon-date"></i>处理时间
                        </template>
                        {{ item.finishTime }}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.duration" label-class-name="my-label">
                        <template slot="label">
                          <i class="el-icon-time"></i>耗时
                        </template>
                        {{ item.duration }}
                      </el-descriptions-item>
                      <el-descriptions-item v-if="item.comment" label-class-name="my-label">
                        <template slot="label">
                          <i class="el-icon-tickets"></i>处理意见
                        </template>
                        {{ item.comment.comment }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-timeline-item>
              </el-timeline> -->
                <ul>
                  <li
                    :class="{
                      linetime: true,
                      linetime_finished:
                        item.processStatus == 'completed' ||
                        item.processStatus == null,
                      linetime_running: item.processStatus == 'running',
                    }"
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
                            : item.candidate +
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
          <!--流程图-->
          <el-tab-pane label="流程图" name="3">
            <flow :flowData="flowData" />
          </el-tab-pane>
        </el-tabs>
        <div v-if="activeName == 1 && !readonly" class="tab_btn">
          <el-row v-if="nextFlow">
            <el-col :span="24">
              <el-form ref="taskForm" :model="taskForm" label-width="120px">
                <!-- <el-form-item label="备注" prop="comment" :rules="[{ required: true, message: '请输入审批意见', trigger: 'blur' }]">
                <el-input type="textarea" :rows="5" v-model="taskForm.comment" placeholder="请输入审批意见" />
              </el-form-item> -->
                <el-form-item label="下级审批人" prop="nextUserIds">
                  <el-tag
                    :key="index"
                    v-for="(item, index) in nextUser"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(item)"
                    >{{ item.nickName }}</el-tag
                  >
                  <el-button
                    class="button-new-tag"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    circle
                    @click="onSelectNextUsers"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row v-if="!readonly" :gutter="10" type="flex" justify="center">
            <el-col :span="1.5">
              <el-button
                icon="el-icon-circle-check"
                type="success"
                @click="handleComplete"
                >同意</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                icon="el-icon-circle-close"
                type="danger"
                @click="handleReject"
                >终止(打回发起人)</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                icon="el-icon-chat-line-square"
                type="primary"
                @click="handleFinish"
                >审批通过结束</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
      <!--审批任务-->
      <el-dialog
        :title="completeTitle"
        :visible.sync="completeOpen"
        width="40%"
        append-to-body
      >
        <el-form ref="taskForm" :model="taskForm">
          <!-- <el-form-item prop="targetKey">
            <flow-user v-if="checkSendUser" :checkType="checkType" @handleUserSelect="handleUserSelect"></flow-user>
            <flow-role v-if="checkSendRole" @handleRoleSelect="handleRoleSelect"></flow-role>
          </el-form-item> -->
          <el-form-item label="处理意见" label-width="80px" prop="comment">
            <el-input
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入处理意见"
              rows="5"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="completeOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskComplete">确 定</el-button>
        </span>
      </el-dialog>
      <!--退回流程-->
      <el-dialog
        :title="returnTitle"
        :visible.sync="returnOpen"
        width="40%"
        append-to-body
      >
        <el-form ref="taskForm" :model="taskForm" label-width="80px">
          <el-form-item label="退回节点" prop="targetKey">
            <el-radio-group v-model="taskForm.targetKey">
              <el-radio-button
                v-for="item in returnTaskList"
                :key="item.id"
                :label="item.id"
                >{{ item.name }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="退回意见"
            prop="comment"
            :rules="[
              { required: true, message: '请输入意见', trigger: 'blur' },
            ]"
          >
            <el-input
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入意见"
              rows="5"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="returnOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskReturn">确 定</el-button>
        </span>
      </el-dialog>
      <!--驳回流程-->
      <el-dialog
        :title="rejectTitle"
        :visible.sync="rejectOpen"
        width="40%"
        append-to-body
      >
        <el-form ref="taskForm" :model="taskForm" label-width="80px">
          <el-form-item
            label="驳回意见"
            prop="comment"
            :rules="[
              { required: true, message: '请输入意见', trigger: 'blur' },
            ]"
          >
            <el-input
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入意见"
              rows="5"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskReject">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 通过并结束 -->
      <el-dialog
        :title="finishTitle"
        :visible.sync="finishOpen"
        width="40%"
        append-to-body
      >
        <el-form ref="taskForm" :model="taskForm">
          <!-- <el-form-item prop="targetKey">
            <flow-user v-if="checkSendUser" :checkType="checkType" @handleUserSelect="handleUserSelect"></flow-user>
            <flow-role v-if="checkSendRole" @handleRoleSelect="handleRoleSelect"></flow-role>
          </el-form-item> -->
          <el-form-item label="处理意见" label-width="80px" prop="comment">
            <el-input
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入处理意见"
              rows="5"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="finishOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskFinish">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <el-drawer
      :title="userData.title"
      :visible.sync="userData.open"
      size="50%"
      append-to-body
    >
      <el-row type="flex" :gutter="20">
        <el-col :span="20" :offset="2">
          <el-table
            ref="userTable"
            height="500"
            :data="userList"
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column width="55" type="selection" />
            <el-table-column label="用户名" align="center" prop="userName" />
            <el-table-column label="姓名" align="center" prop="nickName" />
            <el-table-column label="岗位" align="center" prop="postName" />
            <el-table-column label="班组" align="center" prop="userGroup" />
            <el-table-column label="部门" align="center" prop="dept.deptName" />
            <el-table-column label="手机" align="center" prop="phonenumber" />
          </el-table>
          <pagination
            v-if="userList"
            :total="userList.length"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getUserList"
          />
        </el-col>
      </el-row>
      <span style="display: block; qidth: 100%; text-align: center">
        <el-button @click="userData.open = false">取 消</el-button>
        <el-button type="primary" @click="submitUserData">确 定</el-button>
      </span>
    </el-drawer>
  </div>
</template>

<script>
import { flowRecord } from "@/api/flowable/finished";
import FlowUser from "@/components/flow/User";
import FlowRole from "@/components/flow/Role";
import Parser from "@/components/parser/Parser";
import deviceDetail from "@/views/device/book/details";
import {
  getProcessVariables,
  flowXmlAndNode,
  definitionStart,
} from "@/api/flowable/definition";
import {
  complete,
  rejectTask,
  returnList,
  returnTask,
  getNextFlowNode,
  delegate,
  flowTaskForm,
  userList,
  completeFinish,
} from "@/api/flowable/todo";
import { addNeckApprove } from "@/api/property/receive.js";
import flow from "@/views/flowable/task/todo/detail/flow";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listUser } from "@/api/system/user";
import receiveDetail from "@/views/property/Receive/ui/index";
import backspaceDetail from "@/views/property/Backspace/ui/index";
import turnOverDetail from "@/views/property/TurnOver/ui/index";
import ScrappingDetail from "@/views/property/Scrapping/ui/index";
import AnnualDetail from "@/views/property/equipmentAcquisition/Annual/ui/index2";
import TemporarilyDetail from "@/views/property/equipmentAcquisition/Temporarily/ui/index2";
import PositionChangeDetail from "@/views/property/PositionChange/ui/index";
import spareReceiveDetail from "@/views/sparepart/spareReceive/ui/index";
import requirementDetail from "@/views/sparepart/requirement/ui/index";
import adminParentdevice from "@/views/property/Receive/ui/adminParentdevice";
import adminParentdevice3 from "@/views/property/Receive/ui/adminParentdevice3";
export default {
  name: "Record",
  components: {
    Parser,
    flow,
    FlowUser,
    FlowRole,
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
    adminParentdevice,
    adminParentdevice3,
  },
  props: {},
  data() {
    return {
      // 模型xml数据
      xmlData: "",
      flowData: {},
      activeName: "1",
      // 部门名称
      deptName: undefined,
      // 部门树选项
      // 用户表格数据
      userList: null,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
      },
      // 遮罩层
      loading: true,
      flowRecordList: [], // 流程流转数据
      formConfCopy: {},
      src: null,
      rules: {}, // 表单校验
      variablesForm: {}, // 流程变量数据
      taskForm: {
        returnTaskShow: false, // 是否展示回退表单
        delegateTaskShow: false, // 是否展示回退表单
        defaultTaskShow: true, // 默认处理
        comment: "", // 意见内容
        procInsId: "", // 流程实例编号
        instanceId: "", // 流程实例编号
        deployId: "", // 流程定义编号
        taskId: "", // 流程任务编号
        procDefId: "", // 流程编号
        targetKey: "",
        businessId: "", //业务id
        nextUserIds: "",
        variables: {
          variables: {},
        },
      },
      assignee: null,
      formConf: {}, // 默认表单数据
      variables: [], // 流程变量数据
      variablesData: {}, // 流程变量数据
      returnTaskList: [], // 回退列表数据
      completeTitle: null,
      completeOpen: false,
      finishOpen: false,
      finishTitle: null,
      returnTitle: null,
      returnOpen: false,
      rejectOpen: false,
      rejectTitle: null,
      userData: [],
      checkSendUser: false, // 是否展示人员选择模块
      checkSendRole: false, // 是否展示角色选择模块
      checkType: "single", // 选择类型
      taskName: null, // 任务节点
      startUser: null, // 发起人信息,
      multiInstanceVars: "", // 会签节点
      formKeyExist: false, // 当前节点是否存在表单
      userData: {
        title: "下一级审批人",
        type: "",
        open: false,
      },
      nextUser: [],

      userMultipleSelection: [],
      total: "",
      path: "",
      userobj: {},
      nextFlow: true,
      readonly: false,
      deviceList: [],
    };
  },
  created() {
    if (this.$route.query) {
      this.taskName = this.$route.query.taskName;
      this.startUser = this.$route.query.startUser;
      this.taskForm.deployId = this.$route.query.deployId;
      this.taskForm.taskId = this.$route.query.taskId;
      this.taskForm.procInsId = this.$route.query.procInsId;
      this.taskForm.executionId = this.$route.query.executionId;
      this.taskForm.instanceId = this.$route.query.procInsId;
      this.taskForm.businessId = this.$route.query.businessId;
      this.readonly = this.$route.query.readonly;
      if (this.readonly) this.activeName = "2";
      // 流程任务获取变量信息
      if (this.taskForm.taskId) {
        this.processVariables(this.taskForm.taskId);
        this.getFlowTaskForm(this.taskForm.taskId);
        getNextFlowNode({ taskId: this.$route.query.taskId }).then((res) => {
          if (res.data) {
            this.userobj = {
              flowDataType: res.data.flowDataType,
              selectUsers: res.data.assignee
                ? res.data.assignee
                : res.data.candidateGroups
                ? res.data.candidateGroups
                : res.data.candidateUsers.length > 0
                ? res.data.candidateUsers.join(",")
                : "",
              deptId: res.data.deptId ? res.data.deptId : "",
            };
            const formData = new FormData();
            Object.entries(this.userobj).forEach(([key, value]) => {
              formData.append(key, value);
            });
            userList(formData).then((res) => {
              this.userList = res.data;
            });
          } else {
            this.nextFlow = false;
          }
        });
      }

      this.getFlowRecordList(this.taskForm.procInsId, this.taskForm.deployId);
    }
  },
  methods: {
    handlerDeviceList(row) {
      this.deviceList = row.map((item) => ({
        neckNo: item.neckNo,
        deviceId: item.deviceId,
        deviceCode: item.deviceCode,
        deviceName: item.deviceName,
        targetLocation: item.targetLocation,
        specs: item.specs,
        batchNo: item.batchNo,
        categoryId: item.categoryId,
        location: item.location,
        deviceStatus: item.deviceStatus,
        targetDeviceStatus: item.targetDeviceStatus,
        createTime: item.createTime,
      }));
    },
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
    // 用户信息选中数据
    handleUserSelect(selection) {
      if (selection) {
        if (selection instanceof Array) {
          const selectVal = selection.map((item) => item.userId);
          if (this.multiInstanceVars) {
            this.$set(
              this.taskForm.variables,
              this.multiInstanceVars,
              selectVal
            );
          } else {
            this.$set(this.taskForm.variables, "approval", selectVal.join(","));
          }
        } else {
          this.$set(
            this.taskForm.variables,
            "approval",
            selection.userId.toString()
          );
        }
      }
    },
    // 角色信息选中数据
    handleRoleSelect(selection) {
      if (selection) {
        if (selection instanceof Array) {
          const selectVal = selection.map((item) => item.roleId);
          this.$set(this.taskForm.variables, "approval", selectVal.join(","));
        } else {
          this.$set(this.taskForm.variables, "approval", selection);
        }
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
    fillFormData(form, data) {
      form.fields.forEach((item) => {
        const val = data[item.__vModel__];
        if (val) {
          item.__config__.defaultValue = val;
        }
      });
    },
    /** 获取流程变量内容 */
    processVariables(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        getProcessVariables(taskId).then((res) => {
          this.path = res.data.path ? res.data.path : "";
          // this.variablesData = res.data.variables;
        });
      }
    },
    /** 流程节点表单 */
    getFlowTaskForm(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        flowTaskForm({ taskId: taskId }).then((res) => {
          this.variablesData = res.data.formData;
          this.taskForm.variables = res.data.formData;
          this.formKeyExist = res.data.formKeyExist;
        });
      }
    },
    /** 加载审批任务弹框 */
    handleComplete() {
      if (this.nextFlow && !this.taskForm.nextUserIds)
        return this.$message.error("请选择下级审批人！");
      this.taskForm.comment = "";
      this.completeOpen = true;
      this.completeTitle = "流程审批";
      /* this.submitForm(null); */
    },
    /** 用户审批任务 */
    taskComplete() {
      if (!this.taskForm.variables && this.checkSendUser) {
        this.$modal.msgError("请选择流程接收人员!");
        return;
      }
      if (!this.taskForm.variables && this.checkSendRole) {
        this.$modal.msgError("请选择流程接收角色组!");
        return;
      }
      if (this.taskForm && this.formKeyExist) {
        // 表单是否禁用
        this.taskForm.formData.formData.disabled = true;
        // 是否显示按钮
        this.taskForm.formData.formData.formBtns = false;
        this.taskForm.variables = Object.assign(
          {},
          this.taskForm.variables,
          this.taskForm.formData.valData
        );
        this.taskForm.variables.variables = this.taskForm.formData.formData;
        complete(this.taskForm).then((response) => {
          this.$modal.msgSuccess(response.msg);
          this.goBack();
        });
      } else {
        if (
          this.taskName == "设备管理员" &&
          !this.deviceList.every((item) => item.targetLocation)
        )
          return this.$message.error(
            "已选取设备的位置状态变动信息不能为空，请核查!"
          );
        if (this.taskName == "设备管理员") {
          addNeckApprove({
            neckNo: this.taskForm?.businessId,
            approveList: this.deviceList,
          }).then((res) => {
            if (res.code === 200) {
              complete(this.taskForm).then((response) => {
                this.$modal.msgSuccess(response.msg);
                this.goBack();
              });
            }
          });
          return;
        }
        // 流程设计人员类型配置为固定人员接收任务时,直接提交任务到下一步
        complete(this.taskForm).then((response) => {
          this.$modal.msgSuccess(response.msg);
          this.goBack();
        });
      }
    },
    /** 委派任务 */
    handleDelegate() {
      this.taskForm.delegateTaskShow = true;
      this.taskForm.defaultTaskShow = false;
    },
    handleAssign() {},
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      /* const obj = { path: "/task/todo", query: { t: Date.now() } };
      this.$tab.closeOpenPage(obj); */
      this.$tab.closePage();
    },
    /** 驳回任务 */
    handleReject() {
      this.taskForm.comment = "";
      this.rejectOpen = true;
      this.rejectTitle = "驳回流程";
    },
    /** 驳回任务 */
    taskReject() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          rejectTask(this.taskForm).then((res) => {
            this.$modal.msgSuccess(res.msg);
            this.goBack();
          });
        }
      });
    },
    /** 审批并结束任务 */
    handleFinish() {
      this.taskForm.comment = "";
      this.finishOpen = true;
      this.finishTitle = "审批流程";
    },
    /** 审批并结束任务 */
    taskFinish() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          if (
            this.taskName == "设备管理员" &&
            !this.deviceList.every((item) => item.targetLocation)
          )
            return this.$message.error(
              "已选取设备的位置状态变动信息不能为空，请核查!"
            );
          if (this.taskName == "设备管理员") {
            addNeckApprove({
              neckNo: this.taskForm?.businessId,
              approveList: this.deviceList,
            }).then((res) => {
              if (res.code === 200) {
                complete(this.taskForm).then((response) => {
                  this.$modal.msgSuccess(response.msg);
                  this.goBack();
                });
              }
            });
            return;
          }
          completeFinish(this.taskForm).then((res) => {
            this.$modal.msgSuccess(res.msg);
            this.goBack();
          });
        }
      });
    },
    /** 可退回任务列表 */
    handleReturn() {
      this.returnOpen = true;
      this.returnTitle = "退回流程";
      returnList(this.taskForm).then((res) => {
        this.returnTaskList = res.data;
        this.taskForm.variables = null;
      });
    },
    /** 提交退回任务 */
    taskReturn() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          returnTask(this.taskForm).then((res) => {
            this.$modal.msgSuccess(res.msg);
            this.goBack();
          });
        }
      });
    },
    /** 取消回退任务按钮 */
    cancelTask() {
      this.taskForm.returnTaskShow = false;
      this.taskForm.defaultTaskShow = true;
      this.returnTaskList = [];
    },
    /** 委派任务 */
    submitDeleteTask() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          delegate(this.taskForm).then((response) => {
            this.$modal.msgSuccess(response.msg);
            this.goBack();
          });
        }
      });
    },
    /** 取消回退任务按钮 */
    cancelDelegateTask() {
      this.taskForm.delegateTaskShow = false;
      this.taskForm.defaultTaskShow = true;
      this.returnTaskList = [];
    },
    /** 申请流程表单数据提交 */
    submitForm(formData) {
      // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
      const params = { taskId: this.taskForm.taskId };
      getNextFlowNode(params).then((res) => {
        const data = res.data;
        this.taskForm.formData = formData;
        if (data) {
          if (data.dataType === "dynamic") {
            if (data.type === "assignee") {
              // 指定人员
              this.checkSendUser = true;
              this.checkType = "single";
            } else if (data.type === "candidateUsers") {
              // 候选人员(多个)
              this.checkSendUser = true;
              this.checkType = "multiple";
            } else if (data.type === "candidateGroups") {
              // 指定组(所属角色接收任务)
              this.checkSendRole = true;
            } else {
              // 会签
              // 流程设计指定的 elementVariable 作为会签人员列表
              this.multiInstanceVars = data.vars;
              this.checkSendUser = true;
              this.checkType = "multiple";
            }
          }
        }
        this.completeOpen = true;
        this.completeTitle = "流程审批";
      });
    },
    /* 下级审批人 */
    onSelectUsers(title, type) {
      this.userData.title = title;
      this.userData.type = type;
      //this.getUserList()
      this.userData.open = true;
    },
    onSelectNextUsers() {
      this.getUserList();
      this.userMultipleSelection = this.nextUser;
      this.onSelectUsers("下级审批人");
    },
    /** 查询用户列表 */
    getUserList() {
      console.log(this.userobj);
      const formData = new FormData();
      Object.entries(this.userobj).forEach(([key, value]) => {
        formData.append(key, value);
      });
      userList(formData).then((res) => {
        this.userList = res.data;
        this.toggleSelection(this.userMultipleSelection);
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userMultipleSelection = selection;
    },
    toggleSelection(selection) {
      if (selection && selection.length > 0) {
        this.$nextTick(() => {
          selection.forEach((item) => {
            let row = this.userList.find((k) => k.userId === item.userId);
            this.$refs.userTable.toggleRowSelection(row);
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.userTable.clearSelection();
        });
      }
    },
    submitUserData() {
      if (
        !this.userMultipleSelection ||
        this.userMultipleSelection.length <= 0
      ) {
        this.$modal.msgError("请选择用户");
        return false;
      }
      let userIds = this.userMultipleSelection.map((k) => k.userId);
      this.nextUser = this.userMultipleSelection;
      this.taskForm.nextUserIds =
        userIds instanceof Array ? userIds.join(",") : userIds;
      this.userData.open = false;
    },
    // 关闭标签
    handleClose(tag) {
      let userObj = this.userMultipleSelection.find(
        (item) => item.userId === tag.id
      );
      this.userMultipleSelection.splice(
        this.userMultipleSelection.indexOf(userObj),
        1
      );
      this.nextUser = this.userMultipleSelection;
      // 设置抄送人ID
      if (this.nextUser && this.nextUser.length > 0) {
        const val = this.nextUser.map((item) => item.id);
        this.taskForm.nextUserIds = val instanceof Array ? val.join(",") : val;
      } else {
        this.taskForm.nextUserIds = "";
      }
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.button-new-tag {
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
.linetime_finished:before {
  content: "\e6da";
  font-family: element-icons !important;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #24a71e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
  font-size: 15px;
  font-weight: 900;
  color: #24a71e;
}
.linetime_running:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #006fe5;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
}
.el-card {
  padding-left: 10px;
}
.el-tabs {
  padding-bottom: 110px;
  overflow: auto;
  height: 70vh;
}
.tab_btn {
  z-index: 9;
  padding-top: 5px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  width: 100%;
  border-top: 1px solid #d9d9d9;
  .el-form-item {
    margin: 5px 0 0 0;
  }
}
::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 30vh !important;
  height: 350px;
  .el-dialog__footer {
    padding: 20px;
    padding-top: 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    bottom: 1px;
    left: 50%;
    transform: translateX(-50%);
  }
}
.app-container {
  padding: 0 12px;
}
</style>
