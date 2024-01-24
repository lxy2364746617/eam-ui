<template>
  <div>
    <el-form v-model="searchForm" >
      <el-form-item label="周转类型：">
        <el-checkbox-group v-model="searchForm.type" style="display:inline">
          <el-checkbox v-for="item in zzType" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="日期范围：">
        <el-date-picker v-model="searchForm.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="width:140px;position:absolute;right:0;top:0">
          <div :class="['btn', isTimeLine? 'isactive':'']"  @click="isTimeLine=true">时间轴</div>
          <div :class="['btn', isTimeLine?'' :'isactive']" @click="isTimeLine=false">列表</div>
      </div>
    <ul v-if="isTimeLine">
      <li v-for="(item,index ) in lineArr" :key="index">
        <div class="linetime">
          <div class="linetime_detail">
            <p style="margin-bottom:15px">设备入库</p>
            <p>所属组织</p>
            <p>功能位置</p>
            <p>设备状态</p>
            <p>使用组织</p>
            <p>使用部门</p>
            <p>异常处理</p>
          </div>
        </div>
        <p style="text-align: center;">2012-12-12</p>
      </li>
    </ul>

    <el-table v-if="!isTimeLine" ref="table" :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="业务单号" ></el-table-column>
          <el-table-column prop="name" label="业务日期" ></el-table-column>
          <el-table-column prop="name" label="申请部门" ></el-table-column>
          <el-table-column prop="name" label="调入部门" ></el-table-column>
          <el-table-column prop="name" label="调出部门" ></el-table-column>
          <el-table-column prop="name" label="所属组织" ></el-table-column>
          <el-table-column prop="name" label="单据状态" ></el-table-column>
          <el-table-column prop="name" label="业务类型" ></el-table-column>
        </el-table>
        <pagination v-if="!isTimeLine"
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNum"
        :limit.sync="searchForm.pageSize"
        @pagination="getList"
      />
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
  },
  data() {
    return {
        total:0,
        isTimeLine:true,
      searchForm: {
        type: [],
        pageNum: 1,
        pageSize: 10,
        deviceId: this.formData.deviceId,
      },
      lineArr: [1, 2, 3],
      customColors: [
        { color: "#f56c6c", percentage: 99 },
        { color: "#52C41A", percentage: 100 },
      ],
      zzType: [
        { label: "类型1", value: 1 },
        { label: "类型2", value: 2 },
        { label: "类型3", value: 3 },
      ],
    };
  },
  methods:{
      getList(){},

  }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  float: left;
}
.linetime {
  border-bottom: 4px solid #d9d9d9;
  padding: 20px;
  position: relative;
}
.linetime_detail {
  height: 200px;
  font-size: 14px;
  padding: 10px;
  box-shadow: 0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
  p {
    margin: 2px;
    padding: 0;
  }
  div {
    margin: 5px 0;
  }
}
.linetime::before {
  content: "";
  width: 20px;
  height: 20px;
  background: white;
  border: 4px solid #1890ff;
  border-radius: 50%;
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
}
.el-card {
  padding-left: 10px;
}
.el-divider--horizontal {
  margin: 5px 0;
}
::v-deep .el-progress,
::v-deep .el-progress-bar {
  width: 90px !important;
}
.btn{
    width:50%;
    display: inline-block;
    text-align: center;
    background:  rgba(0, 0, 0, 0.1);
    color: #4E5969;
    border-radius: 2px;
    line-height: 36px;
    height: 36px;
    font-size: 16px;
    cursor: pointer;
    
}
.isactive{
    background: #1F77FC;
    color: #fff;
}

</style>