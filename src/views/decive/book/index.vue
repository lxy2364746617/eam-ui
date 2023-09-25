<template>
  <div class="app-container">
    <el-row :gutter="20" v-show="!addEdit && !deviceIndexVisible">
      <!--部门数据-->
      <!-- <el-col :span="6" :xs="24">
        <p style="color: transparent;">1</p>
        <jm-user-tree 
          :treeData="categoryOptions" 
          @handleNodeClick="handleNodeClick" 
          style="position: fixed;top: 121px;height: calc(100vh - 141px);">
        </jm-user-tree>
      </el-col> -->
      <div>
        <el-popover
          placement="bottom"
          title=""
          style="position: fixed;z-index: 1009;top: 55px;right: 10px;"
          width="200"
          trigger="hover"
          content="">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-c-scale-to-original" 
            slot="reference"></el-button>
          <jm-user-tree 
            :treeData="categoryOptions" 
            @handleNodeClick="handleNodeClick" 
            style="position: fixed;top: 121px;height: calc(100vh - 141px);">
          </jm-user-tree>
        </el-popover>
      </div>
      <!--用户数据-->
      <el-col :span="24" :xs="24" v-show="!addDetails">
        <el-row v-if="!isChoose" :gutter="10" style="margin-bottom: 20px;text-align: center;">
          <el-col :span="6" :xs="24" v-for="item in countColumn" :key="item.prop">
            <div style="background-color: #f7fbff;padding-top:15px;">
              <div style="font-size: 30px;">
                <p style="width: 50px;height: 50px;margin: 0 auto;display: inline-block;color: #fff;background-color: #007bfe;border-radius: 50%;">
                  <i :class="item.icon" style="margin-top: 9px;"></i>
                </p>
              </div>
              <div v-if="item.label">
                <el-row>
                  <el-col :span="24">
                    <p style="color: #666;font-size: 12px;margin: 5px auto;">{{ item.label }}</p>
                    <p style="font-size: 20px;font-weight: bold;margin: 7px auto;padding-bottom: 10px;">{{countData[item.prop]}}</p>
                  </el-col>
                </el-row>
              </div>
              <div v-if="item.children">
                <el-row>
                  <el-col :span="8" v-for="item2 in item.children" :key="item.idd">
                    <p :style="{'color': item2.color}" style="font-size: 12px;margin: 5px auto;">{{ item2.label }}</p>
                    <p style="font-size: 20px;font-weight: bold;margin: 7px auto;padding-bottom: 10px;">{{countData[item2.prop]}}</p>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <jm-table
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="isChoose"
          :handleWidth="230"
          :columns="columns">
          <template slot="headerLeft" v-if="!isChoose">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :loading="btnLoading"
                @click="handleAdd"
                v-hasPermi="['equipment:book:add']"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['equipment:book:add']"
              >导入</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-document"
                size="mini"
                @click="handleDevice"
                v-hasPermi="['equipment:book:add']"
              >设备指标</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['equipment:book:add']"
              >下载</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['equipment:book:remove']"
              >删除</el-button>
            </el-col> -->
          </template>
          <template #end_handle="scope" v-if="!isChoose">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              :loading="btnLoading"
              @click="handleUpdate(scope.row,'view')"
              v-hasPermi="['equipment:book:edit']"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              :loading="btnLoading"
              @click="handleUpdate(scope.row,'edit')"
              v-hasPermi="['equipment:book:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['equipment:book:remove']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-add"
              @click="handleSet(scope.row)"
              v-hasPermi="['equipment:book:edit']"
            >提交</el-button>
          </template>
        </jm-table>
      </el-col>
      <el-col :span="18" :xs="24" v-if="addDetails">
        <add-details :formData="formData" :formTitle="title" @back="back()"></add-details>
      </el-col>

    </el-row>
    <div v-if="isChoose" style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
    <add-edit v-if="addEdit" :formTitle="title" :formData="formData" @back="back()"></add-edit>
    <device-index v-if="deviceIndexVisible" @back="deviceIndexVisible=false"></device-index>
  </div>
</template>

