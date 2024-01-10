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
          <el-col :span="6" v-for="item in equipmentList" :key="item.partsCode">
            <el-card style="margin-bottom: 2px; font-size: 14px">
              <p>
                <el-checkbox :label="item.id" :key="item.partsCode"
                  >{{ item.partsName }}[{{ item.partsCode }}]</el-checkbox
                >
                <span style="float: right">
                  <el-tag size="mini" type="success">在用</el-tag>
                </span>
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
                    src="/dev-api/profile/upload/2023/12/29/给水泵_20231229133724A004.jpg"
                    alt=""
                  />
                </el-col>
                <el-col :span="14">
                  <p>规格型号:{{ item.partspecs }}</p>
                  <p>设备类型:{{ item.partsType }}</p>
                  <p>功能位置:{{ item.location }}</p>
                  <p>所属子公司:{{ item.orgId }}</p>
                  <p>所属组织:</p>
                  <p>重要等级:{{ item.unit }}</p>
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
        :formData="form"
        v-if="drawer"
      >
      </parentdevice>
    </el-drawer>
  </div>
</template>

<script>
import { listParts } from "@/api/equipment/parts";
import parentdevice from "@/views/device/book/device";

export default {
  dicts: ["em_property_type"],
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
        pageNum: 1,
        pageSize: 10,
        deviceId: this.formData.deviceId,
      },
      // 关联设备
      drawer: false,
      form: {},
    };
  },
  created() {
    this.getList(this.queryParams);
  },
  methods: {
    /** 查询用户列表 */
    getList(queryParams) {
      queryParams.deviceId = this.queryParams.deviceId;
      this.loading = true;
      listParts(queryParams).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.partsCodes = selection.map((item) => item.partsCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const partsCodes = row.partsCode || this.partsCodes;
      this.$modal
        .confirm('是否确认删除备件编码为"' + partsCodes + '"的数据项？')
        .then(() => {
          // return delParts(ids);
          console.log("========================", ids);
        })
        .then(() => {
          this.getList(this.queryParams);
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 关联设备
    handleAdd() {
      let lineIds = this.equipmentList.map((item) => item.deviceId) || [];
      this.$set(this.form, "disIds", lineIds);
      this.drawer = true;
    },

    submitRadio(val) {
      console.log("========================", val);
    },
  },
};
</script>