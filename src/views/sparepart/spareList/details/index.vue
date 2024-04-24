<template>
  <Wrapper>
    <el-card shadow="never" style="border: 0">
      <el-row :gutter="12">
        <el-col
          :span="5"
          v-if="disabled1"
          style="font-size: 12px; color: #888; float: right"
        >
          <!-- <el-button type="text" icon="el-icon-s-help">快速工单</el-button> -->
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="
              () => {
                spareValue2 = JSON.parse(JSON.stringify(spareValue));
                disabled1 = false;
              }
            "
            >编辑</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="12" :style="{ 'margin-top': disabled1 ? 0 : 36 + 'px' }">
        <el-col :span="6">
          <img
            v-if="formData.fileResource"
            :src="mainImage"
            alt=""
            srcset=""
            style="vertical-align: top; height: 100px"
          />
          <div
            v-else
            class="noImg"
            style="
              width: 120px;
              vertical-align: top;
              height: 100px;
              display: inline-block;
            "
          />
          <img
            v-if="qrCode.indexOf('null') == -1"
            @click="opendrawer"
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
        <el-col
          :span="15"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          <jm-form
            class="mr20"
            v-if="spareValue"
            :columns="columns"
            :formData="spareValue"
            :showButton="false"
            :disabled="disabled1"
            ref="jmform1"
          >
          </jm-form>
        </el-col>
        <el-col :span="3">
          <span v-if="!disabled1">
            <el-button type="primary" @click="save" size="mini">确认</el-button>
            <br /><br />
            <el-button size="mini" @click="close(null)">取消</el-button>
          </span>
        </el-col>
      </el-row>
      <br />
      <el-tabs v-model="activeName" type="card" @tab-click="tabsHandleClick">
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="item in tabs"
          :key="item.label"
          v-if="item.visible"
        >
          <br />
          <component
            :is="item.name"
            v-if="spareValue"
            :formData="spareValue"
            @submitForm="submitForm"
            @newFormData="newFormData"
            :locationOptions="locationOptions"
            @close="close"
            @editTrue="editTrue"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 打印二维码 -->
    <el-drawer
      title="备件二维码"
      :visible.sync="drawer"
      direction="rtl"
      size="40%"
      :destroy-on-close="true"
    >
      <div id="printContent">
        <table class="qrcode" cellspacing="0">
          <tr>
            <td style="width: 20%">备件名称</td>
            <td colspan="2" style="width: 50%">{{ formData.partName }}</td>
          </tr>
          <tr>
            <td>备件编码</td>
            <td>{{ formData.partCode }}</td>
            <td rowspan="4" style="text-align: center; width: 30%">
              <img
                v-if="qrCode.indexOf('null') == -1"
                :src="qrCode"
                width="60%"
                alt=""
                srcset=""
              />
            </td>
          </tr>
          <tr>
            <td>规格型号</td>
            <td>{{ formData.sModel }}</td>
          </tr>
          <tr>
            <td>备件类别</td>
            <td>
              {{ findName(dict.type.spare_parts_type, formData.partType) }}
            </td>
          </tr>
          <tr>
            <td>单位</td>
            <td>{{ findName(dict.type.spare_parts_unit, formData.unit) }}</td>
          </tr>
        </table>
      </div>
      <div
        style="
          position: absolute;
          bottom: 0px;
          width: 100%;
          background-color: #fff;
          text-align: center;
          padding: 20px;
          border-top: 1px solid #ddd;
        "
      >
        <el-button size="mini" @click="drawer = false">关闭</el-button>
        <el-button size="mini" @click="handlePrint" type="primary"
          >打印</el-button
        >
      </div>
    </el-drawer>

    <!-- 添加供应商对话框 -->
    <el-drawer
      title="选择供应商"
      :visible.sync="drawersupplier"
      size="60%"
      direction="rtl"
      :wrapperClosable="false"
    >
      <supplier
        @submitRadio="submitRadio"
        :isRadio="true"
        @close="closesupplier"
      ></supplier>
    </el-drawer>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import JmForm from "@/components/JmForm";
import {
  getManagementDetails,
  uploadImgPut,
  getImg,
  updateManagement,
} from "@/api/sparePart/sparePartList";
import { equipmentTree } from "@/api/equipment/category";
import supplier from "@/views/device/book/supplier";

