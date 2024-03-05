<template>
  <div class="box">
    <div class="subtitle">
      <i class="el-icon-caret-right"><span class="icon-text">工单信息</span></i>
      <div>
        <span class="mr20">请求时间：{{ formData.createTime }}</span
        ><span
          v-if="formData.orderType !== 'WWWX'"
          class="pack"
          @click="gzalClick"
          >案例查看</span
        >&nbsp;<span class="pack" @click="openUp">收起</span>
      </div>
    </div>
    <br />
    <el-row v-if="flag">
      <el-col :span="2">
        <img
          :src="process + data.devicePic"
          alt=""
          srcset=""
          style="width: 100%; vertical-align: top; height: 120px"
        />
      </el-col>
      <el-col :span="22">
        <el-col :span="6" class="mb8"
          ><span class="show">工单编码:</span>{{ formData.orderCode }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">工单名称:</span>{{ formData.orderName }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">工单类型:</span
          ><span v-html="findTreeName(orderOptions, formData.orderType)"></span
        ></el-col>
        <el-col :span="6" class="mb8"
          ><span class="show">计划执行日期:</span
          >{{ formData.planExecuteDate }}</el-col
        >

        <el-col :span="6" class="mb8"
          ><span class="show">设备名称:</span>{{ data.deviceName }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">设备编码:</span>{{ data.deviceCode }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">规格型号:</span>{{ data.specs }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">设备类别:</span>{{ data.deviceTypeName }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">功能位置(工作面):</span
          >{{ data.location }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">当前使用组织:</span>{{ data.currDept }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">所属组织:</span>{{ data.affDept }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">设备状态:</span
          ><span
            v-html="findName(dict.type.em_device_state, data.deviceStatus)"
          ></span
        ></el-col>
        <el-col :span="6" class="mb8"
          ><span class="show">故障部件:</span
          >{{ faultInfoDTO.faultLocation }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">故障等级:</span
          >{{ faultInfoDTO.faultGrade }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">故障时间:</span
          >{{ faultInfoDTO.faultDate }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show"> 是否特种设备:</span
          >{{ data.specialFlag === "Y" ? "是" : "否" }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">故障类型:</span
          >{{ faultInfoDTO.faultType }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">是否停机:</span
          >{{ faultInfoDTO.haltFlag == 0 ? "否" : "是" }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">请求人员:</span>{{ formData.createBy }}</el-col
        >
        <el-col :span="6" class="mb8"
          ><span class="show">联系方式:</span>{{ data.phoneNumber }}</el-col
        >
        <el-col :span="24" class="mb8"
          ><span class="show">故障描述:</span
          >{{ faultInfoDTO.faultInfo }}</el-col
        >
        <el-col :span="12" class="mb8"
          ><span class="show mr20">故障图片:</span>
          <img
            v-for="item in faultInfoDTO.fileList"
            :key="item.id"
            :src="process + item.fileName"
            alt=""
            srcset=""
            style="width: 30%; vertical-align: top; height: 180px"
            class="mr20"
          />
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getWomDevice,
  getWomInfo,
  getWomFaultInfo2,
} from "@/api/work/schedule";
import { orderTemplate } from "@/api/work/template";
import { listDept } from "@/api/system/dept";
export default {
  components: {},
  dicts: ["em_device_state"],
  props: {
    formData: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      data: {},
      orderOptions: [],
      orderObjs: [],
      deptOptions: undefined,
      process: process.env.VUE_APP_BASE_API,
      faultInfoDTO: {
        fileList: [],
      },
      flag: true,
    };
  },
  computed: {},
  watch: {},
  async created() {
    await this.getTreeSelect();
    await this.getOrderTree();
    if (this.formData.orderCode) {
      await getWomDevice({
        orderCode: this.formData.orderCode,
        lineCode: "",
      }).then((res) => {
        if (res.code == 200) {
          this.data = JSON.parse(JSON.stringify(res.data))[0];

          getWomFaultInfo2({
            deviceCode: this.data.deviceCode,
            orderCode: this.formData.orderCode,
          }).then((res) => {
            if (res.code == 200) {
              this.faultInfoDTO = res.data.faultInfoDTO;
              this.formData.faultInfoDTO = res.data.faultInfoDTO;
              this.formData["faultType"] =
                res.data.faultInfoDTO.faultType +
                "-" +
                res.data.faultInfoDTO.faultInfo;
            }
          });
        }
      });

      await getWomInfo({ orderCode: this.formData.orderCode }).then((res) => {
        if (res.code == 200) {
          this.data = { ...this.data, phoneNumber: res.data.phoneNumber };
        }
      });
    }
  },
  mounted() {},

  methods: {
    openUp() {
      this.flag = !this.flag;
    },
    gzalClick() {
      this.$router.push({
        name: "faults",
        query: { data: JSON.stringify({ code: this.faultInfoDTO.faultCode }) },
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
    findTreeName(options, value) {
      if (!value) return;
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
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // findTreeName(options, value) {
    //   for (let item of options) {
    //     if (item.id === value) return item.label;
    //     if (item.children && item.children.length > 0) {
    //       let result = this.findTreeName(item.children, value);
    //       if (result !== null) return result;
    //     }
    //   }
    //   return null;
    // },
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
  },
};
</script>
<style lang="scss" scoped>
.box {
  overflow: hidden;
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  background-color: #fff;
  .title {
    font-size: 18px;
    width: 100%;
    // border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 40px;
  }
}
.subtitle {
  background-color: #ebf4fc;
  color: #555;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  height: 36px;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  // padding: 0 18px;
  padding-right: 18px;
  border-left: 5px solid #1f77fc;
  i {
    margin-right: 10px;
    color: #1f77fc;
    .icon-text {
      color: #555;
      font-weight: 700;
      padding-left: 5px;
    }
  }
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
  display: flex;
}
</style>
