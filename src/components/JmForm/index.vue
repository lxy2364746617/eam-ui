<template>
    <div>
        <div v-if="!disabled" style="float: right;margin-top: -65px;">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        </div>
        <el-form 
            ref="form" 
            size="small" 
            :model="form" 
            :rules="rules" 
            label-width="120px" >
            <el-row :gutter="10">
                <el-col :span="col.span||12" v-for="col in columns" :key="col.prop" v-if="col.formVisible!=false">
                    <el-form-item 
                        :label="col.label" 
                        :prop="col.prop" 
                        :required="col.required">
                        <editor v-if="col.formType=='textarea'" v-model="form[col.prop]" :min-height="192"/>
                        <el-select v-else-if="col.formType=='select'" v-model="form[col.prop]" placeholder="请选择" :disabled="col.disabled || disabled">
                            <el-option :label="item.label" :value="item.value" v-for="item in col.options" :key="item.value"></el-option>
                        </el-select>
                        <treeselect 
                            size="small" 
                            v-else-if="col.formType=='selectTree'" 
                            v-model="form[col.prop]" 
                            :options="col.options" 
                            placeholder="请选择" 
                            :normalizer="normalizer" 
                            :disabled="col.disabled || disabled" 
                            style="height: 32px;line-height: 32px;"/>
                        <el-input v-else v-model="form[col.prop]" placeholder="请输入" :disabled="col.disabled || disabled"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
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
    },
    watch:{
        formData() {
            this.form = this.formData
            this.clearValidate()
            console.log(this.form,444);
        },
    },
    data() {
        return {
            form: {},
            rules: {},
        }
    },
    created() {
        
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
                this.$refs["form"].clearValidate()
            })
        },
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.$emit( 'submitForm' , this.form)
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
::v-deep .vue-treeselect--disabled .vue-treeselect__control{
    cursor: not-allowed;
}
</style>
