<template>
  <div>
    <el-button type="primary" icon="el-icon-date" size="medium">{{ parseTime(new Date(), '{y}-{m}-{d}') }}</el-button>
    <!-- <svg-icon icon-class="github" @click="goto" /> -->
  </div>
</template>

<script>
export default {
  name: 'RuoYiGit',
  data() {
    return {
      url: 'https://gitee.com/tony2y/RuoYi-flowable'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
