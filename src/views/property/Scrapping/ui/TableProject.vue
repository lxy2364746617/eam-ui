<template>
  <div class="box">
    <slot></slot>

    <JmTableNoPaging
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :showOperate="!isShow"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5" v-if="!isShow">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleAdd"
            v-hasPermi="['property:scrapping:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5" v-else>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="importHandler"
            v-hasPermi="['property:scrapping:add']"
            >下载</el-button
          >
        </el-col>
      </template>
      <template #end_handle="scope" v-if="!isChoose">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          :loading="btnLoading"
          @click="handleUpdate(scope.row, scope.index, 'edit')"
          v-hasPermi="['property:scrapping:edit']"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['property:scrapping:remove']"
          >删除</el-button
        >
      </template>
    </JmTableNoPaging>

    <el-drawer :title="title" :visible.sync="drawer" :wrapperClosable="false">
      <div class="drawer-wrapper">
        <div class="drawer-content">
          <el-form
            ref="elForm"
            :model="formData"
            label-width="110px"
            :rules="rules"
          >
            <el-form-item label="设备编码" prop="deviceCode" required>
              <el-input
                @click.native="addItem.choosedrawer = true"
                style="width: 100%"
                v-model="formData.deviceCode"
                placeholder="请选择设备编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName" required>
              <el-input
                disabled
                style="width: 100%"
                v-model="formData.deviceName"
              ></el-input>
            </el-form-item>
            <el-form-item label="规格型号" prop="sModel" required>
              <el-input
                disabled
                style="width: 100%"
                v-model="formData.sModel"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类别" prop="deviceType" required>
              <el-input
                disabled
                style="width: 100%"
                v-model="formData.deviceType"
              ></el-input>
            </el-form-item>
            <el-form-item label="功能位置" prop="location" required>
              <el-select
                disabled
                style="width: 100%"
                v-model="formData.location"
              ></el-select>
            </el-form-item>
            <el-form-item label="设备状态" prop="deviceStatus" required>
              <el-cascader
                v-model="formData.deviceStatus"
                :options="dict.type.em_device_state"
                :props="{ expandTrigger: 'click' }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="资产类别" prop="propertyType" required>
              <el-cascader
                v-model="formData.propertyType"
                :options="dict.type.em_property_type"
                :props="{ expandTrigger: 'click' }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="索引号" prop="indexNo" required>
              <el-input
                style="width: 100%"
                v-model="formData.indexNo"
              ></el-input>
            </el-form-item>
            <el-form-item label="单价" prop="price" required>
              <el-input-number
                controls-position="right"
                :min="0"
                style="width: 100%"
                v-model="formData.price"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="已提折旧" prop="depreciation" required>
              <el-input-number
                controls-position="right"
                :min="0"
                style="width: 100%"
                v-model="formData.depreciation"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="损失金额" prop="lossAmount" required>
              <el-input-number
                controls-position="right"
                :min="0"
                style="width: 100%"
                v-model="formData.lossAmount"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="折旧年限" prop="depreciationLife" required>
              <el-input-number
                controls-position="right"
                :min="0"
                style="width: 100%"
                v-model="formData.depreciationLife"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="已使用年限" prop="usedLife" required>
              <el-input-number
                controls-position="right"
                :min="0"
                style="width: 100%"
                v-model="formData.usedLife"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="损失原因" prop="lossReason" required>
              <el-input
                style="width: 100%"
                v-model="formData.lossReason"
              ></el-input>
            </el-form-item>
            <el-form-item label="损失说明情况" prop="lossSituation" required>
              <el-input
                type="textarea"
                show-word-limit
                :maxlength="200"
                style="width: 100%"
                v-model="formData.lossSituation"
              ></el-input>
            </el-form-item>
            <el-form-item label="损失鉴定情况" prop="lossIdentity">
              <el-input
                type="textarea"
                show-word-limit
                :maxlength="200"
                style="width: 100%"
                v-model="formData.lossIdentity"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 选取设备 -->
    <el-drawer
      title="选择设备"
      :visible.sync="addItem.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <SelectParentDeviceDialog
        v-if="addItem.choosedrawer"
        :isChoose="true"
        @submitRadio="submitRadio2"
        @close="addItem.choosedrawer = false"
      ></SelectParentDeviceDialog>
    </el-drawer>
  </div>
