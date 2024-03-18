<template>
  <div class="app-container" style="padding-top: 0;">
    <jm-table :tableData="itemList" @getList="getList" @handleSelectionChange="handleSelectionChange" :total="total"
      ref="jmtable" :handleWidth="230" :columns="columns" :isRadio="isChoose" >
    </jm-table>
    <div style="width: 100%; height: 68px;"></div>
    <div
      style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
  </div>
</template>

<script>
import {
  listPline,
} from '@/api/maintain/pline'
import JmTable from "@/components/JmTable";

export default {
  name: "pointItem",
  dicts: ['mro_item_method', 'mro_item_type', 'sys_normal_disable'],
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
        { label: '巡点检路线编码', prop: 'lineCode', class: true },
        { label: '巡点检路线名称', prop: 'lineName', },
        { label: '启用状态', prop: 'lineStatus', formType: 'select', options: this.dict.type.sys_normal_disable, span: 24, formVisible: false, },
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
        lineCode: null,
        lineName: null,
        lineStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      listPline(queryParams).then((response) => {
        response.rows.forEach(item=>{
          item.lineStatus=='1'&&(item.selectDisable=true)
        })
        this.itemList = response.rows.filter(item => {
          if (this.formData.disIds.includes(item.lineId)) {
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