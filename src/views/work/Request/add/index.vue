<template>
  <Wrapper :title="wrapperTitle">
    <div class="box">
      <title-form
        v-if="columns2.length"
        class="mr20"
        :columns="columns2"
        :formData="formData"
        ref="titleform"
        :disabled="disabled"
        @submitForm="submitForm"
        :showButton="showButton"
      >
        <template #footer v-if="formData.orderType && !disabled">
          <div class="container-box2">
            <el-button @click="saveHandle" type="primary">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </title-form>
      <div class="overlay" v-if="!formData.orderType"></div>
    </div>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import JmTable from "@/components/JmTable";
import TitleForm from "@/components/TitleForm";
import Treeselect from "@riophae/vue-treeselect";
import { orderTemplate } from "@/api/work/template";
import {
  addInspection,
  addEquip,
  addMaintenance,
  addPeriodic,
  getWomRepairInfo,
  getWomDevice,
} from "@/api/work/schedule";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { removeStore } from "@/utils/property.js";
import { getGroup } from "@/api/system/group";

export default {
  components: { Wrapper, JmTable, TitleForm, Treeselect },
  dicts: ["order_obj", "fault_level", "fault_type"],
  data() {
    return {
      wrapperTitle: "",
      formData: {},
      disabled: false,
      showButton: true,
      columns: [],
      columns2: [],
      orderOptions: [],
      routePoint: [],
    };
  },
  async created() {
    await this.getOrderTree();

    if (this.$route.query.item) {
      let row = JSON.parse(JSON.stringify(this.$route.query.item));
      // this.$route.query.item = null;
      this.formData = JSON.parse(JSON.stringify(row));

      this.disabled = this.$route.query.disabled === "true" ? true : false;

      // this.$set(this.formData, "orderType", row.orderType);
      switch (row.orderType + row.orderObj) {
        case "RCDJ1":
        case "ZZDJ1":
        case "JMDJ1":
          break;
        case "RCDJ2":
        case "ZZDJ2":
        case "JMDJ2":
          break;
        case "DZWX2":
        case "WWWX2":
        case "JDBWX2":
          break;
        case "DZWX3":
        case "WWWX3":
        case "JDBWX3":
          break;
        case "DQJY2":
          break;
        case "RCBY1":
        case "YJBY1":
        case "EJBY1":
        case "CGRH1":
          break;
        case "RCBY2":
        case "YJBY2":
        case "EJBY2":
        case "CGRH2":
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  computed: {},
  watch: {
    "formData.orderType": {
      handler(newVal, oldVla) {
        if (newVal !== oldVla) {
          switch (newVal) {
            case "DZWX":
            case "WWWX":
            case "JDBWX":
              this.routePoint = JSON.parse(
                JSON.stringify(this.dict.type.order_obj)
              )
                .filter((item) => item.value != 1)
                .map((item) => {
                  return {
                    id: item.value,
                    label: item.label,
                  };
                });
              if (
                this.$route.query.item &&
                this.$route.query.item.deviceDTOList
              ) {
                this.routePoint = this.routePoint.filter(
                  (item) => item.id == 2
                );
              }
              this.resetColumns();
              break;
            case "RCDJ":
            case "ZZDJ":
            case "JMDJ":
            case "RCBY":
            case "YJBY":
            case "EJBY":
            case "CGRH":
              this.routePoint = JSON.parse(
                JSON.stringify(this.dict.type.order_obj)
              )
                .filter((item) => item.value != 3)
                .map((item) => {
                  return {
                    id: item.value,
                    label: item.label,
                  };
                });
              this.resetColumns();
              break;
            case "DQJY":
              this.routePoint = [];
              this.resetColumns();
              break;
            default:
              break;
          }
        }
      },
      // immediate: true,
      deep: true,
    },
    "formData.orderObj": {
      handler(newVal, oldVla) {
        if (newVal !== "") {
          if (this.formData.orderType) {
            switch (this.formData.orderType + newVal) {
              case "RCDJ1":
              case "ZZDJ1":
              case "JMDJ1":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },
                  {
                    label: "工单对象",
                    prop: "orderObj",
                    span: 12,
                    required: true,
                    formType: "selectTree",
                    options: this.routePoint,
                    // formDisabled: true,
                  },

                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnel",
                  },
                  // ! 巡检点路线
                  {
                    prop: "upload4",
                    span: 24,
                    formType: "dotRoute",
                  },

                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              case "RCDJ2":
              case "ZZDJ2":
              case "JMDJ2":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },
                  {
                    label: "工单对象",
                    prop: "orderObj",
                    span: 12,
                    required: true,
                    formType: "selectTree",
                    options: this.routePoint,
                    // formDisabled: true,
                  },

                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnel",
                  },
                  // ! 巡检点设备
                  {
                    prop: "upload4",
                    span: 24,
                    formType: "dotEqm",
                  },

                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              case "DZWX2":
              case "WWWX2":
              case "JDBWX2":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },
                  {
                    label: "工单对象",
                    prop: "orderObj",
                    span: 12,
                    required: true,
                    formType: "selectTree",
                    options: this.routePoint,
                    // formDisabled: true,
                  },
                  // ! 设备信息
                  {
                    span: 24,
                    formType: "equipMessage",
                  },
                  // ! 故障信息
                  {
                    label: "故障信息",
                    span: 24,
                    subTitle: true,
                  },
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
                  // ! 故障图片
                  {
                    label: "故障图片",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    prop: "fileList",
                    formType: "upload",
                  },
                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnel",
                  },
                  // ! 更换备件
                  {
                    prop: "upload4",
                    span: 24,
                    formType: "sparePart",
                  },

                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              case "DZWX3":
              case "WWWX3":
              case "JDBWX3":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },
                  {
                    label: "工单对象",
                    prop: "orderObj",
                    span: 12,
                    required: true,
                    formType: "selectTree",
                    options: this.routePoint,
                    // formDisabled: true,
                  },
                  {
                    span: 24,
                    formType: "table",
                    required: true,
                  },
                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnel",
                    required: true,
                  },
                  // ! 更换备件
                  {
                    prop: "upload4",
                    span: 24,
                    formType: "sparePart",
                  },

                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              case "DQJY2":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },

                  // ! 设备列表
                  {
                    span: 24,
                    formType: "equip",
                  },
                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnel",
                    required: true,
                  },
                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              case "RCBY1":
              case "YJBY1":
              case "EJBY1":
              case "CGRH1":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },
                  {
                    label: "工单对象",
                    prop: "orderObj",
                    span: 12,
                    required: true,
                    formType: "selectTree",
                    options: this.routePoint,
                    // formDisabled: true,
                  },

                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnelUpkeep",
                    required: true,
                  },
                  // ! 更换备件
                  {
                    prop: "upload4",
                    span: 24,
                    formType: "maintenanceRoute",
                  },

                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              case "RCBY2":
              case "YJBY2":
              case "EJBY2":
              case "CGRH2":
                this.columns2 = [
                  // 需填信息
                  {
                    label: "工单信息",
                    span: 24,
                    subTitle: true,
                  },
                  {
                    label: "工单类型",
                    prop: "orderType",
                    required: true,
                    span: 12,
                    formType: "selectTree",
                    options: this.orderOptions,
                  },
                  {
                    label: "工单名称",
                    prop: "orderName",
                    required: true,
                    span: 12,
                  },
                  {
                    label: "计划执行日期",
                    prop: "planExecuteDate",
                    span: 12,
                    formType: "date",
                    required: true,
                  },
                  {
                    label: "工单对象",
                    prop: "orderObj",
                    span: 12,
                    required: true,
                    formType: "selectTree",
                    options: this.routePoint,
                    // formDisabled: true,
                  },

                  // ! 人员配置
                  {
                    span: 24,
                    formType: "personnelUpkeep",
                    required: true,
                  },
                  // ! 更换备件
                  {
                    prop: "upload4",
                    span: 24,
                    formType: "maintenanceEqm",
                  },

                  // ! 关联附件
                  {
                    prop: "contacts2",
                    span: 24,
                    formType: "document",
                  },
                ];
                break;
              default:
                break;
            }
          }
        }
      },
      deep: true,
    },
    orderOptions: {
      handler(newVla) {
        this.resetColumns();
      },
      deep: true,
    },
  },
  methods: {
    resetColumns() {
      if (this.formData.orderType && this.formData.orderType === "DQJY") {
        this.columns2 = [
          {
            label: "工单信息",
            span: 24,
            subTitle: true,
          },
          {
            label: "工单类型",
            prop: "orderType",
            required: true,
            span: 12,
            formType: "selectTree",
            options: this.orderOptions,
          },
          {
            label: "工单名称",
            prop: "orderName",
            required: true,
            span: 12,
          },
          {
            label: "计划执行日期",
            prop: "planExecuteDate",
            span: 12,
            formType: "date",
            required: true,
          },
        ];
        this.formData.orderObj = 2;
      } else {
        this.columns2 = [
          {
            label: "工单信息",
            span: 24,
            subTitle: true,
          },
          {
            label: "工单类型",
            prop: "orderType",
            required: true,
            span: 12,
            formType: "selectTree",
            options: this.orderOptions,
          },
          {
            label: "工单名称",
            prop: "orderName",
            required: true,
            span: 12,
          },
          {
            label: "计划执行日期",
            prop: "planExecuteDate",
            span: 12,
            formType: "date",
            required: true,
          },
          {
            label: "工单对象",
            prop: "orderObj",
            span: 12,
            required: true,
            formType: "selectTree",
            options: this.routePoint,
            // formDisabled: true,
          },
        ];
        // if (this.formData.orderType) {
        //   this.formData.orderObj = Number(this.routePoint[0].id);
        // }
      }
      if (!this.formData.orderCode) {
        this.formData = {
          orderType: this.formData.orderType,
          orderName: this.formData.orderName,
          planExecuteDate: this.formData.planExecuteDate,
          orderObj: this.formData.orderObj,
        };
      }
      this.formData["maintenanceType"] = this.findParentType(
        this.formData["orderType"],
        this.orderOptions
      );
    },
    // 根据二级工单类型获取一级工单类型
    findParentType(selectedChildType, data) {
      for (const item of data) {
        if (
          item.children.some((dataItem) => dataItem.id === selectedChildType)
        ) {
          return item.label;
        }
      }

      return null; // 如果没有找到相关联的一级类型，则返回 null
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
        if (this.$route.query.item && this.$route.query.item.deviceDTOList) {
          this.orderOptions = this.orderOptions.filter(
            (item) => item.label === "设备维修"
          );
        }
      });
    },
    handleCancel() {
      //   this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      //   this.$router.go(-1); //跳回上页
      this.close();
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
      this.formData = {};

      this.$refs.titleform.clearValidate();
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
    /** 提交按钮 */
    submitForm: function (formdata) {
      // ! 成功了才会走这

      switch (this.formData.orderType + this.formData.orderObj) {
        // ! 巡点捡
        case "RCDJ1":
        case "ZZDJ1":
        case "JMDJ1":
        case "RCDJ2":
        case "ZZDJ2":
        case "JMDJ2":
          if (formdata.lineDTOList && formdata.lineDTOList.length > 0) {
            formdata.lineDTOList.map((item) => {
              item.photoFlag = Number(item.photoFlag);
              return item;
            });
          }
          if (formdata.deviceDTOList && formdata.deviceDTOList.length > 0) {
            formdata.deviceDTOList.map((item) => {
              item.photoFlag = Number(item.photoFlag);
              return item;
            });
          }
          addInspection(formdata).then((res) => {
            if ((res.code = 200)) {
              this.$message.success("添加成功");
              this.close();
            }
          });
          break;
        // ! 设备维修
        case "DZWX2":
        case "WWWX2":
        case "JDBWX2":
        case "DZWX3":
        case "WWWX3":
        case "JDBWX3":
          if (
            localStorage.getItem("addList") &&
            localStorage.getItem("addList").length > 0
          ) {
            formdata["deviceDTOList"] = JSON.parse(
              localStorage.getItem("addList")
            );
          } else {
            if (formdata["deviceDTOList"]) {
              formdata["deviceDTOList"][0]["faultInfoDTO"] = {
                faultDate: formdata.faultDate,
                faultLocation: formdata.faultLocation,
                faultType: formdata.faultType,
                faultGrade: formdata.faultGrade,
                haltFlag: formdata.haltFlag,
                faultInfo: formdata.faultInfo,
                fileList: formdata.fileList,
              };
              delete formdata.faultDate;
              delete formdata.faultLocation;
              delete formdata.faultType;
              delete formdata.faultGrade;
              delete formdata.haltFlag;
              delete formdata.faultInfo;
              delete formdata.fileList;
            }
          }

          addEquip(formdata).then((res) => {
            if ((res.code = 200)) {
              this.$message.success("添加成功");
              this.close();
            }
          });
          break;
        // ! 定期检验
        case "DQJY2":
          addPeriodic(formdata).then((res) => {
            if ((res.code = 200)) {
              this.$message.success("添加成功");
              this.close();
            }
          });
          break;
        // ! 保养
        case "RCBY1":
        case "YJBY1":
        case "EJBY1":
        case "CGRH1":
        case "RCBY2":
        case "YJBY2":
        case "EJBY2":
        case "CGRH2":
          if (formdata.lineDTOList && formdata.lineDTOList.length > 0) {
            formdata.lineDTOList.map((item) => {
              item.photoFlag = Number(item.photoFlag);
              return item;
            });
          }
          if (formdata.deviceDTOList && formdata.deviceDTOList.length > 0) {
            formdata.deviceDTOList.map((item) => {
              item.photoFlag = Number(item.photoFlag);
              return item;
            });
          }
          addMaintenance(formdata).then((res) => {
            if ((res.code = 200)) {
              this.$message.success("添加成功");
              this.close();
            }
          });
          break;
        default:
          break;
      }
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
  },
  beforeDestroy() {
    removeStore("equipmentList");
    removeStore("addList");
  },
};
</script>
<style lang='scss' scoped>
.box {
  background-color: #fff;
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
}
.footer {
  padding-top: 20px;
}

.subtitle {
  //   border-bottom: 1px solid #ddd;
  background-color: #ebf4fc;
  ::v-deep .el-form-item__label {
    color: #1d2129;
    font-weight: bold;
    // width: 80px !important;
    text-align: left;
    padding-left: 10px;
  }
}
.container-box2 {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
.overlay {
  height: 580px;
  background-color: aqua;
  background: url("../../../../assets/images/workSelection.png") no-repeat;
  background-size: contain;
}
</style>
