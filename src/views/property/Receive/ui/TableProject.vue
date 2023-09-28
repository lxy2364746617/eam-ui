<template>
  <div class="box">
    <slot></slot>

    <JmTableNoPaging
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :isShow2="isShow"
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
            >新增</el-button
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
          v-hasPermi="['equipment:book:edit']"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
          v-hasPermi="['equipment:book:remove']"
          >删除</el-button
        >
      </template>
    </JmTableNoPaging>

    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
      <div class="title">&nbsp;&nbsp;{{ title }}</div>
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
        class="from"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="formData.deviceName"
            placeholder="请输入设备名称"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="sModel">
          <el-input
            v-model="formData.sModel"
            placeholder="请输入规格型号"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="技术参数" prop="deviceType">
          <el-input
            v-model="formData.deviceType"
            type="textarea"
            placeholder="请输入技术参数"
            :maxlength="200"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>

        <el-form-item label="数量" prop="deviceNum">
          <el-input-number
            v-model="formData.deviceNum"
            placeholder="数量"
            :step="1"
            controls-position="right"
            :max="99"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="submitFormAdd">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import { getProjectList } from "@/api/property/receive";
import JmTableNoPaging from "@/components/JmTableNoPaging";
import {
  setStore,
  getStore,
  delList,
  upName,
  removeStore,
} from "@/utils/property.js";
import { listDept } from "@/api/system/dept";
export default {
  components: {
    JmTableNoPaging,
  },
  props: {
    isShow: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
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
      formData: {},
      rules: {
        deviceName: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
        sModel: [
          {
            required: true,
            message: "请输入规格型号",
            trigger: "blur",
          },
        ],
        createTime: [
          {
            message: "请选择时间",
            trigger: "blur",
          },
        ],
        deviceType: [
          {
            required: true,
            message: "请输入设备类型",
            trigger: "blur",
          },
        ],
        remark: [
          {
            message: "请输入备注",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    columns() {
      return [
        { label: "创建时间", prop: "createTime", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        {
          label: "数量",
          prop: "deviceNum",
          tableVisible: true,
        }, //(1 设备、2 部件)
        {
          label: "备注",
          prop: "remark",
          tableVisible: true,
        },
      ];
    },
  },
  watch: {
    formData: {
      handler(val, oldVal) {
        this.formData["createTime"] = this.formatTimestamp();
      },
      deep: true,
    },
  },
  async created() {
    await this.getDeptTree();
    await this.getList();
    // data赋值
  },
  mounted() {},

  methods: {
    formatTimestamp() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate();
      return `${year}-${month}-${day.toString().padStart(2, "0")}`;
    },

    getWeekNumber(date) {
      const onejan = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
      );
      return week;
    },
    handleChange(value) {
      this.formData.demandOrganization = value[value.length - 1];
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
        this.equipmentList = getStore("equipmentList");
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
                item.deviceName + item.sModel != row.deviceName + item.sModel
            )
          );
          setStore(
            "addList",
            getStore("addList").filter(
              (item) =>
                item.deviceName + item.sModel != row.deviceName + item.sModel
            )
          );
          setStore(
            "updateList",
            getStore("updateList").filter(
              (item) =>
                item.deviceName + item.sModel != row.deviceName + item.sModel
            )
          );
        } else {
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
      this.formData = row;
      this.drawer = true;
      this.itemValue = row;
    },
    submitFormAdd() {
      this.$refs["elForm"].validate(async (valid) => {
        if (!valid) return;
        // this.formData["id"] = 0;
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
        console.log("========================", this.formData);
        this.getList();
        this.$refs["elForm"].resetFields();
        this.drawer = false;
        // await getProjectAdd(this.formData).then((response) => {
        //   if (response.code == 200) {
        //     this.$message({
        //       type: "success",
        //       message: "提交成功",
        //     });
        //     this.getList();
        //     this.$refs["elForm"].resetFields();
        //     this.drawer = false;
        //   }
        // });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    findTreeName(options, value) {
      var name = "";
      name = this.forfn(options, value);
      return name;
    },
    // getDemandOrganizationOptions() {
    //   // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    //   this.$axios({
    //     method: "get",
    //     url: "/property/purchase/plan/selectDetailPage",
    //   }).then((resp) => {
    //     var { data } = resp;
    //     this.demandOrganizationOptions = data.list;
    //   });
    // },
  },
  beforeDestroy() {
    // removeStore("addList");
    // removeStore("delList");
    // removeStore("updateList");
  },

  destroyed() {
    // removeStore("addList");
    // removeStore("delList");
    // removeStore("updateList");
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
    padding: 30px;
    padding-left: 10px;
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
</style>
