<template>
  <div class="content">
    <div class="top">
      <span>{{ title }}</span>
      <div class="controls" @mouseenter="mouseenterHandler">
        <el-button
          icon="el-icon-printer"
          size="mini"
          type="primary"
          @click="handlePrint"
          >打印</el-button
        >
        <span style="" @click="handlerBack" class="test">返回</span>
      </div>
    </div>
    <!-- 打印 -->
    <div v-if="dataSource && dataSource.applyDeptPerson" class="print">
      <!-- 上面 -->
      <div :class="'card bgc'">
        <strong class="receipt">{{ dataSource.applyDeptPerson }}</strong>

        <div class="basic">
          <span>领用单位：{{ dataSource.neckDeptName }}</span>
          <span>日期：{{ dataSource.neckDate }}</span>
          <span>领用单编号：{{ dataSource.neckNo }}</span>
        </div>
      </div>
      <!-- 下面 -->
      <!-- 表格 -->
      <table>
        <tr>
          <th v-for="item in thead" :key="item">{{ item }}</th>
        </tr>
        <tr v-for="item in dataSource.detailList" :key="item.id">
          <td>{{ item.deviceName }}</td>
          <td>{{ item.sModel }}</td>
          <td>{{ "台" }}</td>
          <td>{{ item.deviceNum }}</td>
          <td>{{ "安装地点暂未返回" }}</td>
          <td>{{ item.remark }}</td>
        </tr>
      </table>
      <!-- 底部 -->
      <div class="basic">
        <span>部门主管：张三</span>
        <span>设备管理员：王亚桥</span>
        <span>树料员：张国平</span>
        <span>保管员：李四</span>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  components: {},
  data() {
    return {
      title: "",
      isEdit: false,
      routeUrl: null,
      routeMethod: null,
      dataSource: null,
      thead: [],
    };
  },
  created() {
    this.title = this.$route.meta.title;
    this.routeUrl = this.$route.query.routeUrl;
    this.routeMethod = this.$route.query.routeMethod;
    this.thead = this.$route.query.thead;
    if (this.routeUrl && this.routeMethod) {
      request({
        url: `${this.routeUrl}?id=${this.$route.query.id}`,
        method: this.routeMethod,
      }).then((res) => {
        if (res.code === 200) {
          this.dataSource = res.data;
        }
      });
    }
  },

  mounted() {},
  computed: {},
  methods: {
    mouseenterHandler() {
      // 关闭左侧导航栏
      this.$store.dispatch("app/closeSideBar", {
        withoutAnimation: false,
      });
    },

    handlePrint() {
      window.print();
    },
    handlerBack() {
      this.$router.back();
    },
  },
};
</script>
<style lang='scss' scoped>
.content {
  padding: 20px;
}
.top {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  margin-bottom: 10px;
}
.card {
  overflow: hidden;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  .receipt {
    font-size: 50px;
    color: #007bfe;
  }
}
.basic {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.bgc {
  border-radius: 8px;
  background: url("../../../assets/images/backdrop.png") no-repeat;
  background-size: 100% 100%;
  .form {
    padding-top: 25px;
    align-items: center;
  }
}
.controls {
  span {
    margin-left: 10px;
    margin-right: 10px;
    color: #007bfe;
    cursor: pointer;
  }
}

table {
  border-collapse: collapse;
  width: 100%;
  border-color: #f4f4f7;
  margin: 20px 0;
  border-radius: 8px;
}

th,
td {
  border: 1px solid #f4f4f7;
  text-align: left;
  padding: 8px;
}
th {
  background-color: #e8f3ff;
  font-weight: 600;
}
td {
  font-size: 14px;
}

tr:nth-child(odd) {
  background-color: #f7fbff;
}
</style>
