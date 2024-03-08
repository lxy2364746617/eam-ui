<template>
  <Wrapper :title="wrapperTitle"
    ><div class="box">
      <div class="box-header" v-if="disabled">
        <div class="title">工单进度</div>
        <!-- 进度条 -->
        <el-steps
          :active="formData.workActive"
          align-center
          style="margin-top: 20px"
          finish-status="success"
        >
          <el-step
            v-for="item in formData.workOrderSchedule"
            :key="item.id"
            :title="item.orderStatus"
            icon="el-icon-loading"
          >
            <div slot="description">
              <span style="font-size: 14px">{{ item.createBy }}</span>
              <br />
              <span>{{ item.createTime }}</span>
            </div></el-step
          >
        </el-steps>
      </div>
      <div class="subtitle">
        <div style="display: flex; align-items: center">
          <svg-icon
            :icon-class="'bookmark-fill'"
            class-name="icon"
            style="height: 25px; width: 16px; margin-right: 6px"
          />
          工单信息
        </div>
        <div>
          <span class="mr20 pack" style="cursor: pointer" @click="handlerUpkeep"
            >保养人员</span
          ><span class="mr20 pack" style="cursor: pointer" @click="handlerView"
            >关联文档查看</span
          >
        </div>
      </div>
      <br />
      <el-row>
        <el-col :span="24">
          <el-col :span="6" class="mb20"
            ><span class="show">工单编码:</span>{{ formData.orderCode }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">工单名称:</span>{{ formData.orderName }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">工单来源:</span
            >{{ formData.orderSource == 1 ? "计划生成" : "临时生成" }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">计划编码:</span>{{ data.planCode }}</el-col
          >

          <el-col :span="6" class="mb20"
            ><span class="show">执行人员:</span
            >{{ formData.executorName }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">执行单位:</span>{{ formData.deptName }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">计划开始时间:</span
            >{{ formData.planExecuteDate }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">工单类型:</span
            ><span
              v-html="findTreeName(orderOptions, formData.orderType)"
            ></span
          ></el-col>
          <el-col :span="6" class="mb20"
            ><span class="show">执行开始时间:</span
            >{{ formData.startTime }}</el-col
          >
          <el-col :span="6"
            ><span class="show">执行结束时间:</span
            >{{ formData.endTime }}</el-col
          >
          <el-col :span="6"
            ><span class="show">用时:</span>{{ formData.duration }}</el-col
          >
          <el-col :span="6"
            ><span class="show">保养人数:</span
            >{{ equipmentList3.length }}</el-col
          >
        </el-col>
        <!-- <el-col :span="2">
          <img
            :src="'/dev-api/profile/upload/2023/10/26/abc_20231026163120A074.jpg'"
            alt=""
            srcset=""
            style="width: 100%; vertical-align: top; height: 120px"
          />
        </el-col> -->
      </el-row>
      <!-- 下方 -->
    </div>
    <div class="title">
      <svg-icon
        :icon-class="'bar-chart-horizontal-fill'"
        class-name="icon"
        style="height: 25px; width: 16px; margin-right: 6px"
      ></svg-icon
      >工单执行
    </div>
    <el-table
      v-loading="loading"
      :data="equipmentList"
      @selection-change="handleSelectionChange"
      ref="queryTable2"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="设备编码"
        align="center"
        prop="deviceCode"
        min-width="150"
      >
        <template slot-scope="scope">
          <span class="active" @click="goEqu(scope)">{{
            scope.row.deviceCode
          }}</span>
        </template></el-table-column
      >
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="规格型号"
        align="center"
        prop="specs"
        min-width="150"
      />
      <el-table-column
        label="功能位置"
        align="center"
        prop="location"
        min-width="150"
      />
      <el-table-column label="是否拍照" align="center" prop="photoFlag">
        <template slot-scope="scope">
          <span
            v-html="findName(dict.type.em_is_photo, scope.row.photoFlag)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="执行数量" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.executeNum + "/" + scope.row.itemNum }}</span>
        </template></el-table-column
      >
      <el-table-column label="设备状态" align="center" prop="deviceStatus">
        <template slot-scope="scope">
          <span
            v-html="findName(dict.type.em_device_state, scope.row.deviceStatus)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" align="center" prop="executeStatus">
        <template slot-scope="scope">
          <span
            v-html="
              findName(dict.type.em_device_carry, scope.row.executeStatus)
            "
          ></span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        prop="fullNum"
        min-width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            :loading="btnLoading"
            @click="goDetails(scope.row, 'view')"
            v-hasPermi="['work:quest:view']"
            >查看</el-button
          >
          <el-button
            v-if="!disabled && scope.row.executeStatus != 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            :loading="btnLoading"
            @click="handlerCarry(scope.row, 'carry')"
            v-hasPermi="['work:quest:carry']"
            >执行</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 保养人员和关联文档查看 -->
    <el-drawer
      size="80%"
      class="drawer"
      :title="title"
      :visible.sync="drawer"
      :wrapperClosable="false"
    >
      <div v-if="title == '保养人员'">
        <ContTable
          class="table"
          :tableData="equipmentList3"
          @getList="getList3"
          :total="total3"
          @handleSelectionChange="handleSelectionChange3"
          :isRadio="true"
          :handleWidth="150"
          :columns="columns3"
          :showSearch="false"
          ><template slot="headerLeft" v-if="!disabled">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :loading="btnLoading"
                @click="handlerAdd"
                v-hasPermi="['work:quest:add']"
                >添加</el-button
              >
            </el-col>
          </template>
          <template #end_handle="scope" v-if="!disabled">
            <el-button
              v-if="scope.row.type == 2"
              size="mini"
              type="text"
              icon="el-icon-delete"
              :loading="btnLoading"
              @click="handlerDelete(scope.row, 'delete')"
              v-hasPermi="['work:quest:delete']"
              >删除</el-button
            >
          </template>
        </ContTable>

        <div class="drawer-title" v-if="selectUser.id">保养人员工时</div>
        <ContTable
          v-if="selectUser.id"
          class="table"
          :tableData="equipmentList4"
          @getList="getList4"
          @handleSelectionChange="handleSelectionChange4"
          :total="total4"
          :isRadio="false"
          :handleWidth="230"
          :columns="columns4"
          :showSearch="false"
          ><template slot="headerLeft" v-if="!disabled">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :loading="btnLoading"
                @click="handlerAdd2"
                v-hasPermi="['work:quest:add']"
                >添加</el-button
              >
            </el-col>
          </template>
          <template #end_handle="scope" v-if="!disabled">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              :loading="btnLoading"
              @click="handlerEdit(scope.row, 'edit')"
              v-hasPermi="['work:quest:edit']"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              :loading="btnLoading"
              @click="handlerDeleteHours(scope.row, 'delete')"
              v-hasPermi="['work:quest:delete']"
              >删除</el-button
            >
          </template>
        </ContTable>
      </div>
      <!-- 关联文档 -->
      <div v-else>
        <JmTable
          class="table"
          :tableData="equipmentListRelevance"
          :total="totalRelevance"
          ref="jmtable"
          @getList="getListRelevance"
          :isRadio="isChooseRelevance"
          :handleWidth="230"
          :columns="columnsRelevance"
          :isEdit="false"
          :showSearch="false"
          :rightToolbarShow="false"
        >
          <template #end_handle="scope" v-if="!isChoose">
            <el-button
              type="text"
              size="mini"
              :loading="btnLoading"
              @click="handlerDownload(scope.row, 'download')"
              v-hasPermi="['work:quest:download']"
              >下载</el-button
            >
            <el-button
              size="mini"
              type="text"
              :loading="btnLoading"
              @click="handlerPreview(scope.row, 'preview')"
              v-hasPermi="['work:quest:preview']"
              >预览</el-button
            >
          </template>
        </JmTable>
      </div>
    </el-drawer>
    <!-- 添加人员 -->
    <el-drawer
      size="65%"
      class="drawer"
      title="添加人员"
      :visible.sync="isDrawer"
      :wrapperClosable="false"
    >
      <ContTable
        class="table"
        :tableData="equipmentList2"
        @getList="getList2"
        @handleSelectionChange="handleSelectionChange2"
        :total="total2"
        :isRadio="false"
        :handleWidth="230"
        :columns="columns2"
        :isShow="true"
        :showSearch="false"
      >
      </ContTable>

      <div class="submit">
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-drawer>

    <!-- 添加工时 -->
    <el-drawer
      size="30%"
      direction="rtl"
      :title="title2"
      :visible.sync="isDrawer2"
      :before-close="handleClose"
      :wrapperClosable="false"
    >
      <title-form
        class="mr20"
        :columns="columnsForm"
        :formData="form"
        @submitForm="submitForm"
        ref="jmform"
        :disabled="disabled"
      >
        <template #footer>
          <div style="text-align: center">
            <el-button @click="close2">取消</el-button>
            <el-button @click="saveHandle" type="primary" v-if="!disabled"
              >提交</el-button
            >
          </div>
        </template>
      </title-form>
    </el-drawer>
  </Wrapper>
</template>
<script>
import ContTable from "@/components/ContTable";
import JmTable from "@/components/JmTable";
import TitleForm from "@/components/TitleForm";
import Wrapper from "@/components/wrapper";
import { getWarehousingList } from "@/api/property/warehousing";
import { equipmentTree } from "@/api/equipment/category";
import {
  getWomDevice,
  getWomInfo,
  getRelevanceInfo,
} from "@/api/work/schedule";
import { findAll, getGroup } from "@/api/system/group";
import { orderTemplate } from "@/api/work/template";
import {
  getExecutorList,
  getOrderExecutor,
  addExecutors,
  delExecutors,
  getWorkHours,
  addWorkHours,
  delWorkHours,
  updateWorkHours,
} from "@/api/work/schedule";
export default {
  components: {
    Wrapper,
    ContTable,
    JmTable,
    TitleForm,
  },
  dicts: [
    "em_is_photo",
    "em_device_state",
    "em_device_carry",
    "em_abnormal_status",
  ],
  data() {
    return {
      wrapperTitle: "",
      showSearch: false,
      isDrawer: false,
      isDrawer2: false,
      drawer: false,
      valueMap: {},
      equipmentList: [],
      equipmentList2: [],
      equipmentList3: [],
      equipmentList4: [],
      equipmentListRelevance: [],
      total: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      totalRelevance: 0,
      isChoose: false,
      isChoose2: false,
      isChoose3: false,
      isChooseRelevance: false,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loadingRelevance: false,
      ids: [],
      ids2: [],
      ids3: [],
      ids4: [],
      idsRelevance: [],
      btnLoading: false,
      // 表单
      formData: {},
      form: { workHours: "分钟" },
      disabled: false,
      title2: "",
      //
      title: "",
      data: {},
      groupMembers: [],
      groupOptions: [],
      orderOptions: [],

      selectUser: { name: "", id: null },
    };
  },
  watch: {
    form: {
      handler(val) {
        this.$emit("maintenanceRecord", val);
        if (!val) return;
        if (val.endTime && val.startTime) {
          this.form.workHours = this.dateDiffInHours(
            val.endTime,
            val.startTime
          );
        }
      },
      deep: true,
      immediate: true,
    },
    selectUser: {
      handler(val) {
        if (val.id) {
          this.getList4();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    await this.getOrderTree();
    await this.getTree();
    if (localStorage.getItem("item")) {
      let row = JSON.parse(localStorage.getItem("item"));
      // this.$route.query.item = null;
      this.formData = row.item;
      this.disabled = row.disabled;
      getWomDevice({ orderCode: this.formData.orderCode, lineCode: "" }).then(
        (res) => {
          if (res.code == 200) {
            this.equipmentList = res.data;
          }
        }
      );
      getWomInfo({ orderCode: this.formData.orderCode }).then((res) => {
        this.formData = { ...res.data, ...this.formData };
      });
      findAll({ groupType: this.formData.orderType }).then((res) => {
        res.data.forEach((item) => {
          item.label = item.groupName;
          item.value = item.id;
        });
        this.groupOptions = res.data;
        this.changeGroupId(this.formData.groupId, 2);
      });
      await this.getListRelevance();
      await this.getList3();

      await this.getList2();
    }
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  computed: {
    columns2() {
      return [
        { label: "姓名", prop: "nickName", tableVisible: true, width: 150 },
        { label: "用户名", prop: "userName", tableVisible: true, width: 150 },
        { label: "岗位", prop: "postName", tableVisible: true },

        {
          label: "技能等级",
          prop: "level",
          tableVisible: true,
          formType: "rate",
          width: 200,
        }, //(A、B、C)
        {
          label: "本月待办任务数",
          prop: "pendingCount",

          tableVisible: true,
          width: 180,
        },

        {
          label: "本月已处理任务数",
          prop: "finishCount",
          tableVisible: true,
          width: 180,
        },
        {
          label: "班组",
          prop: "groupName",
          tableVisible: true,
        },
      ];
    },
    columns3() {
      return [
        {
          label: "保养人员姓名",
          prop: "nickName",
          tableVisible: true,
          width: 150,
        },
        { label: "用户名", prop: "userName", tableVisible: true, width: 150 },
        {
          label: "班组",
          prop: "groupName",
          tableVisible: true,
        },
        {
          label: "联系方式",
          prop: "phonenumber",
          tableVisible: true,
          width: 150,
        },

        {
          label: "类型",
          prop: "type",
          formType: "select",
          options: [
            { label: "主要", value: 1 },
            { label: "其他", value: 2 },
          ],
          tableVisible: true,
          width: 100,
        },
        {
          label: "总工时（h）",
          prop: "allWorkHours",
          tableVisible: true,
          width: 150,
        },
      ];
    },
    columnsRelevance() {
      return [
        { label: "文件名", prop: "originalFileName", class: true },
        { label: "创建时间", prop: "createTime", formType: "datetime" },
        { label: "创建人", prop: "createBy" },
        { label: "文件大小", prop: "fileSize" },
      ];
    },
    columns4() {
      return [
        { label: "开始时间", prop: "startTime", tableVisible: true },
        { label: "结束时间", prop: "endTime", tableVisible: true },
        { label: "工时（h）", prop: "workHours", tableVisible: true },
        {
          label: "保养内容",
          prop: "content",
          tableVisible: true,
        },

        {
          label: "暂停原因",
          prop: "pauseReason",
          tableVisible: true,
          width: 180,
        },
      ];
    },
    columnsForm() {
      return [
        {
          label: "开始时间",
          prop: "startTime",
          formType: "datetime",
          required: true,
          span: 24,
        },
        {
          label: "结束时间",
          prop: "endTime",
          formType: "datetime",
          required: true,
          span: 24,
        },
        {
          label: "工时（h）",
          prop: "workHours",
          formType: "number",
          span: 24,
          required: true,
          formDisabled: true,
        },
        {
          label: "保养内容",
          prop: "content",
          span: 24,
          formType: "textarea",
          rows: 4,
        },
        {
          label: "暂停原因",
          prop: "pauseReason",
          formType: "textarea",
          rows: 4,
          span: 24,
        },
      ];
    },
  },
  methods: {
    dateDiffInHours(date1, date2) {
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);
      const oneMinute = 60 * 1000;

      return (
        Math.round(Math.abs((firstDate - secondDate) / oneMinute)) / 60
      ).toFixed(1);
    },
    async getOrderTree() {
      await orderTemplate().then((response) => {
        this.orderOptions = response.data.map((item) => {
          const children = item.sysDictDatas.map((dict) => {
            return {
              id: dict.dictValue,
              label: dict.dictLabel,
            };
          });

          return {
            id: item.value,
            label: item.name,
            children,
          };
        });
      });
    },
    findTreeName(options, value) {
      for (let item of options) {
        if (item.id === value) return item.label;
        if (item.children && item.children.length > 0) {
          let result = this.findTreeName(item.children, value);
          if (result !== null) return result;
        }
      }
      return null;
    },
    changeGroupId(val, flag) {
      if (!val) val = 1;
      getGroup(val).then((response) => {
        this.formData.directorName = response.data.leaderName;

        this.formData.director = response.data.leaderId;
        this.groupMembers = response.data.sysUserGroupList;
        let arr = response.data.sysUserGroupList.filter(
          (item) => item.userId == this.formData.executor
        )[0];

        this.$set(this.formData, "executorName", arr.nickName);
        this.$set(this.formData, "deptName", arr.dept.deptName);
      });
    },
    handlerPreview(row) {
      window.open(process.env.VUE_APP_BASE_API + row.fileName);
    },
    handlerDownload(row) {
      this.$download.resource(row.fileName);
    },
    handleClose(done) {
      done();
      this.$refs.jmform.resetFields();
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      let newFormData = JSON.parse(JSON.stringify(formdata));
      newFormData["workOrderCode"] = this.formData.orderCode;
      newFormData["workHours"] =
        JSON.parse(JSON.stringify(newFormData["workHours"])) * 60;
      newFormData["userName"] = this.selectUser.userName;
      // newFormData["userId"] = this.selectUser.id;

      if (this.title2 === "编辑") {
        updateWorkHours({ womWorkHours: [newFormData] }).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.msg);
            this.isDrawer2 = false;
            this.getList4();
            this.getList3();
          }
        });
      } else {
        addWorkHours({ womWorkHours: [newFormData] }).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.msg);
            this.isDrawer2 = false;
            this.getList4();
            this.getList3();
          }
        });
      }
    },
    saveHandle() {
      this.$refs.jmform.submitForm();
    },
    handlerEdit(row) {
      this.title2 = "编辑";
      this.form = JSON.parse(JSON.stringify(row));
      this.isDrawer2 = true;
    },
    close() {
      this.isDrawer = false;
    },
    close2() {
      this.$refs.jmform.resetFields();
      this.isDrawer2 = false;
    },
    save() {
      this.rowArr2.forEach((item) => {
        item.workOrderCode = this.formData.orderCode;
        item["type"] = 2;
      });
      addExecutors({
        maintainExecutors: this.rowArr2,
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.isDrawer = false;
          this.getList3();
        }
      });
    },
    handlerAdd2() {
      this.title2 = "新增";
      this.isDrawer2 = true;
    },
    handlerAdd() {
      this.isDrawer = true;
    },
    handlerDeleteHours(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delWorkHours({
            womWorkHours: [row],
            workOrderCode: this.formData.orderCode,
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.isDrawer = false;
              this.getList4();
            }
          });
        })
        .catch(() => {});
    },
    handlerDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delExecutors({
            maintainExecutors: [row],
            workOrderCode: this.formData.orderCode,
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.isDrawer = false;
              this.getList3();
            }
          });
        })
        .catch(() => {});
    },
    async getList2(row) {
      this.loading2 = true;
      getOrderExecutor;
      getExecutorList({ groupId: this.formData.groupId }).then((response) => {
        if (this.equipmentList3.length !== 0) {
          response.data = response.data.filter((user) =>
            this.equipmentList3.some((u) => u.userId !== user.userId)
          );
          this.equipmentList2 = response.data;
          this.loading2 = false;
        }
        // getOrderExecutor({ workOrderCode: this.formData.orderCode }).then((response) => {
      });
    },
    // 抽屉
    async getList3(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading3 = true;
      form["workOrderCode"] = this.formData.orderCode;
      await getOrderExecutor(form).then((response) => {
        this.equipmentList3 = response.data;
        // this.total3 = response.total;
        this.loading3 = false;
      });
    },
    async getList4(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loading4 = true;
      form["workOrderCode"] = this.formData.orderCode;
      form["userName"] = this.selectUser.userName;
      // form["userId"] = this.selectUser.userId;
      await getWorkHours({ ...form, ...this.selectUser }).then((response) => {
        if (response.data.length && response.data.length > 0) {
          response.data.forEach((item) => {
            item.workHours = item.workHours / 60;
          });
        }
        this.equipmentList4 = response.data;
        // this.total3 = response.total;
        this.loading4 = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.id);
      this.single2 = selection.length != 1;
      this.multiple2 = !selection.length;
      this.radioRow2 = selection[0];
      this.rowArr2 = selection;
    },
    // 多选框选中数据
    handleSelectionChange3(selection) {
      this.ids3 = selection.map((item) => item.id);
      this.selectUser = selection[0];
    },
    // 多选框选中数据
    handleSelectionChange4(selection) {
      this.ids4 = selection.map((item) => item.id);
    },
    handlerUpkeep(e) {
      this.title = "保养人员";
      this.drawer = true;
    },
    handlerView(e) {
      this.title = "关联文档";
      this.drawer = true;
    },

    goEqu(scope) {
      let title =
        this.getTreeParent(scope.row.deviceType).join(" > ") +
        " > " +
        scope.row.deviceName;
      this.$router.push({
        path:
          "/device/book/details?i=" +
          scope.row.deviceId +
          "&t=" +
          title +
          "&d=true",
      });
    },
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    goDetails(val) {
      this.$router.push({
        path: "/work/questUpkeep2",
      });
      localStorage.setItem(
        "carryValue",
        JSON.stringify({
          i: false,
          val,
          l: this.formData,
          t:
            this.getTreeParent(val.deviceType).join(" > ") +
            " > " +
            val.deviceName,
        })
      );
    },
    handlerCarry(val) {
      this.$router.push({
        path: "/work/questUpkeep2",
      });
      localStorage.setItem(
        "carryValue",
        JSON.stringify({
          i: true,
          val,
          l: this.formData,
          t:
            this.getTreeParent(val.deviceType).join(" > ") +
            " > " +
            val.deviceName,
        })
      );
    },
    getTreeParent(id) {
      const path = [];
      let current = this.valueMap[id];
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path;
    },
    /** 查询设备档案下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
    },
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    getListRelevance(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loadingRelevance = true;
      form["busId"] = this.formData.orderCode;
      getRelevanceInfo(form).then((response) => {
        this.equipmentListRelevance = response.rows;
        this.totalRelevance = response.total;
        this.loadingRelevance = false;
      });
    },
    getList() {
      this.equipmentList = [
        {
          deviceCode: "123123123",
          deviceName: "123123123",
          specs: "123123123",
          location: "123123123",
          photoFlag: "Y",
          categoryNum: "123123123",
          deviceStatus: "123123123",
          deviceStatus2: "123123123",
        },
      ];
      this.total = 1;
      this.loading = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  background-color: #ecf1fa;
}
.title {
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.subtitle {
  border-bottom: 1px solid #ddd;
  background-color: #ebf4fc;
  color: #55566d;
  text-align: left;
  font-size: 16px;
  padding: 5px 0;
  padding-left: 20px;
  display: flex;
  justify-content: space-between;
  span {
    font-weight: 400;
    padding-right: 5px;
  }
  .pack {
    color: #2b7efc;
    cursor: pointer;
  }
}
.upload-demo {
  margin-left: 25px;
}
.show {
  font-weight: 700;
  padding-left: 40px;
}
::v-deep .el-row {
  font-size: 14px;
  // display: flex;
  // align-items: flex-end;
}
.active {
  color: #007bfe;
  cursor: pointer;
  text-decoration: underline;
}
.table {
  padding: 20px;
}
.drawer-title {
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 32px;
  padding: 20px 20px 0;
}
.submit {
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-row {
  flex-wrap: wrap;
}
::v-deep .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 0;
}
.box-header {
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  height: auto;
  .title {
    color: #55566d;
    font-weight: bold;
    height: 30px;
    text-align: left;
    font-size: 16px;
    padding-left: 20px;
    border-bottom: 1px solid #ececec;
  }
  ::v-deep .el-step__head.is-success {
    color: #0c7de0;
    border-color: #0c7de0;
  }
  ::v-deep .el-steps--horizontal {
    width: 100%;
  }
  ::v-deep .el-step__description.is-success {
    color: #adadad;
  }
  ::v-deep .el-step__icon-inner[class*="el-icon"]:not(.is-status),
  ::v-deep .el-step__icon {
    font-size: 16px;
    color: #0c7de0;
  }

  ::v-deep .el-step__title.is-process,
  ::v-deep .el-step__title.is-success,
  ::v-deep .el-step__title.is-wait {
    font-weight: 400;
    color: #0c7de0;
  }

  ::v-deep .el-step__line {
    background-color: #0c7de0;
  }
}
// 滚动条样式
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 12px;
  opacity: 0.5;
}
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