</template>
<script>
import { getProjectList, downDetailLoad } from "@/api/property/scrapping";
import Treeselect from "@riophae/vue-treeselect";
import JmTableNoPaging from "@/components/JmTableNoPaging";
import SelectParentDeviceDialog from "./SelectParentDeviceDialog";
import {
  setStore,
  getStore,
  delList,
  upName,
  convertToTargetFormat,
  removeStore,
} from "@/utils/property.js";
import { listDept } from "@/api/system/dept";
import { saveAs } from "file-saver";
export default {
  components: {
    JmTableNoPaging,
    Treeselect,
    SelectParentDeviceDialog,
  },
  dicts: [
    "em_device_att",
    "apv_status",
    "em_device_level",
    "em_device_state",
    "em_property_type",
  ],
  props: ["rowId", "isShow"],
  data() {
    return {
      addItem: {
        choosedrawer: false,
        copyInputName: "",
        copyInputId: "",
        addDrawer: false,
        addRadio: 1,
      },
      // 需求组织
      deptOptions: null,
      deptOptions2: null,
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
      formData: {
        deviceCode: "",
        deviceName: "",
        sModel: " ",
        deviceType: "",
        location: "",
      },
      formParams: {
        prtOrg: "Y",
      },
      rules: {
        deviceCode: [
          {
            required: true,
            message: "请选择设备编码",
            trigger: "change",
          },
        ],
        deviceName: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "change",
          },
        ],
        sModel: [
          {
            required: true,
            message: "请输入规格型号",
            trigger: "change",
          },
        ],
        deviceType: [
          {
            required: true,
            trigger: "change",
          },
        ],
        location: [
          {
            required: true,
            trigger: "change",
          },
        ],
        deviceStatus: [
          {
            required: true,
            trigger: "change",
          },
        ],
        propertyType: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        indexNo: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        depreciation: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        lossAmount: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        depreciationLife: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        usedLife: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        lossReason: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        lossIdentity: [
          {
            required: true,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    columns() {
      return [
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        { label: "设备类别", prop: "deviceType", tableVisible: true },
        {
          label: "功能位置",
          prop: "location",
          tableVisible: true,
        },
        { label: "索引号", prop: "indexNo", tableVisible: true },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          tableVisible: true,
        },
        {
          label: "资产类别",
          prop: "propertyType",
          formType: "selectTag",
          options: this.dict.type.em_property_type,
          tableVisible: true,
          width: 150,
        }, //(A、B、C)
        {
          label: "单价",
          prop: "price",

          tableVisible: true,
        }, //(0 父级)
        { label: "已提折旧", prop: "depreciation", tableVisible: true },
        {
          label: "损失金额",
          prop: "lossAmount",
          tableVisible: true,
        },
        { label: "折旧年限", prop: "depreciationLife", tableVisible: true },
        { label: "已使用年限", prop: "usedLife", tableVisible: true },
        { label: "损失原因", prop: "lossReason", tableVisible: true },
        { label: "损失说明情况", prop: "lossSituation", tableVisible: true },
        { label: "损失鉴定情况", prop: "lossIdentity", tableVisible: true },
      ];
    },
  },
  watch: {
    drawer: {
      handler(newValue) {
        if (!newValue) {
          this.$refs["elForm"].resetFields();

          this.formData = {
            deviceCode: "",
            deviceName: "",
            sModel: " ",
            deviceType: "",
            location: "",
          };
        }
      },
    },
  },
  async created() {
    await this.getDeptTree();
    await this.getList();

    // data赋值
    this.columns.forEach((b) => {});
    this.deptOptions2 = await convertToTargetFormat(this.deptOptions);
  },
  mounted() {},

  methods: {
    submitRadio2(row) {
      let flag = getStore("equipmentList").some(
        (item) =>
          item.deviceName + item.sModel + item.deviceCode ===
          row.deviceName + row.sModel + row.deviceCode
      );
      if (flag) {
        this.$message.error("该设备已添加到设备清单中请重新选择");
        return;
      }
      this.addItem.copyInputName = row.deviceName;
      this.addItem.copyInputId = row.deviceId;
      this.formData.deviceCode = row.deviceCode;
      this.formData.deviceName = row.deviceName;
      this.formData.sModel = row.specs;
      this.formData.deviceType = row.categoryName;
      this.formData.location = row.location;
      this.formData.propertyType = row.propertyType;
      this.formData.price = row.price;
      this.formData.depreciation = row.depreciation;
      this.formData.lossAmount = row.lossAmount;
      this.formData.depreciationLife = row.depreciationLife;
      this.formData.usedLife = row.usedLife;

      this.addItem.choosedrawer = false;
    },
    handleConfirm() {
      this.$refs["elForm"].validate(async (valid) => {
        if (!valid) return;
        if (Array.isArray(this.formData.deviceStatus))
          this.formData.deviceStatus = this.formData.deviceStatus[0];
        if (Array.isArray(this.formData.propertyType))
          this.formData.propertyType = this.formData.propertyType[0];
        if (this.title === "新增") {
          if (getStore("addList") && getStore("addList").length > 0) {
            setStore("addList", getStore("addList").concat(this.formData));
          } else {
            setStore("addList", [this.formData]);
          }
          this.$message({
            type: "success",
            message: "提交成功",
          });
        } else {
          if (this.itemValue.id) {
            if (getStore("updateList") && getStore("updateList").length > 0) {
              setStore(
                "updateList",
                getStore("updateList").filter(
                  (item) => item.id != this.itemValue.id
                )
              );
              setStore(
                "updateList",
                getStore("updateList").concat(this.formData)
              );
            } else {
              setStore("updateList", [this.formData]);
            }
          } else {
            setStore(
              "updateList",
              getStore("updateList").filter(
                (item) =>
                  item.deviceName + item.sModel !=
                  this.itemValue.deviceName + this.itemValue.sModel
              )
            );
            setStore(
              "updateList",
              getStore("updateList").concat(this.formData)
            );
          }
        }
        this.$message({
          type: "success",
          message: "修改成功",
        });

        this.getList();
        this.resetForm();
        this.drawer = false;
      });
    },
    handleCancel() {
      this.resetForm();
      this.addItem.choosedrawer = false;
      this.drawer = false;
    },
    showSelectDialog() {
      this.addItem.choosedrawer = true;
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
    },
    handleChange(value) {
      // this.formData.demandOrganization = value[value.length - 1];
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
    /** 查询部门下拉树结构 */
    async getDeptTree() {
      await listDept(this.formParams).then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询计划明细列表 */
    async getList(queryParams = { pageNum: 1, pageSize: 10 }) {
      if (this.rowId) queryParams["scrapNo"] = this.rowId;
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      delete search.scrapNo;
      getProjectList(queryParams).then((response) => {
        if (getStore("equipmentList")) setStore("equipmentList", []);
        if (getStore("addList") && getStore("addList").length > 0) {
          setStore("equipmentList", response.data.concat(getStore("addList")));
        } else {
          setStore("equipmentList", response.data);
          this.loading = false;
        }

        if (getStore("updateList") && getStore("updateList").length > 0) {
          setStore(
            "equipmentList",
            upName(getStore("equipmentList"), getStore("updateList"))
          );
        }
        if (getStore("delList") && getStore("delList").length > 0) {
          setStore(
            "equipmentList",
            delList(getStore("equipmentList"), getStore("delList"))
          );
        }
        let matches = getStore("equipmentList").filter((item) => {
          for (let key in search) {
            if (item[key] != search[key]) {
              if (search[key] == "") continue;
              return false;
            }
          }
          return true;
        });
        this.equipmentList = matches;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.drawer = !this.drawer;
      this.title = "新增";
    },
    importHandler() {
      downDetailLoad(this.ids).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (!row.id) {
          setStore(
            "equipmentList",
            this.equipmentList.filter(
              (item) =>
                item.deviceName + item.sModel != row.deviceName + row.sModel
            )
          );
          setStore(
            "addList",
            getStore("addList").filter(
              (item) =>
                item.deviceName + item.sModel != row.deviceName + row.sModel
            )
          );
          setStore(
            "updateList",
            getStore("updateList").filter(
              (item) =>
                item.deviceName + item.sModel != row.deviceName + row.sModel
            )
          );
        } else {
          setStore(
            "updateList",
            getStore("updateList").filter((item) => item.id != row.id)
          );
          if (getStore("delList") && getStore("delList").length > 0) {
            setStore("delList", [
              ...getStore("delList").concat(
                this.equipmentList.filter((item) => item.id == row.id)
              ),
            ]);
          } else {
            setStore(
              "delList",
              this.equipmentList.filter((item) => item.id == row.id)
            );
          }
        }
        setStore(
          "equipmentList",
          this.equipmentList.filter((item) => item.id != row.id)
        );

        this.getList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    handleUpdate(row, index) {
      this.title = "编辑";
      this.formData = JSON.parse(JSON.stringify(row));
      this.drawer = true;
      this.itemValue = JSON.parse(JSON.stringify(row));
    },

    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    findTreeName(options, value) {
      var name = "";
      name = this.forfn(options, value);
      return name;
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-top: 20px;
  width: 100%;
  height: auto;
  padding: 14px 15px;
  .from {
    position: relative;
    padding-left: 10px;
    padding-right: 30px;
    label {
      width: 120px;
    }
  }
  .title {
    font-size: 20px;
    width: 100%;
    height: 58px;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
    padding-bottom: 10px;

    display: flex;
    justify-content: start;
    align-items: center;
  }

  .controls {
    padding-top: 15px;
    width: 100%;
    height: auto;
    padding-bottom: 30px;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #e9eaef;
      background: linear-gradient(
        139deg,
        #62b0ff 44.05%,
        #007bfe 105.54%,
        #007bfe 118.67%,
        #007bfe 129.22%
      );
      padding: 0;
    }
  }

  .overflow-hidden {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.drawer-wrapper {
  position: relative;
  .drawer-content {
    padding: 0px 20px 50px;
    overflow-y: auto;
  }
  .drawer-footer {
    width: 100%;
    height: 50px;
    padding: 0 20px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10;
  }
}
</style>
