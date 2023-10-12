<template>
  <div class="box">
    <slot></slot>

    <JmTableNoPaging
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      :isRadio="isChoose"
      :handleWidth="230"
      :columns="columns"
      :isShow="isShow"
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
            v-hasPermi="['equipment:book:add']"
            >选取设备</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="!isShow">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :loading="btnLoading"
            @click="handleUpdate"
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
          @click="handleUpdate(scope.row, scope.index, 'edit', 1)"
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
        <el-button @click="handleSelectionCancel">取 消</el-button>
        <el-button type="primary" @click="handleSelectionSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 批量配置 -->

    <el-dialog :title="title" :visible.sync="editor" width="40%">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="140px"
        class="from"
      >
        <el-form-item label="目标功能位置" prop="targetLocation">
          <el-input
            v-model="formData.targetLocation"
            placeholder="请输入设备名称"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="模板设备状态" prop="targetDeviceStatus">
          <el-cascader
            clearable
            v-model="formData.targetDeviceStatus"
            :options="dict.type.em_device_state"
            :props="{ expandTrigger: 'click' }"
          ></el-cascader>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="submitFormAdd">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getProjectList } from "@/api/property/turnover";
import Treeselect from "@riophae/vue-treeselect";
import JmTableNoPaging from "@/components/JmTableNoPaging";
import JmTable from "@/components/JmTable";
import {
  setStore,
  getStore,
  delList,
  upName2,
  convertToTargetFormat,
  removeStore,
} from "@/utils/property.js";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { listBASE, countBASE } from "@/api/equipment/BASE";
import { formatDate } from "../../../../utils";
export default {
  components: {
    JmTableNoPaging,
    Treeselect,
    JmTable,
  },
  dicts: ["em_device_state", "em_device_att", "apv_status", "em_device_level"],
  props: ["rowId", "isShow"],
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
      categoryOptions: null,
      valueMap: {},
      // 选择设备弹框
      showEquipSelectDialog: false,
      // 设备档案列表
      equipData: [],
      // 批量配置弹框
      showBatchConfigDialog: false,
      rowArr: [],
      // 编辑弹框
      editor: false,
      rules: {
        targetLocation: [
          {
            required: true,
            message: "请输入目标功能位置",
            trigger: "blur",
          },
        ],
        targetDeviceStatus: [
          {
            required: true,
            message: "请选择目标设备状态",
            trigger: "change",
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
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        {
          label: "设备类别",
          prop: "categoryId",
          // formType: "selectTree",
          // options: this.categoryOptions,
          // tableVisible: true,
          // width: 200,
        },
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
          tableVisible: true,
        },
        {
          label: "目标功能位置",
          prop: "targetLocation",
          tableVisible: true,
        }, //(0 父级)
        {
          label: "目标设备状态",
          prop: "targetDeviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
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
          width: 200,
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
    await this.getTreeSelect();
    await this.getTree();
    await this.getList();
  },
  mounted() {},

  methods: {
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
    getTree() {
      equipmentTree().then(async (response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        await this.loops(this.categoryOptions);
      });
    },
    /** 查询部门下拉树结构 */
    async getTreeSelect() {
      await listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 根据设备ID查找
    upDeviceId(array1, array2) {
      let indicesToRemove = [];

      for (let i = 0; i < array1.length; i++) {
        let nameToCheck = array1[i].deviceId;
        let existsInArray2 = array2.some((obj) => obj.deviceId === nameToCheck);

        if (existsInArray2) {
          indicesToRemove.push(i);
        }
      }

      for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        array1.splice(indicesToRemove[i], 1);
      }

      array1 = array1.concat(array2);
      return array1;
    },
    /** 查询计划明细列表 */
    async getList(queryParams = { pageNum: 1, pageSize: 10 }) {
      if (this.rowId) queryParams["transferNo"] = this.rowId;
      if (!this.rowId) queryParams["transferNo"] = 1;

      await getProjectList(queryParams).then((response) => {
        if (getStore("equipmentList")) setStore("equipmentList", response.data);
        if (getStore("addList") && getStore("addList").length > 0) {
          setStore("equipmentList", response.data.concat(getStore("addList")));
        } else {
          setStore("equipmentList", response.data);
          this.loading = false;
        }

        if (getStore("updateList") && getStore("updateList").length > 0) {
          setStore(
            "equipmentList",
            upName2(getStore("equipmentList"), getStore("updateList"))
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
      if (this.title === "批量设置") {
        this.ids = selection.map((item) => item.id);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
        this.radioRow = selection[0];
        this.rowArr = selection;
      }
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.id);
      this.single2 = selection.length != 1;
      this.multiple2 = !selection.length;
      this.radioRow2 = selection[0];
      this.rowArr = selection;
    },
    deduplicateByDeviceId(inputArray) {
      const deviceIdSet = new Set();
      return inputArray.reduce((result, item) => {
        if (!deviceIdSet.has(item.deviceId)) {
          deviceIdSet.add(item.deviceId);
          result.push(item);
        }
        return result;
      }, []);
    },
    async handleSelectionSubmit() {
      this.rowArr.forEach((item) => {
        item["deviceType"] = item.categoryId;
        item["sModel"] = item.specs;
      });

      if (getStore("equipmentList") && getStore("equipmentList").length > 0) {
        getStore("equipmentList").forEach((t) => {
          this.rowArr = this.rowArr.filter((item) => {
            return (
              item.sModel + item.deviceCode + item.deviceName + item.batchNo !==
              t.sModel + t.deviceCode + t.deviceName + t.batchNo
            );
          });
        });
      }
      if (getStore("addList") && getStore("addList").length > 0) {
        setStore(
          "addList",
          this.deduplicateByDeviceId(getStore("addList").concat(this.rowArr))
        );
      } else {
        setStore("addList", this.rowArr);
      }
      this.$message({
        type: "success",
        message: "选取设备成功",
      });
      this.showEquipSelectDialog = false;
      await this.getList();
    },
    handleSelectionCancel() {
      this.rowArr = [];
      this.showEquipSelectDialog = false;
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
            this.equipmentList.filter((item) => item.deviceId != row.deviceId)
          );
          setStore(
            "addList",
            getStore("addList").filter((item) => item.deviceId != row.deviceId)
          );
          setStore(
            "updateList",
            getStore("updateList").filter(
              (item) => item.deviceId != row.deviceId
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
    handleUpdate(row, index, exit, isRow) {
      if (!isRow) {
        this.title = "批量设置";
        if (this.ids.length) {
          this.formData = {};
          this.editor = true;
          this.itemValue = this.rowArr;
        } else {
          this.$message.error("请选择一行数据进行修改!");
          return;
        }
      } else {
        this.title = "单个设置";
        this.editor = true;
        this.formData = row;
        this.itemValue = [row];
      }
    },
    submitFormAdd() {
      this.$refs["elForm"].validate(async (valid) => {
        if (!valid) return;
        this.itemValue.forEach((i) => {
          i["targetDeviceStatus"] = this.formData["targetDeviceStatus"][0];
          i["targetLocation"] = this.formData["targetLocation"];
          if (i.id) {
            if (getStore("updateList") && getStore("updateList").length > 0) {
              setStore(
                "updateList",
                getStore("updateList").filter((item) => item.id != i.id)
              );
              setStore("updateList", getStore("updateList").concat(i));
              console.log("========================", i);
            } else {
              setStore("updateList", [i]);
            }
          } else {
            if (getStore("addList") && getStore("addList").length > 0) {
              setStore(
                "addList",
                getStore("addList").filter(
                  (item) => item.deviceId != i.deviceId
                )
              );
              setStore("addList", getStore("addList").concat(i));
            } else {
              setStore("addList", [i]);
            }
          }
        });

        this.$message({
          type: "success",
          message: "修改成功",
        });

        this.getList();
        this.resetForm();
        this.editor = false;
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
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
