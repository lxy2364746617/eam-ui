<template>
  <div class="app-container">
    <div>
      <!-- <div class="mb20" style="background-color: #fff;">供应商管理</div> -->
      <jm-table
        :tableData="templateList"
        @getList="getList"
        @handleSelectionChange="handleSelectionChange"
        @switchchange="switchchange"
        @selectchange="selectchange"
        :isRadio="isRadio"
        :total="total"
        :handleWidth="120"
        :columns="tablecolumns"
        ref="jmTable">
        <template slot="headerLeft">
          <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['equipment:template:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['equipment:book:add']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['equipment:book:add']"
            >下载</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['equipment:template:remove']"
            >删除</el-button>
          </el-col> -->
        </template>
        <template #end_handle="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row,'view')"
            v-hasPermi="['equipment:template:edit']"
          >查看</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'edit')"
            v-hasPermi="['equipment:template:edit']"
          >编辑</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:template:remove']"
          >删除</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-document-add"
            @click="handleSet(scope.row)"
            v-hasPermi="['equipment:template:edit']"
          >设置字段</el-button> -->
        </template>
      </jm-table>
  
      <!-- 添加或修改设备平台_表单模板对话框 -->
      <!-- <el-drawer
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        size="40%"
        :wrapperClosable="false"
        :before-close="handleClose">
        <jm-form 
          class="mr20"
          :columns="columns" 
          :formData="formData" 
          @submitForm="submitForm" 
          ref="jmform"
          :disabled="disabled">
          <template #footer>
            <div style="text-align: center;">
              <el-button size="mini" @click="drawer=false">取消</el-button>
              <el-button size="mini" @click="saveHandle" type="primary" v-if="!disabled">保存</el-button>
            </div>
          </template>
        </jm-form>
      </el-drawer> -->

      <!-- 导入 -->
      <!-- <file-import 
        @handleFileSuccess="handleFileSuccess"
        :downloadTemplateUrl="'/system/supplier/importTemplate'"
        ref="fileImport"
        :importUrl="'/system/supplier/importData'">
      </file-import> -->
    </div>
    <div style="position: absolute;bottom: 0px;width: 100%;background-color: #fff;text-align: center;padding: 20px;border-top: 1px solid #ddd;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitRadio" type="primary" :disabled="multiple">确定</el-button>
    </div>
  </div>
</template>

<script>
import { listSupplier, getSupplier, delSupplier, addSupplier, updateSupplier, importSupplier } from "@/api/system/supplier";
import JmTable from "@/components/JmTable";
import JmForm from "@/components/JmForm";
import child from "@/views/formTemplate/child";
import fileImport from "@/components/FileImport";

