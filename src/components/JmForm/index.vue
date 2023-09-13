<template>
    <div>
        <div v-if="!disabled" style="float: right;margin-top: -65px;">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        </div>
        <el-form 
            ref="formform" 
            size="small" 
            :model="formData" 
            :rules="rules" 
            :label-width="labelWidth||'120px'" >
            <el-row :gutter="10">
                <el-col :span="col.span||12" v-for="col in columns" :key="col.prop" v-if="col.formVisible!=false">
                    <el-form-item 
                        :label="col.label" 
                        :prop="col.prop" 
                        :required="col.required">
                        <editor v-if="col.formType=='textarea'" v-model="formData[col.prop]" :min-height="192"/>
                        <el-select v-else-if="col.formType=='select'" v-model="formData[col.prop]" placeholder="请选择" filterable :disabled="col.formDisabled || disabled">
                            <el-option :label="item.label" :value="item.value" v-for="item in col.options" :key="item.value"></el-option>
                        </el-select>
                        <el-radio-group v-else-if="col.formType=='radio'" v-model="formData[col.prop]" :disabled="col.formDisabled || disabled" @input="col.changeFn">
                            <el-radio :label="item.value" v-for="item in col.options" :key="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                        <treeselect 
                            size="small" 
                            v-else-if="col.formType=='selectTree'" 
                            v-model="formData[col.prop]" 
                            :options="col.options" 
                            clear-value-text="清除"
                            no-options-text="暂无数据"
                            placeholder="请选择" 
                            :normalizer="normalizer" 
                            :disabled="col.formDisabled || disabled" 
                            style="height: 32px;line-height: 32px;"/>
                        <el-input v-else v-model="formData[col.prop]" placeholder="请输入" :disabled="col.formDisabled || disabled"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <slot name="footer"></slot>
    </div>
</template>
<script>
import Schema from "async-validator";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// 设置报错提示信息
Schema.messages.required = (fieldName) => {
  return "此项为必填项";
};
export default {
    components: { Treeselect },
    props: {
        columns: {
            default: ()=>[],
            type: Array,
        },
        formData: {
            default: ()=>{},
            type: Object,
        },
        disabled:{
          default: false,
          type: Boolean
        },
        labelWidth: {
            default: '',
            type: String,
        },
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
    created() {
        
    },
    mounted(){
        this.clearValidate()

    },
    methods: {
        /** 转换部门数据结构 */
        normalizer(node) {
            if (JSON.stringify(node.children)=='[]') {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.label,
                children: node.children
            };
        },
        clearValidate(){
            this.$nextTick(()=>{
                this.$refs["formform"].clearValidate()
            })
        },
        submitForm() {
            this.$refs["formform"].validate(valid => {
                if (valid) {
                    this.$emit('submitForm', this.formData)
                }
            });
        },
        close(){
            this.clearValidate()
            this.$emit('close')
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #f9f9f9;
    border-color: #dddddd;
    color: #000;
    cursor: not-allowed;
}
::v-deep .el-radio__input.is-disabled .el-radio__inner{
    background-color: #f9f9f9;
    border-color: #dddddd;
    color: #000;
    cursor: not-allowed;
}
::v-deep .el-radio__input.is-disabled.is-checked {
    .el-radio__inner{
        &::after{
            background-color: #000;
        }
    }
    &+.el-radio__label{
        color: #000;
    }

}
::v-deep .vue-treeselect--disabled .vue-treeselect__control{
    cursor: not-allowed;
}
.el-select.el-select--small{
    width: 100%;
}
</style>
