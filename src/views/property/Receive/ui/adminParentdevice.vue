<template>
  <div class="admin-parentdevice" style="padding: 12px">
    <p class="icon">
      <span style="padding-left: 13px"></span>
      <span>设备审批信息</span>
    </p>
    <ContTable
      :tableData="equipmentList2"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :handleWidth="150"
      class="mb20"
      :columns="columns"
      :isScroll="true"
    >
      <!-- 左侧 -->
      <template slot="headerLeft" v-if="!detailReadonly">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="margin-left: 5px"
          @click="handlerControls(null, 'add')"
          >选取设备</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handlerControls(null, 'batchEdit')"
          >批量设置</el-button
        >
        <!-- <el-button
          type="primary"
          v-if="isShowCard"
          icon="el-icon-download"
          size="mini"
          style="margin-left: 5px"
          v-hasPermi="['property:receive:download']"
          @click="handlerControls(null, 'download')"
          >下载</el-button
        > -->
      </template>
      <!-- 操作 -->
      <template #end_handle="scope" v-if="!detailReadonly">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handlerControls(scope.row, 'edit', scope)"
          v-hasPermi="['property:backspace:edit']"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          v-hasPermi="['property:backspace:remove']"
          @click="handlerControls(scope.row, 'delete', scope)"
          >删除</el-button
        >
      </template>
    </ContTable>
    <!-- 对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      width="40%"
    >
      <TitleForm
        :columns="columnsForm"
        :formData="formDataNow"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'110px'"
        :showButton="false"
      >
        <template #footer>
          <div class="form-footer">
            <el-button @click="save" type="primary">提交</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </template>
      </TitleForm>
    </el-dialog>
    <el-drawer
      title="选择设备"
      :visible.sync="addItem.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        v-if="addItem.choosedrawer"
        :isChoose="false"
        :formData="form"
        @submitRadio="submitRadio2"
        @close="addItem.choosedrawer = false"
      ></parentdevice>
    </el-drawer>
  </div>
</template>
<script>
import ContTable from "@/components/ContTable";
import parentdevice from "@/views/device/book/device";
import { listDept } from "@/api/system/dept";
import { getLocationTree } from "@/api/Location";
import { equipmentTree } from "@/api/equipment/category";
import request from "@/utils/request";

