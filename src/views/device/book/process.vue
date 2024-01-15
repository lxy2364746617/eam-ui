<template>
   <div>
        <el-table  fit :data="tableData" border >
        <el-table-column label="流程名称" align="center" prop="name" />
        <el-table-column label="流程版本" align="center">
          <template slot-scope="scope">
            <el-tag size="medium" >v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="流程分类" align="center" prop="category" />
        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              @click="handleStartProcess(scope.row)"
            >发起流程</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processTotal>0"
        :total="processTotal"
        :page.sync="queryProcessParams.pageNum"
        :limit.sync="queryProcessParams.pageSize"
        @pagination="listDefinition"
      />
   </div>
</template>

<script>
export default {
  name:'subprocess',
    props:{
        tableData:{
            type:Array,
            default:[]
        }
    },
    data(){
        return{
            queryProcessParams: {
        pageNum: 1,
        pageSize: 10,
            }
        }
    },
    created(){},
    computed:{
    processTotal(){
        return this.tableData.length
    }

    },

    methods:{
        handleStartProcess(row){
            this.$emit('submit',row)
            
        },
        listDefinition(val){
            this.$emit('getTableData',val)
        },
    },
}
</script>

<style>

</style>