<template>
  <div class="app-container" style="padding-top: 0">
    <el-row :gutter="24">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <ContTable
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="isChoose"
          :handleWidth="230"
          :columns="columns"
          :showOperate="false"
          :rightToolbarShow="false"
          :showSearch="false"
        >
        </ContTable>
      </el-col>
    </el-row>
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
      <el-button size="mini" @click="close">取消</el-button>
      <el-button
        size="mini"
        @click="submitRadio"
        type="primary"
        :disabled="multiple"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import ContTable from "@/components/ContTable";
import { getExecutorList } from "@/api/work/schedule";
import TitleForm from "@/components/TitleForm";
export default {
  dicts: [],
  components: { ContTable },
  props: {
    isChoose: {
      default: true,
      type: Boolean,
    },
    choosedrawer: {
      default: true,
      type: Boolean,
    },
    formData: {
      default: () => {},
      type: Object,
    },
  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: "姓名", prop: "nickName", tableVisible: true },
        { label: "用户名", prop: "userName", tableVisible: true },
        { label: "岗位", prop: "postName", tableVisible: true },

        {
          label: "技能等级",
          prop: "level",
          tableVisible: true,
          formType: "rate",
          width: 200,
        }, //(A、B、C)
        {
          label: "本月待办任务数",
          prop: "pendingCount",

          tableVisible: true,
          width: 180,
        },

        {
          label: "本月已处理任务数",
          prop: "finishCount",
          tableVisible: true,
          width: 180,
        },
        {
          label: "班组",
          prop: "groupName",
          tableVisible: true,
        },
      ];
      // return [
      //   { label: "用户编号", prop: "userId", tableVisible: true },
      //   { label: "用户名称", prop: "userName", tableVisible: true, width: 150 },

      //   { label: "用户昵称", prop: "nickName", tableVisible: true, width: 150 },
      //   { label: "岗位", prop: "postName", tableVisible: true },
      //   { label: "班组", prop: "userGroup", tableVisible: true, width: 160 },
      //   {
      //     label: "技能等级",
      //     prop: "level",
      //     formType: "rate",
      //     width: 200,
      //   },
      //   { label: "部门", prop: "deptName", tableVisible: true },
      //   { label: "菜单角色", prop: "deptrole", tableVisible: true },

      //   {
      //     label: "手机号码",
      //     prop: "phonenumber",
      //     tableVisible: true,
      //     width: 150,
      //   },
      //   {
      //     label: "状态",
      //     prop: "status",
      //     formType: "select",
      //     options: [
      //       { id: 1, label: "启用" },
      //       { id: 0, label: "禁用" },
      //     ],
      //     tableVisible: true,
      //   },
      //   {
      //     label: "创建时间",
      //     prop: "createTime",
      //     tableVisible: true,
      //     width: 160,
      //   },
      // ];
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      checkBoxRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      radioRow: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  watch: {
    choosedrawer: {
      handler(val) {
        if (val) {
          this.getList();
        }
      },
    },
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submitRadio() {
      if (this.isChoose) {
        // 单选
        this.$emit("submitRadio", this.radioRow);
      } else {
        // 多选
        this.$emit("submitRadio", this.checkBoxRows);
      }
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      getExecutorList({ groupId: this.formData.groupId }).then((response) => {
        // 不展示自身

        response.data = response.data.filter((item) => {
          return item.userId !== this.formData.executor;
        });
        if (this.formData.maintainExecutors) {
          let arr = this.formData.maintainExecutors;
          let row = JSON.parse(JSON.stringify(response.data));
          arr.forEach((t) => {
            row = row.filter((item) => {
              return item.userId !== t.userId;
            });
          });
          this.equipmentList = row;

          // this.total = row.length;
        } else {
          this.equipmentList = response.rows;

          // this.total = response.rows.length;
        }

        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0];
      this.checkBoxRows = selection;
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