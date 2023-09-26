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
      <div v-if="radioColumn.length>0">
          <jm-table :tableData="deptList" @getList="getList" :total="total" :columns="radioColumn[radio].tableHead">
              <template slot="headerLeft">
                  <el-col :span="1.5">
                      <el-button v-if="deptList.length > 0" type="primary" icon="el-icon-download" size="mini"
                          @click="handleExport">下载</el-button>
                  </el-col>
              </template>
          </jm-table>
      </div>
  </div>
</template>

<script>

import JmTable from "@/components/JmTable";
import { isSpecialEmCategoryCategory, } from "@/api/equipment/category";
import { specialListBASE } from "@/api/equipment/BASE";

export default {
  name: "deviceindex",
  dicts: [],
  components: { JmTable },
  props: {
      formTitle: {
          default: '设备指标',
          type: String,
      },
  },
  computed: {

  },
  data() {
      return {
          radio: 0,
          radioColumn: [],
          deptList: [],
          total: 0,
          // 遮罩层
          loading: true,
          // 查询参数
          queryParams: {
              pageNum: 1,
              pageSize: 10,
              isSpecial: "Y",
              categoryId: undefined,
          },
      };
  },
  created() {
      this.isSmEmCategoryRadio()
  },
  methods: {
      radioInput(val){
          this.getList({
              ...this.queryParams,
              categoryId: this.radioColumn[val].categoryId
          })
      },
      isSmEmCategoryRadio(){
        isSpecialEmCategoryCategory().then(response => {
              response.data.forEach(b => {
                  if(b.tableHead){
                      b.tableHead.forEach(bb => {
                          bb.label = bb.fieldName
                          bb.prop = bb.fieldCode
                          bb.formType = bb.fieldType
                          bb.tableVisible = !bb.custom
                      });
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
      /** 导出按钮操作 */
      handleExport(queryParams) { 
          // var obj = {
          //     ...queryParams,
          //     parentId: this.nowClickTreeItem.id
          // }
          var obj = {
                categoryId: this.queryParams.categoryId,
            }
            this.download('equipment/special/export',
                obj,
                `特种设备_${new Date().getTime()}.xlsx`)
      },
  }
};
</script>