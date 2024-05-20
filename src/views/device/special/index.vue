<template>
  <div class="app-container">
      <!-- <el-row :gutter="12">
          <el-col :span="3">
              <i class="el-icon-back" @click="backparent" style="color: #007bfe;cursor: pointer;"></i>
              {{ formTitle }}
          </el-col>
      </el-row> -->
      <div style="margin-top: 20px;margin-bottom: 20px;">
          <span>选择特种设备：</span>
          <el-radio-group v-model="radio" @input="radioInput">
              <el-radio v-for="(item,index) in radioColumn" :label="index" :key="item.categoryId">{{ item.categoryName }}</el-radio>
          </el-radio-group>
      </div>
      <div v-if="radioColumn.length > 0">
          <jm-table :tableData="deptList" @getList="getList" :total="total" :columns="radioColumn[radio].tableHead" @handleSelectionChange='handleSelectionChange'>
              <template slot="headerLeft">
                  <el-col :span="1.5">
                      <el-button v-if="deptList.length > 0" type="primary" icon="el-icon-download" size="mini"
                          @click="handleExport" v-hasPermi="['equipment:special:export']">下载</el-button>
                  </el-col>
              </template>
              <template #end_handle="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              :loading="btnLoading"
              @click="handleUpdate(scope.row,'view')"
              v-hasPermi="['equipment:base:query']"
            >详情</el-button>
              </template>
          </jm-table>
      </div>
  </div>
</template>

<script>

import JmTable from "@/components/JmTable";
import { isSpecialEmCategoryCategory, } from "@/api/equipment/category";
import { specialListBASE, getPrtOrgTreeByDeptId} from "@/api/equipment/BASE";
import { listDept } from "@/api/system/dept";
import { equipmentTree } from "@/api/equipment/category";
import { getLocationTree} from '@/api/Location'
export default {
  name: "deviceindex",
  dicts: ['em_device_state'],
  components: { JmTable },
  props: {
      formTitle: {
          default: '设备指标',
          type: String,
      },
  },
  computed: {
    obj(){
        return {
            location: { formType: 'selectTree', options: this.locationOptions,width:230 },
            categoryId: { formType: 'selectTree', options: this.categoryOptions,width:230 },
            currDeptId: { formType: 'selectTree', options: this.deptOptions,width:230 },
            affDeptId: { formType: 'selectTree',  options: this.deptOptions, width:230},
            makerAoTime: { formType: 'daterange',width:200 },
            deviceStatus:{formType: 'selectTag', options: this.statesArr, },
        }
    }
  },
  watch:{
    'dict.type.em_device_state':{
      handler(val){
        this.statesArr = JSON.parse(JSON.stringify(val)).filter(item=>{
          return item.label!='已报废'
        })
      },
      immediate:true,
      deep:true
    }
  },
  data() {
      return {
          radio: 0,
          radioColumn: [],
          btnLoading:false,
          deptList: [],
          total: 0,
          // 遮罩层
          loading: true,
          // 部门树选项
          deptOptions: [],
          categoryOptions: [],
          locationOptions:[],
          // 查询参数
          queryParams: {
              pageNum: 1,
              pageSize: 10,
              isSpecial: "Y",
              categoryId: undefined,
          },
          statesArr:[]
      };
  },
  async created() {
     await this.getTree();
     await this.getTreeSelect();
     await this.isSmEmCategoryRadio()
  },
  methods: {
    /** 查询设备档案下拉树结构 */
    async getTree() {
      await equipmentTree().then(response => {
        this.categoryOptions = response.data;
      });
      await getLocationTree().then(res=>{
        this.locationOptions=this.getTreeName(res.data)
      })
    },
    /** 查询部门下拉树结构 */
    async getTreeSelect(){
      await getPrtOrgTreeByDeptId().then(response => {
        this.deptOptions = response.data;
      });
    },
    getTreeName(arr){
      arr.forEach(item=>{
          item.value=item.deptId
          item.label=item.deptName
          item.isDisabled=item.locationFlag=='N'?true:false
          if(item.children&&item.children.length>0){
            this.getTreeName(item.children)
          }
        })
        return arr
    },
      radioInput(val){
        this.queryParams.categoryId = this.radioColumn[val].categoryId
          this.getList({
              ...this.queryParams
          })
      },
      isSmEmCategoryRadio(){
        var that = this
        isSpecialEmCategoryCategory().then(response => {
              response.data.forEach(b => {
                  if(b.tableHead){
                      b.tableHead.forEach((bb,index) => {
                          bb.label = bb.fieldName
                          bb.prop = bb.fieldCode
                          bb.formType = bb.fieldType
                          bb.tableVisible = !bb.custom
                          for (const key in that.obj) {
                            if(key==bb.prop){
                                Object.assign(bb,that.obj[key])
                            }
                          }
                      });
                      b.tableHead = b.tableHead.filter(item=>item.fieldCode!='categoryId')
                  }
              });
              this.radioColumn = response.data
              this.radioInput(this.radio)
          });
      },
      backparent(){
          this.$emit('back')
      },
      /** 查询部门列表 */
      getList(queryParams) {
          this.loading = true;
          queryParams.categoryId = this.radioColumn[this.radio].categoryId
          specialListBASE(queryParams).then(response => {
              response.rows.forEach(b => {
                  Object.assign(
                      b,
                      b.archivesOther?b.archivesOther:{},
                      b.emArchivesExtendAtt?JSON.parse(b.emArchivesExtendAtt.fieldValue):{},
                      b.emArchivesIndex?JSON.parse(b.emArchivesIndex.fieldValue):{},
                      b.emArchivesSpecial?JSON.parse(b.emArchivesSpecial.fieldValue):{},
                  )
              });
              this.deptList = response.rows;
              this.total = response.total;
              this.loading = false;
          });
      },
      // 多选框选中数据
    handleSelectionChange(selection) {
      this.exportIds = selection.map(item => item.deviceId).join(',')
    },
      /** 导出按钮操作 */
      handleExport(queryParams) { 
          var obj = {
                categoryId: this.queryParams.categoryId,
                exportIds:this.exportIds
            }
            this.download('equipment/special/export',
                obj,
                `特种设备_${new Date().getTime()}.xlsx`)
      },
      handleUpdate(row, f) {
      // this.btnLoading = true
      const deviceId = row.deviceId
      if (f == 'edit') {
        // this.addEdit = true;
        this.$router.push({ path: '/device/book/add?i=' + deviceId+'&f=edit' })
      } else if (f == 'view') {
        /* this.title =
          this.getTreeParent(row.categoryId).join(' > ') +
          ' > ' +
          row.deviceName */
        this.$router.push({
          path: '/device/book/details?i=' + deviceId + '&t=' + row.deviceName+'&isReadonly=true',
          query:{
              title:row.deviceName+'详情'
          }
        })
        // this.addDetails = true;
      }
    },
    getTreeParent(id) {
      const path = []
      let current = this.valueMap[id]
      while (current) {
        path.unshift(current.label)
        current = current.parent
      }
      return path
    },
  }
};
</script>