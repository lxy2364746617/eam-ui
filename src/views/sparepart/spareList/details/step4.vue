<template>
  <div>
    <div>
      <el-row :gutter="10" class="mb8" style="margin-bottom: 20px">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >关联设备</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            >解除</el-button
          >
        </el-col>
      </el-row>
      <!-- 卡片 -->
      <el-row :gutter="2">
        <el-checkbox-group
          v-model="checkedValue"
          @change="handleSelectionChange"
        >
          <el-col :span="6" v-for="item in equipmentList" :key="item.id">
            <el-card style="margin-bottom: 2px; font-size: 14px">
              <p class="title-p">
                <el-checkbox :label="item.deviceId" :key="item.deviceId">
                  <el-tooltip
                    :content="`${item.deviceName}[${item.deviceCode}]`"
                    placement="top"
                  >
                    <div class="tooltip">
                      {{ item.deviceName }}[{{ item.deviceCode }}]
                    </div>
                  </el-tooltip>
                </el-checkbox>
                <el-tag
                  class="selectTag"
                  effect="light"
                  :type="
                    findClass(dict.type.em_device_state, item.deviceStatus)
                  "
                >
                  {{ findName(dict.type.em_device_state, item.deviceStatus) }}
                </el-tag>
              </p>
              <el-row
                :gutter="2"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <el-col :span="10" style="margin-right: 15px">
                  <img
                    style="width: 100%; height: 100%"
                    :src="
                      item.deviceImg && processEnv + item.deviceImg.fileName
                    "
                    alt=""
                  />
                </el-col>
                <el-col :span="14">
                  <p>设备编码:{{ item.deviceCode }}</p>
                  <p>规格型号:{{ item.specs }}</p>
                  <p>
                    设备类型:{{
                      findTreeName(categoryOptions, item.deviceType)
                    }}
                  </p>
                  <p>
                    功能位置:{{ findTreeName(locationOptions, item.location) }}
                  </p>
                  <p>
                    所属子公司:{{
                      findTreeName(deptOptions, item.subCompanyId)
                    }}
                  </p>
                  <p>所属组织: {{ findTreeName(deptOptions, item.affDept) }}</p>
                  <p>重要等级:{{ item.grade }}</p>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-checkbox-group>
      </el-row>
    </div>

    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择设备"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        :isChoose="false"
        @submitRadio="submitRadio"
        @close="drawer = false"
        :formData="equipmentList"
        v-if="drawer"
      >
      </parentdevice>
    </el-drawer>
  </div>
</template>

<script>
import {
  getDeviceList,
  relateDevices,
  secureDevices,
} from "@/api/sparePart/sparePartList";
import parentdevice from "@/views/device/book/device";
import { equipmentTree } from "@/api/equipment/category";
import { listDept } from "@/api/system/dept";
import { getLocationTree } from "@/api/Location";

export default {
  dicts: ["em_device_state"],
  components: {
    parentdevice,
  },
  props: {
    formData: {
      default: {},
      type: Object,
    },
  },
  computed: {},
  mounted() {},
  data() {
    return {
      checkedValue: [],
      categoryOptions: [],
      deptOptions: [],
      processEnv: process.env.VUE_APP_BASE_API,
      ids: [],
      partsCodes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

      // 表格数据
      equipmentList: null,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
      },
      // 关联设备
      drawer: false,
      form: [],
      locationOptions: [],
    };
  },
  created() {
    this.getTreeSelect();
    this.getList(this.queryParams);
  },
  methods: {
    getTreeName(arr) {
      arr.forEach((item) => {
        item.value = item.deptId;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTreeName(item.children);
        }
      });
      return arr;
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
    findClass(options, value) {
      var name = "primary";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].raw.listClass;
        }
      }
      return name;
    },
    findTreeName(options, value) {
      var name = "";
      function Name(name) {
        this.name = name;
      }
      var name1 = new Name("");
      this.forfn(options, value, name1);
      return name1.name;
    },
    forfn(options, value, name1) {
      function changeName(n1, x) {
        n1.name = x;
      }
      for (let i = 0; i < options?.length; i++) {
        if (options[i].id == value) {
          changeName(name1, options[i].label);
        }
        if (options[i].children) {
          this.forfn(options[i].children, value, name1);
        }
      }
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      queryParams.partCode = this.formData.partCode;
      getDeviceList(queryParams).then((response) => {
        this.equipmentList = response.data;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.partsCodes = selection.map((item) => item.partsCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 解除设备 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认解除选中的设备？")
        .then(() => {
          let dataValue = {
            deviceIdList: this.checkedValue,
            partCode: this.formData.partCode,
          };
          return secureDevices(dataValue);
        })
        .then(() => {
          this.getList(this.queryParams);
          this.multiple = true;
          (this.ids = []), (this.checkedValue = []);
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 关联设备
    handleAdd() {
      this.drawer = true;
    },
    getTreeSelect() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
      getLocationTree().then((res) => {
        this.locationOptions = this.getTreeName(res.data);
      });
    },

    submitRadio(val) {
      let ids = val.map((item) => item.deviceId);
      let dataValue = {
        deviceIdList: ids,
        partCode: this.formData.partCode,
      };
      relateDevices(dataValue).then((res) => {
        if (res.code === 200) {
          this.getList(this.queryParams);
          this.$modal.msgSuccess("关联成功");
          this.getList(this.queryParams);
          this.drawer = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.title-p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tooltip {
  font-weight: 700;
  display: inline-block;
  // vertical-align: middle;
  width: 208px;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
}
::v-deep .el-checkbox__input {
  transform: translateY(-23%);
}
</style>