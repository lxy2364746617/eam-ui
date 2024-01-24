<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="24">
        <p class="subtitle">
          <i class="el-icon-magic-stick"></i> 备件图片
          <span v-if="disabled1" class="rightbutton">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="disabled1 = false"
              >编辑</el-button
            >
          </span>
          <span v-else class="rightbutton">
            <el-button type="text" @click="save('1')">确认</el-button>
            <el-button type="text" @click="closeEdit('1')">取消</el-button>
          </span>
        </p>
        <div>
          <image-upload
            :fileType="['jpg', 'png']"
            @uploadChange="uploadChange1"
            :disabled="disabled1"
            :value="formData.imgFileResourceList"
            :extraData="{ category: 1 }"
            :listType="'picture-card'"
          >
          </image-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import { getImg } from "@/api/sparePart/sparePartList";

export default {
  dicts: [],
  components: {},
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
  },
  watch: {
    formData: {
      handler(val) {},
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  data() {
    return {
      disabled1: true,
      disabled2: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      equipmentList: null,
      drawer: false,
      // 弹出层标题
      title: "",
      // 部门树选项
      categoryOptions: [],
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
    };
  },
  created() {
    // this.getTreeSelect();
    getImg(this.formData.partCode).then((res) => {
      this.$set(this.formData, "imgFileResourceList", res.data);
    });
  },
  methods: {
    uploadChange1(val) {
      this.formData.imgFileResourceList = val;
      this.$emit("newFormData", this.formData);
    },
    async save(formref) {
      // var flag = await this.$refs['jmform'+formref].submitForm()
      // if(flag){
      this.$emit("submitForm", (val) => {
        if (val) {
          this["disabled" + formref] = true;
        }
      });
      // }
    },
    closeEdit(formref) {
      this.$emit("close", (val) => {
        this["disabled" + formref] = true;
      });
    },
    close() {
      this.drawer = false;
    },
    submitRadio(row) {
      this.$set(this.formData, "parentId", row.deviceId);
      this.$set(this.formData, "parentDeviceName", row.deviceName);
      this.close();
    },
    getList(queryParams) {
      this.loading = true;
      listResource(queryParams).then((response) => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getTreeSelect() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
      });
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.subtitle {
  margin-top: 0;
  background: #ebf4fc;
  line-height: 40px;
  & > .rightbutton {
    margin-right: 20px;
    float: right;
  }
}
</style>
