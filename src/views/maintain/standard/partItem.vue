<template>
  <div class="app-container" style="padding-top: 0;">
    <jm-table :tableData="itemList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" :isRadio="isChoose">
    </jm-table>
    <div style="width: 100%; height: 68px;"></div>
    <div
      style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
  </div>
</template>

<script>
import { listAssembly } from "@/api/equipment/assembly";
import { listDept } from "@/api/system/dept";
import { getLocationTree} from '@/api/Location';
import { equipmentTree } from "@/api/equipment/category";
import JmTable from "@/components/JmTable";
import {  getPrtOrgTreeByDeptId} from "@/api/equipment/BASE";
export default {
  name: "partItem",
  dicts: ['mro_item_method', 'XDJ', 'sys_normal_disable','em_device_state','em_device_level'],
  components: { JmTable },
  props: {
    isChoose: {
      default: true,
      type: Boolean,
    },
    formData: {
      default: () => { },
      type: Object,
    },
    itemType:{
      default:'',
      type:String
    }
  },
  computed: {
    // 列信息
    columns() {
      return [
         { label:"设备编码", prop:"deviceCode", },
        { label:"设备名称", prop:"deviceName", },
        { label:"规格型号", prop:"specs", },
        { label:"设备类型", prop:"categoryId", formType: 'selectTree', options: this.categoryOptions, width:220  },
        { label:"设备状态", prop:"deviceStatus", formType: 'select', options: this.dict.type.em_device_state, },
        { label:"功能位置", prop:"location", options:this.locationOptions,formType: 'selectTree', width:220},
        { label:"重要等级", prop:"level", formType: 'select', options: this.dict.type.em_device_level, }, //(A、B、C)
        // { label:"所属子公司", prop:"",  },
        { label:"所属组织", prop:"affDeptId", formType: 'selectTree', options: this.deptOptions, width:220 },
      ]
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      checkBoxRows: [],
      radioRow: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      itemList: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      locationOptions:[],
      deptOptions: [],
      categoryOptions: [],
    };
  },
 async created() {
    await getLocationTree().then(res=>{
        this.locationOptions=this.getTreeData(res.data)
      });
    await equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
    await getPrtOrgTreeByDeptId().then(response => {
        this.deptOptions = response.data;
      });
    this.getList(this.queryParams)
  },
  methods: {
     getTreeData(arr){
      arr.forEach(item=>{
          item.value=item.deptId
          item.label=item.deptName
          item.isDisabled=item.locationFlag=='N'?true:false
          if(item.children&&item.children.length>0){
            this.getTreeData(item.children)
          }
        })
        return arr
    },
    close() {
      this.$emit('close')
    },
    submitRadio() {
      if (this.isChoose) {
        // 单选
        this.$emit('submitRadio', this.radioRow)
      } else {
        // 多选
        this.$emit('submitRadio', this.checkBoxRows)
      }
    },
    /** 查询用户列表 */
    getList(queryParams) {
      queryParams.deviceId=this.formData.deviceId
      this.loading = true
      listAssembly(queryParams).then((response) => {
        this.itemList = response.rows
        this.total = response.total;
        this.loading = false;
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.itemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0]
      this.checkBoxRows = selection;
    },
  }
};
</script>