<script>
import { findByTemplateType } from "@/api/equipment/attribute";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { listBASE, getBASE, delBASE, addBASE, updateBASE, countBASE, exportBASE } from "@/api/equipment/BASE";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import addEdit from "@/views/decive/book/add";
import addDetails from "@/views/decive/book/details";
import deviceIndex from "@/views/decive/book/deviceIndex";
import JmTable from "@/components/JmTable";
import JmUserTree from "@/components/JmUserTree";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "devicebook",
  dicts: [ 'em_device_state','em_device_att', 'apv_status','em_device_level'],
  components: { Treeselect, JmUserTree, JmTable, addEdit, addDetails, deviceIndex },
  props:{
    isChoose:{
      default:false,
      type: Boolean,
    }
  },
  computed:{
    // 列信息
    columns(){
      return [
        { label:"设备编码", prop:"deviceCode",  },
        { label:"设备名称", prop:"deviceName",  },
        { label:"规格型号", prop:"sModel",  },
        { label:"设备类别", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions,   },
        { label:"设备状态", prop:"deviceStatus", formType: 'select', options: this.dict.type.em_device_state, },
        { label:"财务资产编码", prop:"propertyCode",  },
        { label:"功能位置", prop:"location",  },
        { label:"重要等级", prop:"level", formType: 'select', options: this.dict.type.em_device_level, }, //(A、B、C)
        // { label:"所属子公司", prop:"",  },
        { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions,  },
        { label:"当前使用组织", prop:"currDeptId", formType: 'selectTree', options: this.deptOptions, },
        { label:"入账日期", prop:"makerAoTime", formType: 'date', }, 
        { label:"设备属性", prop:"deviceAtt", formType: 'select', options: this.dict.type.em_device_att, },  //(1 设备、2 部件)
        { label:"上级设备", prop:"parentDeviceName",  }, //(0 父级)
        { label:"审批状态", prop:"apvStatus", formType: 'select', options: this.dict.type.apv_status, }, //apv_status
        
      ]
    },
  },
  data() {
    return {
      btnLoading: false,
      formData: {
        archivesOther: {}, // 步骤2 值
        emArchivesExtendAtt: {}, // 步骤2-扩展数据  模板 值
        emArchivesIndex: {}, // 步骤3 主要指标  模板 值
        emArchivesSpecial: {}, // 步骤3 特种设备  模板 值
        archivesPartsList: [], // 步骤4  表格
        genFileResourceList: [],  // 步骤5  上传图片
        imgFileResourceList: [],  // 步骤5  上传文件
      },
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
      countData:{},
      countColumn:[
        {label:'设备数量',prop:'sumCount',icon:'el-icon-share',idd:'1',},
        {label:'在用数量',prop:'zyCount',icon:'el-icon-tickets',idd:'2',},
        {label:'未审批数量',prop:'checkCount',icon:'el-icon-reading',idd:'3',},
        {children:[
          {label:'A级',prop:'a', color: '#24a71e'},
          {label:'B级',prop:'b', color: '#ffb64f'},
          {label:'C级',prop:'c', color: '#fc297d'},
        ], icon:'el-icon-pie-chart',idd:'4',},
      ],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      categoryOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      addEdit: false,
      addDetails: false,
      valueMap: {},
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      radioRow: {},
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: undefined,
      },
      deviceIndexVisible: false,
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
    this.getTree();
    this.getTreeSelect();
  },
  methods: {
    
    /** 查询设备档案下拉树结构 */
    getTree() {
      equipmentTree().then(response => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions)
      });
    },
    /** 查询部门下拉树结构 */
    getTreeSelect(){
      listDept().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 设备指标
    handleDevice(){
      this.deviceIndexVisible = true
      // var obj = {
      //   categoryId: this.queryParams.categoryId
      // }
      // listIndexBASE(obj).then(response => {
        
      // });
    },
    close(){
      this.$emit('close')
    },
    submitRadio(){
      this.$emit('submitRadio',this.radioRow)
    },
    back(){
      this.addEdit=false
      this.addDetails=false
      this.getList(this.queryParams)
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true;
      var data = {
        categoryId:this.queryParams.categoryId,
        ...queryParams
      }
      this.getCount(data)
      listBASE(data).then(response => {
          response.rows.forEach(b => {
            Object.assign(
              b,
              b.archivesOther?b.archivesOther:{},
              b.emArchivesExtendAtt?JSON.parse(b.emArchivesExtendAtt.fieldValue):{},
              b.emArchivesIndex?JSON.parse(b.emArchivesIndex.fieldValue):{},
              b.emArchivesSpecial?JSON.parse(b.emArchivesSpecial.fieldValue):{},
            )
          });
          this.equipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询统计 */
    getCount(queryParams) {
      countBASE(queryParams).then(response => {
          this.countData = response.data;
        });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.addDetails = false
      this.queryParams.categoryId = data.id;
      this.getCount({categoryId:this.queryParams.categoryId})
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.queryParams);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deviceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0]
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    setFormLabel(arr){
      arr.forEach(b => {
        b.label=b.fieldName;
        b.prop=b.fieldCode;
        b.required = b.required=='0'?true:false;

      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.btnLoading = true
      // 获取扩展数据
      findByTemplateType({templateType: 'K'}).then(response => {
        this.formData = this.$options.data().formData;
        // this.formData.emArchivesExtendAtt = response.data;
        // this.formData.emArchivesIndex = response.data;
        // var aa = [
        //   {
        //       "createBy": "buyunxuyong",
        //       "createTime": "2023-09-13 11:38:53",
        //       "updateBy": null,
        //       "updateTime": null,
        //       "remark": "12",
        //       "fieldId": 13,
        //       "templateId": 2,
        //       "fieldCode": "aqsq",
        //       "fieldName": "12",
              
        //       "valuePath": "12",
        //       "required": null,
        //       "isModify": "0",
        //       "componentType": "input",
        //       "componentContent": "12",
        //       "disabled": null
        //   },
        //   {
        //       "createBy": "buyunxuyong",
        //       "createTime": "2023-09-13 16:06:10",
        //       "updateBy": null,
        //       "updateTime": null,
        //       "remark": "1111",
        //       "fieldId": 21,
        //       "templateId": 2,
        //       "fieldCode": "dewde",
        //       "fieldName": "1111",
              
        //       "valuePath": "1111",
        //       "required": "0",
        //       "isModify": "0",
        //       "componentType": "input",
        //       "componentContent": "1111",
        //       "disabled": null
        //   },
        //   {
        //       "createBy": "buyunxuyong",
        //       "createTime": "2023-09-13 16:08:02",
        //       "updateBy": null,
        //       "updateTime": null,
        //       "remark": "11",
        //       "fieldId": 23,
        //       "templateId": 2,
        //       "fieldCode": "vfvf",
        //       "fieldName": "11",
              
        //       "valuePath": "11",
        //       "required": "0",
        //       "isModify": "0",
        //       "componentType": "input",
        //       "componentContent": "11",
        //       "disabled": null
        //   },
        //   {
        //       "createBy": "buyunxuyong",
        //       "createTime": "2023-09-13 16:08:57",
        //       "updateBy": null,
        //       "updateTime": null,
        //       "remark": "11",
        //       "fieldId": 24,
        //       "templateId": 2,
        //       "fieldCode": "cdacad",
        //       "fieldName": "11",
              
        //       "valuePath": "11",
        //       "required": "0",
        //       "isModify": "0",
        //       "componentType": "input",
        //       "componentContent": "11",
        //       "disabled": null
        //   },
        //   {
        //       "createBy": "buyunxuyong",
        //       "createTime": "2023-09-13 16:41:16",
        //       "updateBy": null,
        //       "updateTime": null,
        //       "remark": "1221",
        //       "fieldId": 28,
        //       "templateId": 2,
        //       "fieldCode": "vfewvf",
        //       "fieldName": "12",
              
        //       "valuePath": "12",
        //       "required": "0",
        //       "isModify": "0",
        //       "componentType": "input",
        //       "componentContent": "122",
        //       "disabled": null
        //   }
        // ]
        this.setFormLabel(response.data)
        // 扩展数据
        this.formData.emArchivesExtendAtt = {
          componentContent: response.data,
          fieldValue: {},
        }
        this.addEdit = true;
        this.title = "新增设备";
        this.btnLoading = false
      })
      .catch(err => {
        this.btnLoading = false
      });

      // this.reset();
      // getBASE().then(response => {
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加用户";
      //   this.form.password = this.initPassword;
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row,f) {
      this.btnLoading = true
      const deviceId = row.deviceId
      getBASE(deviceId).then(response => {
        this.title = "编辑设备";
        this.formData = response.data;
        // 第一步  特种设备
        if(this.formData.emArchivesSpecial){
          this.formData.emArchivesSpecial.componentContent = JSON.parse(this.formData.emArchivesSpecial.componentContent)
          this.formData.emArchivesSpecial.fieldValue = JSON.parse(this.formData.emArchivesSpecial.fieldValue)
          this.setFormLabel(this.formData.emArchivesSpecial.componentContent)
        }
        // 第二步
        if(this.formData.archivesOther==null){
          this.formData.archivesOther = {}
        }
        // 第二步  扩展数据
        if(this.formData.emArchivesExtendAtt){
          this.formData.emArchivesExtendAtt.componentContent = JSON.parse(this.formData.emArchivesExtendAtt.componentContent)
          this.formData.emArchivesExtendAtt.fieldValue = JSON.parse(this.formData.emArchivesExtendAtt.fieldValue)
          this.setFormLabel(this.formData.emArchivesExtendAtt.componentContent)
        }
        // 第三步 主要指标
        if(this.formData.emArchivesIndex){
          this.formData.emArchivesIndex.componentContent = JSON.parse(this.formData.emArchivesIndex.componentContent)
          this.formData.emArchivesIndex.fieldValue = JSON.parse(this.formData.emArchivesIndex.fieldValue)
          this.setFormLabel(this.formData.emArchivesIndex.componentContent)
        }
        this.btnLoading = false
        if(f=='edit'){
          this.addEdit = true;
        }else if(f=='view'){
          this.title = this.getTreeParent(row.categoryId).join(' > ') + ' > ' + row.deviceName;
          this.addDetails = true;
        }
      })
      .catch(err => {
        console.log(err,333);
        this.btnLoading = false
      });
    },
    getTreeParent(id){
      const path = [];
      let current = this.valueMap[id];
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path
    },
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + deviceIds + '"的数据项？').then(function() {
        return delBASE(deviceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   this.download('system/user/export', {
    //     ...this.queryParams
    //   }, `user_${new Date().getTime()}.xlsx`)
    // },
    handleExport(){
      var obj = {
        categoryId: this.queryParams.categoryId
      }
      this.download('equipment/base/export', {
        ...obj
      }, `device_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
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
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>