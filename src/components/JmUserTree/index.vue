<template>
    <div class="eltree">
        <div class="head-container">
        <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 10px"
        />
        </div>
        <slot name="middle-pos"></slot>
        <div class="head-container">
          <el-tree
              :data="treeData"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
          />
        </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: "JmUserTree",
    props: {
        // 部门树选项
        treeData: {
            type:Array,
            default:() => ([])
        }
    },
    data() {
      return {
        // 部门名称
        deptName: undefined,
        defaultProps: {
          children: "children",
          label: "label"
        },
      };
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      },
      treeData(val){
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(val[0].id);
          this.$emit('handleNodeClick',val[0]);
          // const firstNode = document.querySelector('.el-tree-node');
          // if(firstNode){
          //   firstNode.click();
          // }
        })
      }
    },
    created() {
    },
    mounted(){
      
    },
    methods: {
      
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.$emit('handleNodeClick',data);
      },
    }
  };
  </script>
  <style scoped lang="scss">
    .eltree{
      border: 1px solid #007bfe;
      border-radius: 6px;
      height: 100%;
      padding: 15px;
      background-color: #f7fbff;
      overflow: auto;
      ::v-deep .is-current>.el-tree-node__content{
        background-color: #007bfe!important;
        color: #fff!important;
      }
    }
  </style>