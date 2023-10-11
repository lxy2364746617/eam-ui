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

    <!-- 选择设备 -->
    <el-dialog
      title="设备档案"
      :visible.sync="showEquipSelectDialog"
      width="80%"
    >
      <jm-table
        :columns="equipSelectColumns"
        :tableData="equipData"
        @getList="getList2"
        @handleSelectionChange="handleSelectionChange2"
        :total="total2"
        ref="jmtable"
        :isRadio="isChoose2"
        :handleWidth="230"
      ></jm-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEquipSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="showEquipSelectDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 批量配置 -->
    <el-dialog
      title="批量配置"
      :visible.sync="showBatchConfigDialog"
      width="30%"
    >
      <el-form class="form" label-width="110px">
        <el-form-item label="目标功能位置" required>
          <el-select :style="{ width: '100%' }"></el-select>
        </el-form-item>
        <el-form-item label="目标设备状态" required>
          <el-select :style="{ width: '100%' }"></el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBatchConfigDialog = false">取 消</el-button>
        <el-button type="primary" @click="showBatchConfigDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProjectList } from "@/api/property/backspace";
import Treeselect from "@riophae/vue-treeselect";
import JmTableNoPaging from "@/components/JmTableNoPaging";
import JmTable from "@/components/JmTable";
import {
  setStore,
  getStore,
  delList,
  upName,
  convertToTargetFormat,
  removeStore,
} from "@/utils/property.js";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { listBASE, countBASE } from "@/api/equipment/BASE";
export default {
  components: {
    JmTableNoPaging,
    Treeselect,
    JmTable,
  },
  dicts: ["em_device_state", "em_device_att", "apv_status", "em_device_level"],
  props: ["rowId"],
  data() {
    return {
      countData: null,
      // 需求组织
      deptOptions: null,
      deptOptions2: null,
      // 新增or编辑框 title
      title: "",
      drawer: false,
      btnLoading: false,
      isChoose: false,
      isChoose2: false,
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
      total2: 0,
      // 选中数组
      ids: [],
      ids2: [],
      // 非单个禁用
      single: true,
      single2: true,
      // 非多个禁用
      multiple: true,
      multiple2: true,
      // 显示搜索条件
      showSearch: true,
      showSearch2: true,
      // 总条数
      total: 0,
      total2: 0,
      // 表格数据
      equipmentList: null,
      formData: {},
      deptOptions: null,
      categoryOptions: null,
      // 选择设备弹框
      showEquipSelectDialog: false,
      // 设备档案列表
      equipData: [],
      // 批量配置弹框
      showBatchConfigDialog: false,
    };
  },
  computed: {
    columns() {
      return [
        { label: "创建时间", prop: "createDate", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "specs", tableVisible: true },
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        {
          label: "设备类别",
          formType: "selectTree",
          options: this.categoryOptions,
        }, //(1 设备、2 部件)
        { label: "功能位置", prop: "location", tableVisible: true },
        {
          label: "设备批次号",
          prop: "batchNo",
          tableVisible: true,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",

          formType: "selectTag",
          options: this.dict.type.em_device_state,
        }, //(A、B、C)
        {
          label: "目标功能位置",
          prop: "targetLocation",

          tableVisible: true,
        }, //(0 父级)
        {
          label: "目标设备状态",
          prop: "targetDeviceStatus",
          tableVisible: true,
        },
      ];
    },
    equipSelectColumns() {
      return [
        { label: "设备编码", prop: "deviceCode" },
        { label: "设备名称", prop: "deviceName" },
        { label: "规格型号", prop: "specs" },
        {
          label: "设备类别",
          prop: "categoryId",
          formType: "selectTree",
          options: this.categoryOptions,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
        },
        { label: "财务资产编码", prop: "propertyCode" },
        { label: "功能位置", prop: "location" },
        {
          label: "重要等级",
          prop: "level",
          formType: "select",
          options: this.dict.type.em_device_level,
        }, //(A、B、C)
        // { label:"所属子公司", prop:"",  },
        {
          label: "所属组织",
          prop: "affDeptId",
          formType: "selectTree",
          options: this.deptOptions,
        },
        {
          label: "当前使用组织",
          prop: "currDeptId",
          formType: "selectTree",
          options: this.deptOptions,
        },
        { label: "入账日期", prop: "makerAoTime", formType: "date" },
        {
          label: "设备属性",
          prop: "deviceAtt",
          formType: "select",
          options: this.dict.type.em_device_att,
        }, //(1 设备、2 部件)
        { label: "上级设备", prop: "parentDeviceName" }, //(0 父级)
        {
          label: "审批状态",
          prop: "apvStatus",
          formType: "selectTag",
          options: this.dict.type.apv_status,
        }, //apv_status
      ];
    },
  },
  watch: {},
  async created() {
    await this.getDeptTree();
    await this.getTree();
    await this.getList();
    // data赋值
    this.columns.forEach((b) => {});
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
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    /** 查询设备档案下拉树结构 */
    async getTree() {
      await equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
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
    /** 查询统计 */
    getCount(queryParams) {
      countBASE(queryParams).then((response) => {
        this.countData = response.data;
      });
    },
    /** 查询用户列表 */
    async getList2(queryParams = { pageNum: 1, pageSize: 10 }) {
      this.loading = true;
      var data = {
        categoryId: this.queryParams.categoryId,
        ...queryParams,
      };
      this.getCount(data);
      await listBASE(data).then((response) => {
        response.rows.forEach((b) => {
          Object.assign(
            b,
            b.archivesOther ? b.archivesOther : {},
            b.emArchivesExtendAtt
              ? JSON.parse(b.emArchivesExtendAtt.fieldValue)
              : {},
            b.emArchivesIndex ? JSON.parse(b.emArchivesIndex.fieldValue) : {},
            b.emArchivesSpecial
              ? JSON.parse(b.emArchivesSpecial.fieldValue)
              : {}
          );
        });
        this.equipData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.id);
      this.single2 = selection.length != 1;
      this.multiple2 = !selection.length;
      this.radioRow2 = selection[0];
    },
    async handleAdd() {
      this.showEquipSelectDialog = !this.showEquipSelectDialog;
      this.title = "新增";
      await this.getList2();
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
                item.deviceName + item.specs != row.deviceName + item.specs
            )
          );
          setStore(
            "addList",
            getStore("addList").filter(
              (item) =>
                item.deviceName + item.specs != row.deviceName + item.specs
            )
          );
          setStore(
            "updateList",
            getStore("updateList").filter(
              (item) =>
                item.deviceName + item.specs != row.deviceName + item.specs
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
                  item.deviceName + item.specs !=
                  this.itemValue.deviceName + this.itemValue.specs
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
