
<template>
  <Wrapper :title="wrapperTitle">
    <div class="header">
      <el-row :gutter="12">
        <el-col :span="19">
          <!-- <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>  -->
          <div style="display: flex; align-items: center">
            <svg-icon
              :icon-class="'bookmark-fill'"
              class-name="icon"
              style="height: 25px; width: 16px; margin-right: 6px"
            />
            <span style="font-size: 14px"> {{ formTitle }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 10px">
        <el-col :span="4" style="display: flex">
          <el-col :span="6">
            <img
              v-if="formData.fileResource"
              :src="mainImage"
              alt=""
              srcset=""
              style="vertical-align: top; height: 100px"
            />
            <img
              v-else
              class="noImg"
              style="
                width: 120px;
                vertical-align: top;
                height: 100px;
                border: 0;
              "
            />
            <img
              v-if="qrCode.indexOf('null') == -1"
              class="qrcodeimg"
              :src="qrCode"
              alt=""
              srcset=""
              style="
                width: 100px;
                vertical-align: top;
                height: 100px;
                margin-left: 10px;
              "
            />
          </el-col>
        </el-col>
        <el-col
          :span="19"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          <jm-form
            class="mr20"
            :columns="columns"
            :formData="form"
            :showButton="false"
            :labelWidth="'80px'"
            :disabled="true"
            ref="jmform1"
          >
          </jm-form>
        </el-col>
      </el-row>
    </div>
    <div class="title" v-if="carryValue.y == true ? true : false">异常项</div>

    <div class="title" v-else>
      <div style="display: flex; align-items: center">
        <svg-icon
          :icon-class="'bookmark-fill'"
          class-name="icon"
          style="height: 25px; width: 16px; margin-right: 6px"
        />
        <strong style="font-size: 14px">点检项目</strong>
      </div>
      <span style="font-size: 20px">
        <i class="el-icon-camera-solid controls" @click="AddFile"></i
        >&nbsp;&nbsp;<i
          class="el-icon-download controls"
          @click="handlerDownload"
        ></i
      ></span>
    </div>
    <div v-if="carryValue.y == true ? true : false" style="padding: 10px 0">
      <el-button type="primary" icon="el-icon-plus" @click="handelerGenerate"
        >生成维修单</el-button
      >
      <el-button @click="handlerSelf">自行处理</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="standardList"
      @selection-change="handleSelectionChange"
      ref="queryTable"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="点检项目编码"
        align="center"
        prop="itemCode"
        min-width="150"
      />
      <el-table-column label="部件" align="center" prop="partsName">
        <!-- <template slot-scope="scope">
          <el-input
            v-model="scope.row.partsName"
            placeholder="请输入部件"
            v-if="scope.row.editType"
          />
          <span v-else v-html="scope.row.partsName"></span>
        </template> -->
      </el-table-column>
      <el-table-column
        label="点检内容"
        align="center"
        prop="itemContent"
        min-width="100"
      />
      <el-table-column
        label="点检点数"
        align="center"
        prop="itemNum"
        min-width="100"
      >
        <!-- <template slot-scope="scope">
          <el-input
            v-model="scope.row.checkNum"
            placeholder="请输入巡点检点数"
            v-if="scope.row.editType"
          />
          <span v-else v-html="scope.row.checkNum"></span>
        </template> -->
      </el-table-column>
      <el-table-column
        label="点检状态"
        align="center"
        prop="itemStatus"
        min-width="100"
      >
        <template slot-scope="scope">
          <!-- <el-select
            v-if="scope.row.editType"
            v-model="scope.row.checkStatus"
            placeholder="请选择巡点检结果类型"
            clearable
          >
            <el-option
              v-for="dict in dict.type.mro_s_check_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
          <span
            v-html="
              findName(dict.type.mro_s_check_status, scope.row.itemStatus)
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        label="点检标准"
        align="center"
        prop="itemStandard"
        min-width="100"
      >
        <!-- <template slot-scope="scope">
          <el-input
            v-model="scope.row.checkStandard"
            placeholder="请输入巡点检标准"
            v-if="scope.row.editType"
          />
          <span v-else v-html="scope.row.checkStandard"></span>
        </template> -->
      </el-table-column>
      <el-table-column
        label="点检方法"
        align="center"
        prop="itemMethod"
        min-width="100"
      />
      <el-table-column
        label="结果类型"
        align="center"
        prop="resultType"
        min-width="140"
      >
        <template slot-scope="scope">
          <!-- <el-select
            v-if="scope.row.editType"
            v-model="scope.row.resultType"
            placeholder="请选择巡点检结果类型"
            clearable
          >
            <el-option
              v-for="dict in dict.type.mro_s_check_res_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
          <span
            v-html="
              findName(dict.type.mro_s_check_res_type, scope.row.resultType)
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        label="结果设置"
        align="center"
        prop="checkResult"
        min-width="140"
      >
        <!-- <template slot-scope="scope">
          <template v-if="scope.row.resultType == '模拟'">
            <el-input
              v-model="scope.row.checkResult"
              placeholder="请输入巡点检标准"
              v-if="scope.row.editType"
            />
            <span v-else v-html="scope.row.checkResult"></span>
          </template>
        </template> -->
      </el-table-column>

      <el-table-column
        label="定量上限"
        align="center"
        prop="quotaUpper"
        min-width="100"
      >
        <!-- <template slot-scope="scope">
          <template v-if="scope.row.resultType == '数字'">
            <el-input
              v-model="scope.row.quotaUpper"
              type="number"
              placeholder="请输入定量上限"
              v-if="scope.row.editType"
              @blur="UpperFun($event, scope.row.quotaLower)"
            />
            <span v-else v-html="scope.row.quotaUpper"></span>
          </template>
        </template> -->
      </el-table-column>
      <el-table-column
        label="定量下限"
        align="center"
        prop="quotaLower"
        min-width="100"
      >
        <!-- <template slot-scope="scope">
          <template v-if="scope.row.resultType == '数字'">
            <el-input
              v-model="scope.row.quotaLower"
              type="number"
              placeholder="请输入定量下限"
              v-if="scope.row.editType"
              @blur="LowerFun($event, scope.row.quotaUpper)"
            />
            <span v-else v-html="scope.row.quotaLower"></span>
          </template>
        </template> -->
      </el-table-column>
      <el-table-column
        label="定量单位"
        align="center"
        prop="quotaUnit"
        min-width="100"
      >
        <!-- <template slot-scope="scope">
          <template v-if="scope.row.resultType == '数字'">
            <el-input
              v-model="scope.row.quotaUnit"
              placeholder="请输入定量下限"
              v-if="scope.row.editType"
            />
            <span v-else v-html="scope.row.quotaLower"></span>
          </template>
        </template> -->
      </el-table-column>
      <el-table-column
        label="实际值"
        align="center"
        prop="quotaValue"
        min-width="150"
      >
        <template slot-scope="scope" v-if="scope.row.resultType == '数字'">
          <template v-if="carryValue.i == false ? false : true">
            <el-input
              v-hasPermi="['work:quest:edit']"
              v-model="scope.row.quotaValue"
              @input="handlerQuotaValue(scope)"
              placeholder="请输入实际值"
            />
          </template>
          <template v-else
            ><span>{{ scope.row.quotaValue }}</span></template
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="!carryValue.i"
        label="操作结果"
        align="center"
        prop="dealMethod"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dealResult === 1 ? "OK" : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!carryValue.i"
        label="备注"
        align="center"
        prop="remark"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        v-if="!carryValue.i"
        label="处理状态"
        align="center"
        prop="dealStatus"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dealStatus == 0 ? "待处理" : "已处理" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!carryValue.i"
        label="处理状态"
        align="center"
        prop="dealMethod"
        min-width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dealMethod }}</span>
          <i
            v-if="scope.row.dealMethod == '自行处理'"
            class="el-icon-view controls"
            @click="handlerOneself(scope.row)"
          ></i>
        </template>
      </el-table-column>

      <el-table-column
        v-if="carryValue.i"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        min-width="200"
      >
        <template slot-scope="scope">
          <el-radio-group
            v-model="scope.row.dealResult"
            v-hasPermi="['work:quest:edit']"
            :disabled="!carryValue.i"
          >
            <el-radio :label="1">OK</el-radio>

            <el-radio :label="2">NG</el-radio>
          </el-radio-group>
          &nbsp; &nbsp;

          <el-button
            v-if="carryValue.i"
            size="mini"
            type="text"
            :loading="btnLoading"
            @click="handlerAddRemarks(scope, 'remarks')"
            v-hasPermi="['work:quest:remarks']"
            >添加备注</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col
        :span="24"
        class="submit"
        v-if="carryValue.i == false ? false : true"
      >
        <el-button @click="handlerBack">取消</el-button>
        <el-button type="primary" @click="handlerStore">暂存</el-button>
        <el-button type="primary" @click="handlerSubmit">提交</el-button>
      </el-col>
      <el-col :span="24" class="submit" v-else>
        <el-button @click="handlerBack">返回</el-button>
      </el-col>
    </el-row>
    <!-- 添加备注 -->
    <el-dialog :visible.sync="drawer2" modal>
      <template slot="title"
        ><span class="custom-dialog-title">
          <i class="el-icon-warning"></i>
          添加备注
        </span></template
      >

      <el-form
        :inline="true"
        :model="remarkForm"
        class="demo-form-inline"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="remarkForm.remark"
                placeholder="请输入"
                style="width: 100%"
                :rows="5"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :offset="6">
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 异常处理 -->
    <el-drawer
      size="80%"
      class="drawer"
      :title="title"
      :visible.sync="drawerOne"
      :wrapperClosable="false"
    >
      <carry-form
        v-if="columns.length"
        class="mr20 ml20"
        :columns="columnsForm"
        :formData="formData"
        ref="titleform"
        :disabled="disabled"
        @submitForm="submitForm2"
        :showButton="showButton"
      >
        <template #footer v-if="!disabled">
          <div class="container-box2">
            <el-button @click="saveHandle" type="primary">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </carry-form>
    </el-drawer>

    <!-- 上传文件 -->
    <el-drawer
      :title="carryValue.i ? '选择文件' : '查看'"
      :visible.sync="filedrawer"
      direction="rtl"
      :destroy-on-close="true"
      :wrapperClosable="false"
    >
      <file-upload
        v-if="fileShow"
        :drag="true"
        @uploadChange="uploadChange2"
        :listType="'picture-card'"
        :fileType="fileType"
        style="padding: 0 20px"
      >
      </file-upload>

      <div class="img-list" v-if="fileList.length">
        <div style="padding-bottom: 5px">
          <i
            class="el-icon-menu"
            style="color: #1f77fc; font-size: 18px; transform: translateY(2px)"
          >
          </i
          >&nbsp;图片查看
        </div>
        <div class="card">
          <img
            v-for="item in fileList"
            :key="item.id"
            :src="process + item.fileName"
            alt=""
            srcset=""
            style="width: 295px; height: 170px"
          />
        </div>
      </div>
      <div class="img-text" v-else>暂无图片</div>
      <div class="img-submit" v-if="carryValue.i">
        <el-button type="primary" @click="handlerImgSubmit">确定</el-button>
        <el-button @click="handlerImgCancel">取消</el-button>
      </div>
    </el-drawer>
  </Wrapper>
