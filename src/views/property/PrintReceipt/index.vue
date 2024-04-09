<template>
  <div class="app-container">
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
    <div v-if="form && form.titleHeader" class="print">
      <!-- 上面 -->
      <div :class="'card bgc'">
        <strong class="receipt">{{ form.titleHeader }}</strong>

        <div v-if="form.flag === 'LY' || form.flag === 'HT'" class="basic">
          <span
            >{{ form.flag === "LY" ? "领用" : "回退" }}单位：{{
              dataSource.deptName
            }}</span
          >
          <span>日期：{{ dataSource.date }}</span>
          <span
            >{{ form.flag === "LY" ? "领用" : "回退" }}单编号：{{
              dataSource.No
            }}</span
          >
        </div>
        <div v-else-if="form.flag === 'YJ'" class="basic">
          <span>移交调出单位：{{ dataSource.outDeptName }}</span>
          <span>移交调入单位：{{ dataSource.inDeptName }}</span>
          <span>日期：{{ dataSource.transferDate }}</span>
          <span>移交单编号：{{ dataSource.transferNo }}</span>
        </div>
        <div v-else-if="form.flag === 'BF'" class="basic">
          <span>报废单位：{{ dataSource.scrapUnit }}</span>
          <span>日期：{{ dataSource.scrapDate }}</span>
          <span>报废单编号：{{ dataSource.scrapNo }}</span>
        </div>
      </div>
      <!-- 下面 -->
      <!-- 表格 -->
      <table>
        <thead>
          <tr>
            <th v-for="item in thead" :key="item">{{ item }}</th>
          </tr>
        </thead>
        <tbody v-if="form.flag === 'LY'">
          <tr v-for="item in dataSource.detailList" :key="item.id">
            <td>{{ item.deviceName }}</td>
            <td>{{ item.sModel }}</td>
            <td>{{ "台" }}</td>
            <td>{{ item.deviceNum }}</td>
            <td>{{ item.location ? item.location : "-" }}</td>
            <td>{{ item.remark ? item.remark : "-" }}</td>
          </tr>
        </tbody>
        <tbody v-else-if="form.flag === 'HT'">
          <tr v-for="item in dataSource.detailList" :key="item.id">
            <td>{{ item.deviceName }}</td>
            <td>{{ item.sModel }}</td>
            <td>{{ "台" }}</td>
            <td>1</td>
            <td>
              {{
                item.location
                  ? findTreeName(locationOptions, item.location)
                  : "-"
              }}
            </td>
            <td>{{ item.targetLocation ? item.targetLocation : "-" }}</td>
          </tr>
        </tbody>
        <tbody v-else-if="form.flag === 'YJ'">
          <tr v-for="item in dataSource.record" :key="item.id">
            <td>{{ item.deviceName }}</td>
            <td>{{ item.sModel }}</td>
            <td>{{ "台" }}</td>
            <td>{{ item.deviceNum }}</td>
            <td>
              {{
                item.targetLocation
                  ? findTreeName(locationOptions, item.targetLocation)
                  : "-"
              }}
            </td>
            <td>
              {{
                item.location
                  ? findTreeName(locationOptions, item.location)
                  : "-"
              }}
            </td>
            <td>{{ item.remark ? item.remark : "-" }}</td>
          </tr>
        </tbody>
        <tbody v-else-if="form.flag === 'BF'">
          <tr v-for="item in dataSource.detailList" :key="item.id">
            <td>{{ item.deviceCode ? item.deviceCode : "-" }}</td>
            <td>{{ item.deviceName ? item.deviceName : "-" }}</td>
            <td>{{ item.sModel ? item.sModel : "-" }}</td>
            <td>{{ findTreeName(categoryOptions, item.deviceType) }}</td>
            <td>
              {{ item.location ? item.location : "-" }}
            </td>
            <td>
              {{ findName(dict.type.em_device_state, item.deviceStatus) }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 底部 -->
      <div v-if="form.flag !== 'BF'" class="basic">
        <span v-for="item in personnelOptions" :key="item.taskName"
          >{{ item.assigneeName }}：{{ item.taskName }}</span
        >
      </div>
      <div v-else class="basic">
        <span>报废人：{{ dataSource.scrapPerson }}</span>
        <span v-for="item in personnelOptions" :key="item.taskName"
          >{{ item.assigneeName }}：{{ item.taskName }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
// 报废
import { getProjectList } from "@/api/property/scrapping";
import { equipmentTree } from "@/api/equipment/category";
import { getLocationTree } from "@/api/Location";
export default {
  components: {},
  dicts: ["em_device_state"],
  data() {
    return {
      title: "",
      isEdit: false,
      routeUrl: null,
      routeMethod: null,
      dataSource: { deptName: " " },
      thead: [],
      form: {},
      categoryOptions: [],
      personnelOptions: [],
      locationOptions: [],
    };
  },
  created() {
    this.title = this.$route.meta.title;
    this.routeUrl = this.$route.query.routeUrl;
    this.routeMethod = this.$route.query.routeMethod;
    this.thead = this.$route.query.thead;
    this.form = this.$route.query;
    if (this.routeUrl && this.routeMethod) {
      getLocationTree().then((res) => {
        this.locationOptions = this.getTreeName(res.data);
      });
      request({
        url: `${this.routeUrl}?id=${this.$route.query.id}`,
        method: this.routeMethod,
      }).then((res) => {
        if (res.code === 200) {
          let value = res.data;
          if (this.form.flag === "LY" || this.form.flag === "HT") {
            this.dataSource = {
              ...res.data,
              deptName: value.neckDeptName || value.applyDept,
              date: value.neckDate || value.createDate,
              No: value.neckNo || value.backNo,
            };
          } else {
            this.dataSource = res.data;
          }
        }
      });
    } else if (this.$route.query.scrapForm.scrapNo) {
      this.dataSource = this.form.scrapForm;
      this.getTree();
      getProjectList({
        pageNum: 1,
        pageSize: 10000,
        scrapNo: this.$route.query.scrapForm.scrapNo,
      }).then((res) => {
        this.dataSource = { ...this.dataSource, detailList: res.data };
      });
    }
    if (this.form.procInsId && this.form.deployId) {
      request({
        url: `/flowable/task/flowRecord?procInsId=${this.form.procInsId}&deployId=${this.form.deployId}`,
      }).then((res) => {
        res.data.flowList.pop();
        this.personnelOptions = res.data.flowList;
      });
    }
  },

  mounted() {},
  computed: {},
  methods: {
    // 递归获取treeselect父节点
    loops(list, parent) {
      return (list || []).map(({ children, id, label }) => {
        const node = (this.valueMap[id] = {
          parent,
          label,
          id,
        });
        node.children = this.loops(children, node);
        return node;
      });
    },
    findName(options, value) {
      var name = "";
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          name = options[i].label;
        }
      }
      return name || value;
    },
    getTreeName(arr) {
      arr.forEach((item) => {
        item.id = item.id;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTreeName(item.children);
        }
      });
      return arr;
    },
    getTree() {
      equipmentTree().then(async (response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
    },
    findTreeName(options, value) {
      var name = "";
      function Name(name) {
        this.name = name;
      }
      var name1 = new Name("");
      this.forfn(options, value, name1);

      return name1.name;
    },
    forfn(options, value, name1) {
      function changeName(n1, x) {
        n1.name = x;
      }
      for (let i = 0; i < options.length; i++) {
        if (options[i].id == value) {
          changeName(name1, options[i].label);
        }
        if (options[i].children) {
          this.forfn(options[i].children, value, name1);
        }
      }
    },
    mouseenterHandler() {
      // 关闭左侧导航栏
      // this.$store.dispatch("app/closeSideBar", {
      //   withoutAnimation: false,
      // });
    },

    handlePrint() {
      window.print();
    },
    handlerBack() {
      // this.$router.back();
      this.$store.dispatch("tagsView/delView", this.$route); // 关闭当前页
      this.$router.go(-1); //跳回上页
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
