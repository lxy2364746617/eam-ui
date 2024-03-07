<template>
  <div>
    <div v-if="!disabled && showButton" style="float: right;margin-top: -65px;">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
    </div>
    <el-form
      ref="formform"
      size="small"
      v-if="formData"
      :model="formData"
      :rules="rules"
      :label-position="labelPosition"
      :label-width="labelWidth||'120px'"
    >
      <el-row :gutter="10">
        <el-col
          :span="col.span||12"
          v-for="(col,index) in columns"
          :key="index"
          v-if="col.formVisible!=false"
        >
          <el-form-item v-if="col.subTitle" :label="col.label" class="subtitle"></el-form-item>
          <el-form-item
            v-else
            :label="col.label"
            :prop="col.prop"
            :class="{'hideBorder':hideBorder}"
            :required="col.required==true?true:false"
          >
            <editor v-if="col.formType=='editor'" v-model="formData[col.prop]" :min-height="192" />
            <el-select
              v-else-if="col.formType=='select'"
              v-model="formData[col.prop]"
              placeholder="请选择"
              @change="col.selectfn?col.selectfn():(()=>{})()"
              filterable
              clearable
              :disabled="col.formDisabled || disabled"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in col.options"
                :key="item.value"
              >
                <span v-if="col.optionShowValue" style="float: left">{{ item.label }}</span>
                <span
                  v-if="col.optionShowValue"
                  style="float: right; color: #8492a6; font-size: 13px"
                >{{ item.value }}</span>
              </el-option>
            </el-select>
            <el-select
              v-else-if="col.formType=='selectTag'"
              v-model="formData[col.prop]"
              placeholder="请选择"
              @change="col.selectfn?col.selectfn():(()=>{})()"
              filterable
              clearable
              :disabled="col.formDisabled || disabled"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in col.options"
                :key="item.value"
              >
                <el-tag class="selectTag" effect="light" :type="item.raw.listClass">{{ item.label }}</el-tag>
              </el-option>
            </el-select>
            <el-radio-group
              v-else-if="col.formType=='radio'"
              v-model="formData[col.prop]"
              :disabled="col.formDisabled || disabled"
              @input="col.changeFn"
            >
              <el-radio
                :label="item.value"
                v-for="item in col.options"
                :key="item.value"
                :disabled='item.disabled'
                :style="col.style"
              >{{item.label}}</el-radio>
            </el-radio-group>
            <el-date-picker
              v-else-if="col.formType=='date'"
              v-model="formData[col.prop]"
              value-format="yyyy-MM-dd"
              size="small"
              type="date"
              clearable
              :disabled="col.formDisabled || disabled"
              style="width: 100%;"
              placeholder="选择日期"
            ></el-date-picker>
            <treeselect
              size="small"
              v-else-if="col.formType=='selectTree'"
              v-model="formData[col.prop]"
              :options="col.options"
              clear-value-text="清除"
              no-options-text="暂无数据"
              clearValueText="清除"
              noOptionsText="暂无数据"
              placeholder="请选择"
              :default-expand-level="4"
              :appendToBody="true"
              :normalizer="normalizer"
              :disabled="col.formDisabled || disabled"
              :zIndex="9999"
              style="height: 32px;line-height: 32px;"
              :flat="true"
            />
            <el-input
              v-else-if="col.formType=='textarea'"
              type="textarea"
              v-model="formData[col.prop]"
              placeholder="请输入"
              :disabled="col.formDisabled || disabled"
            />
            <el-input
              v-else
              v-model="formData[col.prop]"
              placeholder="请输入"
              :readonly="col.readonly"
              :disabled="col.formDisabled || disabled"
              @input.native="forceUpdate?$forceUpdate():(()=>{})()"
              @click.native="col.clickFn?col.clickFn():(()=>{})()"
              :type= "col.number?'number':'text'"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <slot name="footer"></slot>
  </div>
</template>
<script>
import Schema from 'async-validator'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 设置报错提示信息
Schema.messages.required = (fieldName) => {
  return '此项为必填项'
}
export default {
  components: { Treeselect },
  props: {
    columns: {
      default: () => [],
      type: Array,
    },
    formData: {
      default: () => {},
      type: Object,
    },
    hideBorder: {
      default: false,
      type: Boolean,
    },
    showButton: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    labelWidth: {
      default: '',
      type: String,
    },
    labelPosition: {
      default: 'right',
      type: String,
    },
    number: {
      default: false,
      type: Boolean,
    },
    forceUpdate:{
      default:false,
      type:Boolean
    }
  },
  // watch:{
  //     formData: {
  //         handler(newVal) {
  //             this.form = newVal
  //             this.clearValidate()
  //         },
  //         immediate: true,
  //         deep: true,
  //     },
  //     // 'form.parentId'(newval,oldval) {
  //     //     if(newval==0){
  //     //         this.form.parentId = 100
  //     //     }
  //     // }
  // },
  data() {
    return {
      // form: {},
      rules: {},
    }
  },
  created() {},
  mounted() {
    this.clearValidate()
  },
  methods: {
    /** 转换部门数据结构 */
    normalizer(node) {
      if (JSON.stringify(node.children) == '[]') {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      }
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs['formform'].clearValidate()
      })
    },
    async submitForm() {
      try {
        //调用表单的validate方法，执行表单校验
        await this.$refs['formform'].validate()
      } catch (e) {
        //如果表单有报错，则进入catch，此时直接return不执行表单提交
        return false
      }
      this.$emit('submitForm', this.formData)
      return true
    },
    close() {
      this.clearValidate()
      this.$emit('close')
    },
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-input.is-disabled .el-input__inner,
::v-deep .el-textarea.is-disabled .el-textarea__inner,
::v-deep .el-radio__input.is-disabled .el-radio__inner {
  background-color: #f9f9f9;
  border-color: #dddddd;
  color: #000;
  cursor: not-allowed;
}

::v-deep .el-radio__input.is-disabled.is-checked {
  .el-radio__inner {
    &::after {
      background-color: #000;
    }
  }
  & + .el-radio__label {
    color: #000;
  }
}
::v-deep .vue-treeselect--disabled .vue-treeselect__control {
  cursor: not-allowed;
}
.el-select.el-select--small {
  width: 100%;
}
::v-deep .hideBorder {
  .vue-treeselect__control,
  .el-input__inner,
  .el-textarea__inner {
/*     border: none !important; */
    background-color: #fff !important;
    cursor: default !important;
  }
  .el-input__suffix,
  .el-input__prefix {
    display: none !important;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 15px !important;
  }
}
.subtitle {
  border-bottom: 1px solid #ddd;
  ::v-deep .el-form-item__label {
    color: #c9a835;
    font-weight: bold;
  }
}
.selectTag {
  background: none !important;
  border: none;
  margin: 0;
  padding: 0;
  height: auto;
  line-height: normal;
}
</style>
