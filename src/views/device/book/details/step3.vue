<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="16">
        <p class="subtitle"><i class="el-icon-magic-stick"></i> 设备位置：
          <span> {{formData.locationFullName}} </span>
        </p>
        <div style="height:200px;width:300px;position:relative" :class="{main_image:mainImage}">
          <img :src="mainImage||require('@/assets/images/noImg.png')"  style="width:100%;height:100%">
          <div class="img_btn" style="line-height:200px">
            <span @click="handlePictureCardPreview({url:mainImage})">
            <i class="el-icon-zoom-in"></i>
          </span> 
          </div>
        </div> 
      </el-col>
      <el-col :span="8">
        <p class="subtitle"><i class="el-icon-magic-stick"></i> 设备图片
          <span v-if="disabled1" class="rightbutton">
            <el-button v-if="!isReadonly" type="text" icon="el-icon-edit" @click="disabled1=false" v-hasPermi="['equipment:base:modify']">编辑</el-button>
          </span>
          <span v-else class="rightbutton">
            <el-button v-if="!isReadonly" type="text" @click="save('1')">确认</el-button>
            <el-button v-if="!isReadonly" type="text" @click="closeEdit('1')">取消</el-button>
          </span>
        </p>
        <div>
          <draggable v-model="formData.imgFileResourceList" :sort='!disabled1'>
            <transition-group>
               <div class="el-upload-list__item" v-for="item in formData.imgFileResourceList" :key="item.fileName">
                  <img :src="baseUrl+item.fileName" style="width:100%">
                  <div class="img_btn" >
                      <span
                      @click="handlePictureCardPreview(item)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span> 
                    <span
                      v-show="!disabled1"
                      @click="handleRemove(item)"
                    >
                      <i class="el-icon-delete"></i>
                    </span> 
                  </div>
              </div> 
            </transition-group>
            <div slot="footer">
              <image-upload 
              ref="imgUpload"
            :class="{'hide':disabled1}"
            :fileType="['jpg','png']"
            @uploadChange="uploadChange1"
            :disabled="disabled1"
            :value="formData.imgFileResourceList"
            :extraData="{'category':1}"
            :listType="'picture-card'"
            :showFileList='false'
            :isReadonly='isReadonly'>
          </image-upload>
            </div>
             
          </draggable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listBASE, addBASE, updateBASE } from "@/api/equipment/BASE";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import JmUserTree from "@/components/JmUserTree";
import draggable from 'vuedraggable';
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "bookadd",
  dicts: [
  ],
  components: { 
    Treeselect, JmUserTree, JmTable, JmForm, draggable
  },
  props:{
    isReadonly:{
      type:Boolean,
      default:false,
    },
    formData: {
      default: ()=>{},
      type: Object,
    },
  },
  watch: {
    formData: {
      handler(val) {
      },
      immediate: true,
      deep: true,
    },
  },
  computed:{
     mainImage(){
      return this.formData.locationImage?process.env.VUE_APP_BASE_API + this.formData.locationImage:false
    },  
  },
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
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      baseUrl:process.env.VUE_APP_BASE_API,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getTreeSelect()
  },
  methods: {
    uploadChange1(val){
      this.formData.imgFileResourceList = val
      console.log(this.formData.imgFileResourceList)
      this.formData.imgFileResourceList.forEach(item=>{
        item.url=`${process.env.VUE_APP_BASE_API}${item.fileName}`
      }) 
    },
    async save(formref){
      // var flag = await this.$refs['jmform'+formref].submitForm()
      // if(flag){
        this.$emit('submitForm',(val)=>{
          if(val){
            this['disabled'+formref] = true;
          }
        })
      // }
    },
    closeEdit(formref){
      this.$emit('close',(val)=>{
        this['disabled'+formref] = true;
      })
    },
    close(){
      this.drawer = false
    },
    submitRadio(row){
      this.$set(this.formData,'parentId',row.deviceId)
      this.$set(this.formData,'parentDeviceName',row.deviceName)
      this.close()
    },
    getTreeSelect(){
      equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
      listDept().then(response => {
        this.deptOptions = response.data;
      });
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      listBASE(queryParams).then(response => {
          this.equipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    handlePictureCardPreview(item){
      this.$refs.imgUpload.handlePictureCardPreview(item)
    },
    handleRemove(item){
      this.$refs.imgUpload.handleDelete(item)
    }

  }
};
</script>
<style scoped lang="scss">
  .subtitle{
    background: #ebf4fc;
    line-height: 40px;
    & > .rightbutton{
      margin-right: 20px;
      float: right;
    }
  }
  .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    position: relative;
    &:hover{
      .img_btn{
        text-align: center;
        line-height: 148px;
        font-size: 22px;
        display: flex;
        color: white;
        justify-content: space-evenly;
        span{
          cursor: pointer;
        }
      }
    }
} 
.main_image{
  &:hover{
     .img_btn{
        text-align: center;
        line-height: 148px;
        font-size: 22px;
        display: flex;
        color: white;
        justify-content: space-evenly;
        span{
          cursor: pointer;
        }
      }
  }
}
.img_btn{
  width:100%;
  height: 100%;
   background-color: rgba(0,0,0,.5);
   position: absolute;
   top: 0;
   display: none;
} 

</style>
