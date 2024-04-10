<template>
  <div class="eltree">
    <div class="head-container">
      <el-input v-model="deptName" placeholder="请输入名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 10px" />
    </div>
    <slot name="middle-pos"></slot>
    <slot v-if="$slots['middle-pos']||showSlot"> 
      <el-button v-if="expanded" type="text" icon="el-icon-arrow-up" @click="expandTreeNodeStatus($refs.tree.root)"></el-button>
      <el-button v-else type="text" icon="el-icon-arrow-down" @click="shrinkTreeNodeStatus($refs.tree.root)"></el-button>
    </slot>
    <div class="head-container">
      <el-tree :data="treeData" :props="defaultProps" 
      :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" 
      node-key="id" :default-expand-all='!($slots["middle-pos"]||showSlot)' highlight-current :current-node-key="currentNodeKey"
      :default-expanded-keys="defaultExpIds" @node-click="handleNodeClick" />
    </div>
  </div>
</template>
<script>
export default {
  name: "JmUserTree",
  props: {
    // 部门树选项
    treeData: {
      type: Array,
      default: () => [],
    },
    //默认展开
    defaultExpIds:{
      type:Array,
      default:()=>[]
    },
    currentNodeKey:{
      type:Number,
      default:0
    },
    showSlot:{
      type:Boolean,
      default:false
    },
    //默认点击节点
    setCurrent:{
        type:Boolean,
      default:true
    }
  },
  data() {
    return {
      // 部门名称
      deptName: undefined,
      expanded:true,
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    treeData(val) {
     this.setCurrent&& this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentNodeKey||val[0].id);
        console.log(this.currentNodeKey||val[0].id)
        !this.currentNodeKey&&this.$emit("handleNodeClick", val[0]);
        this.currentNodeKey&&this.$emit("handleNodeClick", this.$refs.tree.getCurrentNode());
        let expandNode =this.$refs.tree.getNode(this.$refs.tree.getCurrentNode()) 
        expandNode&&this.setExpanded(expandNode)
        // const firstNode = document.querySelector('.el-tree-node');
        // if(firstNode){
        //   firstNode.click();
        // }
      });
    },
  },
  mounted() {
   
  },
  methods: {
    //取消选中
    clearChecked(){
      this.$refs.tree.setCurrentKey(null);
      this.$emit('clearChecked')
    },
    setExpanded(node){
      node.expanded=true
      if(node.parent) this.setExpanded(node.parent)
    },
    setCurrentKey(id) {
        this.$refs.tree.setCurrentKey(id);
      },
    expandTreeNodeStatus(node) {
      this.expanded=false
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = false;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.expandTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
    shrinkTreeNodeStatus(node) {
      this.expanded=true
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = true;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.shrinkTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.$emit("handleNodeClick", data);
    },
  },
};
</script>
<style scoped lang="scss">
.eltree {
  border: 1px solid #007bfe;
  border-radius: 6px;
  height: 100%;
  padding: 15px;
  background-color: #f7fbff;
  overflow: auto;
  ::v-deep .is-current > .el-tree-node__content {
    background-color: #007bfe !important;
    color: #fff !important;
  }
}
</style>