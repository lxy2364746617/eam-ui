<template>
  <div class="">
    <el-drawer
      title="导入"
      :visible.sync="upload.open"
      :direction="direction"
      :wrapperClosable="false"
      destroy-on-close
      :before-close='()=>{upload.open=false;upload.updateSupport=0}'
      >
      
      <el-upload
        ref="upload"
        :limit="1"
        style="margin: 0 auto;text-align: center;"
        accept=".xlsx, .xls"
        :headers="uploadConfig.headers"
        :action="uploadConfig.importUrl + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :before-upload='beforeUpload'
        :auto-upload="autoUpload"
        :on-exceed='handleFileExceed'
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip"  v-if="isUpdate">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="()=>{upload.open=false;upload.updateSupport=0}">取 消</el-button>
      </div>
    </el-drawer>
    
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "FileImport",
  props: {
    importUrl: {
      default: '',
      type: String
    },
    downloadTemplateUrl: {
      default: '',
      type: String
    },
    isUpdate:{
      default: true,
      type: Boolean
    },
    autoUpload:{
      default:true,
      type:Boolean
    }
  },
  computed:{
    uploadConfig() {
      return {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        importUrl: process.env.VUE_APP_BASE_API + this.importUrl,
      }
    },
  },
    data() {
    return {
      // 用户导入参数
      upload: {
        open: false,
        // 弹出层标题（用户导入）
        title: "导入",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
      },
      direction: 'rtl',
    };
  },
  methods: {
    beforeUpload(file){
      let fileType=file.name&&file.name.split('.')[file.name.split('.').length-1] //获取文件后缀名
  console.log(fileType)
                if (!(fileType=='xlsx'||fileType=='xls')) {
                    this.$message({
                        message: '仅允许导入xls、xlsx格式文件',
                        type: 'error',  
                        duration: 2000
                    });
                    return Promise.reject(false);
                } 
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      this.$emit('handleFileSuccess')
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(this.downloadTemplateUrl, {
      }, `template_${new Date().getTime()}.xlsx`)
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
      this.upload.updateSupport=0
    },
    handleFileExceed(){
      this.$message.error('文件数量超出，只允许上传一个文件！');
    }
  }
};
</script>

<style scoped lang="scss">
.dialog-footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: 50px;
  text-align: center;
  border-top: 1px solid #ddd;
}
</style>
