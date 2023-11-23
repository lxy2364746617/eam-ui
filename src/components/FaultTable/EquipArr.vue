<template>
  <div class="box">
    <div class="subtitle">
      工单信息
      <div>
        <span class="mr20">请求时间:{{ `2022-05-17 09:57:32` }}</span
        ><span class="pack" @click="openUp">收起</span>
      </div>
    </div>
    <br />
    <div v-if="flag">
      <el-row>
        <el-col :span="6"
          ><span class="show">工单编码:</span>{{ formData.orderCode }}</el-col
        >
        <el-col :span="6"
          ><span class="show">工单名称：</span>{{ formData.orderName }}</el-col
        >
        <el-col :span="6"
          ><span class="show">工单类型：</span
          ><span v-html="findTreeName(orderOptions, formData.orderType)"></span
        ></el-col>
        <el-col :span="6"
          ><span class="show">计划执行日期：</span
          >{{ formData.planExecuteDate }}</el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="6"
          ><span class="show">工单对象：</span
          ><span
            v-html="findName2(this.dict.type.order_obj, formData.orderObj)"
          ></span
        ></el-col>
        <el-col :span="6"
          ><span class="show">请求人员：</span>{{ formData.createBy }}</el-col
        >
        <el-col :span="6"
          ><span class="show">联系方式：</span>{{ data.phoneNumber }}</el-col
        >
      </el-row>
      <div class="title">设备信息</div>
      <JmTableNoPaging
        :tableData="equipmentList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        :total="total"
        ref="jmtable"
        :isShow="isShow"
        :isRadio="isChoose"
        :handleWidth="230"
        :columns="columns"
        :showSearch="false"
        :rightToolbarShow="false"
      >
        <template #end_handle="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            :loading="btnLoading"
            @click="goDetails(scope.row, 'view')"
            v-hasPermi="['equipment:book:edit']"
            >查看故障</el-button
          >
        </template>
      </JmTableNoPaging>
    </div>

    <!-- 维护故障弹窗 -->
    <el-drawer
      size="50%"
      class="drawer"
      title="故障信息"
      :before-close="close"
      :visible.sync="drawer"
    >
      <TitleForm
        v-if="columns.length"
        class="mr20"
        :columns="columnsForm"
        :formData="form"
        @submitForm="submitForm"
        ref="titleform"
        :disabled="disabled"
        :showButton="showButton"
      >
        <template #footer>
          <image-upload
            class="upload-demo"
            :fileType="['jpg', 'png']"
            @uploadChange="uploadChange1"
            :value="form.fileList"
            :disabled="disabled"
            :extraData="{ category: 1 }"
            :listType="'picture-card'"
          >
          </image-upload>
          <div style="text-align: center" class="footer">
            <el-button @click="saveHandle" type="primary" v-if="!disabled"
              >提交</el-button
            >
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-drawer>
  </div>
</template>
<script>
import { getProjectList, downDetailLoad } from "@/api/property/scrapping";
import JmTableNoPaging from "@/components/JmTableNoPaging";
import SelectParentDeviceDialog from "./SelectParentDeviceDialog";

