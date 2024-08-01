
<template>
  <div class="search mt10 mb20">
    <div class="search-title">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M10.0887 1.11856L15.3655 3.67645C15.4767 3.73033 15.5705 3.81444 15.6362 3.91916C15.7018 4.02388 15.7366 4.14497 15.7366 4.26856C15.7366 4.39215 15.7018 4.51324 15.6362 4.61796C15.5705 4.72268 15.4767 4.80679 15.3655 4.86066L10.4602 7.23961V9.38487C10.4602 9.40593 10.4602 9.42698 10.4581 9.44698H14.0781C14.4235 9.44694 14.755 9.58267 15.0012 9.82489C15.2473 10.0671 15.3884 10.3964 15.3939 10.7417V13.2912H17.3676C17.7308 13.2912 18.0255 13.5859 18.0255 13.9491V17.7733C18.0255 18.1365 17.7308 18.4312 17.3676 18.4312H12.1044C11.93 18.4312 11.7626 18.3619 11.6392 18.2385C11.5159 18.1151 11.4465 17.9478 11.4465 17.7733V13.9491C11.4465 13.5859 11.7413 13.2912 12.1044 13.2912H14.0781V10.7628H5.52549V13.2912H7.49918C7.86234 13.2912 8.15707 13.5859 8.15707 13.9491V17.7733C8.15707 18.1365 7.86234 18.4312 7.49918 18.4312H2.23602C2.06154 18.4312 1.8942 18.3619 1.77082 18.2385C1.64744 18.1151 1.57813 17.9478 1.57812 17.7733V13.9491C1.57812 13.5859 1.87286 13.2912 2.23602 13.2912H4.2097V10.7628C4.20966 10.4174 4.34539 10.0859 4.58762 9.83973C4.82984 9.59357 5.15913 9.45251 5.50444 9.44698H9.14444V7.23856L4.23918 4.85961C4.12823 4.80563 4.0347 4.72153 3.96927 4.61692C3.90383 4.51232 3.86914 4.39142 3.86914 4.26803C3.86914 4.14465 3.90383 4.02375 3.96927 3.91914C4.0347 3.81454 4.12823 3.73044 4.23918 3.67645L9.51497 1.11856C9.60438 1.07524 9.70245 1.05273 9.80181 1.05273C9.90117 1.05273 9.99923 1.07524 10.0887 1.11856Z"
          fill="#007BFE"
        />
      </svg>
      <span>请选择分析条件</span>
    </div>
    <div class="search-content">
      <TitleForm
        :columns="columns"
        :formData="formData"
        @submitForm="submitForm"
        ref="titleform"
        style="width: 100%"
        :labelWidth="'100px'"
        :disabled="disabledForm"
        :showButton="false"
      >
        <template #footerRight>
          <el-col :span="4" class="form-footer">
            <el-button @click="save" type="primary">开始分析</el-button>
            <el-button
              @click="reset"
              type="primary"
              icon="el-icon-refresh-right"
              >重置</el-button
            >
          </el-col>
        </template>
      </TitleForm>
    </div>
  </div>
</template>
<script>
import Wrapper from "@/components/wrapper";
import { getPrtOrgTreeByDeptId } from "@/api/equipment/BASE";
import { getLocationTree } from "@/api/Location";
import { equipmentTreeNoTemplate } from "@/api/equipment/category";
export default {
  components: { Wrapper },
  data() {
    return {
      formData: {},
      disabledForm: false,
      deptOptions1: undefined,
      locationOptions: [],
      categoryOptions: undefined,
    };
  },
  created() {
    this.getTreeSelect();
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "选择日期",
          prop: "deviceName",
          tableVisible: true,
          formType: "dateRange",
          span: 5,
        },
        {
          label: "所属组织",
          prop: "affDeptId",
          formType: "selectTree",
          options: this.deptOptions1,
          span: 5,
        },
        {
          label: "功能位置",
          prop: "location",
          options: this.locationOptions,
          formType: "selectTree",
          span: 5,
        },
        {
          label: "设备类别",
          prop: "categoryId",
          formType: "selectTree",
          options: this.categoryOptions,
          span: 5,
        }, //(1 设备、2 部件)
      ];
    },
  },
  methods: {
    save() {
      this.$refs.titleform.submitForm();
    },
    reset() {
      this.$refs.titleform.resetFields();
    },
    submitForm() {},
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      equipmentTreeNoTemplate().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
      });
      getPrtOrgTreeByDeptId().then((response) => {
        this.deptOptions1 = response.data;
      });
      getLocationTree().then((res) => {
        this.locationOptions = this.getTreeName(res.data);
      });
    },
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
  },
};
</script>
<style lang='scss' scoped>
.search {
  width: 100%;
  height: 170px;
  border-radius: 6px;
  border: 1px solid #e9eaef;

  background: #f7fbff;
  padding: 14px;
  .search-title {
    display: flex;
    justify-content: start;
    align-items: center;
    svg {
      margin-right: 10px;
    }
  }
  .search-content {
    width: 100%;
    height: calc(100% - 35px);
    display: flex;
    align-items: center;
  }
}
.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