</template>
<script>
import CarryForm from "@/components/CarryForm";
import Wrapper from "@/components/wrapper";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import {
  getPatrolItemDealRecord,
  getRelevanceInfo,
  photoWomDevice,
  exportPatrolItem,
} from "@/api/work/schedule";
import { removeStore } from "@/utils/property.js";
import { saveAs } from "file-saver";
import {
  getSelectPage,
  commitPatrolItem,
  stagingPatrolItem,
  dealPatrolItem,
} from "@/api/work/schedule";
import { format } from "echarts";
export default {
  components: { Wrapper, JmTable, CarryForm, JmForm },
  dicts: [
    "em_device_state",
    "device_run_state",
    "mro_s_check_res_type",
    "mro_s_check_status",
  ],
  data() {
    return {
      wrapperTitle: "",
      flag: "",
      formTitle: "",
      formData: {},
      total: 0,
      isChoose: false,
      btnLoading: false,
      equipmentList: [],
      checkBoxRows: null,
      ids: [],
      loading: false,
      drawer2: false,
      // 图片

      rules: {
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
      standardList: [],
      routerForm: [],
      queryParams: { pageNum: 1, pageSize: 1000 },
      // 添加备注
      remarkForm: { remark: "" },
      selectId: null,
      // 异常处理
      disabled: false,
      showButton: true,
      drawerOne: false,
      title: "",
      itemIds: [],
      itemId: null,
      carryValue: {},

      // 上传
      //文档
      filedrawer: false,
      fileType: ["png", "jpg", "jpeg", "webp"],
      fileList: [],
      fileLists: [],
      fileValue: {},
      process: process.env.VUE_APP_BASE_API,
      fileShow: false,
    };
  },

  watch: {
    drawerOne: {
      handler(val) {
        if (!val) {
          this.itemId = null;
          this.formData.itemId = null;
          this.$refs.titleform.resetFields();
          this.formData.addAttachmentDTOList = [];
        }
      },
      deep: true,
    },
    itemId: {
      handler(val) {
        if (val) {
          this.formData.itemId = val;

          getPatrolItemDealRecord({ itemId: val }).then((res) => {
            if (res.code === 200) {
              this.formData = { ...this.formData, ...res.data };
            }
          });
        }
      },
      deep: true,
    },
  },
  async created() {
    this.carryValue = JSON.parse(localStorage.getItem("carryValue"));
    this.fileShow = this.carryValue.i;
    this.formTitle = this.carryValue.t;
    this.form = this.carryValue.val;
    this.routerForm = this.carryValue.l;
    await this.getDetails(this.queryParams);

    if (!this.carryValue.y) {
      getRelevanceInfo({ busId: this.routerForm.orderCode }).then((res) => {
        if (res.code == 200 && res.rows.length > 0) {
          this.fileList = res.rows;
        }
      });
    }
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  computed: {
    columns() {
      return [
        { label: "设备名称", prop: "deviceName", span: 8 },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "select",
          options: this.dict.type.em_device_state,
          span: 8,
        },
        {
          label: "执行数量",
          prop: "executeNum",
          span: 8,
        },
        { label: "设备编码", prop: "deviceCode", span: 8 },
        {
          label: "运行状态",
          prop: "runStatus",
          formType: "select",
          options: this.dict.type.device_run_state,
          span: 8,
        },
        {
          label: "异常数量",
          prop: "errorNum",
          span: 8,
        },
      ];
    },
    columnsForm() {
      return [
        {
          label: "处理记录",
          span: 24,
          subTitle: true,
        },
        {
          label: "是否解决",
          span: 24,
          prop: "dealFlag",
          formType: "radio",
          options: [
            { label: "已解决", value: 1 },
            { label: "为解决", value: 0 },
          ],
          required: true,
        },
        {
          label: "处理记录",
          span: 24,
          prop: "dealRecord",
          formType: "textarea",
          required: true,
          rows: 4,
        },
        {
          label: "添加备件",
          span: 24,
          formType: "spareRecord",
        },
      ];
    },
    mainImage() {
      return process.env.VUE_APP_BASE_API + this.form.devicePic;
    },
    qrCode() {
      return process.env.VUE_APP_BASE_API + this.form.qrCode;
    },
  },
  methods: {
    UpperFun(e, quotaLower) {
      console.log(e);
      if (e.target.value - quotaLower < 0) {
        e.target.value = quotaLower;
        this.standardList.splice(1, 0);
      }
    },
    LowerFun(event, quotaUpper) {
      if (event.target.value - quotaUpper > 0) {
        event.target.value = quotaUpper;
        this.standardList.splice(1, 0);
      }
    },
    handlerBack() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    handlerImgSubmit() {
      photoWomDevice({
        deviceCode: this.form.deviceCode,
        orderCode: this.routerForm.orderCode,
        fileList: this.fileLists,
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success("提交成功");
          this.filedrawer = false;
        }
      });
    },
    handlerImgCancel() {
      this.filedrawer = false;
      this.fileLists = [];
    },
    uploadChange2(val) {
      this.fileLists = val;
      // this.filedrawer = false;
    },
    //上传文件
    AddFile() {
      this.filedrawer = true;
    },
    handlerDownload() {
      // const format = new FormData();

      // format.append("deviceCode", this.form.deviceCode);
      // format.append("orderCode", this.routerForm.orderCode);
      exportPatrolItem({
        deviceCode: this.form.deviceCode,
        orderCode: this.routerForm.orderCode,
      }).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `order_${new Date().getTime()}`);
      });

      // this.download(
      //   "/wom/patrol/item/exportPatrolItem",
      //   {
      //     deviceCode: this.form.deviceCode,
      //     orderCode: this.routerForm.orderCode,
      //   },
      //   `下载数据_${new Date().getTime()}.xlsx`
      // );
    },
    // ! 异常处理
    // 自行处理
    handlerOneself(row) {
      this.itemId = row.id;
      this.disabled = true;
      this.drawerOne = true;
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    /** 提交按钮 */
    submitForm2: function (formdata) {
      // ! 成功了才会走这
      formdata["idList"] = this.itemIds;
      formdata.addAttachmentDTOList.forEach((item) => {
        item.createTime = item.createTime.substring(0, 10);
      });
      formdata["attachmentDTOList"] = JSON.parse(
        JSON.stringify(formdata.addAttachmentDTOList)
      );
      delete formdata.addAttachmentDTOList;
      dealPatrolItem(formdata).then((res) => {
        if (res.code === 200) {
          this.getDetails(this.queryParams);
          this.$message.success("提交成功！");
          this.drawerOne = false;
        }
      });

      // this.formData = { supplierName: "" };
    },
    handleCancel() {
      //   //   this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      //   //   this.$router.go(-1); //跳回上页
    },
    handelerGenerate() {
      if (!this.itemIds.length > 0) {
        this.$message.warning("请选择异常项!");
        return;
      }
      if (this.checkBoxRows.some((item) => item.dealMethod)) {
        this.$message.warning("请选择未处理的异常项异常项!");
        return;
      }
      this.$router.push({
        path: "/work/requestAdd",
        query: {
          item: {
            orderType: "DZWX",
            deviceDTOList: this.form,
            itemIdList: this.itemIds,
          },
        },
      });
    },
    handlerSelf() {
      if (!this.itemIds.length > 0) {
        this.$message.warning("请选择异常项!");
        return;
      }
      if (this.checkBoxRows.some((item) => item.dealMethod)) {
        this.$message.warning("请选择未处理的异常项异常项!");
        return;
      }
      this.disabled = false;
      this.title = "自行处理记录";
      this.drawerOne = true;
    },
    // ! 异常处理结束
    handlerQuotaValue(scope) {
      this.$set(
        this.standardList[scope.$index],
        "dealResult",
        scope.row.quotaValue < scope.row.quotaUpper - scope.row.quotaLower
          ? 1
          : 2
      );
    },
    // 暂存
    handlerStore() {
      let data = this.standardList.map((item) => ({
        dealResult: item.dealResult,
        id: item.id,
        quotaValue: item.quotaValue,
        remark: item.remark,
      }));

      stagingPatrolItem(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("提交成功!");
          this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
          this.$router.go(-1); //跳回上页
        }
      });
    },
    // 提交
    handlerSubmit() {
      let data = this.standardList.map((item) => ({
        dealResult: item.dealResult,
        id: item.id,
        quotaValue: item.quotaValue,
        remark: item.remark,
      }));
      if (
        data.filter((item) => item.dealResult).length !==
        this.standardList.length
      ) {
        this.$message.warning("请填写所有操作！");
        return;
      }
      commitPatrolItem(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("提交成功!");
          this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
          this.$router.go(-1); //跳回上页
        }
      });
    },

    pagination(val) {
      this.$set(this.queryParams, "pageNum", val.page);
      this.$set(this.queryParams, "pageSize", val.limit);
      this.getDetails(this.queryParams);
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
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.$set(
        this.standardList[scope.$index],
        "editType",
        this.standardList[scope.$index].editType ? false : true
      );
    },
    getDetails(queryParams) {
      queryParams["orderCode"] = this.routerForm.orderCode;
      queryParams["deviceCode"] = this.form.deviceCode;

      getSelectPage(queryParams).then((res) => {
        if (res.code == 200) {
          this.standardList = res.data.records;
        }
      });
    },
    submitForm(formName) {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$set(
            this.standardList[this.selectId],
            "remark",
            this.remarkForm.remark
          );
          this.$message.success("添加成功");
          this.selectId = null;
          this.remarkForm.remark = null;
          this.drawer2 = false;
        } else {
          this.selectId = null;
          this.remarkForm.remark = null;
          return false;
        }
      });
    },

    handlerAddRemarks(scope) {
      this.selectId = scope.$index;
      this.remarkForm.remark = JSON.parse(JSON.stringify(scope.row.remark));
      this.drawer2 = true;
    },
    getList() {},
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.itemIds = selection.map((item) => item.id);
      this.checkBoxRows = selection;
    },
  },
  // beforeRouteLeave(to, from, next) {
  //   // 保存上一个路由信息
  //   this.$store.dispatch("tagsView/delView", from); // 关闭当前页
  //   // this.$router.go(-1);
  //   removeStore("carryValue");
  //   next();
  // },
};
</script>
<style lang='scss' scoped>
.header {
  background-color: #ecf1fa;
  margin-bottom: 20px;
  padding-left: 10px;
  padding-top: 10px;
}
.title {
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
  padding-left: 10px;
}
.medium {
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-dialog {
  width: 30%;
}
.submit {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
::v-deep .el-radio__label {
  padding-left: 5px;
  padding-right: 10px;
}
::v-deep .el-radio {
  margin-right: 0;
}
// ::v-deep .el-upload-list {
//   display: none;
// }
.controls {
  color: #1f77fc;
  padding-left: 6px;
  cursor: pointer;
}
.img-list {
  width: 100%;
  height: 60%;
  padding: 5px 20px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0; /* 隐藏滚动条 */
  }

  ::-webkit-scrollbar-thumb {
    background: transparent; /* 点击后滚动条的颜色 */
  }
  .card {
    min-height: 450px;

    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    img {
      margin-top: 10px;
    }
  }
}
.img-text {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.img-submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
.noImg {
  background: url("../../../../assets/images/noImg.png") no-repeat;
}
::v-deep .el-table th.el-table__cell {
  background-color: #f9f9f9;
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
