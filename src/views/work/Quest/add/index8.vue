<template>
  <Wrapper :title="wrapperTitle"
    ><div class="box">
      <div class="box-header" v-if="disabled">
        <div class="title">工单进度</div>
        <!-- 进度条 -->
        <el-steps
          :active="2"
          align-center
          style="margin-top: 20px"
          finish-status="success"
        >
          <el-step
            v-for="item in [
              { title: '待分派', label: '王子璇 2016-12-12 12:32' },
              { title: '待执行', label: '王子璇 2016-12-12 12:32' },
              { title: '执行中', label: '' },
              { title: '验收中', label: '' },
              { title: '已完成', label: '' },
              { title: '已关闭', label: '' },
            ]"
            :key="item.title"
            :title="item.title"
            icon="el-icon-loading"
            :description="item.label"
          ></el-step>
        </el-steps>
      </div>
      <div class="subtitle">
        工单信息
        <div>
          <span class="mr20 pack" @click="handlerView">关联文档查看</span>
        </div>
      </div>
      <br />
      <el-row>
        <el-col :span="24">
          <el-col :span="6" class="mb20"
            ><span class="show">工单编码:</span>{{ formData.orderCode }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">工单名称:</span>{{ formData.orderName }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">工单来源:</span
            >{{ formData.orderSource == 1 ? "计划生成" : "临时生成" }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">计划编码:</span>{{ data.planCode }}</el-col
          >

          <el-col :span="6" class="mb20"
            ><span class="show">内部负责人:</span
            >{{ formData.executorName }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">检验设备数量:</span
            >{{ equipmentList.length }}</el-col
          >
          <!-- <el-col :span="6" class="mb20"
            ><span class="show">负责人单位:</span
            >{{ formData.deptName }}</el-col
          > -->
          <el-col :span="6" class="mb20"
            ><span class="show">计划校验日期:</span
            >{{ formData.planExecuteDate }}</el-col
          >
          <el-col :span="6" class="mb20"
            ><span class="show">工单状态:</span
            >{{ formData.orderStatus }}</el-col
          >
          <!-- <el-col :span="6" class="mb20"
            ><span class="show">工单类型:</span
            ><span
              v-html="findTreeName(orderOptions, formData.orderType)"
            ></span
          ></el-col> -->
          <!-- <el-col :span="6" class="mb20"
            ><span class="show">执行开始时间:</span
            >{{ formData.startTime }}</el-col
          >
          <el-col :span="6"
            ><span class="show">执行结束时间:</span
            >{{ formData.endTime }}</el-col
          >
          <el-col :span="6"
            ><span class="show">用时:</span>{{ formData.duration }}</el-col
          > -->
        </el-col>
        <!-- <el-col :span="2">
          <img
            v-if="mainImage.indexOf('null') == -1"
            :src="mainImage"
            alt=""
            srcset=""
            style="width: 100%; vertical-align: top; height: 120px"
          />
        </el-col> -->
      </el-row>
      <!-- 下方 -->
    </div>
    <div class="title">工单执行</div>
    <el-table
      v-loading="loading"
      :data="equipmentList"
      @selection-change="handleSelectionChange"
      ref="queryTable2"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="设备编码"
        align="center"
        prop="deviceCode"
        min-width="150"
      >
        <template slot-scope="scope">
          <span class="active" @click="goEqu(scope)">{{
            scope.row.deviceCode
          }}</span>
        </template></el-table-column
      >
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="规格型号"
        align="center"
        prop="specs"
        min-width="150"
      />
      <el-table-column
        label="设备状态"
        align="center"
        prop="deviceStatus"
        min-width="150"
      />
      <el-table-column
        label="检测单位"
        align="center"
        prop="location2"
        min-width="150"
      />
      <el-table-column
        label="检测单位负责人"
        align="center"
        prop="location3"
        min-width="150"
      />

      <el-table-column label="执行状态" align="center" prop="executeStatus">
        <template slot-scope="scope">
          <span
            v-html="
              findName(dict.type.em_device_carry, scope.row.executeStatus)
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        prop="fullNum"
        min-width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            :loading="btnLoading"
            @click="goDetails(scope.row, 'view')"
            v-hasPermi="['work:quest:view']"
            >查看</el-button
          >
          <el-button
            v-if="!disabled"
            size="mini"
            type="text"
            icon="el-icon-edit"
            :loading="btnLoading"
            @click="handlerCarry(scope.row, 'carry')"
            v-hasPermi="['work:quest:carry']"
            >执行</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 保养人员和关联文档查看 -->
    <el-drawer
      size="80%"
      class="drawer"
      :title="title"
      :visible.sync="drawer"
      :wrapperClosable="false"
    >
      <JmTable
        class="table"
        :tableData="equipmentListRelevance"
        @getList="getList2"
        :total="totalRelevance"
        ref="jmtable"
        :isRadio="isChooseRelevance"
        :handleWidth="230"
        :columns="columnsRelevance"
        :isEdit="false"
        :showSearch="false"
        :rightToolbarShow="false"
      >
        <template #end_handle="scope" v-if="!isChoose">
          <el-button
            type="text"
            size="mini"
            :loading="btnLoading"
            @click="handlerDownload(scope.row, 'download')"
            v-hasPermi="['work:quest:download']"
            >下载</el-button
          >
          <el-button
            size="mini"
            type="text"
            :loading="btnLoading"
            @click="handlerPreview(scope.row, 'preview')"
            v-hasPermi="['work:quest:preview']"
            >预览</el-button
          >
        </template>
      </JmTable>
    </el-drawer>
  </Wrapper>
</template>
<script>
import ContTable from "@/components/ContTable";
import JmTable from "@/components/JmTable";
import TitleForm from "@/components/TitleForm";
import Wrapper from "@/components/wrapper";
import { getWarehousingList } from "@/api/property/warehousing";
import { equipmentTree } from "@/api/equipment/category";
import {
  getWomDevice,
  getWomInfo,
  getRelevanceInfo,
} from "@/api/work/schedule";
import { findAll, getGroup } from "@/api/system/group";
import { orderTemplate } from "@/api/work/template";
export default {
  components: {
    Wrapper,
    ContTable,
    JmTable,
    TitleForm,
  },
  dicts: [
    "em_is_photo",
    "em_device_state",
    "em_device_carry",
    "em_abnormal_status",
  ],
  data() {
    return {
      wrapperTitle: "",
      showSearch: false,
      isDrawer: false,
      isDrawer2: false,
      drawer: false,
      valueMap: {},
      equipmentList: [],
      formData: { executorName: "", deptName: "" },
      equipmentListRelevance: [],
      total: 0,

      totalRelevance: 0,
      isChoose: false,

      isChooseRelevance: false,
      loading: false,

      loadingRelevance: false,
      ids: [],

      idsRelevance: [],
      btnLoading: false,
      title: "",
      data: {},
      groupMembers: [],
      groupOptions: [],
      orderOptions: [],
      disabled: false,
    };
  },
  async created() {
    await this.getTree();
    await this.getOrderTree();
    if (localStorage.getItem("item")) {
      let row = JSON.parse(localStorage.getItem("item"));
      // this.$route.query.item = null;
      this.formData = row.item;
      this.disabled = row.disabled;
      getWomDevice({ orderCode: this.formData.orderCode, lineCode: "" }).then(
        (res) => {
          if (res.code == 200) {
            this.equipmentList = res.data;
          }
        }
      );
      getWomInfo({ orderCode: this.formData.orderCode }).then((res) => {
        this.formData = { ...res.data, ...this.formData };
      });
      findAll({ groupType: this.formData.orderType }).then((res) => {
        res.data.forEach((item) => {
          item.label = item.groupName;
          item.value = item.id;
        });
        this.groupOptions = res.data;
        this.changeGroupId(this.formData.groupId, 2);
      });
      await this.getList2();
    }
  },
  mounted() {
    this.wrapperTitle = this.$route.meta.title;
  },
  computed: {
    columnsRelevance() {
      return [
        { label: "文件名", prop: "originalFileName", class: true },
        { label: "创建时间", prop: "createTime", formType: "date" },
        { label: "创建人", prop: "createBy" },
        { label: "文件大小", prop: "fileSize" },
      ];
    },
    mainImage() {
      return process.env.VUE_APP_BASE_API + this.formData.devicePic;
    },
  },
  methods: {
    async getOrderTree() {
      await orderTemplate().then((response) => {
        this.orderOptions = response.data.map((item) => {
          const children = item.sysDictDatas.map((dict) => {
            return {
              id: dict.dictValue,
              label: dict.dictLabel,
            };
          });

          return {
            id: item.value,
            label: item.name,
            children,
          };
        });
      });
    },
    changeGroupId(val, flag) {
      if (!val) val = 1;
      getGroup(val).then((response) => {
        this.formData.directorName = response.data.leaderName;

        this.formData.director = response.data.leaderId;
        this.groupMembers = response.data.sysUserGroupList;
        let arr = response.data.sysUserGroupList.filter(
          (item) => item.userId == this.formData.executor
        )[0];

        this.$set(this.formData, "executorName", arr.nickName);
        this.$set(this.formData, "deptName", arr.dept.deptName);
      });
    },

    handlerPreview(row) {
      window.open(process.env.VUE_APP_BASE_API + row.fileName);
    },
    handlerDownload(row) {
      this.download(
        "common/download",
        {
          fileName: row.fileName,
        },
        row.originalFileName
      );
    },

    // 抽屉
    async getList2(
      form = {
        pageNum: 1,
        pageSize: 10,
      }
    ) {
      this.loadingRelevance = true;
      form["busId"] = this.formData.orderCode;
      getRelevanceInfo(form).then((response) => {
        this.equipmentListRelevance = response.rows;
        this.totalRelevance = response.total;
        this.loadingRelevance = false;
      });
    },

    handlerView(e) {
      this.title = "关联文档";
      this.drawer = true;
    },

    goEqu(scope) {
      let title =
        this.getTreeParent(scope.row.deviceType).join(" > ") +
        " > " +
        scope.row.deviceName;
      this.$router.push({
        path:
          "/device/book/details?i=" +
          scope.row.deviceId +
          "&t=" +
          title +
          "&d=true",
      });
    },
    findTreeName(options, value) {
      for (let item of options) {
        if (item.id === value) return item.label;
        if (item.children && item.children.length > 0) {
          let result = this.findTreeName(item.children, value);
          if (result !== null) return result;
        }
      }
      return null;
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
    goDetails(val) {
      this.$router.push({
        path: "/work/questUpkeep3",
      });
      localStorage.setItem(
        "carryValue",
        JSON.stringify({
          i: false,
          val,
          l: this.formData,
          t:
            this.getTreeParent(val.deviceType).join(" > ") +
            " > " +
            val.deviceName,
        })
      );
    },

    handlerCarry(val) {
      this.$router.push({
        path: "/work/questUpkeep3",
      });
      localStorage.setItem(
        "carryValue",
        JSON.stringify({
          i: true,
          val,
          l: this.formData,
          t:
            this.getTreeParent(val.deviceType).join(" > ") +
            " > " +
            val.deviceName,
        })
      );
    },
    getTreeParent(id) {
      const path = [];
      let current = this.valueMap[id];
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path;
    },
    /** 查询设备档案下拉树结构 */
    getTree() {
      equipmentTree().then((response) => {
        this.categoryOptions = response.data;
        // 方便获取父级tree
        this.loops(this.categoryOptions);
      });
    },
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

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    getListRelevance() {
      this.loadingRelevance = true;
      this.loadingRelevance = false;
    },
    getList() {
      this.equipmentList = [
        {
          deviceCode: "123123123",
          deviceName: "123123123",
          specs: "123123123",
          location: "123123123",
          isPhoto: "Y",
          categoryNum: "123123123",
          deviceStatus: "123123123",
          deviceStatus2: "123123123",
        },
      ];
      this.total = 1;
      this.loading = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  overflow: hidden;
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  background-color: #ecf1fa;
}
.title {
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.subtitle {
  border-bottom: 1px solid #ddd;
  background-color: #ebf4fc;
  color: #55566d;
  font-weight: bold;
  text-align: left;
  font-size: 16px;
  padding: 5px 0;
  padding-left: 20px;
  display: flex;
  justify-content: space-between;
  span {
    font-weight: 400;
    padding-right: 5px;
  }
  .pack {
    color: #2b7efc;
    cursor: pointer;
  }
}
.upload-demo {
  margin-left: 25px;
}
.show {
  font-weight: 700;
  padding-left: 40px;
}
::v-deep .el-row {
  font-size: 14px;
}
.active {
  color: #007bfe;
  cursor: pointer;
  text-decoration: underline;
}
.table {
  padding: 20px;
}
.drawer-title {
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 32px;
  padding: 20px 20px 0;
}
.submit {
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-row {
  flex-wrap: wrap;
}
.box-header {
  margin-bottom: 20px;
  background-color: #fff;
  .title {
    color: #55566d;
    font-weight: bold;
    height: 30px;
    text-align: left;
    font-size: 16px;
    padding-left: 20px;
    border-bottom: 1px solid #ececec;
  }
  ::v-deep .el-step__head.is-success {
    color: #0c7de0;
    border-color: #0c7de0;
  }

  ::v-deep .el-step__description.is-success {
    color: #adadad;
  }
  ::v-deep .el-step__icon-inner[class*="el-icon"]:not(.is-status),
  ::v-deep .el-step__icon {
    font-size: 16px;
    color: #0c7de0;
  }

  ::v-deep .el-step__title.is-process,
  ::v-deep .el-step__title.is-success,
  ::v-deep .el-step__title.is-wait {
    font-weight: 400;
    color: #0c7de0;
  }

  ::v-deep .el-step__line {
    background-color: #0c7de0;
  }
}
</style>
