<template>
  <div>
    <div class="title">
      设备列表
      <el-button
        v-if="!disabled"
        type="text"
        icon="el-icon-edit"
        @click="handleAdd"
        style="margin-left: auto"
        >添加</el-button
      >
      <el-button
        v-if="!disabled"
        type="text"
        icon="el-icon-delete"
        @click="allDelete"
        >批量删除</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="lineList"
      @selection-change="handleSelectionChange"
      ref="queryTable"
      row-key="deviceCode"
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
          <span class="active">{{ scope.row.deviceCode }}</span>
        </template>
      </el-table-column>
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
        label="设备类别"
        align="center"
        prop="categoryName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="功能位置"
        align="center"
        prop="location"
        min-width="150"
      >
        <!-- <template slot-scope="scope">
            <span>{{ findTreeName(locationOptions, scope.row.location) }}</span>
          </template> -->
      </el-table-column>
      <el-table-column
        label="所属子公司"
        align="center"
        prop="subCompanyName"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="所属组织"
        align="center"
        prop="affDeptName"
        min-width="150"
      />
      <el-table-column label="是否特种设备" align="center" prop="isSpecial">
        <template slot-scope="scope">
          <span v-html="scope.row.isSpecial === 'Y' ? '是' : '否'"></span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="!disabled"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope)"
            v-hasPermi="['maintain:mline:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改设备平台_表单模板对话框 -->
    <el-drawer
      title="选择设备"
      :visible.sync="form.choosedrawer"
      direction="rtl"
      size="80%"
      :wrapperClosable="false"
    >
      <parentdevice
        :isChoose="false"
        @submitRadio="submitRadio2"
        @close="form.choosedrawer = false"
        :formData="form"
        v-if="form.choosedrawer"
      >
      </parentdevice>
    </el-drawer>
  </div>
</template>
<script>
import parentdevice from "@/views/device/book/device";
import { getMline, findByDeviceId, larchivesList } from "@/api/maintain/mline";
import Sortable from "sortablejs";
import { getWomDevice } from "@/api/work/schedule";
import { getLocationTree } from "@/api/Location";
export default {
  components: { parentdevice },
  dicts: ["em_device_state", "em_is_special"],
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    formData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      btnLoading: false,

      lineList: [],
      // 表单参数
      form: {
        choosedrawer: false,
        lineCode: "",
        lineName: "",
        lineStatus: "0",
        lineId: 1,
      },
      locationOptions: [],
    };
  },

  watch: {
    lineList: {
      handler(val) {
        if (val) {
          this.$emit("womDevices", val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    getLocationTree().then((res) => {
      this.locationOptions = this.getTree(res.data);
    });
    if (this.formData.orderCode) {
      getWomDevice({ orderCode: this.formData.orderCode, lineCode: "" }).then(
        (res) => {
          this.lineList = res.data;
        }
      );
    }
  },
  mounted() {
    const el = this.$refs.queryTable.$el.querySelectorAll(
      ".el-table__body-wrapper > table > tbody"
    )[0];
    this.sortable = Sortable.create(el, {
      onEnd: (e) => {
        //onEnd是结束拖拽时触发，onUpdate是列表内元素顺序更新的时候触发，更多请看文末配置项 //e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
        const targetRow = this.lineList.splice(e.oldIndex, 1)[0];
        this.lineList.splice(e.newIndex, 0, targetRow);
        let dragId = this.lineList[e.newIndex].deviceCode; //拖动行的id
        let oneId, twoId; //拖动行的前一行
        if (this.lineList[e.newIndex - 1]) {
          oneId = this.lineList[e.newIndex - 1].id;
        } else {
          oneId = "";
        } //拖动行的后一行
        if (this.lineList[e.newIndex + 1]) {
          twoId = this.lineList[e.newIndex + 1].id;
        } else {
          twoId = "";
        }
        console.log("拖动行：" + dragId);
        console.log("前一行：" + oneId);
        console.log("后一行：" + twoId); //然后就可以发送请求了......
      },
    });
  },
  computed: {},
  methods: {
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
    getTree(arr) {
      arr.forEach((item) => {
        item.value = item.deptId;
        item.label = item.deptName;
        item.isDisabled = item.locationFlag == "N" ? true : false;
        if (item.children && item.children.length > 0) {
          this.getTree(item.children);
        }
      });
      return arr;
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      var that = this;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          that.lineList.splice(scope.$index, 1);
        })
        .catch(() => {});
    },
    /** 查询设备平台_表单模板列表 */
    getDetails(queryParams) {
      this.loading = true;
      getMline(queryParams)
        .then((response) => {
          this.form = response.data;
          // if (mroMaintainLineArchivesList.length > 0) {
          larchivesList({ lineId: this.form.lineId }).then((res) => {
            this.lineList = res.data || [];
          });
          // }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$set(this.form, "choosedrawer", true);
      let lineIds = this.lineList.map((item) => item.deviceId) || [];
      this.$set(this.form, "disIds", lineIds);
    },
    allDelete() {
      var that = this;
      if (this.selectArr.length == 0) {
        this.$modal.msgWarning("请至少选择一项");
      } else {
        console.log(
          that.selectArr[0],
          that.lineList[0],
          that.selectArr[0] == that.lineList[0]
        );
        this.$modal
          .confirm("是否确认删除？")
          .then(function () {
            that.selectArr.forEach((element) => {
              let index = that.lineList.indexOf(element);
              that.lineList.splice(index, 1);
            });
          })
          .catch(() => {});
      }
    },
    handleSelectionChange(selection) {
      this.selectArr = selection;
    },
    submitRadio2(row) {
      let deviceIds = row.map((item) => item.deviceId);
      let formData = new FormData();
      formData.append("deviceIds", deviceIds.toString());
      // Object.keys(data).forEach((key) => {
      //     formData.append(key, data[key]);
      // });
      findByDeviceId(formData).then((res) => {
        this.lineList = this.lineList.concat(res.data);
      });
      this.$set(this.form, "choosedrawer", false);
    },
  },
};
</script>
<style lang='scss' scoped>
.title {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 30px;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 18px;
}
</style>