export default {
  name: "Template",
  dicts: ['system_supplier_level','system_supplier_type','system_supplier_statue'],
  components: { JmTable, JmForm, child, fileImport },
  computed:{
    // 列信息
    columns(){
      return [
        { label: "供应商名称", prop: "supplierName", required: true, span:24,   },
        { label: "供应商编码", prop: "supplierCode", required: true, span:24,   },
        { label: "简称", prop: "simpleName", span:24,  },
        { label: "简码", prop: "simpleCode", span:24,  },
        { label: "重要等级", prop: "supplierLevel", formType: 'select', options: this.dict.type.system_supplier_level, required: true, span:24,   },
        { label: "类型", prop: "supplierType", formType: 'select', options: this.dict.type.system_supplier_type, required: true, span:24,   },
        { label: "联系人", prop: "contacts", span:24,  },
        { label: "联系电话", prop: "phone", span:24,  },
        { label: "统一社会信用编码", prop: "societyCode", span:24,  },
        { label: "供应商地址", prop: "supplierAddress", span:24,  },
        { label: "省份", prop: "province", formType: 'select', options: this.provs, span:24, selectfn: ()=>{this.$set(this.formData,'city','') }  },
        { label: "城市", prop: "city", formType: 'select', options: this.cities[this.formData.province]||[], span:24, },
        { label: '备注', prop: 'remark', formType: 'textarea', span:24, },
        { label: '启用状态', prop: 'supplierStatue', formType: 'switch', options: this.dict.type.system_supplier_statue, span:24, formVisible: false, },
        { label: '所属组织', prop: 'supplierOrganization', span:24, formVisible: false, },
        { label: '更新人', prop: 'updateBy', span:24, formVisible: false, },
        { label: '更新时间', prop: 'updateTime', span:24, formVisible: false, formType: 'date' },
      ]
    },
    // 列信息
    tablecolumns(){
      return [
        { label: "供应商名称", prop: "supplierName", required: true, span:24,   },
        { label: "供应商编码", prop: "supplierCode", required: true, span:24,   },
        { label: "简称", prop: "simpleName", span:24,  },
        { label: "简码", prop: "simpleCode", span:24,  },
        { label: "重要等级", prop: "supplierLevel", formType: 'select', options: this.dict.type.system_supplier_level, required: true, span:24,   },
        { label: "类型", prop: "supplierType", formType: 'select', options: this.dict.type.system_supplier_type, required: true, span:24,   },
        { label: "联系人", prop: "contacts", span:24,  },
        { label: "联系电话", prop: "phone", span:24,  },
        { label: "统一社会信用编码", prop: "societyCode", span:24,  },
        { label: "供应商地址", prop: "supplierAddress", span:24,  },
        { label: "省份", prop: "province", formType: 'select', options: this.provs, span:24,  },
        { label: "城市", prop: "city", formType: 'select', options: this.cities[this.tableprovs]||[], span:24, },
        { label: '备注', prop: 'remark', formType: 'textarea', span:24, },
        { label: '启用状态', prop: 'supplierStatue', formType: 'switch', options: this.dict.type.system_supplier_statue, span:24, formVisible: false, },
        { label: '所属组织', prop: 'supplierOrganization', span:24, formVisible: false, },
        { label: '更新人', prop: 'updateBy', span:24, formVisible: false, },
        { label: '更新时间', prop: 'updateTime', span:24, formVisible: false, formType: 'date' },
      ]
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formData:{},
      nowclickitem: '',
      disabled: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      drawer: false,
      drawer2: false,
      direction: 'rtl',
      // 设备平台_表单模板表格数据
      templateList: [],
      // 弹出层标题
      title: "新增表单",
      // 是否显示弹出层
      open: false,
      importData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      radioRow: {},
      checkBoxRows: [],
      // 表单校验
      rules: {
      },
      provs: [{"label":"北京","value":"北京"},{"label":"深圳","value":"深圳"},{"label":"上海","value":"上海"},{"label":"重庆","value":"重庆"},{"label":"天津","value":"天津"},{"label":"广东","value":"广东"},{"label":"河北","value":"河北"},{"label":"山西","value":"山西"},{"label":"内蒙古","value":"内蒙古"},{"label":"辽宁","value":"辽宁"},{"label":"吉林","value":"吉林"},{"label":"黑龙江","value":"黑龙江"},{"label":"江苏","value":"江苏"},{"label":"浙江","value":"浙江"},{"label":"安徽","value":"安徽"},{"label":"福建","value":"福建"},{"label":"江西","value":"江西"},{"label":"山东","value":"山东"},{"label":"河南","value":"河南"},{"label":"湖北","value":"湖北"},{"label":"广西","value":"广西"},{"label":"海南","value":"海南"},{"label":"四川","value":"四川"},{"label":"贵州","value":"贵州"},{"label":"云南","value":"云南"},{"label":"西藏","value":"西藏"},{"label":"陕西","value":"陕西"},{"label":"甘肃","value":"甘肃"},{"label":"青海","value":"青海"},{"label":"宁夏","value":"宁夏"},{"label":"新疆","value":"新疆"},{"label":"香港","value":"香港"},{"label":"澳门","value":"澳门"},{"label":"台湾","value":"台湾"}],
      cities: {"河北":[{"label":"石家庄","value":"石家庄"},{"label":"张家口市","value":"张家口市"},{"label":"承德市","value":"承德市"},{"label":"秦皇岛市","value":"秦皇岛市"},{"label":"唐山市","value":"唐山市"},{"label":"廊坊市","value":"廊坊市"},{"label":"保定市","value":"保定市"},{"label":"沧州市","value":"沧州市"},{"label":"衡水市","value":"衡水市"},{"label":"邢台市","value":"邢台市"},{"label":"邯郸市","value":"邯郸市"}],"山西":[{"label":"太原市","value":"太原市"},{"label":"大同市","value":"大同市"},{"label":"朔州市","value":"朔州市"},{"label":"阳泉市","value":"阳泉市"},{"label":"长治市","value":"长治市"},{"label":"晋城市","value":"晋城市"},{"label":"忻州地区","value":"忻州地区"},{"label":"吕梁地区","value":"吕梁地区"},{"label":"晋中市","value":"晋中市"},{"label":"临汾地区","value":"临汾地区"},{"label":"运城地区","value":"运城地区"}],"北京":[{"label":"东城区","value":"东城区"},{"label":"西城区","value":"西城区"},{"label":"崇文区","value":"崇文区"},{"label":"宣武区","value":"宣武区"},{"label":"朝阳区","value":"朝阳区"},{"label":"海淀区","value":"海淀区"},{"label":"丰台区","value":"丰台区"},{"label":"石景山","value":"石景山"}],"深圳":[{"label":"罗湖","value":"罗湖"},{"label":"福田","value":"福田"},{"label":"南山","value":"南山"},{"label":"盐田","value":"盐田"},{"label":"宝安","value":"宝安"},{"label":"龙岗","value":"龙岗"}],"上海":[{"label":"宝山","value":"宝山"},{"label":"金山","value":"金山"},{"label":"南市","value":"南市"},{"label":"长宁","value":"长宁"},{"label":"静安","value":"静安"},{"label":"青浦","value":"青浦"},{"label":"崇明","value":"崇明"},{"label":"卢湾","value":"卢湾"},{"label":"松江","value":"松江"},{"label":"奉贤","value":"奉贤"},{"label":"浦东","value":"浦东"},{"label":"杨浦","value":"杨浦"},{"label":"虹口","value":"虹口"},{"label":"普陀","value":"普陀"},{"label":"闸北","value":"闸北"},{"label":"黄浦","value":"黄浦"},{"label":"闵行","value":"闵行"},{"label":"徐汇","value":"徐汇"},{"label":"嘉定","value":"嘉定"},{"label":"南汇","value":"南汇"}],"天津":[{"label":"天津市区","value":"天津市区"},{"label":"天津市辖区","value":"天津市辖区"}],"重庆":[{"label":"重庆市区","value":"重庆市区"},{"label":"重庆市辖区","value":"重庆市辖区"}],"辽宁":[{"label":"沈阳市","value":"沈阳市"},{"label":"大连市","value":"大连市"},{"label":"鞍山市","value":"鞍山市"},{"label":"抚顺市","value":"抚顺市"},{"label":"本溪市","value":"本溪市"},{"label":"丹东市","value":"丹东市"},{"label":"锦州市","value":"锦州市"},{"label":"营口市","value":"营口市"},{"label":"阜新市","value":"阜新市"},{"label":"辽阳市","value":"辽阳市"},{"label":"盘锦市","value":"盘锦市"},{"label":"铁岭市","value":"铁岭市"},{"label":"朝阳市","value":"朝阳市"},{"label":"葫芦岛市","value":"葫芦岛市"}],"吉林":[{"label":"长春市","value":"长春市"},{"label":"吉林市","value":"吉林市"},{"label":"四平市","value":"四平市"},{"label":"辽源市","value":"辽源市"},{"label":"通化市","value":"通化市"},{"label":"白山市","value":"白山市"},{"label":"松原市","value":"松原市"},{"label":"白城市","value":"白城市"},{"label":"延边州","value":"延边州"},{"label":"长白山管委会","value":"长白山管委会"}],"黑龙江":[{"label":"哈尔滨市","value":"哈尔滨市"},{"label":"齐齐哈尔市","value":"齐齐哈尔市"},{"label":"大庆市","value":"大庆市"},{"label":"佳木斯市","value":"佳木斯市"},{"label":"牡丹江市","value":"牡丹江市"},{"label":"七台河市","value":"七台河市"},{"label":"双鸭山市","value":"双鸭山市"},{"label":"黑河市","value":"黑河市"},{"label":"鸡西市","value":"鸡西市"},{"label":"伊春市","value":"伊春市"},{"label":"绥化市","value":"绥化市"},{"label":"鹤岗市","value":"鹤岗市"},{"label":"加格达奇市","value":"加格达奇市"}],"江苏":[{"label":"南京市","value":"南京市"},{"label":"苏州市","value":"苏州市"},{"label":"无锡市","value":"无锡市"},{"label":"常州市","value":"常州市"},{"label":"南通市","value":"南通市"},{"label":"扬州市","value":"扬州市"},{"label":"镇江市","value":"镇江市"},{"label":"泰州市","value":"泰州市"},{"label":"盐城市","value":"盐城市"},{"label":"连云港市","value":"连云港市"},{"label":"宿迁市","value":"宿迁市"},{"label":"淮安市","value":"淮安市"},{"label":"徐州市","value":"徐州市"}],"浙江":[{"label":"杭州市","value":"杭州市"},{"label":"宁波市","value":"宁波市"},{"label":"温州市","value":"温州市"},{"label":"嘉兴市","value":"嘉兴市"},{"label":"湖州市","value":"湖州市"},{"label":"绍兴市","value":"绍兴市"},{"label":"金华市","value":"金华市"},{"label":"衢州市","value":"衢州市"},{"label":"舟山市","value":"舟山市"},{"label":"台州市","value":"台州市"},{"label":"丽水市","value":"丽水市"}],"安徽":[{"label":"合肥市","value":"合肥市"},{"label":"芜湖市","value":"芜湖市"},{"label":"蚌埠市","value":"蚌埠市"},{"label":"淮南市","value":"淮南市"},{"label":"马鞍山市","value":"马鞍山市"},{"label":"淮北市","value":"淮北市"},{"label":"铜陵市","value":"铜陵市"},{"label":"安庆市","value":"安庆市"},{"label":"黄山市","value":"黄山市"},{"label":"滁州市","value":"滁州市"},{"label":"阜阳市","value":"阜阳市"},{"label":"宿州市","value":"宿州市"},{"label":"巢湖市","value":"巢湖市"},{"label":"六安市","value":"六安市"},{"label":"亳州市","value":"亳州市"},{"label":"池州市","value":"池州市"},{"label":"宣城市","value":"宣城市"}],"福建":[{"label":"福州市","value":"福州市"},{"label":"厦门市","value":"厦门市"},{"label":"莆田市","value":"莆田市"},{"label":"三明市","value":"三明市"},{"label":"泉州市","value":"泉州市"},{"label":"漳州市","value":"漳州市"},{"label":"南平市","value":"南平市"},{"label":"龙岩市","value":"龙岩市"},{"label":"宁德市","value":"宁德市"}],"江西":[{"label":"南昌市","value":"南昌市"},{"label":"景德镇市","value":"景德镇市"},{"label":"萍乡市","value":"萍乡市"},{"label":"九江市","value":"九江市"},{"label":"新余市","value":"新余市"},{"label":"鹰潭市","value":"鹰潭市"},{"label":"赣州市","value":"赣州市"},{"label":"吉安市","value":"吉安市"},{"label":"宜春市","value":"宜春市"},{"label":"抚州市","value":"抚州市"},{"label":"上饶市","value":"上饶市"}],"山东":[{"label":"济南市","value":"济南市"},{"label":"青岛市","value":"青岛市"},{"label":"淄博市","value":"淄博市"},{"label":"枣庄市","value":"枣庄市"},{"label":"东营市","value":"东营市"},{"label":"烟台市","value":"烟台市"},{"label":"潍坊市","value":"潍坊市"},{"label":"济宁市","value":"济宁市"},{"label":"泰安市","value":"泰安市"},{"label":"威海市","value":"威海市"},{"label":"日照市","value":"日照市"},{"label":"莱芜市","value":"莱芜市"},{"label":"临沂市","value":"临沂市"},{"label":"德州市","value":"德州市"},{"label":"聊城市","value":"聊城市"},{"label":"滨州市","value":"滨州市"},{"label":"菏泽市","value":"菏泽市"}],"河南":[{"label":"郑州市","value":"郑州市"},{"label":"开封市","value":"开封市"},{"label":"洛阳市","value":"洛阳市"},{"label":"平顶山市","value":"平顶山市"},{"label":"安阳市","value":"安阳市"},{"label":"鹤壁市","value":"鹤壁市"},{"label":"新乡市","value":"新乡市"},{"label":"焦作市","value":"焦作市"},{"label":"濮阳市","value":"濮阳市"},{"label":"许昌市","value":"许昌市"},{"label":"漯河市","value":"漯河市"},{"label":"三门峡市","value":"三门峡市"},{"label":"南阳市","value":"南阳市"},{"label":"商丘市","value":"商丘市"},{"label":"信阳市","value":"信阳市"},{"label":"周口市","value":"周口市"},{"label":"驻马店市","value":"驻马店市"}],"湖北":[{"label":"武汉市","value":"武汉市"},{"label":"黄石市","value":"黄石市"},{"label":"十堰市","value":"十堰市"},{"label":"荆州市","value":"荆州市"},{"label":"宜昌市","value":"宜昌市"},{"label":"襄樊市","value":"襄樊市"},{"label":"鄂州市","value":"鄂州市"},{"label":"荆门市","value":"荆门市"},{"label":"孝感市","value":"孝感市"},{"label":"黄冈市","value":"黄冈市"},{"label":"咸宁市","value":"咸宁市"},{"label":"随州市","value":"随州市"}],"湖南":[{"label":"长沙市","value":"长沙市"},{"label":"株洲市","value":"株洲市"},{"label":"湘潭市","value":"湘潭市"},{"label":"衡阳市","value":"衡阳市"},{"label":"邵阳市","value":"邵阳市"},{"label":"岳阳市","value":"岳阳市"},{"label":"常德市","value":"常德市"},{"label":"张家界市","value":"张家界市"},{"label":"益阳市","value":"益阳市"},{"label":"郴州市","value":"郴州市"},{"label":"永州市","value":"永州市"},{"label":"怀化市","value":"怀化市"},{"label":"娄底市","value":"娄底市"}],"广东":[{"label":"广州市","value":"广州市"},{"label":"深圳市","value":"深圳市"},{"label":"珠海市","value":"珠海市"},{"label":"汕头市","value":"汕头市"},{"label":"韶关市","value":"韶关市"},{"label":"佛山市","value":"佛山市"},{"label":"江门市","value":"江门市"},{"label":"湛江市","value":"湛江市"},{"label":"茂名市","value":"茂名市"},{"label":"肇庆市","value":"肇庆市"},{"label":"惠州市","value":"惠州市"},{"label":"梅州市","value":"梅州市"},{"label":"汕尾市","value":"汕尾市"},{"label":"河源市","value":"河源市"},{"label":"阳江市","value":"阳江市"},{"label":"清远市","value":"清远市"},{"label":"东莞市","value":"东莞市"},{"label":"中山市","value":"中山市"},{"label":"潮州市","value":"潮州市"},{"label":"揭阳市","value":"揭阳市"},{"label":"云浮市","value":"云浮市"}],"海南":[{"label":"文昌市","value":"文昌市"},{"label":"琼海市","value":"琼海市"},{"label":"万宁市","value":"万宁市"},{"label":"五指山市","value":"五指山市"},{"label":"东方市","value":"东方市"},{"label":"儋州市","value":"儋州市"}],"四川 ":[{"label":"成都市","value":"成都市"},{"label":"自贡市","value":"自贡市"},{"label":"攀枝花市","value":"攀枝花市"},{"label":"泸州市","value":"泸州市"},{"label":"德阳市","value":"德阳市"},{"label":"绵阳市","value":"绵阳市"},{"label":"广元市","value":"广元市"},{"label":"遂宁市","value":"遂宁市"},{"label":"内江市","value":"内江市"},{"label":"乐山市","value":"乐山市"},{"label":"南充市","value":"南充市"},{"label":"眉山市","value":"眉山市"},{"label":"宜宾市","value":"宜宾市"},{"label":"广安市","value":"广安市"},{"label":"达州市","value":"达州市"},{"label":"雅安市","value":"雅安市"},{"label":"巴中市","value":"巴中市"},{"label":"资阳市","value":"资阳市"}],"贵州":[{"label":"贵阳市","value":"贵阳市"},{"label":"六盘水市","value":"六盘水市"},{"label":"遵义市","value":"遵义市"},{"label":"安顺市","value":"安顺市"}],"云南":[{"label":"昆明市","value":"昆明市"},{"label":"曲靖市","value":"曲靖市"},{"label":"玉溪市","value":"玉溪市"},{"label":"保山市","value":"保山市"},{"label":"昭通市","value":"昭通市"},{"label":"丽江市","value":"丽江市"},{"label":"普洱市","value":"普洱市"},{"label":"临沧市","value":"临沧市"}],"陕西":[{"label":"西安市","value":"西安市"},{"label":"铜川市","value":"铜川市"},{"label":"宝鸡市","value":"宝鸡市"},{"label":"咸阳市","value":"咸阳市"},{"label":"渭南市","value":"渭南市"},{"label":"延安市","value":"延安市"},{"label":"汉中市","value":"汉中市"},{"label":"榆林市","value":"榆林市"},{"label":"安康市","value":"安康市"},{"label":"商洛市","value":"商洛市"}],"甘肃":[{"label":"兰州市","value":"兰州市"},{"label":"金昌市","value":"金昌市"},{"label":"白银市","value":"白银市"},{"label":"天水市","value":"天水市"},{"label":"嘉峪关市","value":"嘉峪关市"},{"label":"武威市","value":"武威市"},{"label":"张掖市","value":"张掖市"},{"label":"平凉市","value":"平凉市"},{"label":"酒泉市","value":"酒泉市"},{"label":"庆阳市","value":"庆阳市"},{"label":"定西市","value":"定西市"},{"label":"陇南市","value":"陇南市"}],"青海":[{"label":"西宁市","value":"西宁市"}],"台湾":[{"label":"台北市","value":"台北市"},{"label":"高雄市","value":"高雄市"},{"label":"基隆市","value":"基隆市"},{"label":"台中市","value":"台中市"},{"label":"台南市","value":"台南市"},{"label":"新竹市","value":"新竹市"},{"label":"嘉义市","value":"嘉义市"}],"广西":[{"label":"南宁市","value":"南宁市"},{"label":"柳州市","value":"柳州市"},{"label":"桂林市","value":"桂林市"},{"label":"梧州市","value":"梧州市"},{"label":"北海市","value":"北海市"},{"label":"防城港市","value":"防城港市"},{"label":"钦州市","value":"钦州市"},{"label":"贵港市","value":"贵港市"},{"label":"玉林市","value":"玉林市"},{"label":"百色市","value":"百色市"},{"label":"贺州市","value":"贺州市"},{"label":"河池市","value":"河池市"},{"label":"来宾市","value":"来宾市"},{"label":"崇左市","value":"崇左市"}],"内蒙古":[{"label":"呼和浩特市","value":"呼和浩特市"},{"label":"包头市","value":"包头市"},{"label":"乌海市","value":"乌海市"},{"label":"赤峰市","value":"赤峰市"},{"label":"通辽市","value":"通辽市"},{"label":"鄂尔多斯市","value":"鄂尔多斯市"},{"label":"呼伦贝尔市","value":"呼伦贝尔市"},{"label":"巴彦淖尔市","value":"巴彦淖尔市"},{"label":"乌兰察布市","value":"乌兰察布市"}],"西藏":[{"label":"拉萨市","value":"拉萨市"}],"宁夏":[{"label":"银川市","value":"银川市"},{"label":"石嘴山市","value":"石嘴山市"},{"label":"吴忠市","value":"吴忠市"},{"label":"固原市","value":"固原市"},{"label":"中卫市","value":"中卫市"}],"新疆":[{"label":"乌鲁木齐市","value":"乌鲁木齐市"},{"label":"克拉玛依市","value":"克拉玛依市"}],"香港":[{"label":"台北市","value":"台北市"},{"label":"高雄市","value":"高雄市"},{"label":"基隆市","value":"基隆市"},{"label":"台中市","value":"台中市"},{"label":"台南市","value":"台南市"},{"label":"新竹市","value":"新竹市"},{"label":"嘉义市","value":"嘉义市"}]},
      tableprovs: '',
    };
  },
  props: {
    isRadio: {
      default: true,
      type: Boolean,
    }
  },
  created() {
    this.getList(this.queryParams);
  },
  methods: {
    close(){
      this.$emit('close')
    },
    submitRadio(){
      if(this.isRadio){
        // 单选
        this.$emit('submitRadio',this.radioRow)
      }else{
        // 多选
        this.$emit('submitRadio',this.checkBoxRows)
      }
    },
    handleImport(){
      this.$refs.fileImport.upload.open=true
    },
    handleFileSuccess(){
      this.getList(this.queryParams);
    },
    uploadChange(val){
      this.importData = val
    },
    selectchange(val,prop){
      if(prop=='province'){
        this.tableprovs = val
        delete this.$refs.jmTable.queryParams.city
      }
    },
    switchchange(val,prop,row){
      this.submitForm(row)
    },
    saveHandle() {
      this.$refs.jmform.submitForm()
    },
    saveHandle2() {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      importSupplier(this.importData).then(response => {
        loading.close();
        this.$modal.msgSuccess("上传成功");
        this.getList(this.queryParams)
      });
    },
    handleClose(done){
      done()
    },
    /** 查询设备平台_表单模板列表 */
    getList(queryParams) {
      this.loading = true;
      listSupplier(queryParams).then(response => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        templateId: null,
        templateName: null,
        templateCode: null,
        templateType: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
      this.radioRow = selection[0]
      this.checkBoxRows = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.drawer = true;
      this.title = "新增表单模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row,state) {
      this.disabled = state=='view'?true:false
      // const id = row.id
      // getSupplier(id).then(response => {
        this.formData = JSON.parse(JSON.stringify(row));
        this.title = state=='view'?"查看表单模板":"修改表单模板";
        this.drawer = true;
      // });
    },
    /** 提交按钮 */
    submitForm: function(formdata) {
      if (formdata.id != undefined) {
        updateSupplier(formdata).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.drawer = false;
          this.getList();
        });
      } else {
        addSupplier(formdata).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.drawer = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除设备平台_表单模板编号为"' + ids + '"的数据项？').then(function() {
        return delSupplier(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    // 设置字段
    handleSet(row){
      this.nowclickitem = row
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/supplier/export', {
        ...this.queryParams
      }, `供应商_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
