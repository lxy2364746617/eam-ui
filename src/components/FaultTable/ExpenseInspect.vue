<template>
  <div class="app-container2">
    <div class="title">
      <i class="el-icon-caret-right"
        ><span class="icon-text"
          >费用核算 合计：{{
            standardList2 instanceof Array &&
            standardList2.reduce(
              (v, t) => v + (t.num * ~~(t.unitPrice * 100)) / 100,
              0
            )
          }}</span
        ></i
      >

      <el-button
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        v-if="!disabled"
        >新增费用</el-button
      >
    </div>

    <div class="container-box1">
      <el-table
        class="table"
        v-loading="loading"
        :data="standardList2"
        @selection-change="handleSelectionChange"
        ref="queryTable"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column
          label="材料及费用名称"
          align="center"
          prop="costItem"
          min-width="150"
        />
        <el-table-column label="单位" align="center" prop="unit">
          <template slot-scope="scope">
            <span>{{
              findName(dict.type.spare_parts_unit, scope.row.unit)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          align="center"
          prop="num"
          min-width="150"
        />
        <el-table-column
          label="单价"
          align="center"
          prop="unitPrice"
          min-width="150"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.unitPrice"
              placeholder="请输入单价"
              v-if="scope.row.editType"
            />
            <span v-else v-html="scope.row.unitPrice"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="金额"
          align="center"
          prop="allPrice"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.num * scope.row.unitPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!disabled"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="150"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope)"
              >{{ scope.row.editType ? "保存" : "编辑" }}</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="30%"
      :wrapperClosable="false"
      :before-close="close"
    >
      <title-form
        :columns="columns2"
        :formData="form"
        @submitForm="submitForm"
        ref="titleform"
        :labelWidth="'140px'"
        :disabled="disabled"
      >
        <template #footer>
          <div class="container-box2">
            <el-button @click="saveHandle" type="primary">提交</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </template>
      </title-form>
    </el-drawer>
  </div>
</template>
<script>
export default {
  components: {},
  dicts: ["spare_parts_unit"],
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      standardList: [],
      standardList2: [],
      loading: false,
      btnLoading: false,
      drawer: false,
      form: {},
    };
  },
  watch: {
    standardList: {
      handler(val) {
        this.$emit(
          "expenseInspect",
          val.map((item) => ({
            ...item,
            allPrice: item.unitPrice * item.num,
          }))
        );
        this.standardList2 = val;
      },
      deep: true,
      immediate: true,
    },
    "formData.checkCosts": {
      handler(val) {
        this.standardList2 = val;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  computed: {
    columns2() {
      return [
        { label: "材料费用及名称", prop: "costItem", required: true, span: 22 },
        {
          label: "单位",
          prop: "unit",
          required: true,
          span: 22,
          formType: "select",
          options: this.dict.type.spare_parts_unit,
        },
        {
          label: "数量",
          prop: "num",
          span: 22,
          required: true,
          formType: "number",
        },
        {
          label: "单价",
          prop: "unitPrice",
          span: 22,
          required: true,
          formType: "number",
        },
      ];
    },
  },
  methods: {
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    HandlerInput(val) {},
    handleSelectionChange() {},
    handleAdd() {
      this.drawer = true;
    },
    /** 修改按钮操作 */
    handleUpdate(scope) {
      this.$set(
        this.standardList[scope.$index],
        "editType",
        this.standardList[scope.$index].editType ? false : true
      );
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          that.standardList.splice(scope.$index, 1);
        })
        .catch(() => {});
    },
    saveHandle() {
      this.$refs.titleform.submitForm();
    },
    submitForm(formVal) {
      let newValue = JSON.parse(JSON.stringify(formVal));
      // newValue.allPrice = newValue.num * newValue.unitPrice;
      this.standardList = this.standardList.concat([newValue]);
      this.close();
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$refs.titleform.resetFields();

      this.drawer = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.app-container2 {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .container-box1 {
    max-height: 550px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  // .table {
  //   max-height: 550px;
  //   overflow-y: scroll;
  //   margin-bottom: 20px;
  // }
  .container-box2 {
    flex-shrink: 0;
    background-color: #fff;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ddd;
    z-index: 2;
  }
}

::v-deep {
  .el-select {
    width: 100%;
  }

  .el-tabs__nav-scroll {
    width: 50% !important;
    margin: 0 auto !important;
  }

  .el-tabs__nav-wrap {
    padding-top: 10px;
  }

  .el-tabs__nav-wrap::after {
    top: 0;
  }
}

.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 36px;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-right: 18px;
  border-left: 5px solid #1f77fc;
  margin-bottom: 20px;
  i {
    margin-right: 10px;
    color: #1f77fc;
    .icon-text {
      color: #555;
      font-weight: 700;
      padding-left: 5px;
    }
  }
}
::v-deep .el-table th.el-table__cell {
  background-color: #f9f9f9;
}
</style>
