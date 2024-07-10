
<template>
  <Wrapper>
    <el-tabs class="table" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in [
          '采煤机',
          '刮板输送机',
          '掘进机',
          '皮带运输机',
          '液压支架',
        ]"
        :key="item"
        :label="item"
        :name="index + ''"
      >
        <ContTable
          :tableData="equipmentList"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
          :total="total"
          ref="jmtable"
          :isRadio="false"
          :handleWidth="230"
          :columns="columns"
          :showOperate="false"
        >
          <template slot="headerLeft">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-download" size="mini"
                >导出</el-button
              >
            </el-col>
          </template>
        </ContTable></el-tab-pane
      >
    </el-tabs>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import ContTable from "@/components/ContTable";
export default {
  components: { Wrapper, ContTable },
  data() {
    return {
      equipmentList: [],
      total: 0,
      loading: true,
      activeName: "0",
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  computed: {
    columns() {
      return [
        {
          label: "子分公司",
          prop: "item1",
          tableVisible: true,
        },
        {
          label: "设备类型",
          prop: "item2",
          tableVisible: true,
        },
        {
          label: "规格型号",
          prop: "item3",
          tableVisible: true,
          width: 200,
        },
        {
          label: "数量",
          prop: "item4",
          tableVisible: true,
        },
        {
          label: "产权组织",
          prop: "item5",
          tableVisible: true,
          width: 250,
        },
        {
          label: "设备状态",
          prop: "item6",
          tableVisible: true,
        },
        {
          label: "使用地点",
          prop: "item7",
          tableVisible: true,
        },
        {
          label: "制造商",
          prop: "item8",
          tableVisible: true,
          width: 200,
        },
      ];
    },
  },
  methods: {
    handleClick(tab, event) {
      this.getList();
    },
    handleSelectionChange() {},
    getList(queryParams) {
      //   this.loading = true;
      if (this.activeName === "0") {
        this.equipmentList = [
          {
            item1: "西山",
            item2: "采煤机",
            item3: "MG1000/2660-WD",
            item4: "1",
            item5: "斜沟煤矿",
            item6: "闲置",
            item7: "机电科库房",
            item8: "太重煤机有限公司",
          },
          {
            item1: "西山",
            item2: "采煤机",
            item3: "MG200/500",
            item4: "1",
            item5: "山西离石西山晋邦德煤业有限责任公司",
            item6: "闲置",
            item7: "晋邦德煤业",
            item8: "",
          },
          {
            item1: "西山",
            item2: "采煤机",
            item3: "MG500-1140-WD",
            item4: "1",
            item5: "股份",
            item6: "待修",
            item7: "西山租赁公司",
            item8: "上海创立集团股份有限责任公司",
          },
          {
            item1: "西山",
            item2: "采煤机",
            item3: "MG500-1140-WD",
            item4: "1",
            item5: "股份",
            item6: "待修",
            item7: "西山租赁公司",
            item8: "上海创立集团股份有限责任公司",
          },
          {
            item1: "霍州",
            item2: "采煤机",
            item3: "MGTY750/1800-3.3",
            item4: "1",
            item5: "霍宝干河煤矿",
            item6: "待报废",
            item7: "机电科",
            item8: "太原矿山机器集团有限公司",
          },
          {
            item1: "霍州",
            item2: "采煤机",
            item3: "MG500/1200-WD",
            item4: "1",
            item5: "木瓜煤矿",
            item6: "租出",
            item7: "2-2131",
            item8: "太矿重工",
          },
          {
            item1: "霍州",
            item2: "采煤机",
            item3: "M400/930-QWD",
            item4: "1",
            item5: "吕临能化庞庞塔煤矿",
            item6: "待修",
            item7: "库存",
            item8: "上海创力",
          },
          {
            item1: "霍州",
            item2: "采煤机",
            item3: "M400/930-QWD",
            item4: "1",
            item5: "吕临能化庞庞塔煤矿",
            item6: "闲置",
            item7: "库存",
            item8: "",
          },
          {
            item1: "霍州",
            item2: "采煤机",
            item3: "MGTY250-600-WD(小)",
            item4: "1",
            item5: "薛虎沟煤业",
            item6: "闲置",
            item7: "机电库房",
            item8: "太重煤机有限公司",
          },
          {
            item1: "山煤国际煤业分公司",
            item2: "采煤机",
            item3: "MG-160-375-W",
            item4: "1",
            item5: "凌志达",
            item6: "待修",
            item7: "",
            item8: "无锡机械厂",
          },
          //   {
          //     item1: "山煤国际煤业分公司",
          //     item2: "采煤机",
          //     item3: "MG150/345-W",
          //     item4: "1",
          //     item5: "恒兴煤业",
          //     item6: "待修",
          //     item7: "",
          //     item8: "江苏无锡盛达",
          //   },
          //   {
          //     item1: "山煤国际煤业分公司",
          //     item2: "交流电牵引采煤机",
          //     item3: "MG300/730-WD",
          //     item4: "1",
          //     item5: "铺龙湾",
          //     item6: "待修",
          //     item7: "",
          //     item8: "鸡西煤矿机械有限公司",
          //   },
          //   {
          //     item1: "山煤国际煤业分公司",
          //     item2: "采煤机",
          //     item3: "MG-50-375",
          //     item4: "1",
          //     item5: "长春兴",
          //     item6: "待修",
          //     item7: "",
          //     item8: "鸡西煤矿机械有限公司",
          //   },
          //   {
          //     item1: "山煤国际煤业分公司",
          //     item2: "割煤机组",
          //     item3: "MG150/375-W",
          //     item4: "1",
          //     item5: "河曲露天",
          //     item6: "待修",
          //     item7: "",
          //     item8: "鸡西煤矿机械有限公司",
          //   },
        ];
      } else {
        this.equipmentList = null;
      }
      this.total = this.equipmentList ? this.equipmentList.length : 0;

      this.loading = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.table {
  margin-top: 20px;
}
</style>
