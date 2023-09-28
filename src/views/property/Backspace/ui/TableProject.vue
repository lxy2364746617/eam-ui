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
      :handleWidth="230"
      :columns="columns"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5" v-if="!this.$route.query.item ? true : false">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleAdd"
            v-hasPermi="['equipment:book:add']"
            >选取设备</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="!this.$route.query.item ? true : false">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="importHandler"
            v-hasPermi="['equipment:book:add']"
            >批量设置</el-button
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
      <JmTableNoPaging
        :tableData="equipmentList2"
        @getList="getList2"
        @handleSelectionChange="handleSelectionChange2"
        :total="total2"
        ref="jmtable"
        :isRadio="isChoose2"
        :handleWidth="230"
        :columns="columns2"
        :isEdit="false"
        v-if="!addEdit2"
      >
      </JmTableNoPaging>
    </el-drawer>
  </div>
</template>
<script>
import { getProjectList } from "@/api/property/backspace";
import Treeselect from "@riophae/vue-treeselect";
import JmTableNoPaging from "@/components/JmTableNoPaging";
import {
  setStore,
  getStore,
  delList,
  upName,
  convertToTargetFormat,
  removeStore,
} from "@/utils/property.js";
import { listDept } from "@/api/system/dept";
export default {
  components: {
    JmTableNoPaging,
    Treeselect,
  },
  props: ["rowId"],
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
      formData: {
        deviceName: undefined,
        sModel: undefined,
        technologyParam: "",
        necessityAnalysis: "",
        demandDate: null,
        demandNum: 0,
        planPrice: 0,
        demandOrganization: null,
        projectCategory: undefined,
        examinationAccording: undefined,
        remark: undefined,
        purchasePlanNo: "年度",
      },
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
        technologyParam: [
          {
            message: "请输入技术参数",
            trigger: "blur",
          },
        ],
        necessityAnalysis: [
          {
            required: true,
            message: "请输入必要性分析",
            trigger: "blur",
          },
        ],
        demandDate: [
          {
            required: true,
            message: "请选择需求日期",
            trigger: "change",
          },
        ],
        demandNum: [
          {
            required: true,
            message: "需求数量",
            trigger: "blur",
          },
        ],
        planPrice: [
          {
            required: true,
            message: "计划单价(万元)",
            trigger: "blur",
          },
        ],
        demandOrganization: [
          {
            required: true,
            message: "请至少选择一个需求组织",
            trigger: "change",
          },
        ],
        projectCategory: [
          {
            required: true,
            message: "请输入项目分类",
            trigger: "blur",
          },
        ],
        examinationAccording: [
          {
            message: "请输入子公司审查依据",
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
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        { label: "技术参数", prop: "technologyParam", tableVisible: true },
        {
          label: "必要性分析",
          prop: "necessityAnalysis",
          tableVisible: true,
        }, //(1 设备、2 部件)
        { label: "项目分类", prop: "projectCategory", tableVisible: true },
        {
          label: "子公司审查依据",
          prop: "examinationAccording",
          tableVisible: true,
        },
        {
          label: "需求日期",
          prop: "demandDate",

          formType: "date",
          tableVisible: true,
        }, //(A、B、C)
        {
          label: "需求数量",
          prop: "demandNum",

          tableVisible: true,
        }, //(0 父级)
        { label: "计划单价(万元)", prop: "planPrice", tableVisible: true },
        {
          label: "需求组织",
          prop: "demandOrganization",
          tableVisible: true,
          formType: "selectTree",
          options: [],
          width: 150,
        },
        { label: "备注", prop: "remark", tableVisible: true },
        { label: "行号", prop: "lineNum", tableVisible: true },
      ];
    },
  },
  watch: {},
  async created() {
    await this.getDeptTree();
    await this.getList();
    // data赋值
    this.columns.forEach((b) => {
      if (b.prop == "demandOrganization")
        this.$set(b, "options", this.deptOptions);
    });
    this.deptOptions2 = await convertToTargetFormat(this.deptOptions);
  },
  mounted() {},

  methods: {
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
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
      if (this.rowId) queryParams["id"] = this.rowId;
      queryParams["purchasePlanType"] = 1;

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
    importHandler() {},
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
        this.formData["purchasePlanNo"] = "年度";
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