export default {
  components: { ContTable, parentdevice },
  dicts: ["em_device_state"],
  props: {
    detailReadonly: {
      type: Boolean,
      default: false,
    },
    equipList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      addList: [],
      equipmentList: [],
      equipmentList2: [],
      total: 0,
      title: "",
      formDataNow: {},
      drawer: false,
      ids: [],
      // 选择设备
      addItem: {
        choosedrawer: false,
        copyInputName: "",
        copyInputId: "",
        addDrawer: false,
        addRadio: 1,
      },
      disabledForm: false,
      selectIndex: null,
      // 过滤设备
      form: {
        disIds: [],
      },
      categoryOptions: [],
      locationOptions: [],
    };
  },
  created() {
    this.getTreeSelect();
    if (this.equipList) {
      this.equipmentList = this.equipList;
    }
  },
  watch: {
    equipmentList: {
      handler(val) {
        this.equipmentList2 = JSON.parse(JSON.stringify(val));
        this.$emit("equipmentList", this.equipmentList2);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "创建日期",
          prop: "createTime",
          tableVisible: true,
          width: 200,
          formType: "date",
        },
        {
          label: "设备名称",
          prop: "deviceName",
          tableVisible: true,
          width: 200,
        },
        { label: "规格型号", prop: "sModel", tableVisible: true, width: 200 },
        {
          label: "设备编码",
          prop: "deviceCode",
          tableVisible: true,
          width: 200,
        },
        {
          label: "设备类别",
          prop: "deviceType",
          formType: "selectTree",
          options: this.categoryOptions,
          width: 200,
        },
        { label: "功能位置", prop: "location", tableVisible: true },
        {
          label: "设备批次号",
          prop: "batchNo",
          tableVisible: true,
          width: 200,
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
          formType: "selectTree",
          options: this.locationOptions,
          width: 150,
        }, //(0 父级)
        {
          label: "目标设备状态",
          prop: "targetDeviceStatus",
          formType: "selectTag",
          options: this.dict.type.em_device_state,
        },
      ];
    },
    columnsForm() {
      return [
        {
          label: "目标功能位置（工作面）",
          prop: "targetLocation",
          span: 23,
          tableVisible: true,
          formType: "selectTree",
          options: this.locationOptions,
          required: true,
        },
        {
          label: "目标设备状态",
          prop: "targetDeviceStatus",
          span: 23,
          tableVisible: true,
          formType: "selectTag",
          options: this.dict.type.em_device_state,
          required: true,
        },
      ];
    },
  },
  methods: {
    getTree(arr) {
      arr.forEach((item) => {
        item.id = item.deptName;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTree(item.children);
        }
      });
      return arr;
    },
    // ! 部门树数据
    getTreeSelect() {
      getLocationTree().then((res) => {
        this.locationOptions = this.getTree(res.data);
      });
      equipmentTree().then(async (response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree

        await this.loops(this.categoryOptions);
      });
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
    save() {
      this.$refs.titleform.submitForm();
    },
    close() {
      this.drawer = false;
    },
    submitForm(formVal) {
      if (this.title === "批量设置") {
        let newArr = [];
        this.equipmentList.forEach((item) => {
          if (this.ids.includes(item.id)) {
            if (
              typeof item.id === "number" &&
              this.updateList.indexOf(item.id) === -1
            ) {
              this.updateList.push({ ...item, ...formVal });
            }
            newArr.push({ ...item, ...formVal });
          } else {
            newArr.push({ ...item });
          }
        });
        this.equipmentList = newArr;
      } else {
        this.equipmentList.splice(this.selectIndex, 1, formVal);
        if (
          typeof formVal.id === "number" &&
          this.updateList.indexOf(formVal.id) === -1
        ) {
          this.updateList.push(formVal);
        }
      }
      this.close();
    },
    submitRadio2(row) {
      this.equipmentList = this.equipmentList.concat(
        row.map((item) => ({
          ...item,
          sModel: item.specs,
          deviceType: item.categoryId,
          id: item.deviceId,
        }))
      );
      this.addItem.choosedrawer = false;
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    // ! 查询表格数据
    getList(queryParams) {
      let search = JSON.parse(JSON.stringify(queryParams));
      delete search.pageNum;
      delete search.pageSize;
      let matches = this.equipmentList.filter((item) => {
        for (let key in search) {
          if (!String(item[key]).includes(search[key])) {
            if (search[key] == "") continue;
            return false;
          }
        }
        return true;
      });
      this.equipmentList2 = matches;
      this.total = 0;
      // getAttachmentReceiptList(queryParams).then((res) => {
      // this.equipmentList = res.data.parts;
      // this.total = 0;
      // });
    },
    // ! 增删改操作
    handlerControls(row, act, scope) {
      if (act === "add") {
        // ! 新增
        this.title = "新增";
        this.formDataNow = {};
        this.$set(this.addItem, "choosedrawer", true);
        let lineIds = this.equipmentList2.map((item) => item.deviceId) || [];
        this.$set(this.form, "disIds", lineIds);
        return;
      } else if (act === "edit") {
        // ! 编辑
        this.title = "编辑";
        this.drawer = true;
        this.formDataNow = JSON.parse(JSON.stringify(row));
        this.selectIndex = scope.index - 1;
        return;
      } else if (act === "batchEdit") {
        // ! 批量设置
        this.title = "批量设置";
        if (this.ids.length) {
          this.formDataNow = {};
          this.drawer = true;
        } else {
          this.$message.warning("请选择一行数据进行修改!");
          return;
        }
      } else if (act === "delete") {
        // ! 删除

        this.selectIndex = scope.index - 1;
        this.$modal
          .confirm('是否确认删除设备编码为"' + row.deviceCode + '"的数据项？')
          .then(() => {
            // return delList(ids);

            if (row.id) {
              this.equipmentList.splice(this.selectIndex, 1);
              this.delList.push(row.id);
            } else this.equipmentList.splice(this.selectIndex, 1);
          })
          .then(() => {
            this.getList(this.queryParams);
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
        return;
      } else if (act === "download") {
        downDetailLoad({ ids: this.ids }).then((res) => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          saveAs(blob, `sparePart_${new Date().getTime()}`);
        });
      } else {
        // ! 其他
        return;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.form-footer {
  flex-shrink: 0;
  background-color: #fff;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  z-index: 2;
}
</style>
