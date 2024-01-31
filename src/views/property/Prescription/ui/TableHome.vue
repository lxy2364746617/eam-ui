<template>
  <div class="box">
    <jm-table
      :tableData="equipmentList"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
      :total="total"
      ref="jmtable"
      :isRadio="isChoose"
      :handleWidth="150"
      :columns="columns"
      v-if="!addEdit"
    >
      <template slot="headerLeft" v-if="!isChoose">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="exportWarnLog"
            v-hasPermi="['equipment:book:add']"
            >下载</el-button
          >
        </el-col>
      </template>
    </jm-table>
  </div>
</template>
<script>
import {
  getPurchaseList,
  uploadInfo,
  download,
  delId,
} from "@/api/property/purchase";
import { equipmentTree } from "@/api/equipment/category";
import { listDept } from "@/api/system/dept";
import JmTable from "@/components/JmTable";
export default {
  components: {
    JmTable,
  },
  dicts: ["em_device_state", "em_device_att",  "em_device_level"],
  props: {},
  data() {
    return {
      field101fileList: [],
      btnLoading: false,
      categoryOptions: null,
      deptOptions: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      equipmentList: null,
      isChoose: false,
      // 遮罩层
      loading: true,
      addEdit: false,
      total: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      // 弹出层标题
      title: "",
      formData: {},
      // 表单参数
      form: {},

      radioRow: {},
    };
  },
  computed: {
    columns() {
      return [
        { label: "设备编码", prop: "deviceCode", tableVisible: true },
        { label: "设备名称", prop: "deviceName", tableVisible: true },
        { label: "规格型号", prop: "sModel", tableVisible: true },
        {
          label: "设备类别",
          prop: "categoryId",
          tableVisible: true,
          formType: "selectTree",
          options: this.categoryOptions,
          width: 200,
        },
        {
          label: "设备状态",
          prop: "deviceStatus",
          formType: "select",
          options: this.dict.type.em_device_state,
        },
        {
          label: "财务资产编码",
          prop: "propertyCode",
        },
        { label: "功能位置", prop: "location" },
        {
          label: "重要等级",
          prop: "level",
          formType: "select",
          options: this.dict.type.em_device_level,
        }, //(A、B、C)
        { label: "申报人", prop: "declarationPerson", tableVisible: true },
        {
          label: "所属组织",
          prop: "declarationDate",
          tableVisible: true,
          width: 150,
        },
        { label: "所属子公司", prop: "declarationUnit", tableVisible: true },

        {
          label: "当前使用组织",
          prop: "createBy",
          tableVisible: true,
          width: 150,
        },
        {
          label: "购置日期",
          prop: "createTime",
          tableVisible: true,
          formType: "data",
        },
      ];
    },
  },
  watch: {},
  async created() {
    // data赋值
    this.columns.forEach((b) => {
      if (b.prop == "apvStatus")
        this.$set(b, "options", [
          {
            value: 1,
            label: "待审批",
          },
          {
            value: 2,
            label: "审批中",
          },
          {
            value: 3,
            label: "审批通过",
          },
          {
            value: 4,
            label: "审批驳回",
          },
        ]);
    });
    await this.getList();
    await this.getTree();
  },
  mounted() {},
  methods: {
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
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        // this.loops(this.categoryOptions);
      });
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
    handelImport() {},
    exportWarnLog(data) {
      download(this.ids).then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        saveAs(blob, `下载数据_${new Date().getTime()}`);
      });
    },
    // 导入
    field101BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      const fileData = new FormData();
      fileData.append("files", file);
      fileData["purchasePlanType"] = 2;
      uploadInfo(fileData);
      return false;
    },
    /** 查询用户列表 */
    async getList(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      // this.loading = true;
      // getPurchaseList(form).then((response) => {
      //   this.equipmentList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
    },
    handleAdd() {
      this.$router.push("/property/purchase/temporarilyAdd");
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delId(row.id).then(async (res) => {
          if (res.code == 200) {
            await this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
      });
    },
    goDetails(row) {
      this.$router.push({
        path: "/property/purchase/temporarilyDetails",
        query: {
          item: { ...row, isEdit: false },
        },
      });
    },
    goEdit(row) {
      this.$router.push({
        path: "/property/purchase/temporarilyEdit",
        query: {
          item: { ...row, isEdit: true },
        },
      });
    },
    setFormLabel(arr) {
      arr.forEach((b) => {
        b.label = b.fieldName;
        b.prop = b.fieldCode;
        b.required = b.required == "0" ? true : false;
      });
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

  .icon {
    span {
      padding-left: 10px;
    }

    padding: 0;
    margin: 0;
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
