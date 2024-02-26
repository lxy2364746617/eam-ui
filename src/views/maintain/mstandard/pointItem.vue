<template>
  <div class="app-container" style="padding-top: 0;">
    <jm-table :tableData="itemList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" :isRadio="isChoose">
    </jm-table>
    <div style="width: 100%; height: 68px;"></div>
    <div
      style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">提交</el-button>
      <el-button size="mini" @click="close">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  listMitem,
} from '@/api/maintain/mitem';
import JmTable from "@/components/JmTable";

export default {
  name: "pointItem",
  dicts: ['BYJX', 'sys_normal_disable'],
  components: { JmTable },
  props: {
    isChoose: {
      default: true,
      type: Boolean,
    },
    formData: {
      default: () => { },
      type: Object,
    },

  },
  computed: {
    // 列信息
    columns() {
      return [
        { label: '保养项编码', prop: 'itemCode' },
        { label: '保养项名称', prop: 'itemName' },
        { label: '保养部位', prop: 'itemArea' },
        { label: '保养类型', prop: 'itemType', formType: 'select', options: this.dict.type.BYJX, },
        { label: '保养内容', prop: 'itemContent',showOverflowTooltip:true },
        { label: '保养工具', prop: 'itemTool', },
        { label: '状态', prop: 'itemStatus', formType: 'selectTag', options: this.dict.type.sys_normal_disable, },
      ]
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      checkBoxRows: [],
      radioRow: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      itemList: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemCode: null,
        itemName: null,
        itemArea: null,
        itemContent: null,
        itemType: null,
        itemTool: null,
        itemStatus: null,
      },
    };
  },
  created() {
    this.getList(this.queryParams)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submitRadio() {
      if (this.isChoose) {
        // 单选
        this.$emit('submitRadio', this.radioRow)
      } else {
        // 多选
        this.$emit('submitRadio', this.checkBoxRows)
      }
    },
    /** 查询用户列表 */
    getList(queryParams) {
      this.loading = true
      listMitem(queryParams).then((response) => {
        this.itemList = response.rows.filter(item => {
          if (this.formData.disIds.includes(item.itemCode)) {
            return false
          } else {
            return true
          }
        });
        this.total = response.total;
        this.loading = false;
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.itemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.radioRow = selection[0]
      this.checkBoxRows = selection;
    },
  }
};
</script>