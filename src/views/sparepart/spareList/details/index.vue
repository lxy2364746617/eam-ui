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
          <el-button type="text" icon="el-icon-edit" @click="disabled1 = false"
            >编辑</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="12" :style="{ 'margin-top': disabled1 ? 0 : 36 + 'px' }">
        <el-col :span="6">
          <img
            v-if="mainImage.indexOf('null') == -1"
            :src="mainImage"
            alt=""
            srcset=""
            style="width: 50%; vertical-align: top; height: 100px"
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
              margin-left: 50px;
            "
          />
        </el-col>
        <el-col
          :span="15"
          style="font-size: 12px; color: #888; padding-top: 4px"
        >
          <jm-form
            class="mr20"
            v-if="formData1"
            :columns="columns"
            :formData="formData1"
            :showButton="false"
            :disabled="disabled1"
            ref="jmform1"
          >
          </jm-form>
        </el-col>
        <el-col :span="3">
          <span v-if="disabled1">
            <el-progress
              type="circle"
              :percentage="formData.integrity"
              :width="70"
            ></el-progress>
            <div style="font-size: 12px">
              资料完整度{{ formData.integrity }}%
            </div>
          </span>
          <span v-else>
            <el-button type="primary" @click="save" size="mini">确认</el-button>
            <br /><br />
            <el-button size="mini" @click="close">取消</el-button>
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
            v-if="formData1"
            :formData="formData1"
            @submitForm="submitForm"
            @close="close"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 打印二维码 -->
    <el-drawer
      title="设备二维码"
      :visible.sync="drawer"
      direction="rtl"
      size="40%"
      :destroy-on-close="true"
    >
      <div id="printContent">
        <table class="qrcode" cellspacing="0">
          <tr>
            <td style="width: 20%">设备名称</td>
            <td colspan="2" style="width: 50%">{{ formData.deviceName }}</td>
          </tr>
          <tr>
            <td>设备编码</td>
            <td>{{ formData.deviceCode }}</td>
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
            <td>{{ formData.specs }}</td>
          </tr>
          <tr>
            <td>设备类别</td>
            <td>{{ categoryName }}</td>
          </tr>
          <tr>
            <td>功能位置</td>
            <td>{{ formData.location }}</td>
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
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import JmForm from "@/components/JmForm";
import { getBASE } from "@/api/equipment/BASE";
import { equipmentTree } from "@/api/equipment/category";
import step1 from "./step1.vue";
import step2 from "./step2.vue";
import step3 from "./step3.vue";
import step4 from "./step4.vue";
import step5 from "./step5.vue";
export default {
  components: { Wrapper, JmForm, step1, step2, step3, step4, step5 },
  dicts: ["em_device_state", "device_run_state"],
  data() {
    return {
      activeName: "step1",
      disabled1: true,
      formData: {},
      formData1: null,
      formTitle: "编辑设备",
      drawer: false,
      // 部门树选项
      categoryOptions: [],
      categoryName: "",
    };
  },
  created() {
    this.getTreeSelect();
    // 编辑
    const deviceId = this.$route.query.i;
    getBASE(deviceId)
      .then((response) => {
        // 第一步  特种设备
        if (response.data.emArchivesSpecial) {
          response.data.emArchivesSpecial.componentContent = JSON.parse(
            response.data.emArchivesSpecial.componentContent
          );
          response.data.emArchivesSpecial.fieldValue = JSON.parse(
            response.data.emArchivesSpecial.fieldValue
          );
          this.setFormLabel(response.data.emArchivesSpecial.componentContent);
        }
        // 第二步
        if (response.data.archivesOther == null) {
          response.data.archivesOther = {};
        }
        // 第二步  扩展数据
        if (response.data.emArchivesExtendAtt) {
          response.data.emArchivesExtendAtt.componentContent = JSON.parse(
            response.data.emArchivesExtendAtt.componentContent
          );
          response.data.emArchivesExtendAtt.fieldValue = JSON.parse(
            response.data.emArchivesExtendAtt.fieldValue
          );
          this.setFormLabel(response.data.emArchivesExtendAtt.componentContent);
        }
        // 第三步 主要指标
        if (response.data.emArchivesIndex) {
          response.data.emArchivesIndex.componentContent = JSON.parse(
            response.data.emArchivesIndex.componentContent
          );
          response.data.emArchivesIndex.fieldValue = JSON.parse(
            response.data.emArchivesIndex.fieldValue
          );
          this.setFormLabel(response.data.emArchivesIndex.componentContent);
        }

        this.formData = response.data;
        this.formData1 = JSON.parse(JSON.stringify(this.formData));
      })
      .catch((err) => {});
  },

  mounted() {},
  computed: {
    mainImage() {
      return process.env.VUE_APP_BASE_API + this.formData.mainImage;
    },
    qrCode() {
      return process.env.VUE_APP_BASE_API + this.formData.qrCode;
    },
    // 列信息
    columns() {
      return [
        { label: "设备名称", prop: "deviceName", span: 12, required: true },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "select",
          options: this.dict.type.em_device_state,
          span: 12,
          required: true,
        },
        { label: "设备编码", prop: "deviceCode", span: 12, required: true },
        {
          label: "运行状态",
          prop: "runStatus",
          formType: "select",
          options: this.dict.type.device_run_state,
          span: 12,
        },
      ];
    },
    tabs() {
      return [
        { label: "库存明细", name: "step1", visible: true },
        {
          label: "出入库记录",
          name: "step2",
          visible: this.formData.emArchivesIndex,
        },
        { label: "备件更换记录", name: "step3", visible: true },
        { label: "关联设备", name: "step4", visible: true },
        { label: "备件图片", name: "step5", visible: true },
      ];
    },
  },
  methods: {
    setFormLabel(arr) {
      arr.forEach((b) => {
        b.label = b.fieldName;
        b.prop = b.fieldCode;
        // b.required = b.required;
        b.required = b.required == "0" ? true : false;
        b.disabled = b.disabled;
        b.formType = b.componentType;
        switch (b.componentType) {
          case "select":
            b.options = [];
            // 字典
            if (b.dictionaryType) {
              console.log(this, 222);
              b.options = this.dict.type[b.dictionaryType];
            }
            break;
          case "radio":
            b.options = [];
            if (b.dictionaryType) {
              b.options = this.dict.type[b.dictionaryType];
            }
            break;

          default:
            break;
        }
      });
    },
    getTreeSelect() {
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
      // console.log('========================',  callback());
      this.formData1 = JSON.parse(JSON.stringify(this.formData));
      this.disabled1 = true;
      // if (callback) callback();
    },
    async save(fn) {
      var jmform1 = await this.$refs.jmform1.submitForm();
      if (jmform1) {
        this.submitForm();
      }
    },
    /** 提交按钮 */
    submitForm(callback) {
      var formData1 = this.getFormDataParams();
      modifyBASE(formData1).then((response) => {
        this.$modal.msgSuccess("修改成功");
        this.setSuccessData();
        this.disabled1 = true;
        if (callback) callback(formData1);
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
</style>