import step1 from "./step1.vue";
import step2 from "./step2.vue";
import step3 from "./step3.vue";
import step4 from "./step4.vue";
import step5 from "./step5.vue";
import { getLocationTree } from "@/api/Location";
export default {
  components: { Wrapper, JmForm, supplier, step1, step2, step3, step4, step5 },
  dicts: ["spare_parts_type", "spare_parts_unit", "spare_parts_type"],
  data() {
    return {
      activeName: "step1",
      disabled1: true,
      formData: { imgFileResourceList: [] },
      spareValue: null,
      spareValue2: null,
      formTitle: "编辑设备",
      drawer: false,
      // 部门树选项
      categoryOptions: [],
      categoryName: "",
      spareValue: null,
      drawersupplier: false,
      locationOptions: [],
    };
  },
  created() {
    this.getTreeSelect();
    // 编辑
    this.spareValue = {
      ...this.$route.query.i,
      partType: "" + this.$route.query.i.partType,
    };
    getManagementDetails(this.spareValue.partCode).then((res) => {
      this.formData = { ...res.data, partType: "" + res.data.partType };
      this.$refs.jmform1.clearValidate();
    });
    getImg(this.spareValue.partCode).then((res) => {
      this.$set(this.formData, "fileResource", res.data[0]);
    });
  },

  mounted() {},
  computed: {
    mainImage() {
      return (
        process.env.VUE_APP_BASE_API + this.formData.fileResource?.fileName
      );
    },
    qrCode() {
      return process.env.VUE_APP_BASE_API + this.formData.qrCode;
    },
    // 列信息
    columns() {
      return [
        {
          label: "备件类别",
          prop: "partType",
          span: 8,
          required: true,
          formType: "select",
          options: this.dict.type.spare_parts_type,
        },
        {
          label: "备件编码",
          prop: "partCode",
          span: 8,
          required: true,
          formDisabled: true,
        },
        { label: "备件名称", prop: "partName", span: 8, required: true },
        {
          label: "规格型号",
          prop: "sModel",
          span: 8,
        },
        {
          label: "默认存储位置",
          prop: "locationCode",
          span: 8,
          // required: true,
          options: this.locationOptions,
          formType: "selectTree",
        },
        {
          label: "默认供应商",
          prop: "supplierName",
          span: 8,
          // required: true,
          clickFn: () => {
            this.drawersupplier = true;
          },
        },
      ];
    },
    tabs() {
      return [
        { label: "库存明细", name: "step1", visible: true },
        {
          label: "出入库记录",
          name: "step2",
          visible: true,
        },
        { label: "备件更换记录", name: "step3", visible: true },
        { label: "关联设备", name: "step4", visible: true },
        { label: "备件图片", name: "step5", visible: true },
      ];
    },
  },
  methods: {
    editTrue() {
      this.spareValue2 = JSON.parse(JSON.stringify(this.spareValue));
    },
    getTree(arr) {
      arr.forEach((item) => {
        item.id = item.deptCode;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTree(item.children);
        }
      });
      return arr;
    },
    newFormData(newValue) {
      this.formData.imgFileResourceList = newValue.imgFileResourceList;
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
    closesupplier() {
      this.drawersupplier = false;
    },
    submitRadio(row) {
      this.$set(this.spareValue, "supplierName", row.supplierName);
      this.$set(this.spareValue, "supplierCode", row.supplierCode);
      this.$set(this.spareValue, "supplierId", row.id);
      this.closesupplier();
    },
    getTreeSelect() {
      getLocationTree().then((res) => {
        this.locationOptions = this.getTree(res.data);
      });
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
      });
    },
    tabsHandleClick() {},
    opendrawer() {
      // 查categoryId对应的名字
      // this.loops(this.categoryOptions, this.formData.categoryId);
      this.drawer = true;
    },
    close(callback) {
      console.log("========================", this.spareValue2);
      this.spareValue = JSON.parse(JSON.stringify(this.spareValue2));

      this.disabled1 = true;
      this.$refs.jmform1.clearValidate();
      if (callback) callback();
      this.spareValue2 = null;
    },
    async save(fn) {
      var jmform1 = await this.$refs.jmform1.submitForm();
      if (jmform1) {
        this.submitForm(fn, "bj");
      }
    },
    /** 提交按钮 */
    submitForm(callback, type) {
      if (type === "bj") {
        // 编辑
        updateManagement(this.spareValue).then((res) => {
          if (res.code === 200) {
            getManagementDetails(this.spareValue.partCode).then((res) => {
              this.formData = { ...res.data, partType: "" + res.data.partType };
              this.$refs.jmform1.clearValidate();
            });
            this.$message.success("编辑成功！");
            this.disabled1 = true;
            if (callback) callback();
            this.spareValue2 = null;
          } else {
            this.close(callback);
          }
        });
        return;
      }
      // 修改图片
      let newFile = {
        busId: this.formData.partCode,
        fileResourceList: this.formData.imgFileResourceList,
      };

      uploadImgPut(newFile).then((response) => {
        if (response.code === 200) {
          getImg(this.spareValue.partCode).then((res) => {
            this.$set(this.formData, "fileResource", res.data[0]);
          });
          this.$modal.msgSuccess("修改成功");
          this.disabled1 = true;
          if (callback) callback(this.formData);
        }
      });
    },
    handlePrint() {
      this.$print({
        printable: "printContent",
        type: "html",
        header: "备件二维码",
        targetStyles: ["*"], // 打印内容使用所有HTML样式，没有设置这个属性/值，设置分页打印没有效果
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.qrcode {
  margin-right: 20px;
  margin-left: 20px;
  td {
    padding: 5px;
    border: 1px solid #ddd;
  }
}
.qrcodeimg {
  width: 50%;
  vertical-align: top;
  cursor: pointer;
  transition: 0.2s all;
  &:hover {
    box-shadow: 0 0 5px #007bfe;
  }
}

.el-tabs--card ::v-deep .el-tabs__header {
  margin: 0;
  border-bottom: 0;
  height: 35px;
}
::v-deep .el-tabs__nav {
  border: 0 !important;
  background-color: #f7fbff;
  border-radius: 30px !important;
}
.el-tabs--card ::v-deep .el-tabs__item {
  height: 34px;
  line-height: 34px;
  background-color: #f7fbff;
  border-radius: 30px;
  color: #5d5d5f;
  border: 0;
}
.el-tabs--card ::v-deep .el-tabs__item.is-active {
  color: #fff;
  background-color: #007bfe;
}
::v-deep .el-card__body {
  padding-top: 0;
}
.noImg {
  background: url("../../../../assets/images/noImg.png") no-repeat;
}
</style>