import { saveAs } from "file-saver";
import { orderTemplate } from "@/api/work/template";
import { getWomDevice, getWomInfo } from "@/api/work/schedule";
export default {
  components: {
    JmTableNoPaging,
    SelectParentDeviceDialog,
  },
  dicts: ["em_device_state", "em_is_special", "order_obj"],
  props: {
    formData: {
      default: {},
      type: Object,
    },

    isShow: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      form: {},
      disabled: true,
      data: {},
      rules: {
        demandDate: [
          {
            required: true,
            message: "请选择调整计划执行日期",
            trigger: "blur",
          },
        ],
      },
      showButton: true,
      addItem: {
        choosedrawer: false,
        copyInputName: "",
        copyInputId: "",
        addDrawer: false,
        addRadio: 1,
      },
      // 新增or编辑框 title
      title: "",
      drawer: false,
      equipmentList: null,
      btnLoading: false,
      isChoose: false,
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // ! 当前选中行数据
      itemValue: null,
      total: 0,
      rowArr: {},
      // 选中数组
      ids: [],
      flag: true,
      orderOptions: [],
      orderObjs: [],
    };
  },
  computed: {
    columns() {
      return [
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "specs", tableVisible: true },
        { label: "设备类别", prop: "deviceType", tableVisible: true },
        {
          label: "功能位置",
          prop: "location",
          tableVisible: true,
        },
        { label: "当前使用组织", prop: "currDeptName", tableVisible: true },
        {
          label: "所属组织",
          prop: "affDeptName",
          width: 180,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          tableVisible: true,
        },
        {
          label: "是否特种设备",
          prop: "isSpecial",
          formType: "select",
          options: this.dict.type.em_is_special,
        },
      ];
    },
    columnsForm() {
      return [
        {
          label: "故障时间",
          prop: "faultDate",
          span: 12,
          formType: "date",
          required: true,
        },
        {
          label: "故障部件(位)",
          prop: "faultLocation",
          span: 12,
          required: true,
        },
        {
          label: "故障类型",
          prop: "faultType",
          formType: "select",
          options: this.dict.type.fault_type,
          span: 12,
          required: true,
        },
        {
          label: "故障等级",
          prop: "faultGrade",
          formType: "select",
          options: this.dict.type.fault_level,
          span: 12,
          required: true,
        },

        {
          label: "是否停机",
          prop: "haltFlag",
          span: 24,
          formType: "radio",
          options: [
            { label: "是", value: 1 },
            { label: "否", value: 0 },
          ],
          required: true,
        },
        {
          label: "故障描述",
          prop: "faultInfo",
          formType: "textarea",
          span: 24,
          required: true,
        },
      ];
    },
  },
  watch: {
    drawer: {
      handler(newValue) {
        if (!newValue) {
          this.handleCancel();
          this.title = "";
        }
      },
    },
  },
  async created() {
    await this.getOrderTree();
    if (this.formData.orderCode) {
      getWomDevice({ orderCode: this.formData.orderCode, lineCode: "" }).then(
        (res) => {
          if (res.code == 200) {
            this.equipmentList = res.data;
          }
        }
      );
      getWomInfo({ id: this.formData.id }).then((res) => {
        this.data = res.data;
      });
    }
  },
  mounted() {},

  methods: {
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
    openUp() {
      this.flag = !this.flag;
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

    findName2(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    uploadChange1(val) {
      this.form.imgFileResourceList = val;
    },

    handleCancel() {
      this.$refs.titleform.resetFields();
      this.form = {};

      this.drawer = false;
      //   this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      //   this.$router.go(-1); //跳回上页
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    goDetails(row) {
      this.drawer = true;
      this.form = { ...this.form, ...row["faultInfoDTO"] };
      console.log("========================", this.form);
      this.disabled = true;
      // this.$refs.titleform.resetFields();
    },
    /** 提交按钮 */
    submitForm: function (formdata) {
      // ! 成功了才会走这
    },

    close() {
      this.handleCancel();
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      if (JSON.stringify(node.children) == "[]") {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },

    /** 查询计划明细列表 */
    async getList(queryParams = { pageNum: 1, pageSize: 10 }) {
      if (this.formData.orderCode) {
        getWomDevice({ orderCode: this.formData.orderCode, lineCode: "" }).then(
          (res) => {
            if (res.code == 200) {
              this.equipmentList = res.data;
            }
          }
        );
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if (this.title !== "单个设置") {
        this.ids = selection.map((item) => item.id);
      }
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.rowArr = selection;
    },

    importHandler() {
      downDetailLoad(this.ids).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },

    // resetForm() {
    //   this.$refs["elForm"].resetFields();
    // },
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  background-color: #fff;
  .title {
    margin-top: 20px;
    padding: 0 20px;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    background: rgba(0, 116, 217, 0.08);
    justify-content: space-between;
  }
}
.subtitle {
  //   border-bottom: 1px solid #ddd;
  background-color: #ebf4fc;
  color: #55566d;
  font-weight: bold;
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
  transform: translateX(40px);
}
.show {
  font-weight: 700;
  padding-left: 40px;
}
::v-deep .el-row {
  font-size: 14px;
}
</style>
