<template>
  <span>
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; font-size: 20px; margin-right: 15px"
      @click="handleClick"
    ></svg-icon>
  </span>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async handleClick () {
      // 原生写法
      if (document.fullscreenElement) { // 判断是否在全屏状态中
        document.exitFullscreen() // 退出全屏
      } else {
        await document.documentElement.requestFullscreen() // 进入全屏
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
