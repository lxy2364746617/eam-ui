<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-popover
          placement="bottom"
          title=""
          width="200"
          trigger="click">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="value" @change="showColumn">
            <div v-for="item in columns" :key="item.prop">
              <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
            </div>
          </el-checkbox-group>
          <el-button slot="reference" size="mini" circle icon="el-icon-menu"/>
        </el-popover>
      </el-tooltip>
      <slot name="right_end"></slot>
    </el-row>
    <!-- <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "显示/隐藏",
      // 是否显示弹出层
      open: false,
      isIndeterminate: true,
      checkAll: false,
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: true,
    },
    gutter: {
      type: Number,
      default: 10,
    },
    tableVisible: {
      type: Object,
    }
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginRight = `${this.gutter / 2}px`;
      }
      return ret;
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    this.setVisible()
  },
  methods: {
    setVisible(){
      for (let item in this.tableVisible) {
        if (this.tableVisible[item]) {
          this.value.push(item);
        }
      }
      let checkedCount = this.value.length;
      this.checkAll = checkedCount === this.columns.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length;
    },
    handleCheckAllChange(val) {
      this.value = val ? Object.keys(this.tableVisible) : [];
      this.isIndeterminate = false;
      for (let key in this.tableVisible) {
        this.$set(this.tableVisible,key,this.value.includes(key))
      }
    },
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 右侧列表元素变化
    // dataChange(data) {
    //   for (let item in this.columns) {
    //     const key = this.columns[item].key;
    //     this.columns[item].tableVisible = !data.includes(key);
    //   }
    // },
    // 处理显隐列
    showColumn(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.columns.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length;

      for (let key in this.tableVisible) {
        this.$set(this.tableVisible,key,val.includes(key))
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
