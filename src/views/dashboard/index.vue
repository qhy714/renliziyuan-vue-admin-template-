<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <input
      type="file"
      accept="image/jpg,image/png,image/jpeg,image.gif"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import COS from 'cos-js-sdk-v5'
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDQecJjskMhlY5KIzQaT5QVKs99sKUO1NS',
  SecretKey: 'pNeeMoztWt0qPhiSv61f28xVlkSs1tTn'
})
console.log(cos)
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleChange (e) {
      console.dir(e.target)
      cos.putObject({
        Bucket: 'qhy-1313062325',
        Region: 'ap-shanghai',
        Key: 'qhy',
        StorageClass: 'STANDARD',
        Body: e.target.files[0],
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, function (err, data) {
        console.log(err || data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
